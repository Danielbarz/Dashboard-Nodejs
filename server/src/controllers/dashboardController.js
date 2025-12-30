import sql from '../config/database.js'
import { successResponse, errorResponse } from '../utils/response.js'

// Get revenue by witel for stacked bar chart
export const getRevenueByWitel = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let query = sql`
      SELECT 
        witel,
        product_name as "type",
        SUM(revenue) as value
      FROM digital_products
    `

    if (startDate && endDate) {
      query = sql`
        SELECT 
          witel,
          product_name as "type",
          SUM(revenue) as value
        FROM digital_products
        WHERE created_at >= ${new Date(startDate)} AND created_at <= ${new Date(endDate)}
      `
    }

    const result = await sql`
      ${query}
      GROUP BY witel, product_name
      ORDER BY witel, product_name
    `

    // Transform to chart format
    const data = {}
    result.forEach((row) => {
      if (!data[row.witel]) {
        data[row.witel] = { name: row.witel }
      }
      data[row.witel][row.type] = parseFloat(row.value)
    })

    const chartData = Object.values(data)

    successResponse(res, chartData, 'Revenue by witel retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get amount by witel for stacked bar chart
export const getAmountByWitel = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    let result
    if (startDate && endDate) {
      result = await sql`
        SELECT 
          witel,
          product_name as "type",
          SUM(amount) as value
        FROM digital_products
        WHERE created_at >= ${new Date(startDate)} AND created_at <= ${new Date(endDate)}
        GROUP BY witel, product_name
        ORDER BY witel, product_name
      `
    } else {
      result = await sql`
        SELECT 
          witel,
          product_name as "type",
          SUM(amount) as value
        FROM digital_products
        GROUP BY witel, product_name
        ORDER BY witel, product_name
      `
    }

    // Transform to chart format
    const data = {}
    result.forEach((row) => {
      if (!data[row.witel]) {
        data[row.witel] = { name: row.witel }
      }
      data[row.witel][row.type] = parseFloat(row.value)
    })

    const chartData = Object.values(data)

    successResponse(res, chartData, 'Amount by witel retrieved successfully')
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
