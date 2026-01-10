import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import ExcelJS from 'exceljs';
dayjs.extend(utc)
dayjs.extend(timezone)

// --- HELPER: Coordinate Fixer (Migrasi dari PHP) ---
const fixCoordinate = (val, isLat) => {
  if (!val) return null
  // Hapus karakter non-numerik kecuali minus dan titik
  const c = val.toString().replace(/[^0-9\-.]/g, '')
  if (isNaN(c) || c === '') return null

  let f = parseFloat(c)
  if (f === 0) return null

  let loop = 0
  if (isLat) {
    // Latitude Indonesia kira-kira -11 sampai 6
    while ((f < -12 || f > 10) && loop < 15) {
      f /= 10
      loop++
    }
  } else {
    // Longitude Indonesia kira-kira 95 sampai 141
    while (Math.abs(f) > 142 && loop < 15) {
      f /= 10
      loop++
    }
  }
  return f
}

// --- SCOPE DATA (RSO 2) ---
const RSO2_WITELS = ['JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'BALI', 'NUSA TENGGARA']


const getBranchMap = async () => {
  const branchesRaw = await prisma.hsiData.groupBy({
    by: ['witel', 'witelOld'],
    where: { witel: { in: RSO2_WITELS }, witelOld: { not: null } }
  })
  const branchMap = {}
  branchesRaw.forEach(b => {
    const witelKey = (b.witel || '').toUpperCase()
    const branchVal = (b.witelOld || '').toUpperCase()
    if (!branchMap[witelKey]) branchMap[witelKey] = []
    if (branchVal && !branchMap[witelKey].includes(branchVal)) branchMap[witelKey].push(branchVal)
  })
  return branchMap
}

// =================================================================
// BAGIAN 1: KODE LAMA ANDA (SOS, JT, REPORTS)
// =================================================================

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
    // const regions = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

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

    const witels = await prisma.sosData.findMany({
      distinct: ['billWitel'],
      select: { billWitel: true }
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

    // Date filter
    let dateFilter = ''
    const params = []
    if (start_date && end_date) {
      dateFilter = 'WHERE tanggal_mom BETWEEN $1 AND $2'
      params.push(new Date(start_date))
      params.push(new Date(end_date))
    }



    // Aggregate per witel + region
    const rows = await prisma.$queryRawUnsafe(
      `SELECT
        TRIM(UPPER(REPLACE(witel_lama, 'WITEL ', ''))) AS witel,
        TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) AS parent_witel,
        SUM(CASE WHEN populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS jumlah_lop,
        SUM(COALESCE(revenue_plan,0)) AS rev_all,
        SUM(CASE WHEN (status_i_hld ILIKE '%GO LIVE%' OR go_live = 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS golive_jml,
        SUM(CASE WHEN (status_i_hld ILIKE '%GO LIVE%' OR go_live = 'Y') AND populasi_non_drop = 'Y' THEN COALESCE(revenue_plan,0) ELSE 0 END) AS golive_rev,
        SUM(CASE WHEN populasi_non_drop = 'N' THEN 1 ELSE 0 END)::int AS drop_cnt,
        SUM(CASE WHEN status_tomps_last_activity ILIKE '%DALAM%' AND populasi_non_drop = 'Y' AND go_live = 'N' THEN 1 ELSE 0 END)::int AS dalam_toc,
        SUM(CASE WHEN status_tomps_last_activity ILIKE '%LEWAT%' AND populasi_non_drop = 'Y' AND go_live = 'N' THEN 1 ELSE 0 END)::int AS lewat_toc,
        SUM(CASE WHEN status_i_hld ILIKE '%Initial%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_initial,
        SUM(CASE WHEN status_i_hld ILIKE '%Survey%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_survey,
        SUM(CASE WHEN status_i_hld ILIKE '%Perizinan%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_perizinan,
        SUM(CASE WHEN status_i_hld ILIKE '%Instalasi%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_instalasi,
        SUM(CASE WHEN status_i_hld ILIKE '%FI%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_fi
      FROM spmk_mom
      ${dateFilter}
      GROUP BY witel_baru, witel_lama, region
      ORDER BY witel_baru, witel_lama` ,
      ...params
    )

    const WITEL_HIERARCHY = {
      'BALI': ['BALI', 'DENPASAR', 'SINGARAJA'],
      'JATIM BARAT': ['JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG'],
      'JATIM TIMUR': ['JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO'],
      'NUSA TENGGARA': ['NUSA TENGGARA', 'NTT', 'NTB'],
      'SURAMADU': ['SURAMADU', 'SURABAYA UTARA', 'SURABAYA SELATAN', 'MADURA']
    }

    const findParent = (w) => {
      for (const [p, children] of Object.entries(WITEL_HIERARCHY)) {
        if (children.includes(w)) return p
      }
      return w
    }

    // Build table data with parent (region) rows
    const parents = new Map()
    const tableData = []

    rows.forEach((row) => {
      const witelNorm = row.witel
      const parentKey = row.parent_witel || findParent(witelNorm)

      const jumlahLop = Number(row.jumlah_lop || 0)
      const goliveJml = Number(row.golive_jml || 0)
      const dropCnt = Number(row.drop_cnt || 0)
      const revAll = Number(row.rev_all || 0)
      const goliveRev = Number(row.golive_rev || 0)

      const cntInitial = Number(row.cnt_initial || 0)
      const cntSurvey = Number(row.cnt_survey || 0)
      const cntPerizinan = Number(row.cnt_perizinan || 0)
      const cntInstalasi = Number(row.cnt_instalasi || 0)
      const cntFi = Number(row.cnt_fi || 0)

      // child row
      tableData.push({
        isParent: false,
        parentWitel: parentKey,
        witel: witelNorm,
        jumlahLop,
        revAll,
        initial: cntInitial,
        survey: cntSurvey,
        perizinan: cntPerizinan,
        instalasi: cntInstalasi,
        piOgp: cntFi,
        golive_jml: goliveJml,
        golive_rev: goliveRev,
        drop: dropCnt,
        persen_close: jumlahLop > 0 ? ((goliveJml / jumlahLop) * 100).toFixed(2) : '0.00'
      })

      // accumulate parent
      if (!parents.has(parentKey)) {
        parents.set(parentKey, {
          isParent: true,
          parentWitel: parentKey,
          witel: parentKey,
          jumlahLop: 0,
          revAll: 0,
          initial: 0,
          survey: 0,
          perizinan: 0,
          instalasi: 0,
          piOgp: 0,
          golive_jml: 0,
          golive_rev: 0,
          drop: 0
        })
      }
      const p = parents.get(parentKey)
      p.jumlahLop += jumlahLop
      p.revAll += revAll
      p.golive_jml += goliveJml
      p.golive_rev += goliveRev
      p.drop += dropCnt
      p.initial += cntInitial
      p.survey += cntSurvey
      p.perizinan += cntPerizinan
      p.instalasi += cntInstalasi
      p.piOgp += cntFi
    })

    // finalize parent rows and interleave
    const groupedByParent = new Map()
    tableData.forEach(row => {
      if (!groupedByParent.has(row.parentWitel)) {
        groupedByParent.set(row.parentWitel, [])
      }
      groupedByParent.get(row.parentWitel).push(row)
    })

    const finalTable = []
    parents.forEach((p, key) => {
      p.persen_close = p.jumlahLop > 0 ? ((p.golive_jml / p.jumlahLop) * 100).toFixed(2) : '0.00'
      finalTable.push(p)
      finalTable.push(...(groupedByParent.get(key) || []))
    })

    // Project data (belum GO LIVE)
    const projectRows = await prisma.$queryRawUnsafe(
      `SELECT
        TRIM(UPPER(REPLACE(witel_lama, 'WITEL ', ''))) AS witel,
        TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) AS parent_witel,
        SUM(CASE WHEN status_tomps_last_activity ILIKE '%DALAM%' THEN 1 ELSE 0 END)::int AS dalam_toc,
        SUM(CASE WHEN status_tomps_last_activity ILIKE '%LEWAT%' THEN 1 ELSE 0 END)::int AS lewat_toc,
        SUM(CASE WHEN go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS lop_progress
      FROM spmk_mom
      ${dateFilter ? `${dateFilter} AND go_live = 'N' AND populasi_non_drop = 'Y'` : "WHERE go_live = 'N' AND populasi_non_drop = 'Y'"}
      GROUP BY witel_baru, witel_lama
      ORDER BY witel_baru, witel_lama`,
      ...params
    )

    const parentProjects = new Map()
    const projectData = []

    projectRows.forEach((row) => {
      const witelNorm = row.witel
      const parentKey = row.parent_witel || findParent(witelNorm)
      const dalam = Number(row.dalam_toc || 0)
      const lewat = Number(row.lewat_toc || 0)
      const progress = Number(row.lop_progress || 0)

      projectData.push({
        isParent: false,
        parentWitel: parentKey,
        witel: witelNorm,
        dalam_toc: dalam,
        lewat_toc: lewat,
        jumlah_lop_progress: progress,
        persen_dalam_toc: (dalam + lewat) > 0 ? ((dalam / (dalam + lewat)) * 100).toFixed(2) : '0.00'
      })

      if (!parentProjects.has(parentKey)) {
        parentProjects.set(parentKey, {
          isParent: true,
          parentWitel: parentKey,
          witel: parentKey,
          dalam_toc: 0,
          lewat_toc: 0,
          jumlah_lop_progress: 0
        })
      }
      const p = parentProjects.get(parentKey)
      p.dalam_toc += dalam
      p.lewat_toc += lewat
      p.jumlah_lop_progress += progress
    })

    const groupedProject = new Map()
    projectData.forEach(r => {
      if (!groupedProject.has(r.parentWitel)) groupedProject.set(r.parentWitel, [])
      groupedProject.get(r.parentWitel).push(r)
    })

    const finalProjects = []
    parentProjects.forEach((p, key) => {
      p.persen_dalam_toc = (p.dalam_toc + p.lewat_toc) > 0 ? ((p.dalam_toc / (p.dalam_toc + p.lewat_toc)) * 100).toFixed(2) : '0.00'
      finalProjects.push(p)
      finalProjects.push(...(groupedProject.get(key) || []))
    })

    // --- TOP 3 AGING (Tanpa batasan dateFilter agar project lama tetap muncul) ---
    const top3WitelRaw = await prisma.$queryRawUnsafe(
      `WITH Ranked AS (
         SELECT
           TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) as witel_norm,
           id_i_hld,
           tanggal_mom,
           revenue_plan,
           status_tomps_new,
           usia,
           uraian_kegiatan,
           ROW_NUMBER() OVER (PARTITION BY TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) ORDER BY usia DESC) as rn
         FROM spmk_mom
         WHERE go_live = 'N' AND populasi_non_drop = 'Y'
       )
       SELECT * FROM Ranked WHERE rn <= 3 ORDER BY witel_norm, rn`
    )

    const top3PoRaw = await prisma.$queryRawUnsafe(
      `WITH Ranked AS (
         SELECT
           po_name,
           uraian_kegiatan,
           id_i_hld,
           tanggal_mom,
           revenue_plan,
           status_tomps_new,
           usia,
           ROW_NUMBER() OVER (PARTITION BY po_name ORDER BY usia DESC) as rn
         FROM spmk_mom
         WHERE go_live = 'N' AND populasi_non_drop = 'Y'
       )
       SELECT * FROM Ranked WHERE rn <= 3 ORDER BY po_name, rn`
    )

    // --- NEW: Distribution of Project Age (Bucket Usia) ---
    const bucketUsiaRaw = await prisma.$queryRawUnsafe(
      `SELECT
        CASE
          WHEN usia < 30 THEN '< 30 Hari'
          WHEN usia BETWEEN 30 AND 60 THEN '30 - 60 Hari'
          WHEN usia BETWEEN 61 AND 90 THEN '61 - 90 Hari'
          ELSE '> 90 Hari'
        END as range,
        COUNT(*)::int as count
      FROM spmk_mom
      WHERE go_live = 'N' AND populasi_non_drop = 'Y'
      GROUP BY range
      ORDER BY range`
    )

    // --- NEW: Trend Order vs Go-Live (Monthly) ---
    const trendRaw = await prisma.$queryRawUnsafe(
      `SELECT
        TO_CHAR(tanggal_mom, 'YYYY-MM') as month,
        COUNT(*)::int as total_order,
        SUM(CASE WHEN go_live = 'Y' THEN 1 ELSE 0 END)::int as total_golive
      FROM spmk_mom
      ${dateFilter ? `${dateFilter} AND populasi_non_drop = 'Y'` : "WHERE populasi_non_drop = 'Y'"}
      GROUP BY month
      ORDER BY month`,
      ...params
    )

    // Helper formatting
    const formatRaw = (rows) => rows.map(r => ({
      ...r,
      region: findParent(r.witel_norm || ''), // Untuk Top 3 Witel, gunakan parent
      revenue_plan: Number(r.revenue_plan || 0),
      usia: Number(r.usia || 0),
      rn: Number(r.rn)
    }))

    successResponse(
      res,
      {
        tableData: finalTable,
        projectData: finalProjects,
        top3Witel: formatRaw(top3WitelRaw),
        top3Po: formatRaw(top3PoRaw),
        bucketUsiaData: bucketUsiaRaw,
        trendGolive: trendRaw,
        topMitraRevenue: []
      },
      'Report Tambahan data retrieved successfully'
    )
  } catch (error) {
    console.error("GET REPORT TAMBAHAN ERROR:", error)
    return res.status(500).json({
      success: false,
      message: `Error fetching report: ${error.message}`,
      error: error.toString()
    })
  }
}

// Get Report Datin - from SPMK MOM data
export const getReportDatin = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let whereClause = { statusProyek: { contains: 'DATIN', mode: 'insensitive' } }

    if (start_date && end_date) {
      whereClause.tanggalMom = {
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
    
    // Base conditions with RSO2 Scope (Keep this for safety/scope)
    const conditions = [`UPPER(witel) IN (${RSO2_WITELS.map(w => `'${w.toUpperCase()}'`).join(',')})`]
    
    if (start_date && end_date) {
      conditions.push(`order_date >= '${start_date}'::date`)
      conditions.push(`order_date < ('${end_date}'::date + INTERVAL '1 day')`)
    }

    const whereSql = `WHERE ${conditions.join(' AND ')}`

    const query = `
      SELECT
        witel,
        COUNT(*) as registered,
        
        -- PRE PI
        SUM(CASE WHEN UPPER(status_resume) LIKE '%PRE PI%' THEN 1 ELSE 0 END) as pre_pi,
        
        -- INPRO SC
        SUM(CASE WHEN UPPER(data_proses) = 'INPRO SC' THEN 1 ELSE 0 END) as inpro_sc,
        
        -- QC1
        SUM(CASE WHEN UPPER(data_proses) = 'CANCEL QC1' THEN 1 ELSE 0 END) as qc1,
        
        -- FCC
        SUM(CASE WHEN UPPER(data_proses) = 'CANCEL FCC' THEN 1 ELSE 0 END) as fcc,
        
        -- RJCT FCC
        SUM(CASE WHEN UPPER(kelompok_status) = 'REJECT_FCC' THEN 1 ELSE 0 END) as rjct_fcc,
        
        -- Survey Manja
        SUM(CASE WHEN UPPER(data_proses) = 'OGP SURVEY' AND UPPER(status_resume) LIKE '%INVALID SURVEY%' THEN 1 ELSE 0 END) as survey_manja,
        
        -- UN-SC
        SUM(CASE WHEN UPPER(data_proses) = 'UNSC' THEN 1 ELSE 0 END) as un_sc,
        
        -- PI Aging
        SUM(CASE WHEN kelompok_status = 'PI' AND (NOW() - order_date) < INTERVAL '24 hours' THEN 1 ELSE 0 END) as pi_under_24,
        SUM(CASE WHEN kelompok_status = 'PI' AND (NOW() - order_date) >= INTERVAL '24 hours' AND (NOW() - order_date) <= INTERVAL '72 hours' THEN 1 ELSE 0 END) as pi_24_72,
        SUM(CASE WHEN kelompok_status = 'PI' AND (NOW() - order_date) > INTERVAL '72 hours' THEN 1 ELSE 0 END) as pi_over_72,
        SUM(CASE WHEN kelompok_status = 'PI' THEN 1 ELSE 0 END) as total_pi,
        
        -- Fallout (FO)
        SUM(CASE WHEN kelompok_status = 'FO_UIM' THEN 1 ELSE 0 END) as fo_uim,
        SUM(CASE WHEN kelompok_status = 'FO_ASAP' THEN 1 ELSE 0 END) as fo_asp,
        SUM(CASE WHEN kelompok_status = 'FO_OSM' THEN 1 ELSE 0 END) as fo_osm,
        
        -- FO WFM Split (Simplified Logic based on kel_kendala or default)
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND UPPER(kelompok_kendala) LIKE '%PELANGGAN%' THEN 1 ELSE 0 END) as fo_wfm_plgn,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND UPPER(kelompok_kendala) LIKE '%TEKNIS%' THEN 1 ELSE 0 END) as fo_wfm_teknis,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND UPPER(kelompok_kendala) LIKE '%SYSTEM%' THEN 1 ELSE 0 END) as fo_wfm_system,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND (kelompok_kendala IS NULL OR (UPPER(kelompok_kendala) NOT LIKE '%PELANGGAN%' AND UPPER(kelompok_kendala) NOT LIKE '%TEKNIS%' AND UPPER(kelompok_kendala) NOT LIKE '%SYSTEM%')) THEN 1 ELSE 0 END) as fo_wfm_others,
        SUM(CASE WHEN kelompok_status IN ('FO_UIM', 'FO_ASAP', 'FO_OSM', 'FO_WFM') THEN 1 ELSE 0 END) as total_fallout,
        
        -- ACT COMP
        SUM(CASE WHEN kelompok_status = 'ACT_COM' THEN 1 ELSE 0 END) as act_comp,
        
        -- PS
        SUM(CASE WHEN kelompok_status = 'PS' THEN 1 ELSE 0 END) as ps,
        
        -- CANCEL Split
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND UPPER(kelompok_kendala) LIKE '%PELANGGAN%' THEN 1 ELSE 0 END) as cancel_plgn,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND UPPER(kelompok_kendala) LIKE '%TEKNIS%' THEN 1 ELSE 0 END) as cancel_teknis,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND UPPER(kelompok_kendala) LIKE '%SYSTEM%' THEN 1 ELSE 0 END) as cancel_system,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND (kelompok_kendala IS NULL OR (UPPER(kelompok_kendala) NOT LIKE '%PELANGGAN%' AND UPPER(kelompok_kendala) NOT LIKE '%TEKNIS%' AND UPPER(kelompok_kendala) NOT LIKE '%SYSTEM%')) THEN 1 ELSE 0 END) as cancel_others,
        SUM(CASE WHEN kelompok_status = 'CANCEL' THEN 1 ELSE 0 END) as total_cancel,
        
        -- REVOKE
        SUM(CASE WHEN data_proses = 'REVOKE' THEN 1 ELSE 0 END) as revoke
        
      FROM hsi_data
      ${whereSql}
      GROUP BY witel
    `

    const tableData = await prisma.$queryRawUnsafe(query)
    
    // Calculate Percentages
    const formattedData = tableData.map(row => {
        const r = {}
        for (const k in row) r[k] = typeof row[k] === 'bigint' ? Number(row[k]) : row[k]
        
        const pi_re_numerator = r.total_pi + r.total_fallout + r.act_comp + r.ps + r.total_cancel
        const perf_pi_re = r.registered > 0 ? ((pi_re_numerator / r.registered) * 100).toFixed(2) : 0
        
        const ps_re_denominator = r.registered - r.rjct_fcc - r.un_sc - r.revoke
        const perf_ps_re = ps_re_denominator > 0 ? ((r.ps / ps_re_denominator) * 100).toFixed(2) : 0
        
        const ps_pi_denominator = r.total_pi + r.total_fallout + r.act_comp + r.ps
        const perf_ps_pi = ps_pi_denominator > 0 ? ((r.ps / ps_pi_denominator) * 100).toFixed(2) : 0
        
        return { ...r, perf_pi_re, perf_ps_re, perf_ps_pi }
    })

    successResponse(res, { tableData: formattedData }, 'Report HSI data retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Placeholder exports for reports
export const exportReportAnalysis = async (req, res, next) => {
  try {
    successResponse(res, { message: 'Export Report Analysis not implemented' }, 'Export placeholder')
  } catch (error) {
    next(error)
  }
}

export const exportReportDatin = async (req, res, next) => {
  try {
    successResponse(res, { message: 'Export Report Datin not implemented' }, 'Export placeholder')
  } catch (error) {
    next(error)
  }
}

export const exportReportTambahan = async (req, res, next) => {
  try {
    successResponse(res, { message: 'Export Report Tambahan not implemented' }, 'Export placeholder')
  } catch (error) {
    next(error)
  }
}

export const exportReportHSI = async (req, res, next) => {
  try {
    successResponse(res, { message: 'Export Report HSI not implemented' }, 'Export placeholder')
  } catch (error) {
    next(error)
  }
}

// JT/Jaringan Tambahan dashboard data (spmk_mom)
export const getJTDashboard = async (req, res, next) => {
  try {
    const { witel, po, search, limit } = req.query

    const defaultStart = dayjs().startOf('year').toDate()
    const maxDate = await prisma.spmkMom.aggregate({ _max: { tanggalMom: true } })
    const defaultEnd = maxDate._max.tanggalMom || new Date()

    const startDate = req.query.start_date ? new Date(req.query.start_date) : defaultStart
    const endDate = req.query.end_date ? new Date(req.query.end_date) : defaultEnd

    const whereClause = {
      tanggalMom: {
        gte: startDate,
        lte: endDate
      }
    }

    if (witel) whereClause.witelBaru = witel
    if (po) whereClause.poName = po
    if (search) {
      whereClause.OR = [
        { idIHld: { contains: search, mode: 'insensitive' } },
        { noNdeSpmk: { contains: search, mode: 'insensitive' } },
        { uraianKegiatan: { contains: search, mode: 'insensitive' } },
        { poName: { contains: search, mode: 'insensitive' } }
      ]
    }

    const rows = await prisma.spmkMom.findMany({
      where: whereClause,
      select: {
        witelBaru: true,
        poName: true,
        goLive: true,
        statusTompsNew: true,
        statusProyek: true,
        revenuePlan: true,
        rab: true,
        usia: true,
        statusIHld: true,
        tanggalMom: true,
        idIHld: true,
        noNdeSpmk: true,
        uraianKegiatan: true
      }
    })

    const isDrop = (row) => {
      const st = (row.statusTompsNew || '').toUpperCase()
      const sp = (row.statusProyek || '').toUpperCase()
      return st.includes('DROP') || sp.includes('BATAL') || sp.includes('CANCEL')
    }

    // Status pie/stack per witel
    const statusByWitel = {}
    rows.forEach((row) => {
      const key = row.witelBaru || 'Unknown'
      if (!statusByWitel[key]) statusByWitel[key] = { golive: 0, belum_golive: 0, drop: 0 }
      if (isDrop(row)) statusByWitel[key].drop += 1
      else if (row.goLive === 'Y') statusByWitel[key].golive += 1
      else statusByWitel[key].belum_golive += 1
    })

    // Radar/pipeline counts by statusIHld
    const pipeline = {}
    rows.forEach((row) => {
      const key = row.statusIHld || 'Unknown'
      pipeline[key] = (pipeline[key] || 0) + 1
    })

    // Top aging
    const topAging = [...rows]
      .filter((r) => typeof r.usia === 'number')
      .sort((a, b) => (b.usia || 0) - (a.usia || 0))
      .slice(0, 15)
      .map((r) => ({
        witel: r.witelBaru || 'Unknown',
        po: r.poName || '-',
        usia: r.usia || 0,
        idIHld: r.idIHld,
        uraian: r.uraianKegiatan,
        status: r.statusIHld
      }))

    // Preview table with pagination
    const pageSize = Math.min(parseInt(limit) || 20, 200)
    const preview = rows
      .sort((a, b) => (b.usia || 0) - (a.usia || 0))
      .slice(0, pageSize)
      .map((r) => ({
        witel: r.witelBaru,
        po: r.poName,
        status: r.statusIHld,
        goLive: r.goLive,
        drop: isDrop(r),
        usia: r.usia,
        tanggalMom: r.tanggalMom,
        revenuePlan: r.revenuePlan,
        rab: r.rab,
        idIHld: r.idIHld,
        noNdeSpmk: r.noNdeSpmk,
        uraianKegiatan: r.uraianKegiatan
      }))

    successResponse(res, {
      filters: {
        startDate,
        endDate,
        witel,
        po
      },
      statusByWitel,
      pipeline,
      topAging,
      preview
    }, 'JT dashboard data retrieved')
  } catch (error) {
    next(error)
  }
}

// JT filter options and default ranges
export const getJTFilters = async (req, res, next) => {
  try {
    const witelList = await prisma.spmkMom.findMany({
      distinct: ['witelBaru'],
      select: { witelBaru: true, poName: true }
    })

    const poList = await prisma.spmkMom.findMany({
      distinct: ['poName'],
      select: { poName: true, witelBaru: true }
    })

    const maxDate = await prisma.spmkMom.aggregate({ _max: { tanggalMom: true }, _min: { tanggalMom: true } })

    const witelToPo = {}
    poList.forEach((row) => {
      const w = row.witelBaru || 'Unknown'
      if (!witelToPo[w]) witelToPo[w] = new Set()
      if (row.poName) witelToPo[w].add(row.poName)
    })

    const mapped = Object.entries(witelToPo).reduce((acc, [w, set]) => {
      acc[w] = Array.from(set)
      return acc
    }, {})

    successResponse(res, {
      witel: witelList.filter((w) => w.witelBaru).map((w) => w.witelBaru),
      po: poList.filter((p) => p.poName).map((p) => p.poName),
      witelToPo: mapped,
      defaultStart: maxDate._min.tanggalMom,
      defaultEnd: maxDate._max.tanggalMom
    }, 'JT filters retrieved')
  } catch (error) {
    next(error)
  }
}

// JT report summary (admin)
export const getJTReport = async (req, res, next) => {
  try {
    const { witel, po } = req.query

    const whereClause = {}
    if (witel) whereClause.witelBaru = witel
    if (po) whereClause.poName = po

    const rows = await prisma.spmkMom.findMany({
      where: whereClause,
      select: {
        witelBaru: true,
        poName: true,
        goLive: true,
        statusTompsNew: true,
        statusProyek: true,
        statusIHld: true,
        revenuePlan: true,
        rab: true,
        usia: true,
        idIHld: true,
        uraianKegiatan: true
      }
    })

    const isDrop = (row) => {
      const st = (row.statusTompsNew || '').toUpperCase()
      const sp = (row.statusProyek || '').toUpperCase()
      return st.includes('DROP') || sp.includes('BATAL') || sp.includes('CANCEL')
    }

    const perWitel = {}
    rows.forEach((row) => {
      const key = row.witelBaru || 'Unknown'
      if (!perWitel[key]) {
        perWitel[key] = {
          witel: key,
          total: 0,
          golive: 0,
          drop: 0,
          revenue: 0,
          rab: 0
        }
      }
      perWitel[key].total += 1
      perWitel[key].revenue += parseFloat(row.revenuePlan || 0)
      perWitel[key].rab += parseFloat(row.rab || 0)
      if (isDrop(row)) perWitel[key].drop += 1
      else if (row.goLive === 'Y') perWitel[key].golive += 1
    })

    const summary = Object.values(perWitel).map((w) => ({
      ...w,
      closeRate: w.total ? Math.round((w.golive / w.total) * 10000) / 100 : 0
    }))

    const topAging = [...rows]
      .filter((r) => typeof r.usia === 'number')
      .sort((a, b) => (b.usia || 0) - (a.usia || 0))
      .slice(0, 10)
      .map((r) => ({
        witel: r.witelBaru || 'Unknown',
        po: r.poName || '-',
        usia: r.usia || 0,
        idIHld: r.idIHld,
        uraian: r.uraianKegiatan,
        status: r.statusIHld
      }))

    successResponse(res, { summary, topAging }, 'JT report retrieved')
  } catch (error) {
    next(error)
  }
}

// JT export (reuse report payload)
export const exportJTReport = async (req, res, next) => {
  try {
    // Reuse report data for now; frontend can turn this into a file
    req.query.limit = 1000
    await getJTReport(req, res, next)
  } catch (error) {
    next(error)
  }
}


// =================================================================
// BAGIAN 2: KODE BARU HSI (MIGRASI DARI PHP)
// =================================================================

// 1. DASHBOARD HSI (Charts, Map, Table)
export const getHSIDashboard = async (req, res, next) => {
  try {
    const {
      start_date, end_date,
      global_witel, global_branch,
      map_status, search,
      page = 1, limit = 10
    } = req.query

    // 1. FILTERING
    const selectedWitels = global_witel ? global_witel.split(',').filter(w => w) : []
    const selectedBranches = global_branch ? global_branch.split(',').filter(b => b) : []
    const mapStatusArr = map_status ? map_status.split(',').filter(s => s) : []

    // Base Filter (Scope RSO2)
    let baseWhere = {
      witel: { in: RSO2_WITELS }
    }

    if (selectedWitels.length > 0) {
      baseWhere.witel = { in: selectedWitels }
    }
    if (selectedBranches.length > 0) {
      baseWhere.witelOld = { in: selectedBranches }
    }
    
    // Search
    if (search) {
      baseWhere.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { nomor: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Determine Dimension (witel or witelOld)
    let dimension = 'witel'
    if (selectedBranches.length > 0 || selectedWitels.length > 0) {
      dimension = 'witelOld'
    }

    // --- CLAUSE 1: Order Date (For Charts 1, 2, 3, Trend, Table) ---
    let whereOrderDate = { ...baseWhere }
    if (start_date && end_date) {
      whereOrderDate.orderDate = { 
        gte: new Date(start_date), 
        lte: new Date(end_date) 
      }
    }

    // --- CLAUSE 2: PS Date (For Charts 4, 5, 6 - Requested TGL_PS, using lastUpdatedDate as proxy due to nulls) ---
    let wherePsDate = { ...baseWhere }
    if (start_date && end_date) {
      wherePsDate.lastUpdatedDate = { 
        gte: new Date(start_date), 
        lte: new Date(end_date) 
      }
    }

    // --- CHART 1: Total Order per Dimensi (Order Date) ---
    const chart1Raw = await prisma.hsiData.groupBy({
      by: [dimension],
      where: whereOrderDate,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })
    const chart1 = chart1Raw.map(i => ({
      product: i[dimension] || 'Unknown',
      value: i._count.id
    }))

    // --- CHART 2: Komposisi Status (Order Date) ---
    const chart2Raw = await prisma.hsiData.groupBy({
      by: ['kelompokStatus'],
      where: whereOrderDate,
      _count: { id: true }
    })
    const statusGroups = { Completed: 0, Cancel: 0, Open: 0 }
    chart2Raw.forEach(item => {
      const status = item.kelompokStatus
      if (status === 'PS') {
        statusGroups.Completed += item._count.id
      } else if (['CANCEL', 'REJECT_FCC'].includes(status)) {
        statusGroups.Cancel += item._count.id
      } else {
        statusGroups.Open += item._count.id
      }
    })
    const chart2 = Object.keys(statusGroups).map(key => ({
      product: key,
      value: statusGroups[key]
    }))

    // --- CHART 3: Tren Jenis Layanan (Order Date) ---
    const chart3Raw = await prisma.hsiData.groupBy({
      by: ['typeLayanan'],
      where: whereOrderDate,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    })
    const chart3 = chart3Raw.map(i => ({
      sub_type: i.typeLayanan,
      product: 'Total',
      total_amount: i._count.id
    }))

    // --- CHART 4: Sebaran PS per Dimensi (PS Date) ---
    const chart4Raw = await prisma.hsiData.groupBy({
      by: [dimension],
      where: { ...wherePsDate, kelompokStatus: 'PS' },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })
    const chart4 = chart4Raw.map(i => ({
      product: i[dimension] || 'Unknown',
      value: i._count.id
    }))

    // --- CHART 5: Cancel FCC (Updated: Read directly from suberrorcode) ---
    // Menggunakan wherePsDate sesuai request filter "TGL_PS"
    const chart5Raw = await prisma.hsiData.groupBy({
      by: [dimension, 'suberrorcode'],
      where: { ...wherePsDate, kelompokStatus: 'REJECT_FCC' },
      _count: { id: true }
    })

    const chart5Map = {}
    // Gunakan Set untuk menampung semua unique error code yang muncul di DB
    const chart5KeySet = new Set()

    chart5Raw.forEach(i => {
      const dim = i[dimension] || 'Unknown'
      
      // AMBIL RAW DATA: Jika null/kosong ganti string 'NULL', lalu uppercase agar seragam
      const errorCode = i.suberrorcode ? i.suberrorcode.toUpperCase() : 'NULL'

      // Masukkan ke koleksi keys (untuk dikirim ke frontend)
      chart5KeySet.add(errorCode)

      // Inisialisasi object per wilayah jika belum ada
      if (!chart5Map[dim]) chart5Map[dim] = { name: dim, total: 0 }
      
      // Assign jumlah count langsung ke kode error aslinya
      chart5Map[dim][errorCode] = (chart5Map[dim][errorCode] || 0) + i._count.id
      chart5Map[dim].total += i._count.id
    })
    
    // Sort Data: Urutkan wilayah berdasarkan total error terbanyak (Descending)
    const chart5Data = Object.values(chart5Map).sort((a, b) => b.total - a.total)
    
    // Sort Keys: Ubah Set ke Array agar bisa dibaca frontend
    const chart5Keys = Array.from(chart5KeySet).sort()

    // --- CHART 6: Cancel Non-FCC (PS Date, Sorted) ---
    const chart6Raw = await prisma.hsiData.groupBy({
      by: [dimension, 'suberrorcode'], 
      where: { ...wherePsDate, kelompokStatus: 'CANCEL' },
      _count: { id: true }
    })
    
    const chart6Map = {}
    const chart6KeySet = new Set()
    
    chart6Raw.forEach(i => {
      const dim = i[dimension] || 'Unknown'
      const err = i.suberrorcode || 'Null'
      chart6KeySet.add(err)
      
      if (!chart6Map[dim]) chart6Map[dim] = { name: dim, total: 0 }
      chart6Map[dim][err] = (chart6Map[dim][err] || 0) + i._count.id
      chart6Map[dim].total += i._count.id
    })
    
    // Sort Descending by Total Record Count
    const chart6Data = Object.values(chart6Map).sort((a, b) => b.total - a.total)
    const chart6Keys = [...chart6KeySet]

    // --- MAP DATA (Order Date) ---
    const mapWhere = { 
      ...whereOrderDate, 
      gpsLatitude: { not: null }, 
      gpsLongitude: { not: null } 
    }

    if (mapStatusArr.length > 0) {
      const statusConditions = []
      if (mapStatusArr.includes('Completed')) {
        statusConditions.push({ kelompokStatus: 'PS' })
      }
      if (mapStatusArr.includes('Cancel')) {
        statusConditions.push({ kelompokStatus: { in: ['CANCEL', 'REJECT_FCC'] } })
      }
      if (mapStatusArr.includes('Open')) {
        statusConditions.push({ NOT: { kelompokStatus: { in: ['PS', 'CANCEL', 'REJECT_FCC'] } } })
      }

      const specificStatuses = mapStatusArr.filter(s => !['Completed', 'Cancel', 'Open'].includes(s))
      if (specificStatuses.length > 0) {
        statusConditions.push({ statusResume: { in: specificStatuses } })
      }

      if (statusConditions.length > 0) {
        mapWhere.OR = statusConditions
      }
    }

    // Ambil data peta (Limit 2000 agar tidak berat)
    const mapRaw = await prisma.hsiData.findMany({
      where: mapWhere,
      select: {
        orderId: true,
        gpsLatitude: true,
        gpsLongitude: true,
        customerName: true,
        witel: true,
        kelompokStatus: true
      },
      take: 2000
    })

    const mapData = mapRaw.map(item => {
      const lat = fixCoordinate(item.gpsLatitude, true)
      const lng = fixCoordinate(item.gpsLongitude, false)
      if (!lat || !lng) return null

      let statusGroup = 'Open'
      if (item.kelompokStatus === 'PS') statusGroup = 'Completed'
      else if (['CANCEL', 'REJECT_FCC'].includes(item.kelompokStatus)) statusGroup = 'Cancel'

      return {
        id: item.orderId,
        lat,
        lng,
        status_group: statusGroup,
        name: item.customerName,
        witel: (item.witel || '').toUpperCase()
      }
    }).filter(i => i !== null)

    // --- TREND CHART (Order Date) ---
    const trendRaw = await prisma.hsiData.findMany({ 
      where: whereOrderDate, 
      select: { orderDate: true, kelompokStatus: true }, 
      orderBy: { orderDate: 'asc' } 
    })

    const trendMap = {}
    trendRaw.forEach(item => {
      if (!item.orderDate) return
      const dateStr = item.orderDate.toISOString().split('T')[0]
      if (!trendMap[dateStr]) {
        trendMap[dateStr] = { date: dateStr, total: 0, ps: 0 }
      }
      trendMap[dateStr].total++
      if (item.kelompokStatus === 'PS') trendMap[dateStr].ps++
    })
    const chartTrend = Object.values(trendMap)

    // --- TABLE DATA (Order Date) ---
    const skip = (Number(page) - 1) * Number(limit)
    const tableDataRaw = await prisma.hsiData.findMany({
      where: whereOrderDate, 
      take: Number(limit), 
      skip: skip, 
      orderBy: { orderDate: 'desc' },
      select: {
        orderId: true,
        orderDate: true,
        customerName: true,
        witel: true,
        sto: true,
        typeLayanan: true,
        kelompokStatus: true,
        statusResume: true
      }
    })

    const tableData = tableDataRaw.map(r => ({
      order_id: r.orderId,
      order_date: r.orderDate,
      customer_name: r.customerName,
      witel: r.witel,
      sto: r.sto,
      type_layanan: r.typeLayanan,
      kelompok_status: r.kelompokStatus,
      status_resume: r.statusResume
    }))

    // Stats Cards
    const stats = {
      total: await prisma.hsiData.count({ where: whereOrderDate }),
      completed: await prisma.hsiData.count({ where: { ...whereOrderDate, kelompokStatus: 'PS' } }),
      open: await prisma.hsiData.count({ where: { ...whereOrderDate, NOT: { kelompokStatus: { in: ['PS', 'CANCEL', 'REJECT_FCC'] } } } })
    }

    // Branch Mapping (Untuk Dropdown)
    const branchesRaw = await prisma.hsiData.groupBy({
      by: ['witel', 'witelOld'],
      where: { witel: { in: RSO2_WITELS }, witelOld: { not: null } }
    })
    const branchMap = {}
    branchesRaw.forEach(b => {
      if (!branchMap[b.witel]) branchMap[b.witel] = []
      if (b.witelOld && !branchMap[b.witel].includes(b.witelOld)) {
        branchMap[b.witel].push(b.witelOld)
      }
    })

    successResponse(res, {
      stats, mapData,
      chart1, chart2, chart3, chart4,
      chart5Data, chart5Keys, chart6Data, chart6Keys, chartTrend,
      branchMap, tableData,
      pagination: {
        page: Number(page),
        total: stats.total,
        totalPages: Math.ceil(stats.total / Number(limit))
      }
    }, 'Dashboard data retrieved')

  } catch (error) {
    next(error)
  }
}

// 2. FLOW PROCESS HSI (Raw Query) - FIXED PARAMS HANDLING
export const getHSIFlowStats = async (req, res, next) => {
  try {
    const { startDate, endDate, witel, branch } = req.query

    // FIX: Gunakan array RSO2 sebagai base filter, dan pastikan string escaping aman
    let conditions = [`witel IN ('${RSO2_WITELS.join("','")}')`]

    // FIX: Cek apakah witel ada dan bukan string kosong
    if (witel && witel.trim() !== '') {
      const witelArr = witel.split(',').map(w => w.trim().toUpperCase()).filter(w => w !== '')
      if (witelArr.length > 0) {
        conditions.push(`UPPER(witel) IN (${witelArr.map(w => `'${w}'`).join(',')})`)
      }
    }

    if (branch && branch.trim() !== '') {
      const branchArr = branch.split(',').map(b => b.trim().toUpperCase()).filter(b => b !== '')
      if (branchArr.length > 0) {
        conditions.push(`UPPER(witel_old) IN (${branchArr.map(b => `'${b}'`).join(',')})`)
      }
    }

    if (startDate && endDate) {
      // Logic Date Range yang benar:
      // startDate 00:00:00 <= orderDate < (endDate + 1 hari) 00:00:00
      conditions.push(`order_date >= '${startDate}'::date`)
      conditions.push(`order_date < ('${endDate}'::date + INTERVAL '1 day')`)
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const query = `
      SELECT
        COUNT(*) as re,
        SUM(CASE WHEN data_proses = 'OGP VERIFIKASI DAN VALID' THEN 1 ELSE 0 END) as ogp_verif,
        SUM(CASE WHEN data_proses = 'CANCEL QC1' THEN 1 ELSE 0 END) as cancel_qc1,
        SUM(CASE WHEN data_proses = 'CANCEL FCC' THEN 1 ELSE 0 END) as cancel_fcc,
        SUM(CASE WHEN data_proses NOT IN ('CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID') THEN 1 ELSE 0 END) as valid_re,
        SUM(CASE WHEN data_proses = 'OGP SURVEY' AND status_resume = 'MIA - INVALID SURVEY' THEN 1 ELSE 0 END) as cancel_wo,
        SUM(CASE WHEN data_proses = 'UNSC' THEN 1 ELSE 0 END) as unsc,
        SUM(CASE WHEN data_proses = 'OGP SURVEY' AND status_message = 'MIE - SEND SURVEY' THEN 1 ELSE 0 END) as ogp_survey_count,
        SUM(CASE WHEN data_proses NOT IN ('CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID', 'UNSC') AND NOT (data_proses = 'OGP SURVEY' AND status_resume = 'MIA - INVALID SURVEY') AND NOT (data_proses = 'OGP SURVEY' AND status_message = 'MIE - SEND SURVEY') THEN 1 ELSE 0 END) as valid_wo,
        SUM(CASE WHEN data_proses = 'CANCEL' THEN 1 ELSE 0 END) as cancel_instalasi,
        SUM(CASE WHEN data_proses = 'FALLOUT' THEN 1 ELSE 0 END) as fallout,
        SUM(CASE WHEN data_proses = 'REVOKE' THEN 1 ELSE 0 END) as revoke_count,
        SUM(CASE WHEN data_proses NOT IN ('CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID', 'UNSC', 'CANCEL', 'FALLOUT', 'REVOKE', 'OGP SURVEY') AND status_resume != 'MIA - INVALID SURVEY' THEN 1 ELSE 0 END) as valid_pi,
        SUM(CASE WHEN data_proses = 'OGP PROVI' THEN 1 ELSE 0 END) as ogp_provi,
        SUM(CASE WHEN data_proses NOT IN ('CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID', 'UNSC', 'CANCEL', 'FALLOUT', 'REVOKE', 'OGP PROVI', 'OGP SURVEY') AND status_resume != 'MIA - INVALID SURVEY' THEN 1 ELSE 0 END) as ps_count,
        SUM(CASE WHEN data_proses NOT IN ('CANCEL FCC', 'UNSC', 'REVOKE') THEN 1 ELSE 0 END) as ps_re_denominator,
        SUM(CASE WHEN kelompok_status IN ('PI', 'FO_UIM', 'FO_ASAP', 'FO_OSM', 'FO_WFM', 'ACT_COM', 'PS') THEN 1 ELSE 0 END) as ps_pi_denominator,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' THEN 1 ELSE 0 END) as followup_completed,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '100 | REVOKE COMPLETED' THEN 1 ELSE 0 END) as revoke_completed,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = 'REVOKE ORDER' THEN 1 ELSE 0 END) as revoke_order,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke = 'PS' THEN 1 ELSE 0 END) as ps_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke IN ('PI', 'ACT_COM') THEN 1 ELSE 0 END) as ogp_provi_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke IN ('FO_WFM', 'FO_UIM', 'FO_ASAP', 'FO_OSM') THEN 1 ELSE 0 END) as fallout_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke = 'CANCEL' THEN 1 ELSE 0 END) as cancel_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND (data_ps_revoke NOT IN ('PS', 'PI', 'ACT_COM', 'FO_WFM', 'FO_UIM', 'FO_ASAP', 'FO_OSM', 'CANCEL') OR data_ps_revoke IS NULL) THEN 1 ELSE 0 END) as lain_lain_revoke,
        SUM(CASE WHEN UPPER(hasil) = 'COMPLY' THEN 1 ELSE 0 END) as comply_count
      FROM hsi_data ${whereSql}
    `
    const result = await prisma.$queryRawUnsafe(query)
    const stats = {}
    if (result && result.length > 0) {
      const row = result[0]
      for (const [key, val] of Object.entries(row)) { stats[key] = Number(val || 0) }
    }

    const branchMap = await getBranchMap()
    successResponse(res, { ...stats, branchMap }, 'HSI Flow stats retrieved')
  } catch (error) {
    console.error("FLOW STATS ERROR:", error)
    next(error)
  }
}

// 3. FLOW PROCESS DETAIL & EXPORT (LOGIC FIX)
export const getHSIFlowDetail = async (req, res, next) => {
  try {
    const { startDate, endDate, witel, branch, detail_category, page = 1, limit = 10, export_detail } = req.query

    // 1. BASE FILTER (Witel & Tanggal)
    const baseWhere = { witel: { in: RSO2_WITELS } }

    if (witel && witel.trim()) baseWhere.witel = { in: witel.split(',') }
    if (branch && branch.trim()) baseWhere.witelOld = { in: branch.split(',') }
    if (startDate && endDate) baseWhere.orderDate = { gte: new Date(startDate), lte: new Date(endDate) }

    // 2. DETAIL CATEGORY FILTER (Specific Logic)
    // Kita gunakan AND array agar bisa menumpuk kondisi kompleks dengan aman
    let finalWhere = {
        AND: [baseWhere]
    };

    if (detail_category) {
      switch (detail_category) {
        // --- RE & Validasi ---
        case 'RE':
            // Tidak ada filter tambahan
            break;
        case 'Valid RE':
            finalWhere.AND.push({
                dataProses: { notIn: ['CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID'] }
            });
            break;
        case 'OGP Verif & Valid':
            finalWhere.dataProses = 'OGP VERIFIKASI DAN VALID';
            break;
        case 'Cancel QC 1':
            finalWhere.dataProses = 'CANCEL QC1';
            break;
        case 'Cancel FCC':
            finalWhere.dataProses = 'CANCEL FCC';
            break;

        // --- WO & Survey ---
        case 'Valid WO':
            finalWhere.AND.push(
                { dataProses: { notIn: ['CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID', 'UNSC'] } },
                { NOT: { dataProses: 'OGP SURVEY', statusResume: 'MIA - INVALID SURVEY' } },
                { NOT: { dataProses: 'OGP SURVEY', statusMessage: 'MIE - SEND SURVEY' } }
            );
            break;
        case 'Cancel WO':
            finalWhere.dataProses = 'OGP SURVEY';
            finalWhere.statusResume = 'MIA - INVALID SURVEY';
            break;
        case 'UNSC':
            finalWhere.dataProses = 'UNSC';
            break;
        case 'OGP SURVEY':
            finalWhere.dataProses = 'OGP SURVEY';
            finalWhere.statusMessage = 'MIE - SEND SURVEY';
            break;

        // --- PI & Instalasi ---
        case 'Valid PI':
            finalWhere.AND.push(
                { dataProses: { notIn: ['CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID', 'UNSC', 'CANCEL', 'FALLOUT', 'REVOKE', 'OGP SURVEY'] } },
                { statusResume: { not: 'MIA - INVALID SURVEY' } }
            );
            break;
        case 'Cancel Instalasi':
            finalWhere.dataProses = 'CANCEL';
            break;
        case 'Fallout':
            finalWhere.dataProses = 'FALLOUT';
            break;
        case 'Revoke':
            finalWhere.dataProses = 'REVOKE';
            break;

        // --- PS / Completed ---
        case 'PS (COMPLETED)':
        case 'PS':
            finalWhere.AND.push(
                { dataProses: { notIn: ['CANCEL QC1', 'CANCEL FCC', 'OGP VERIFIKASI DAN VALID', 'UNSC', 'CANCEL', 'FALLOUT', 'REVOKE', 'OGP PROVI', 'OGP SURVEY'] } },
                { statusResume: { not: 'MIA - INVALID SURVEY' } }
            );
            break;
        case 'OGP Provisioning':
            finalWhere.dataProses = 'OGP PROVI';
            break;

        // --- REVOKE SPECIFICS (Sesuai Gambar Diagram Tree) ---
        case 'Total Revoke':
            finalWhere.dataProses = 'REVOKE';
            break;
        case 'Follow Up Completed':
            finalWhere.dataProses = 'REVOKE';
            finalWhere.statusResume = '102 | FOLLOW UP COMPLETED';
            break;
        case 'Revoke Completed':
            finalWhere.dataProses = 'REVOKE';
            finalWhere.statusResume = '100 | REVOKE COMPLETED';
            break;
        case 'Revoke Order':
            finalWhere.dataProses = 'REVOKE';
            finalWhere.statusResume = 'REVOKE ORDER';
            break;

        // --- DETAIL DARI FOLLOW UP COMPLETED ---
        case 'PS Revoke':
            finalWhere.dataProses = 'REVOKE';
            finalWhere.statusResume = '102 | FOLLOW UP COMPLETED';
            finalWhere.dataPsRevoke = 'PS'; // Pastikan kolom di DB bernama dataPsRevoke (camelCase)
            break;
        case 'OGP Provi Revoke':
            finalWhere.dataProses = 'REVOKE';
            finalWhere.statusResume = '102 | FOLLOW UP COMPLETED';
            finalWhere.dataPsRevoke = { in: ['PI', 'ACT_COM'] };
            break;
        case 'Fallout Revoke':
            finalWhere.dataProses = 'REVOKE';
            finalWhere.statusResume = '102 | FOLLOW UP COMPLETED';
            finalWhere.dataPsRevoke = { in: ['FO_WFM', 'FO_UIM', 'FO_ASAP'] };
            break;
        case 'Cancel Revoke':
            finalWhere.dataProses = 'REVOKE';
            finalWhere.statusResume = '102 | FOLLOW UP COMPLETED';
            finalWhere.dataPsRevoke = 'CANCEL';
            break;
        case 'Lain-Lain Revoke':
            finalWhere.dataProses = 'REVOKE';
            finalWhere.statusResume = '102 | FOLLOW UP COMPLETED';
            // Logika NULL atau N/A atau spesifik string
            finalWhere.OR = [
                { dataPsRevoke: null },
                { dataPsRevoke: '#N/A' },
                { dataPsRevoke: 'INPROGESS_SC' },
                { dataPsRevoke: 'REVOKE' }
            ];
            break;
      }
    }

    const whereSql = sqlConditions.length > 0 ? `WHERE ${sqlConditions.join(' AND ')}` : '';

    // --- EXECUTE QUERY ---
    
    // 1. EXPORT MODE
    if (export_detail === 'true') {
        const query = `
            SELECT *
            FROM hsi_data 
            ${whereSql}
            ORDER BY order_date DESC
        `;
        const data = await prisma.$queryRawUnsafe(query);
        console.log(`[FLOW_DETAIL] Export data fetched: ${data.length} rows`);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Detail Data');

        if (data.length > 0) {
            // Generate Header Dinamis (Snake Case to Regular)
            const columns = Object.keys(data[0]).map(key => ({
                header: key.toUpperCase().replace(/_/g, ' '),
                key: key,
                width: 25
            }));
            worksheet.columns = columns;

            // Masukkan data
            data.forEach(row => {
                const formattedRow = { ...row };
                Object.keys(formattedRow).forEach(k => {
                    if (formattedRow[k] instanceof Date) {
                        formattedRow[k] = formattedRow[k].toISOString().split('T')[0];
                    }
                    if (typeof formattedRow[k] === 'bigint') {
                        formattedRow[k] = formattedRow[k].toString();
                    }
                });
                worksheet.addRow(formattedRow);
            });
        }

        const buffer = await workbook.xlsx.writeBuffer();
        const fileName = `Detail_HSI_${detail_category ? detail_category.replace(/[^a-zA-Z0-9-_]/g, '_') : 'ALL'}.xlsx`;

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.send(buffer);
        return;
    }

    // --- 4. PREVIEW TABLE LOGIC ---
    const skip = (Number(page) - 1) * Number(limit)
    const tableDataRaw = await prisma.hsiData.findMany({
      where: finalWhere,
      take: Number(limit),
      skip: skip,
      orderBy: { orderDate: 'desc' },
      select: {
        orderId: true, orderDate: true, customerName: true,
        witel: true, sto: true, typeLayanan: true,
        kelompokStatus: true, statusResume: true, dataProses: true
      }
    })

    const tableData = tableDataRaw.map(r => ({
      order_id: r.orderId, order_date: r.orderDate, customer_name: r.customerName,
      witel: r.witel, sto: r.sto, type_layanan: r.typeLayanan,
      kelompok_status: r.kelompokStatus, status_resume: r.statusResume,
      data_proses: r.dataProses
    }))

    const total = await prisma.hsiData.count({ where: finalWhere })

    successResponse(res, {
        table: tableData,
        pagination: { page: Number(page), total, totalPages: Math.ceil(total / Number(limit)) }
    }, 'Flow details retrieved')

  } catch (error) {
    console.error("FLOW DETAIL ERROR:", error)
    next(error)
  }
}


// ==================== DASHBOARD SOS DATIN ====================

export const getSOSDatinFilters = async (req, res, next) => {
  try {
    const baseWhere = {
      AND: [
        { OR: [{ witelBaru: { not: 'RSO1' } }, { witelBaru: null }] },
        { orderCreatedDate: { gte: new Date('2000-01-01') } }
      ]
    }

    const [witels, segments, categories] = await Promise.all([
      prisma.sosData.findMany({ where: baseWhere, distinct: ['witelBaru'], select: { witelBaru: true } }),
      prisma.sosData.findMany({ where: baseWhere, distinct: ['segmen'], select: { segmen: true } }),
      prisma.sosData.findMany({ where: baseWhere, distinct: ['kategori'], select: { kategori: true } })
    ])

    successResponse(res, {
      witels: witels.map(i => i.witelBaru).filter(Boolean).sort(),
      segments: segments.map(i => i.segmen).filter(Boolean).sort(),
      categories: categories.map(i => i.kategori).filter(Boolean).sort()
    }, 'SOS Datin filter options retrieved')
  } catch (error) {
    next(error)
  }
}

export const getSOSDatinDashboard = async (req, res, next) => {
  try {
    const { start_date, end_date, witels, segments, categories } = req.query

    // 1. Build Multi-select Filters
    let conditions = ["(witel_baru != 'RSO1' OR witel_baru IS NULL)", "order_created_date >= '2000-01-01'"]
    const params = []
    let pIdx = 1

    if (start_date && end_date) {
      conditions.push(`order_created_date BETWEEN $${pIdx} AND $${pIdx + 1}`)
      params.push(new Date(start_date), new Date(end_date))
      pIdx += 2
    }

    if (witels && witels.length > 0) {
      const wArr = witels.split(',')
      conditions.push(`witel_baru IN (${wArr.map(() => `$${pIdx++}`).join(',')})`)
      params.push(...wArr)
    }

    if (segments && segments.length > 0) {
      const sArr = segments.split(',')
      conditions.push(`segmen IN (${sArr.map(() => `$${pIdx++}`).join(',')})`)
      params.push(...sArr)
    }

    if (categories && categories.length > 0) {
      const cArr = categories.split(',')
      conditions.push(`kategori IN (${cArr.map(() => `$${pIdx++}`).join(',')})`)
      params.push(...cArr)
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // 2. Query execution
    const [ordersByCategory, revenueByCategory, witelDistribution, segmenDistribution] = await Promise.all([
      // Chart 1: Orders by Category & Age
      prisma.$queryRawUnsafe(`
        SELECT kategori,
          SUM(CASE WHEN kategori_umur = '< 3 BLN' THEN 1 ELSE 0 END)::int as lt_3bln_total,
          SUM(CASE WHEN kategori_umur = '> 3 BLN' THEN 1 ELSE 0 END)::int as gt_3bln_total
        FROM sos_data ${whereSql} AND kategori IS NOT NULL
        GROUP BY kategori ORDER BY kategori`, ...params),

      // Chart 2: Revenue by Category & Age (in Millions)
      prisma.$queryRawUnsafe(`
        SELECT kategori,
          SUM(CASE WHEN kategori_umur = '< 3 BLN' THEN COALESCE(revenue,0) ELSE 0 END) / 1000000 as lt_3bln_revenue,
          SUM(CASE WHEN kategori_umur = '> 3 BLN' THEN COALESCE(revenue,0) ELSE 0 END) / 1000000 as gt_3bln_revenue
        FROM sos_data ${whereSql} AND kategori IS NOT NULL
        GROUP BY kategori ORDER BY kategori`, ...params),

      // Chart 3: Witel Distribution
      prisma.$queryRawUnsafe(`
        SELECT COALESCE(TRIM(UPPER(witel_baru)), 'UNKNOWN') as witel, COUNT(*)::int as value
        FROM sos_data ${whereSql}
        GROUP BY witel ORDER BY value DESC`, ...params),

      // Chart 4: Segment Distribution (Alias witel for chart component compatibility)
      prisma.$queryRawUnsafe(`
        SELECT COALESCE(TRIM(UPPER(segmen)), 'UNKNOWN') as witel, COUNT(*)::int as value
        FROM sos_data ${whereSql}
        GROUP BY witel ORDER BY value DESC`, ...params)
    ])

    // Format Decimal results to numbers
    const formatRev = (rows) => rows.map(r => ({
      ...r,
      lt_3bln_revenue: Number(r.lt_3bln_revenue || 0),
      gt_3bln_revenue: Number(r.gt_3bln_revenue || 0)
    }))

    successResponse(res, {
      ordersByCategory,
      revenueByCategory: formatRev(revenueByCategory),
      witelDistribution,
      segmenDistribution
    }, 'SOS Datin dashboard data retrieved')

  } catch (error) {
    next(error)
  }
}

// =================================================================
// DIGITAL PRODUCT DASHBOARD CHARTS
// =================================================================

/**
 * Get chart data for Digital Product Dashboard
 * Returns: revenueByWitel, amountByWitel, productBySegment, productByChannel, productShare
 * NOTE: Using digital_products table (has data) instead of document_data (empty)
 */
/**
 * Get chart data for Digital Product Dashboard
 * Returns: revenueByWitel, amountByWitel, productBySegment, productByChannel, productShare
 * NOTE: Using digital_products table (has data) instead of document_data (empty)
 */
export const getDigitalProductCharts = async (req, res, next) => {
  try {
    const { start_date, end_date, witel } = req.query

    // Define Date Filter
    let dateFilter = ''
    const params = []
    let pIdx = 1

    if (start_date && end_date) {
      dateFilter = `AND order_date >= $${pIdx}::date AND order_date <= $${pIdx + 1}::date`
      params.push(start_date, end_date)
      pIdx += 2
    }

    // Common CTEs for normalization
    // Maps specific branches to RSO2 Regions, fuzzy matches product names, and groups segments
    const normalizedDataCTE = `
      WITH normalized_data AS (
        SELECT
          *,
          CASE
            WHEN witel IN ('BALI') THEN 'BALI'
            WHEN witel IN ('SURAMADU') THEN 'SURAMADU'
            WHEN witel IN ('NTT', 'NTB') THEN 'NUSA TENGGARA'
            WHEN witel IN ('MADIUN', 'KEDIRI', 'MALANG') THEN 'JATIM BARAT'
            WHEN witel IN ('JEMBER', 'PASURUAN', 'SIDOARJO') THEN 'JATIM TIMUR'
            ELSE 'OTHER'
          END as region_norm,
          CASE
            WHEN product_name ILIKE '%Netmonk%' THEN 'Netmonk'
            WHEN product_name ILIKE '%OCA%' THEN 'OCA'
            WHEN product_name ILIKE '%Pijar%' THEN 'Pijar'
            WHEN product_name ILIKE '%Antares%' OR product_name ILIKE '%IOT%' OR product_name ILIKE '%CCTV%' THEN 'Antares'
            ELSE 'OTHER'
          END as product_norm,
          CASE
            WHEN UPPER(segment) IN ('LEGS', 'DGS', 'DPS', 'GOV', 'ENTERPRISE', 'REG', 'BUMN', 'SOE', 'GOVERNMENT') THEN 'LEGS'
            ELSE 'SME'
          END as segment_norm,
          CASE
            WHEN UPPER(category) LIKE '%NCX%' OR UPPER(witel) LIKE '%NCX%' OR UPPER(branch) LIKE '%NCX%' THEN 'NCX'
            ELSE 'SC-ONE'
          END as channel_norm
        FROM digital_products
        WHERE 1=1
        ${dateFilter}
      )
    `

    // Filter Condition based on Normalized Columns
    const filterCondition = `
      WHERE region_norm != 'OTHER' 
      AND product_norm != 'OTHER'
      ${witel && witel !== 'ALL' ? `AND region_norm = $${pIdx}` : ''}
    `
    
    if (witel && witel !== 'ALL') params.push(witel)

    // Run queries in parallel
    const [
      revenueByWitel,
      amountByWitel,
      productBySegment,
      productByChannel,
      productShare
    ] = await Promise.all([
      // 1. Revenue by Witel - Stacked Bar (Vertical)
      // Extract revenue from product_name text if column is 0
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT 
          region_norm as witel, 
          product_norm as product, 
          SUM(
            COALESCE(revenue, 0) + 
            COALESCE(substring(product_name from 'Total \\(Sebelum PPN\\) : ([0-9]+)')::numeric, 0)
          )::numeric as revenue
        FROM normalized_data
        ${filterCondition}
        GROUP BY region_norm, product_norm
        ORDER BY region_norm, product_norm
      `, ...params),

      // 2. Amount by Witel - Stacked Bar (Vertical)
      // Use COUNT(*) as proxy for amount since column is often 0
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT region_norm as witel, product_norm as product, COUNT(*)::int as amount
        FROM normalized_data
        ${filterCondition}
        GROUP BY region_norm, product_norm
        ORDER BY region_norm, product_norm
      `, ...params),

      // 3. Product by Segment - Horizontal Stacked Bar
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT 
          product_norm as product,
          segment_norm as segment,
          COUNT(*)::int as total
        FROM normalized_data
        ${filterCondition}
        GROUP BY product_norm, segment_norm
        ORDER BY product_norm, segment_norm
      `, ...params),

      // 4. Product by Channel - Horizontal Stacked Bar
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT 
          product_norm as product,
          channel_norm as channel,
          COUNT(*)::int as total
        FROM normalized_data
        ${filterCondition}
        GROUP BY product_norm, channel_norm
        ORDER BY product_norm, channel_norm
      `, ...params),

      // 5. Product Share - Pie Chart
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT 
          product_norm as product,
          COUNT(*)::int as value
        FROM normalized_data
        ${filterCondition}
        GROUP BY product_norm
        ORDER BY value DESC
      `, ...params)
    ])

    // Transform data for frontend charts
    // 1 & 2: Transform to stacked bar format {witel: 'X', Antares: 10, Netmonk: 20, ...}
    const transformStackedByWitel = (data, valueKey) => {
      const result = {}
      data.forEach(row => {
        const witelName = row.witel || 'Unknown'
        if (!result[witelName]) {
          result[witelName] = { witel: witelName }
        }
        result[witelName][row.product] = Number(row[valueKey] || 0)
      })
      return Object.values(result)
    }

    // 3 & 4: Transform to horizontal stacked bar format {product: 'X', SME: 10, LEGS: 20, ...}
    const transformStackedByProduct = (data, categoryKey) => {
      const result = {}
      data.forEach(row => {
        const productName = row.product || 'Unknown'
        if (!result[productName]) {
          result[productName] = { product: productName }
        }
        result[productName][row[categoryKey]] = Number(row.total || 0)
      })
      return Object.values(result)
    }

    // Get unique products for color mapping
    const products = ['Antares', 'Netmonk', 'OCA', 'Pijar']
    const segments = [...new Set(productBySegment.map(p => p.segment))]
    const channels = [...new Set(productByChannel.map(p => p.channel))]

    successResponse(res, {
      revenueByWitel: transformStackedByWitel(revenueByWitel, 'revenue'),
      amountByWitel: transformStackedByWitel(amountByWitel, 'amount'),
      productBySegment: transformStackedByProduct(productBySegment, 'segment'),
      productByChannel: transformStackedByProduct(productByChannel, 'channel'),
      productShare: productShare.map(p => ({ name: p.product, value: Number(p.value) })),
      // Metadata for chart rendering
      products,
      segments,
      channels
    }, 'Digital product charts data retrieved')

  } catch (error) {
    console.error('Error in getDigitalProductCharts:', error)
    next(error)
  }
}
