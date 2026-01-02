import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

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
    const witels = await prisma.sosData.findMany({
      distinct: ['billWitel'],
      select: { billWitel: true }
    })

    const products = await prisma.sosData.findMany({
      distinct: ['liProductName'],
      select: { liProductName: true }
    })

    const segments = await prisma.sosData.findMany({
      distinct: ['segmen'],
      select: { segmen: true }
    })

    successResponse(
      res,
      {
        filters: {
          witels: witels.filter(w => w.billWitel).map(w => w.billWitel),
          products: products.filter(p => p.liProductName).map(p => p.liProductName),
          segments: segments.filter(s => s.segmen).map(s => s.segmen)
        },
        stats: {
          totalWitels: witels.filter(w => w.billWitel).length,
          totalProducts: products.filter(p => p.liProductName).length,
          totalSegments: segments.filter(s => s.segmen).length
        }
      },
      'Filter options retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// Get Report Tambahan (JT/Jaringan Tambahan) - from SPMK MOM data
export const getReportTambahan = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let whereClause = { statusProyek: 'JT' }

    if (start_date && end_date) {
      whereClause.createdAt = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    const tableData = await prisma.spmkMom.groupBy({
      by: ['witelBaru'],
      where: whereClause,
      _count: {
        id: true
      },
      _sum: {
        revenuePlan: true
      }
    })

    const formattedTableData = tableData.map(row => ({
      witel: row.witelBaru || 'Unknown',
      jumlahLop: row._count.id,
      revAll: parseFloat(row._sum.revenuePlan || 0),
      initial: 0,
      survey: 0,
      perizinan: 0,
      instalasi: 0,
      piOgp: 0,
      golive: row.goLive === 'Y' ? row._count.id : 0,
      drop: 0
    }))

    // Get project data (belum GO LIVE)
    const projectData = await prisma.spmkMom.findMany({
      where: {
        ...whereClause,
        goLive: 'N'
      },
      select: {
        witelBaru: true,
        region: true,
        revenuePlan: true,
        usia: true
      }
    })

    successResponse(
      res,
      {
        tableData: formattedTableData,
        projectData
      },
      'Report Tambahan data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// Get Report Datin - from SPMK MOM data  
export const getReportDatin = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let whereClause = { statusProyek: { contains: 'DATIN' } }

    if (start_date && end_date) {
      whereClause.createdAt = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    const tableData = await prisma.spmkMom.groupBy({
      by: ['witelBaru', 'region'],
      where: whereClause,
      _count: {
        id: true
      },
      _sum: {
        revenuePlan: true,
        rab: true
      }
    })

    const formattedTableData = tableData.map(row => ({
      witel: row.witelBaru || 'Unknown',
      branch: row.region || 'Unknown',
      totalAmount: parseFloat(row._sum.revenuePlan || 0),
      jumlahProject: row._count.id,
      selesai: 0,
      progress: row._count.id
    }))

    successResponse(
      res,
      {
        tableData: formattedTableData,
        posisiGalaksi: []
      },
      'Report Datin data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// Get Report Analysis - from SOS data segmentation
export const getReportAnalysis = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let whereClause = {}

    if (start_date && end_date) {
      whereClause.orderCreatedDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    // Get SME data
    const smeData = await prisma.sosData.count({
      where: {
        ...whereClause,
        segmen: { contains: 'SME' }
      }
    })

    const smeBillAmount = await prisma.sosData.aggregate({
      where: {
        ...whereClause,
        segmen: { contains: 'SME' }
      },
      _sum: {
        revenue: true
      }
    })

    // Get Government data
    const govData = await prisma.sosData.count({
      where: {
        ...whereClause,
        segmen: { contains: 'GOV' }
      }
    })

    const govBillAmount = await prisma.sosData.aggregate({
      where: {
        ...whereClause,
        segmen: { contains: 'GOV' }
      },
      _sum: {
        revenue: true
      }
    })

    // Get Private data
    const privateData = await prisma.sosData.count({
      where: {
        ...whereClause,
        segmen: { notIn: ['SME', 'GOVERNMENT', 'GOV', 'SOE'] }
      }
    })

    const privateBillAmount = await prisma.sosData.aggregate({
      where: {
        ...whereClause,
        segmen: { notIn: ['SME', 'GOVERNMENT', 'GOV', 'SOE'] }
      },
      _sum: {
        revenue: true
      }
    })

    const tableData = [
      {
        kategori: 'SME',
        jumlah: smeData,
        totalRevenue: parseFloat(smeBillAmount._sum.revenue || 0)
      },
      {
        kategori: 'GOVERNMENT',
        jumlah: govData,
        totalRevenue: parseFloat(govBillAmount._sum.revenue || 0)
      },
      {
        kategori: 'PRIVATE',
        jumlah: privateData,
        totalRevenue: parseFloat(privateBillAmount._sum.revenue || 0)
      }
    ]

    successResponse(
      res,
      { tableData },
      'Report Analysis data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// Get Report HSI - from HSI data table
export const getReportHSI = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let whereClause = {}

    if (start_date && end_date) {
      whereClause.orderDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    const tableData = await prisma.hsiData.groupBy({
      by: ['witel'],
      where: whereClause,
      _count: {
        id: true
      },
      _sum: {
        upload: true
      }
    })

    const formattedTableData = tableData.map(row => ({
      witel: row.witel || 'Unknown',
      totalHsi: row._count.id,
      jumlahProject: row._count.id,
      selesai: 0,
      progress: row._count.id,
      avgRevenue: 0
    }))

    successResponse(
      res,
      { tableData: formattedTableData },
      'Report HSI data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}
