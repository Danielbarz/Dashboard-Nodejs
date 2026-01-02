import { PrismaClient } from '@prisma/client'
import { successResponse, errorResponse } from '../utils/response.js'

const prisma = new PrismaClient()

// Get all SOS data for dashboard
export const getDashboardData = async (req, res, next) => {
  try {
    const { startDate, endDate, witel } = req.query

    let whereClause = {}
    
    if (startDate && endDate) {
      whereClause.orderCreatedDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }
    
    if (witel) {
      whereClause.billWitel = witel
    }

    const data = await prisma.sosData.findMany({
      where: whereClause,
      orderBy: { orderId: 'desc' }
    })

    successResponse(res, data, 'Dashboard data retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get revenue by witel from SOS data
export const getRevenueByWitel = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let whereClause = {}
    
    if (startDate && endDate) {
      whereClause.orderCreatedDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const data = await prisma.sosData.groupBy({
      by: ['billWitel', 'liProductName'],
      where: whereClause,
      _sum: {
        revenue: true
      }
    })

    // Transform to chart format
    const chartData = {}
    data.forEach((row) => {
      if (!chartData[row.billWitel]) {
        chartData[row.billWitel] = { name: row.billWitel }
      }
      const productName = row.liProductName || 'Unknown'
      chartData[row.billWitel][productName] = parseFloat(row._sum.revenue || 0)
    })

    successResponse(res, Object.values(chartData), 'Revenue by witel retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get amount/count by witel from SOS data
export const getAmountByWitel = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let whereClause = {}
    
    if (startDate && endDate) {
      whereClause.orderCreatedDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const data = await prisma.sosData.groupBy({
      by: ['billWitel', 'liProductName'],
      where: whereClause,
      _count: true
    })

    // Transform to chart format
    const chartData = {}
    data.forEach((row) => {
      if (!chartData[row.billWitel]) {
        chartData[row.billWitel] = { name: row.billWitel }
      }
      const productName = row.liProductName || 'Unknown'
      chartData[row.billWitel][productName] = row._count
    })

    successResponse(res, Object.values(chartData), 'Amount by witel retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get KPI data from SOS data
export const getKPIData = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let whereClause = {}
    
    if (startDate && endDate) {
      whereClause.orderCreatedDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const totalOrders = await prisma.sosData.count({ where: whereClause })
    const completedOrders = await prisma.sosData.count({
      where: {
        ...whereClause,
        liStatus: { in: ['completed', 'activated', 'live'] }
      }
    })

    successResponse(
      res,
      {
        totalOrders,
        completedOrders,
        progressOrders: totalOrders - completedOrders,
        completionRate: totalOrders > 0 ? ((completedOrders / totalOrders) * 100).toFixed(2) : 0
      },
      'KPI data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// Get total order by regional
export const getTotalOrderByRegional = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let whereClause = {}
    
    if (startDate && endDate) {
      whereClause.orderCreatedDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const data = await prisma.sosData.groupBy({
      by: ['billWitel'],
      where: whereClause,
      _count: true,
      _sum: {
        revenue: true
      }
    })

    const result = data.map(row => ({
      witel: row.billWitel,
      count: row._count,
      revenue: parseFloat(row._sum.revenue || 0)
    }))

    successResponse(res, result, 'Total order by regional retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get sebaran data PS (Product Service)
export const getSebaranDataPS = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let whereClause = {}
    
    if (startDate && endDate) {
      whereClause.orderCreatedDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    const data = await prisma.sosData.groupBy({
      by: ['liProductName'],
      where: whereClause,
      _count: true,
      _sum: {
        revenue: true
      }
    })

    const result = data.map(row => ({
      product: row.liProductName || 'Unknown',
      count: row._count,
      revenue: parseFloat(row._sum.revenue || 0)
    }))

    successResponse(res, result, 'Sebaran data PS retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get cancel by FCC
export const getCancelByFCC = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let whereClause = {}
    
    if (startDate && endDate) {
      whereClause.orderCreatedDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // Get data where status indicates cancellation
    const canceledData = await prisma.sosData.groupBy({
      by: ['billWitel'],
      where: {
        ...whereClause,
        liStatus: { in: ['cancelled', 'rejected'] }
      },
      _count: true
    })

    const result = canceledData.map(row => ({
      witel: row.billWitel,
      canceledCount: row._count
    }))

    successResponse(res, result, 'Cancel by FCC retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get filter options (unique values for dropdowns)
export const getFilterOptions = async (req, res, next) => {
  try {
    // Hardcoded regions as per requirement
    const regions = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

    const products = await prisma.sosData.findMany({
      distinct: ['liProductName'],
      select: { liProductName: true }
    })

    const segments = await prisma.sosData.findMany({
      distinct: ['segmen'],
      select: { segmen: true }
    })

    const statuses = await prisma.sosData.findMany({
      distinct: ['liStatus'],
      select: { liStatus: true }
    })

    successResponse(
      res,
      {
        filters: {
          witels: regions,
          products: products.filter(p => p.liProductName).map(p => p.liProductName),
          segments: segments.filter(s => s.segmen).map(s => s.segmen),
          statuses: statuses.filter(s => s.liStatus).map(s => s.liStatus)
        },
        stats: {
          totalWitels: regions.length,
          totalProducts: products.filter(p => p.liProductName).length,
          totalSegments: segments.filter(s => s.segmen).length,
          totalStatuses: statuses.filter(s => s.liStatus).length
        }
      },
      'Filter options retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}
