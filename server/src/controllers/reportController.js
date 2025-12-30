import sql from '../config/database.js'
import { successResponse, errorResponse } from '../utils/response.js'

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

// Get Report Datin data
export const getReportDatin = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let query = sql`
      SELECT 
        witel,
        branch,
        SUM(amount) as total_amount,
        COUNT(*) as jumlah_project,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as selesai,
        SUM(CASE WHEN status = 'progress' THEN 1 ELSE 0 END) as progress
      FROM digital_products
      WHERE product_name = 'DATIN'
    `

    if (start_date && end_date) {
      query = sql`
        SELECT 
          witel,
          branch,
          SUM(amount) as total_amount,
          COUNT(*) as jumlah_project,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as selesai,
          SUM(CASE WHEN status = 'progress' THEN 1 ELSE 0 END) as progress
        FROM digital_products
        WHERE product_name = 'DATIN'
        AND created_at >= ${new Date(start_date)} 
        AND created_at <= ${new Date(end_date)}
      `
    }

    const tableData = await sql`
      ${query}
      GROUP BY witel, branch
      ORDER BY witel, branch
    `

    successResponse(
      res,
      {
        tableData,
        posisiGalaksi: []
      },
      'Report Datin data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// Get Report Analysis data
export const getReportAnalysis = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let smeQuery = sql`
      SELECT 
        'SME' as kategori,
        COUNT(*) as jumlah,
        SUM(amount) as total_revenue
      FROM digital_products
      WHERE branch LIKE '%SME%'
    `

    if (start_date && end_date) {
      smeQuery = sql`
        SELECT 
          'SME' as kategori,
          COUNT(*) as jumlah,
          SUM(amount) as total_revenue
        FROM digital_products
        WHERE branch LIKE '%SME%'
        AND created_at >= ${new Date(start_date)} 
        AND created_at <= ${new Date(end_date)}
      `
    }

    let govQuery = sql`
      SELECT 
        'GOVERNMENT' as kategori,
        COUNT(*) as jumlah,
        SUM(amount) as total_revenue
      FROM digital_products
      WHERE branch LIKE '%GOV%' OR branch LIKE '%PEMERINTAH%'
    `

    if (start_date && end_date) {
      govQuery = sql`
        SELECT 
          'GOVERNMENT' as kategori,
          COUNT(*) as jumlah,
          SUM(amount) as total_revenue
        FROM digital_products
        WHERE (branch LIKE '%GOV%' OR branch LIKE '%PEMERINTAH%')
        AND created_at >= ${new Date(start_date)} 
        AND created_at <= ${new Date(end_date)}
      `
    }

    let privateQuery = sql`
      SELECT 
        'PRIVATE' as kategori,
        COUNT(*) as jumlah,
        SUM(amount) as total_revenue
      FROM digital_products
      WHERE branch NOT LIKE '%SME%' 
        AND branch NOT LIKE '%GOV%' 
        AND branch NOT LIKE '%PEMERINTAH%'
        AND branch NOT LIKE '%SOE%'
    `

    if (start_date && end_date) {
      privateQuery = sql`
        SELECT 
          'PRIVATE' as kategori,
          COUNT(*) as jumlah,
          SUM(amount) as total_revenue
        FROM digital_products
        WHERE branch NOT LIKE '%SME%' 
          AND branch NOT LIKE '%GOV%' 
          AND branch NOT LIKE '%PEMERINTAH%'
          AND branch NOT LIKE '%SOE%'
        AND created_at >= ${new Date(start_date)} 
        AND created_at <= ${new Date(end_date)}
      `
    }

    const smeData = await sql`${smeQuery}`
    const govData = await sql`${govQuery}`
    const privateData = await sql`${privateQuery}`

    const tableData = [
      ...(smeData || []),
      ...(govData || []),
      ...(privateData || [])
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

// Get Report HSI data
export const getReportHSI = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let query = sql`
      SELECT 
        witel,
        SUM(amount) as total_hsi,
        COUNT(*) as jumlah_project,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as selesai,
        SUM(CASE WHEN status = 'progress' THEN amount ELSE 0 END) as progress,
        AVG(revenue) as avg_revenue
      FROM digital_products
      WHERE product_name = 'HSI'
    `

    if (start_date && end_date) {
      query = sql`
        SELECT 
          witel,
          SUM(amount) as total_hsi,
          COUNT(*) as jumlah_project,
          SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as selesai,
          SUM(CASE WHEN status = 'progress' THEN amount ELSE 0 END) as progress,
          AVG(revenue) as avg_revenue
        FROM digital_products
        WHERE product_name = 'HSI'
        AND created_at >= ${new Date(start_date)} 
        AND created_at <= ${new Date(end_date)}
      `
    }

    const tableData = await sql`
      ${query}
      GROUP BY witel
      ORDER BY witel
    `

    successResponse(
      res,
      { tableData },
      'Report HSI data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}
