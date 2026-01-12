import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'

// 1. Get Master Data List (Pagination + Search)
export const getMasterData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ''
    const offset = (page - 1) * limit

    const where = search ? {
      OR: [
        { nipnas: { contains: search, mode: 'insensitive' } },
        { po: { contains: search, mode: 'insensitive' } },
        { witel: { contains: search, mode: 'insensitive' } }
      ]
    } : {}

    const [data, total] = await Promise.all([
      prisma.listPo.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.listPo.count({ where })
    ])

    return successResponse(res, {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, 'Master Data retrieved')
  } catch (error) {
    return errorResponse(res, 'Failed to fetch master data', error.message)
  }
}

// 2. Get Unmapped Orders (Filtered SOS Data)
export const getUnmappedOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const witel = req.query.witel || ''
    const offset = (page - 1) * limit

    // Base filter: PO Name undefined (case insensitive & contains to handle whitespace)
    const where = {
      poName: {
        contains: 'PO_TIDAK_TERDEFINISI',
        mode: 'insensitive'
      }
    }

    // Witel Filter Logic
    if (witel) {
      // Specific witel filter (insensitive)
      where.billWitel = {
        equals: witel,
        mode: 'insensitive'
      }
    } else {
      // Default list filter (insensitive OR condition)
      const targetWitels = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']
      where.OR = targetWitels.map(w => ({
        billWitel: {
          equals: w,
          mode: 'insensitive'
        }
      }))
    }

    const [data, total] = await Promise.all([
      prisma.sosData.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { orderCreatedDate: 'desc' },
        select: {
          id: true,
          orderId: true,
          nipnas: true,
          standardName: true,
          billWitel: true,
          poName: true,
          billCity: true,
          segmen: true,
          orderCreatedDate: true
        }
      }),
      prisma.sosData.count({ where })
    ])

    return successResponse(res, {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, 'Unmapped orders retrieved')
  } catch (error) {
    return errorResponse(res, 'Failed to fetch unmapped orders', error.message)
  }
}

// 3. Get PO Options (Distinct)
export const getPoOptions = async (req, res) => {
  try {
    const data = await prisma.listPo.findMany({
      distinct: ['po'],
      select: { po: true },
      orderBy: { po: 'asc' },
      where: {
        NOT: {
          po: { in: ['#N/A', 'HOLD', 'LANDING', 'PO_TIDAK_TERDEFINISI', ''] }
        }
      }
    })
    const options = data.map(item => item.po).filter(Boolean)
    return successResponse(res, options, 'PO Options retrieved')
  } catch (error) {
    return errorResponse(res, 'Failed to fetch options', error.message)
  }
}

// 4. Map Order (Transaction: Update SOS + Upsert ListPo)
export const mapOrder = async (req, res) => {
  const { orderId, nipnas, poName, billCity, segmen, witelBaru } = req.body

  if (!orderId || !poName) {
    return errorResponse(res, 'Validation Error', 'Order ID and PO Name are required', 400)
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update Transaction
      await tx.sosData.update({
        where: { orderId: orderId },
        data: {
          poName: poName,
          billCity: billCity,
          // Optional: update segment/witel if provided
          ...(segmen && { segmen }),
          ...(witelBaru && { witelBaru })
        }
      })

      // 2. Update/Insert Master Dictionary
      if (nipnas) {
        await tx.listPo.upsert({
          where: { nipnas: nipnas },
          update: {
            po: poName,
            ...(billCity && { billCity }),
            ...(segmen && { segment: segmen }),
            ...(witelBaru && { witel: witelBaru })
          },
          create: {
            nipnas: nipnas,
            po: poName,
            billCity: billCity || null,
            segment: segmen || null,
            witel: witelBaru || null
          }
        })
      }
    })

    return successResponse(res, null, 'Order mapped and dictionary updated successfully')
  } catch (error) {
    return errorResponse(res, 'Mapping failed', error.message)
  }
}

// 5. Manual Store Master Data
export const manualStoreMaster = async (req, res) => {
  const { nipnas, po, segment, billCity, witel } = req.body

  if (!nipnas || !po) {
    return errorResponse(res, 'Validation Error', 'NIPNAS and PO Name are required', 400)
  }

  try {
    const result = await prisma.listPo.upsert({
      where: { nipnas },
      update: { po, segment, billCity, witel },
      create: { nipnas, po, segment, billCity, witel }
    })
    return successResponse(res, result, 'Master Data saved successfully')
  } catch (error) {
    return errorResponse(res, 'Failed to save master data', error.message)
  }
}

// 6. Get Account Officers
export const getAccountOfficers = async (req, res) => {
  try {
    const data = await prisma.accountOfficer.findMany({
      orderBy: { name: 'asc' }
    })

    // Convert BigInt to String for JSON response
    const formatted = data.map(item => ({
      ...item,
      id: item.id.toString()
    }))

    return successResponse(res, formatted, 'Account Officers retrieved')
  } catch (error) {
    return errorResponse(res, 'Failed to fetch account officers', error.message)
  }
}

// 7. Add Account Officer
export const addAccountOfficer = async (req, res) => {
  const { name, displayWitel, filterWitelLama, specialFilterColumn, specialFilterValue } = req.body

  if (!name || !displayWitel || !filterWitelLama) {
    return errorResponse(res, 'Validation Error', 'Name, Display Witel, and Filter Source are required', 400)
  }

  try {
    const result = await prisma.accountOfficer.create({
      data: {
        name,
        displayWitel,
        filterWitelLama,
        specialFilterColumn,
        specialFilterValue
      }
    })

    const formatted = { ...result, id: result.id.toString() }
    return successResponse(res, formatted, 'Account Officer created successfully')
  } catch (error) {
    return errorResponse(res, 'Failed to create account officer', error.message)
  }
}

// 8. Delete Account Officer
export const deleteAccountOfficer = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.accountOfficer.delete({
      where: { id: BigInt(id) }
    })
    return successResponse(res, null, 'Account Officer deleted successfully')
  } catch (error) {
    return errorResponse(res, 'Failed to delete account officer', error.message)
  }
}
