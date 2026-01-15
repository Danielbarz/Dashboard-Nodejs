// server/src/controllers/masterController.js
import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'

// --- ACCOUNT OFFICERS ---
export const getAccountOfficers = async (req, res) => {
  try {
    const data = await prisma.accountOfficer.findMany({
      orderBy: { name: 'asc' }
    })
    // Konversi BigInt ke string agar JSON aman
    const formatted = data.map(item => ({
      ...item,
      id: item.id.toString()
    }))
    return successResponse(res, formatted, 'Account Officers retrieved')
  } catch (error) {
    console.error('Get AO Error:', error)
    return errorResponse(res, 'Failed to fetch Account Officers', 500)
  }
}

export const createAccountOfficer = async (req, res) => {
  try {
    const { name, displayWitel, filterWitelLama, specialFilterColumn, specialFilterValue } = req.body
    await prisma.accountOfficer.create({
      data: {
        name,
        displayWitel,
        filterWitelLama,
        specialFilterColumn,
        specialFilterValue
      }
    })
    return successResponse(res, null, 'Account Officer created')
  } catch (error) {
    return errorResponse(res, 'Failed to create AO', 500)
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
    // Gunakan query raw sebagai fallback karena model list_po mungkin belum ter-generate di Prisma Client
    const data = await prisma.$queryRawUnsafe('SELECT * FROM list_po ORDER BY po ASC')
    const formatted = data.map(item => ({
      id: item.id.toString(),
      nipnas: item.nipnas,
      namaPo: item.po, // Mapping kolom 'po' di DB ke 'namaPo' di Frontend
      segment: item.segment,
      billCity: item.bill_city,
      witel: item.witel
    }))
    return successResponse(res, formatted, 'PO Master retrieved')
  } catch (error) {
    console.error('Get PO Error:', error)
    return errorResponse(res, 'Failed to fetch PO Master', 500)
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
    // 1. Definisikan Witel Region 3 secara LENGKAP
    const region3Witels = [
      'BALI',
      'JATIM BARAT',
      'JATIM TIMUR',
      'NUSA TENGGARA',
      'SURAMADU',
      'MALANG',
      'SIDOARJO'
    ];

    // 2. Query Database (Prisma)
    // HANYA ambil yang benar-benar kosong (null, empty, '-')
    // Jika sudah berubah jadi 'PO_TIDAK_TERDEFINISI' atau nama orang, dia dianggap 'mapped'
    // sehingga list Unmapped akan berkurang/hilang setelah dipencet Mapping Otomatis.
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

    const formatted = data.map(item => ({
      id: item.id.toString(),
      orderId: item.orderId,
      nipnas: item.nipnas,
      customerName: item.standardName || item.customerName,
      custCity: item.custCity,
      billCity: item.billCity,
      servCity: item.servCity,
      billWitel: item.billWitel
    }))
    return successResponse(res, formatted, 'Unmapped orders retrieved')
  } catch (error) {
    console.error('Get Unmapped Error:', error)
    return errorResponse(res, 'Failed to fetch unmapped orders', 500)
  }
}

export const updateMapping = async (req, res) => {
  try {
    const { id } = req.params
    const { poName, billCity, billWitel, segment } = req.body

    await prisma.sosData.update({
      where: { id: BigInt(id) },
      data: { poName, billCity, billWitel, segmen: segment }
    })
    return successResponse(res, null, 'Mapping updated')
  } catch (error) {
    return errorResponse(res, 'Failed to update mapping', 500)
  }
}

export const autoMapping = async (req, res) => {
  console.log('API: autoMapping started with improved priority logic')
  try {
    // 1. Get all Region 3 unmapped orders (including those currently marked as undefined)
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

      // PRIORITY 1: Check static PO_MAPPING utility (highest accuracy manual overrides)
      if (PO_MAPPING[order.nipnas]) {
        newPoName = PO_MAPPING[order.nipnas].toUpperCase()
        utilityCount++
      }

      // PRIORITY 2: Check list_po table if utility didn't have it OR utility returned a generic name
      if (!newPoName) {
        const match = await prisma.$queryRawUnsafe(
          'SELECT po FROM list_po WHERE nipnas = $1 AND po != \'PO_TIDAK_TERDEFINISI\' LIMIT 1',
          order.nipnas
        )
        if (match && match.length > 0) {
          newPoName = match[0].po.toUpperCase()
          tableCount++
        }
      }

      // Perform update if a real name was found and it's different from current
      if (newPoName && newPoName !== order.poName) {
        await prisma.sosData.update({
          where: { id: order.id },
          data: { poName: newPoName, updatedAt: new Date() }
        })
        updateCount++
      }
    }

    // 3. Optional: Final cleanup for anything still NULL/Empty in Region 3
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
