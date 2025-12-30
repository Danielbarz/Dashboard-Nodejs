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

// Get KPI data (total order, completed, open/progress)
export const getKPIData = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let whereClause = ''
    if (startDate && endDate) {
      whereClause = `WHERE created_at >= '${new Date(startDate).toISOString()}' AND created_at <= '${new Date(endDate).toISOString()}'`
    }

    const stats = await sql`
      SELECT 
        COUNT(*) as total_order,
        SUM(CASE WHEN status = 'completed' OR status = 'ps' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'open' OR status = 'progress' THEN 1 ELSE 0 END) as open_progress
      FROM digital_products
      ${whereClause ? sql`${whereClause}` : sql``}
    `

    const data = {
      totalOrder: parseInt(stats[0].total_order),
      completed: parseInt(stats[0].completed || 0),
      openProgress: parseInt(stats[0].open_progress || 0)
    }

    successResponse(res, data, 'KPI data retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get total order by regional (pie chart)
export const getTotalOrderByRegional = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let result
    if (startDate && endDate) {
      result = await sql`
        SELECT 
          witel as name,
          COUNT(*) as value
        FROM digital_products
        WHERE created_at >= ${new Date(startDate)} AND created_at <= ${new Date(endDate)}
        GROUP BY witel
        ORDER BY value DESC
      `
    } else {
      result = await sql`
        SELECT 
          witel as name,
          COUNT(*) as value
        FROM digital_products
        GROUP BY witel
        ORDER BY value DESC
      `
    }

    const chartData = result.map((row) => ({
      name: row.name,
      value: parseInt(row.value)
    }))

    successResponse(res, chartData, 'Total order by regional retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get sebaran data PS per witel (pie chart)
export const getSebaranDataPS = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let result
    if (startDate && endDate) {
      result = await sql`
        SELECT 
          witel as name,
          COUNT(*) as value
        FROM digital_products
        WHERE (status = 'completed' OR status = 'ps') 
          AND created_at >= ${new Date(startDate)} AND created_at <= ${new Date(endDate)}
        GROUP BY witel
        ORDER BY value DESC
      `
    } else {
      result = await sql`
        SELECT 
          witel as name,
          COUNT(*) as value
        FROM digital_products
        WHERE status = 'completed' OR status = 'ps'
        GROUP BY witel
        ORDER BY value DESC
      `
    }

    const chartData = result.map((row) => ({
      name: row.name,
      value: parseInt(row.value)
    }))

    successResponse(res, chartData, 'Sebaran data PS per witel retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get cancel by FCC (bar chart)
export const getCancelByFCC = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let result
    if (startDate && endDate) {
      result = await sql`
        SELECT 
          witel as name,
          COUNT(*) as value
        FROM digital_products
        WHERE status ILIKE '%cancel%' AND status ILIKE '%fcc%'
          AND created_at >= ${new Date(startDate)} AND created_at <= ${new Date(endDate)}
        GROUP BY witel
        ORDER BY witel
      `
    } else {
      result = await sql`
        SELECT 
          witel as name,
          COUNT(*) as value
        FROM digital_products
        WHERE status ILIKE '%cancel%' AND status ILIKE '%fcc%'
        GROUP BY witel
        ORDER BY witel
      `
    }

    const chartData = result.map((row) => ({
      name: row.name,
      value: parseInt(row.value)
    }))

    successResponse(res, chartData, 'Cancel by FCC data retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get filter options (products, branches, sub_types)
export const getFilterOptions = async (req, res, next) => {
  try {
    const products = await sql`
      SELECT DISTINCT product_name 
      FROM digital_products 
      ORDER BY product_name
    `

    const branches = await sql`
      SELECT DISTINCT branch 
      FROM digital_products 
      ORDER BY branch
    `

    const witels = await sql`
      SELECT DISTINCT witel 
      FROM digital_products 
      ORDER BY witel
    `

    const subTypes = await sql`
      SELECT DISTINCT sub_type 
      FROM digital_products 
      WHERE sub_type IS NOT NULL
      ORDER BY sub_type
    `

    successResponse(res, {
      products: products.map((p) => p.product_name),
      branches: branches.map((b) => b.branch),
      witels: witels.map((w) => w.witel),
      subTypes: subTypes.map((s) => s.sub_type)
    }, 'Filter options retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get dashboard data with filters
export const getDashboardData = async (req, res, next) => {
  try {
    const { startDate, endDate, product, witel, subType } = req.query

    // Build filter conditions
    let conditions = []
    if (startDate && endDate) {
      conditions.push(
        sql`created_at >= ${new Date(startDate)} AND created_at <= ${new Date(endDate)}`
      )
    }
    if (product) {
      conditions.push(sql`product_name = ${product}`)
    }
    if (witel) {
      conditions.push(sql`witel = ${witel}`)
    }
    if (subType) {
      conditions.push(sql`sub_type = ${subType}`)
    }

    // Get all relevant data
    let products = await sql`
      SELECT DISTINCT product_name FROM digital_products ORDER BY product_name
    `

    let branches = await sql`
      SELECT DISTINCT branch FROM digital_products ORDER BY branch
    `

    let witels = await sql`
      SELECT DISTINCT witel FROM digital_products ORDER BY witel
    `

    successResponse(res, {
      filters: {
        products: products.map((p) => p.product_name),
        branches: branches.map((b) => b.branch),
        witels: witels.map((w) => w.witel)
      },
      stats: {
        totalProducts: products.length,
        totalBranches: branches.length,
        totalWitels: witels.length
      }
    }, 'Dashboard data retrieved successfully')
  } catch (error) {
    next(error)
  }
}
// Get Report Tambahan (JT) data
export const getReportTambahan = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let query = sql`
      SELECT 
        witel,
        SUM(CASE WHEN sub_type = 'jumlah_lop' THEN amount ELSE 0 END) as jumlah_lop,
        SUM(CASE WHEN sub_type = 'rev_all' THEN amount ELSE 0 END) as rev_all,
        SUM(CASE WHEN sub_type = 'initial' THEN amount ELSE 0 END) as initial,
        SUM(CASE WHEN sub_type = 'survey' THEN amount ELSE 0 END) as survey,
        SUM(CASE WHEN sub_type = 'perizinan' THEN amount ELSE 0 END) as perizinan,
        SUM(CASE WHEN sub_type = 'instalasi' THEN amount ELSE 0 END) as instalasi,
        SUM(CASE WHEN sub_type = 'pi_ogp' THEN amount ELSE 0 END) as pi_ogp,
        SUM(CASE WHEN sub_type = 'golive' THEN amount ELSE 0 END) as golive,
        SUM(CASE WHEN sub_type = 'drop' THEN amount ELSE 0 END) as drop
      FROM digital_products
      WHERE product_name = 'JT'
    `

    if (start_date && end_date) {
      query = sql`
        SELECT 
          witel,
          SUM(CASE WHEN sub_type = 'jumlah_lop' THEN amount ELSE 0 END) as jumlah_lop,
          SUM(CASE WHEN sub_type = 'rev_all' THEN amount ELSE 0 END) as rev_all,
          SUM(CASE WHEN sub_type = 'initial' THEN amount ELSE 0 END) as initial,
          SUM(CASE WHEN sub_type = 'survey' THEN amount ELSE 0 END) as survey,
          SUM(CASE WHEN sub_type = 'perizinan' THEN amount ELSE 0 END) as perizinan,
          SUM(CASE WHEN sub_type = 'instalasi' THEN amount ELSE 0 END) as instalasi,
          SUM(CASE WHEN sub_type = 'pi_ogp' THEN amount ELSE 0 END) as pi_ogp,
          SUM(CASE WHEN sub_type = 'golive' THEN amount ELSE 0 END) as golive,
          SUM(CASE WHEN sub_type = 'drop' THEN amount ELSE 0 END) as drop
        FROM digital_products
        WHERE product_name = 'JT' 
        AND created_at >= ${new Date(start_date)} 
        AND created_at <= ${new Date(end_date)}
      `
    }

    const tableData = await sql`
      ${query}
      GROUP BY witel
      ORDER BY witel
    `

    // Get project data (belum GO LIVE)
    let projectQuery = sql`
      SELECT 
        witel,
        branch,
        SUM(CASE WHEN status = 'dalam_toc' THEN amount ELSE 0 END) as dalam_toc,
        SUM(CASE WHEN status = 'lewat_toc' THEN amount ELSE 0 END) as lewat_toc,
        SUM(amount) as jumlah_lop_progress
      FROM digital_products
      WHERE product_name = 'JT' AND status IN ('dalam_toc', 'lewat_toc')
    `

    if (start_date && end_date) {
      projectQuery = sql`
        SELECT 
          witel,
          branch,
          SUM(CASE WHEN status = 'dalam_toc' THEN amount ELSE 0 END) as dalam_toc,
          SUM(CASE WHEN status = 'lewat_toc' THEN amount ELSE 0 END) as lewat_toc,
          SUM(amount) as jumlah_lop_progress
        FROM digital_products
        WHERE product_name = 'JT' AND status IN ('dalam_toc', 'lewat_toc')
        AND created_at >= ${new Date(start_date)} 
        AND created_at <= ${new Date(end_date)}
      `
    }

    const projectData = await sql`
      ${projectQuery}
      GROUP BY witel, branch
      ORDER BY witel, branch
    `

    successResponse(
      res,
      {
        tableData,
        projectData
      },
      'Report Tambahan data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}