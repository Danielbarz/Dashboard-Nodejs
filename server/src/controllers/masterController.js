import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import PO_MAPPING from '../utils/poMapping.js'

// --- ACCOUNT OFFICERS ---
export const getAccountOfficers = async (req, res) => {
  try {
    const data = await prisma.accountOfficer.findMany({
        orderBy: { name: 'asc' }
    })
    const formatted = data.map(item => ({
      ...item,
      id: item.id.toString()
    }))
    return successResponse(res, formatted, 'Account Officers retrieved successfully')
  } catch (error) {
    console.error(error)
    return errorResponse(res, 'Failed to fetch Account Officers', 500)
  }
}

export const deleteAccountOfficer = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.accountOfficer.delete({ where: { id: BigInt(id) } })
    return successResponse(res, null, 'Account Officer deleted')
  } catch (error) {
    return errorResponse(res, 'Failed to delete AO', 500)
  }
}

// --- MASTER PO (list_po) ---
export const getPOMaster = async (req, res) => {
  try {
    const data = await prisma.$queryRawUnsafe('SELECT * FROM list_po ORDER BY po ASC')
    const formatted = data.map(item => ({
      id: item.id.toString(),
      nipnas: item.nipnas,
      namaPo: item.po, 
      segment: item.segment,
      billCity: item.bill_city,
      witel: item.witel
    }))
    successResponse(res, formatted, 'Master PO retrieved successfully')
  } catch (error) {
    console.error(error)
    errorResponse(res, 'Failed to fetch Master PO', 500)
  }
}

export const createPOMaster = async (req, res) => {
  try {
    const { nipnas, namaPo, segment, witel } = req.body
    await prisma.$executeRawUnsafe(
      'INSERT INTO list_po (nipnas, po, segment, witel, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
      nipnas, namaPo, segment, witel
    )
    return successResponse(res, null, 'PO created')
  } catch (error) {
    return errorResponse(res, 'Failed to create PO: ' + error.message, 500)
  }
}

export const deletePOMaster = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.$executeRawUnsafe('DELETE FROM list_po WHERE id = $1', BigInt(id))
    return successResponse(res, null, 'PO deleted')
  } catch (error) {
    return errorResponse(res, 'Failed to delete PO: ' + error.message, 500)
  }
}

// --- UNMAPPED ORDERS & MAPPING ---
export const getUnmappedOrders = async (req, res) => {
  try {
    const region3Witels = [
      'BALI',
      'JATIM BARAT',
      'JATIM TIMUR',
      'NUSA TENGGARA',
      'SURAMADU',
      'MALANG',
      'SIDOARJO'
    ];

    const data = await prisma.sosData.findMany({
      where: {
        OR: [
          { poName: null },
          { poName: '' },
          { poName: '-' }
        ],
        billWitel: {
          in: region3Witels,
          mode: 'insensitive'
        }
      },
      orderBy: { orderCreatedDate: 'desc' },
      take: 50
    })

    const formattedData = data.map(item => ({
        id: item.id.toString(),
        orderId: item.orderId,
        customerName: item.standardName || item.customerName,
        nipnas: item.nipnas,
        custCity: item.custCity,
        billCity: item.billCity,
        billWitel: item.billWitel,
        segment: item.segmen
    }))
    return successResponse(res, formattedData, 'Unmapped orders retrieved')
  } catch (error) {
    console.error('Get Unmapped Error:', error)
    return errorResponse(res, 'Failed to fetch unmapped orders', 500)
  }
}

export const updateMapping = async (req, res) => {
  try {
    const { id } = req.params
    const { poName } = req.body 

    await prisma.sosData.update({
        where: { id: BigInt(id) },
        data: { poName: poName }
    })

    successResponse(res, null, 'Order mapped successfully')
  } catch (error) {
    console.error(error)
    errorResponse(res, 'Failed to update mapping', 500)
  }
}

