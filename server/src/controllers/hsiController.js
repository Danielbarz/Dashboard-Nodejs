import { PrismaClient } from '@prisma/client'
import { successResponse, errorResponse } from '../utils/response.js'

const prisma = new PrismaClient()

// Get all HSI data with optional filters
export const getAllHSIData = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 1000,
      witel,
      kelompok_status,
      start_date,
      end_date 
    } = req.query

    let whereClause = {}

    // Filter by witel if provided
    if (witel) {
      whereClause.witel = witel
    }

    // Filter by kelompok_status if provided
    if (kelompok_status) {
      whereClause.kelompok_status = kelompok_status
    }

    // Filter by date range if provided
    if (start_date && end_date) {
      whereClause.orderDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Get data with pagination
    const [data, total] = await Promise.all([
      prisma.hsiData.findMany({
        where: whereClause,
        skip: skip,
        take: parseInt(limit),
        orderBy: {
          orderDate: 'desc'
        }
      }),
      prisma.hsiData.count({ where: whereClause })
    ])

    successResponse(res, {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, 'HSI data retrieved successfully')
  } catch (error) {
    console.error('Get HSI data error:', error)
    next(error)
  }
}

export const deleteHSIRecord = async (req, res, next) => {
  try {
    const { orderId } = req.params

    if (!orderId) {
      return errorResponse(res, 'Order ID tidak ditemukan', 400)
    }

    // Delete the HSI record
    const deletedRecord = await prisma.hsiData.deleteMany({
      where: {
        orderId: orderId
      }
    })

    if (deletedRecord.count === 0) {
      return errorResponse(res, 'Data HSI dengan Order ID tersebut tidak ditemukan', 404)
    }

    successResponse(res, {
      deletedCount: deletedRecord.count,
      orderId: orderId
    }, `${deletedRecord.count} record dengan Order ID ${orderId} berhasil dihapus`)
  } catch (error) {
    console.error('Delete HSI error:', error)
    next(error)
  }
}

// Delete ALL HSI data (Reset Database)
export const deleteAllHSIData = async (req, res, next) => {
  try {
    // Menghapus semua data tanpa kondisi where (setara dengan truncate)
    const result = await prisma.hsiData.deleteMany({})

    successResponse(res, {
      deletedCount: result.count
    }, 'Semua data HSI berhasil dihapus (Reset Database)')
  } catch (error) {
    console.error('Delete All HSI error:', error)
    next(error)
  }
}
