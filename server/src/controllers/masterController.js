import { PrismaClient } from '@prisma/client'
import { successResponse, errorResponse } from '../utils/response.js'

const prisma = new PrismaClient()

// ===== Account Officer Endpoints =====
export const getAccountOfficers = async (req, res, next) => {
  try {
    const accountOfficers = await prisma.accountOfficer.findMany({
      orderBy: { createdAt: 'desc' }
    })
    successResponse(res, accountOfficers, 'Account Officers retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export const createAccountOfficer = async (req, res, next) => {
  try {
    const { name, displayWitel, filterWitelLama, specialFilterColumn, specialFilterValue } = req.body

    const accountOfficer = await prisma.accountOfficer.create({
      data: {
        name,
        displayWitel,
        filterWitelLama,
        specialFilterColumn: specialFilterColumn || null,
        specialFilterValue: specialFilterValue || null
      }
    })

    successResponse(res, accountOfficer, 'Account Officer created successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const deleteAccountOfficer = async (req, res, next) => {
  try {
    const { id } = req.params

    await prisma.accountOfficer.delete({
      where: { id: BigInt(id) }
    })

    successResponse(res, null, 'Account Officer deleted successfully')
  } catch (error) {
    next(error)
  }
}

// ===== PO Master Endpoints =====
export const getPOMaster = async (req, res, next) => {
  try {
    const poMaster = await prisma.poMaster.findMany({
      orderBy: { createdAt: 'desc' }
    })
    successResponse(res, poMaster, 'PO Master retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export const createPO = async (req, res, next) => {
  try {
    const { nipnas, namaPo, segment, witel } = req.body

    const po = await prisma.poMaster.create({
      data: {
        nipnas,
        namaPo,
        segment: segment || null,
        witel
      }
    })

    successResponse(res, po, 'PO created successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const deletePO = async (req, res, next) => {
  try {
    const { id } = req.params

    await prisma.poMaster.delete({
      where: { id: BigInt(id) }
    })

    successResponse(res, null, 'PO deleted successfully')
  } catch (error) {
    next(error)
  }
}

// ===== Unmapped Orders Endpoints =====
export const getUnmappedOrders = async (req, res, next) => {
  try {
    // Get orders from SOS data that don't have valid PO name
    const unmappedOrders = await prisma.sosData.findMany({
      where: {
        OR: [
          { poName: null },
          { poName: '' }
        ]
      },
      select: {
        id: true,
        orderId: true,
        nipnas: true,
        standardName: true,
        custCity: true,
        servCity: true,
        billWitel: true,
        billCity: true,
        segmen: true,
        poName: true
      },
      take: 100, // Limit to 100 unmapped orders
      orderBy: { createdAt: 'desc' }
    })

    // Transform to match frontend expectations
    const formattedOrders = unmappedOrders.map(order => ({
      id: order.id.toString(),
      orderId: order.orderId,
      nipnas: order.nipnas,
      customerName: order.standardName,
      custCity: order.custCity,
      servCity: order.servCity,
      billWitel: order.billWitel,
      billCity: order.billCity,
      segment: order.segmen,
      poName: order.poName
    }))

    successResponse(res, formattedOrders, 'Unmapped orders retrieved successfully')
  } catch (error) {
    next(error)
  }
}

export const updateOrderMapping = async (req, res, next) => {
  try {
    const { id } = req.params
    const { poName, billCity, billWitel, segment } = req.body

    const updated = await prisma.sosData.update({
      where: { id: BigInt(id) },
      data: {
        poName,
        billCity,
        billWitel,
        segmen: segment
      }
    })

    successResponse(res, updated, 'Order mapping updated successfully')
  } catch (error) {
    next(error)
  }
}

export const autoMapOrders = async (req, res, next) => {
  try {
    // Get all Account Officers with their mapping rules
    const accountOfficers = await prisma.accountOfficer.findMany()

    // Get unmapped orders
    const unmappedOrders = await prisma.sosData.findMany({
      where: {
        OR: [
          { poName: null },
          { poName: '' }
        ]
      }
    })

    let mappedCount = 0

    for (const order of unmappedOrders) {
      // Try to find matching AO based on witel and special filters
      for (const ao of accountOfficers) {
        let isMatch = false

        // Check if witelLama matches (assuming billWitel or other witel field)
        if (order.billWitel === ao.filterWitelLama || order.custWitel === ao.filterWitelLama) {
          isMatch = true

          // If there's a special filter, check it
          if (ao.specialFilterColumn && ao.specialFilterValue) {
            const orderValue = order[ao.specialFilterColumn]
            if (orderValue !== ao.specialFilterValue) {
              isMatch = false
            }
          }
        }

        // If match found, update the order
        if (isMatch) {
          await prisma.sosData.update({
            where: { id: order.id },
            data: {
              poName: ao.name,
              witelBaru: ao.displayWitel
            }
          })
          mappedCount++
          break
        }
      }
    }

    successResponse(res, { mappedCount }, `Auto-mapping completed. ${mappedCount} orders mapped.`)
  } catch (error) {
    next(error)
  }
}