export const autoMapping = async (req, res) => {
  console.log('API: autoMapping started with improved priority logic')
  try {
    const region3Witels = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU', 'MALANG', 'SIDOARJO']

    const targetOrders = await prisma.sosData.findMany({
      where: {
        OR: [
          { poName: null },
          { poName: '' },
          { poName: '-' },
          { poName: 'PO_TIDAK_TERDEFINISI' }
        ],
        billWitel: {
          in: region3Witels,
          mode: 'insensitive'
        }
      },
      select: { id: true, nipnas: true, poName: true }
    })

    console.log(`AutoMapping: Processing ${targetOrders.length} potential orders`)

    let updateCount = 0
    let utilityCount = 0
    let tableCount = 0

    for (const order of targetOrders) {
      if (!order.nipnas) continue

      let newPoName = null

      if (PO_MAPPING[order.nipnas]) {
        newPoName = PO_MAPPING[order.nipnas].toUpperCase()
        utilityCount++
      }

      if (!newPoName) {
        const match = await prisma.$queryRawUnsafe(
          "SELECT po FROM list_po WHERE nipnas = $1 AND po != 'PO_TIDAK_TERDEFINISI' LIMIT 1",
          order.nipnas
        )
        if (match && match.length > 0) {
          newPoName = match[0].po.toUpperCase()
          tableCount++
        }
      }

      if (newPoName && newPoName !== order.poName) {
        await prisma.sosData.update({
          where: { id: order.id },
          data: { poName: newPoName, updatedAt: new Date() }
        })
        updateCount++
      }
    }

    const resultCleanup = await prisma.sosData.updateMany({
      where: {
        OR: [
          { poName: null },
          { poName: '' },
          { poName: '-' }
        ],
        billWitel: {
          in: region3Witels,
          mode: 'insensitive'
        }
      },
      data: {
        poName: 'PO_TIDAK_TERDEFINISI'
      }
    })

    console.log(`AutoMapping Complete: Updated ${updateCount} to real names (${utilityCount} from utility, ${tableCount} from table). Marked ${resultCleanup.count} as undefined.`)

    return successResponse(res, {
      totalProcessed: targetOrders.length,
      updatedToRealNames: updateCount,
      fromUtility: utilityCount,
      fromTable: tableCount,
      markedUndefined: resultCleanup.count
    }, 'Auto mapping completed successfully')
  } catch (error) {
    console.error('AutoMapping Error:', error)
    return errorResponse(res, 'Failed to perform auto mapping: ' + error.message, 500)
  }
}

// --- TARGET MANAGEMENT ---

export const getTargets = async (req, res) => {
  try {
    const data = await prisma.target.findMany({
      orderBy: { periodDate: 'desc' }
    })
    const formatted = data.map(item => ({
      ...item,
      id: item.id.toString(),
      value: parseFloat(item.value)
    }))
    return successResponse(res, formatted, 'Targets retrieved successfully')
  } catch (error) {
    console.error(error)
    return errorResponse(res, 'Failed to fetch targets', 500)
  }
}

export const getTargetById = async (req, res) => {
  try {
    const { id } = req.params
    const item = await prisma.target.findUnique({
      where: { id: BigInt(id) }
    })
    if (!item) return errorResponse(res, 'Target not found', 404)
    
    return successResponse(res, {
      ...item,
      id: item.id.toString(),
      value: parseFloat(item.value)
    }, 'Target retrieved')
  } catch (error) {
    return errorResponse(res, 'Failed to fetch target', 500)
  }
}

export const createTarget = async (req, res) => {
  try {
    const { periodType, targetType, witel, product, value, periodDate } = req.body
    const newItem = await prisma.target.create({
      data: {
        periodType,
        targetType,
        witel,
        product,
        value: parseFloat(value),
        periodDate: new Date(periodDate)
      }
    })
    return successResponse(res, { ...newItem, id: newItem.id.toString() }, 'Target created')
  } catch (error) {
    return errorResponse(res, 'Failed to create target: ' + error.message, 500)
  }
}

export const updateTarget = async (req, res) => {
  try {
    const { id } = req.params
    const { periodType, targetType, witel, product, value, periodDate } = req.body
    const updated = await prisma.target.update({
      where: { id: BigInt(id) },
      data: {
        periodType,
        targetType,
        witel,
        product,
        value: parseFloat(value),
        periodDate: new Date(periodDate)
      }
    })
    return successResponse(res, { ...updated, id: updated.id.toString() }, 'Target updated')
  } catch (error) {
    return errorResponse(res, 'Failed to update target: ' + error.message, 500)
  }
}

export const deleteTarget = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.target.delete({ where: { id: BigInt(id) } })
    return successResponse(res, null, 'Target deleted')
  } catch (error) {
    return errorResponse(res, 'Failed to delete target', 500)
  }
}