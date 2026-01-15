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

// Get KPI data from Digital Product data
export const getKPIData = async (req, res, next) => {
  try {
    const { startDate, endDate, witel, branch, product } = req.query

    // Define Date Filter
    let dateFilter = ''
    const params = []
    let pIdx = 1

    if (startDate && endDate) {
      dateFilter = `AND order_date >= $${pIdx}::date AND order_date <= $${pIdx + 1}::date`
      params.push(startDate, endDate)
      pIdx += 2
    }

    // Reuse the same CTE for consistency
    const normalizedDataCTE = `
      WITH normalized_data AS (
        SELECT
          *,
          CASE
            WHEN witel IN ('BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG') THEN 'BALI'
            WHEN witel IN ('JATIM BARAT', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG') THEN 'JATIM BARAT'
            WHEN witel IN ('JATIM TIMUR', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO') THEN 'JATIM TIMUR'
            WHEN witel IN ('NUSA TENGGARA', 'NTB', 'NTT', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA') THEN 'NUSA TENGGARA'
            WHEN witel IN ('SURAMADU', 'SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES') THEN 'SURAMADU'
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
            WHEN telda IS NOT NULL AND telda != '' THEN UPPER(telda)
            ELSE UPPER(branch)
          END as branch_norm,
          channel as channel_norm
        FROM digital_products
        WHERE 1=1
        ${dateFilter}
      )
    `

    let filterCondition = `WHERE region_norm != 'OTHER' AND product_norm != 'OTHER'`

    // 1. Witel Filter
    if (witel && witel !== 'ALL') {
      const witelArr = witel.split(',').filter(w => w)
      if (witelArr.length > 0) {
        const placeholders = witelArr.map(() => `$${pIdx++}`).join(',')
        filterCondition += ` AND region_norm IN (${placeholders})`
        params.push(...witelArr)
      }
    }

    // 2. Branch Filter
    if (branch) {
      const branchArr = branch.split(',').filter(b => b)
      if (branchArr.length > 0) {
        const placeholders = branchArr.map(() => `$${pIdx++}`).join(',')
        filterCondition += ` AND branch_norm IN (${placeholders})`
        params.push(...branchArr)
      }
    }

    // 3. Product Filter
    if (product) {
      const productArr = product.split(',').filter(p => p)
      if (productArr.length > 0) {
        const placeholders = productArr.map(() => `$${pIdx++}`).join(',')
        filterCondition += ` AND product_norm IN (${placeholders})`
        params.push(...productArr)
      }
    }

    const stats = await prisma.$queryRawUnsafe(`
      ${normalizedDataCTE}
      SELECT
        COUNT(*)::int as total,
        SUM(CASE 
          WHEN status ILIKE '%completed%' OR status ILIKE '%activated%' OR status ILIKE '%live%' OR status ILIKE '%done%' OR status ILIKE '%closed%' OR status ILIKE '%ps%' 
          THEN 1 ELSE 0 
        END)::int as completed
      FROM normalized_data
      ${filterCondition}
    `, ...params)

    const totalOrders = stats[0]?.total || 0
    const completedOrders = stats[0]?.completed || 0
    const progressOrders = totalOrders - completedOrders

    successResponse(
      res,
      {
        totalOrder: totalOrders,
        completed: completedOrders,
        openProgress: progressOrders,
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
        SUM(CASE WHEN status_i_hld ILIKE '%Initial%' AND (go_live = 'N' OR go_live IS NULL OR go_live != 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_initial,
        SUM(CASE WHEN status_i_hld ILIKE '%Survey%' AND (go_live = 'N' OR go_live IS NULL OR go_live != 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_survey,
        SUM(CASE WHEN status_i_hld ILIKE '%Perizinan%' AND (go_live = 'N' OR go_live IS NULL OR go_live != 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_perizinan,
        SUM(CASE WHEN status_i_hld ILIKE '%Instalasi%' AND (go_live = 'N' OR go_live IS NULL OR go_live != 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_instalasi,
        SUM(CASE WHEN status_i_hld ILIKE '%FI%' AND (go_live = 'N' OR go_live IS NULL OR go_live != 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_fi
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

    // Aging Charts
    // Fetch all active projects sorted by age
    const rawActiveProjects = await prisma.spmkMom.findMany({
      where: {
        ...(start_date && end_date && {
          tanggalMom: { gte: new Date(start_date), lte: new Date(end_date) }
        }),
        goLive: 'N',
        populasiNonDrop: 'Y'
      },
      select: {
        witelLama: true, witelBaru: true, segmen: true, poName: true, idIHld: true,
        tanggalMom: true, revenuePlan: true, statusTompsNew: true, usia: true, uraianKegiatan: true
      },
      orderBy: { usia: 'desc' }
    })

    // 1. Top 3 Witel Logic
    const witelGroups = {}
    rawActiveProjects.forEach(proj => {
      const w = cleanWitelName(proj.witelBaru || proj.witelLama)
      const region = findParent(w)
      if (!witelGroups[region]) witelGroups[region] = []
      // Push all, sort/slice later
      witelGroups[region].push({
        ...proj,
        witel_norm: w,
        region: region,
        revenue_plan: Number(proj.revenuePlan || 0),
        status_tomps_new: proj.statusTompsNew,
        usia: proj.usia,
        uraian_kegiatan: proj.uraianKegiatan
      })
    })

    const top3WitelMapped = []
    Object.keys(witelGroups).sort().forEach(key => {
      // Sort desc by usia just in case
      witelGroups[key].sort((a, b) => (b.usia || 0) - (a.usia || 0))
      // Take top 3
      witelGroups[key].slice(0, 3).forEach((item, idx) => {
        top3WitelMapped.push({ ...item, rn: idx + 1 })
      })
    })

    // 2. Top 3 PO Logic
    const poGroups = {}
    rawActiveProjects.forEach(proj => {
      const rawWitel = cleanWitelName(proj.witelLama || proj.witelBaru)
      const parent = findParent(rawWitel)
      const ao = findAO(rawWitel, parent, proj.segmen)
      let aoName = ao ? ao.name : (proj.poName || 'UNMAPPED PO')

      // CLEANUP: Filter out junk PO names
      aoName = aoName.trim()
      if (['PT2', 'PT3', 'PT2S', 'PT2UL', 'PT3B'].includes(aoName) || aoName.length < 3) {
         return // Skip junk POs
      }

      if (!poGroups[aoName]) poGroups[aoName] = []
      poGroups[aoName].push({
        po_name: aoName,
        witel_norm: rawWitel,
        id_i_hld: proj.idIHld,
        tanggal_mom: proj.tanggalMom,
        revenue_plan: Number(proj.revenuePlan || 0),
        status_tomps_new: proj.statusTompsNew,
        usia: proj.usia,
        uraian_kegiatan: proj.uraianKegiatan
      })
    })

    const top3PoMapped = []
    Object.keys(poGroups).sort().forEach(key => {
      poGroups[key].sort((a, b) => (b.usia || 0) - (a.usia || 0))
      poGroups[key].slice(0, 3).forEach((item, idx) => {
        top3PoMapped.push({ ...item, rn: idx + 1 })
      })
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
// Get Report Analysis - from Digital Product data segmentation
export const getReportAnalysis = async (req, res, next) => {
  try {
    const { start_date, end_date, witel } = req.query

    let whereClause = {}
    if (start_date && end_date) {
      whereClause.orderDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    // Region Mapping
    const regionMapping = {
      'BALI': ['BALI', 'DENPASAR', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'Non-Telda (NCX)', 'SANUR', 'SINGARAJA', 'TABANAN', 'UBUNG'],
      'JATIM BARAT': ['JATIM BARAT', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'Non-Telda (NCX)', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG'],
      'JATIM TIMUR': ['JATIM TIMUR', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'INNER - JATIM TIMUR', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'Non-Telda (NCX)', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO'],
      'NUSA TENGGARA': ['NUSA TENGGARA', 'NTB', 'NTT', 'ATAMBUA', 'BIMA', 'ENDE', 'INNER - NUSA TENGGARA', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'Non-Telda (NCX)', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU'],
      'SURAMADU': ['SURAMADU', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'Non-Telda (NCX)', 'PAMEKASAN', 'TANDES']
    }

    let selectedRegion = null
    let targetRows = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

    if (witel) {
      const witelList = witel.split(',').map(w => w.trim()).filter(w => w)
      if (witelList.length === 1 && regionMapping[witelList[0]]) {
        selectedRegion = witelList[0]
        targetRows = regionMapping[selectedRegion]
      } else if (witelList.length > 0) {
        targetRows = targetRows.filter(r => witelList.includes(r))
      }
    }

    // Helper to get data for a segment
    const getSegmentData = async (segmentKeywords) => {
      const keywords = Array.isArray(segmentKeywords) ? segmentKeywords : [segmentKeywords]
      
      const data = await prisma.digitalProduct.findMany({
        where: {
          ...whereClause,
          OR: keywords.map(k => ({ segment: { contains: k, mode: 'insensitive' } }))
        },
        select: {
          witel: true,
          productName: true,
          status: true,
          revenue: true,
          netPrice: true
        }
      })

      // Process data
      const witelMap = {}
      
      targetRows.forEach(w => {
        witelMap[w] = {
          witel: w, // Standardize key for frontend
          nama_witel: w,
          in_progress_n: 0, in_progress_o: 0, in_progress_ae: 0, in_progress_ps: 0,
          prov_comp_n_realisasi: 0, prov_comp_o_realisasi: 0, prov_comp_ae_realisasi: 0, prov_comp_ps_realisasi: 0,
          revenue_n_ach: 0, revenue_o_ach: 0, revenue_ae_ach: 0, revenue_ps_ach: 0
        }
      })

      let totalOgp = 0
      let totalClosed = 0

      data.forEach(row => {
        let rawWitel = (row.witel || '').toUpperCase()
        let mappedName = null

        if (selectedRegion) {
          const branches = regionMapping[selectedRegion] || []
          const foundBranch = branches.find(b => rawWitel.includes(b))
          if (foundBranch) mappedName = foundBranch
        } else {
          for (const [region, branches] of Object.entries(regionMapping)) {
            if (branches.some(b => rawWitel.includes(b))) {
              mappedName = region
              break
            }
          }
          if (!mappedName) {
             if (rawWitel.includes('BALI') || rawWitel.includes('DENPASAR') || rawWitel.includes('SINGARAJA') || rawWitel.includes('BADUNG')) mappedName = 'BALI'
             else if (rawWitel.includes('BARAT') || rawWitel.includes('KEDIRI') || rawWitel.includes('MADIUN') || rawWitel.includes('MALANG')) mappedName = 'JATIM BARAT'
             else if (rawWitel.includes('TIMUR') || rawWitel.includes('JEMBER') || rawWitel.includes('PASURUAN') || rawWitel.includes('SIDOARJO')) mappedName = 'JATIM TIMUR'
             else if (rawWitel.includes('NUSA') || rawWitel.includes('NTB') || rawWitel.includes('NTT') || rawWitel.includes('KUPANG') || rawWitel.includes('MATARAM')) mappedName = 'NUSA TENGGARA'
             else if (rawWitel.includes('SURAMADU') || rawWitel.includes('MADURA') || rawWitel.includes('SURABAYA') || rawWitel.includes('GRESIK')) mappedName = 'SURAMADU'
          }
        }
        
        if (!mappedName) {
           mappedName = targetRows.find(t => rawWitel.includes(t))
        }

        if (!mappedName || !witelMap[mappedName]) return 

        let productCode = ''
        const pName = (row.productName || '').toLowerCase()
        if (pName.includes('netmonk')) productCode = 'n'
        else if (pName.includes('oca')) productCode = 'o'
        else if (pName.includes('antares') || pName.includes('camera') || pName.includes('cctv') || pName.includes('iot') || pName.includes('recording') || pName.includes('eazy')) productCode = 'ae'
        else if (pName.includes('pijar')) productCode = 'ps'
        
        if (!productCode) return

        const status = (row.status || '').toLowerCase()
        const isCompleted = ['completed', 'activated', 'live', 'done', 'closed'].some(s => status.includes(s))
        const isInProgress = !isCompleted

        if (isInProgress) {
          witelMap[mappedName][`in_progress_${productCode}`]++
          totalOgp++
        } else {
          witelMap[mappedName][`prov_comp_${productCode}_realisasi`]++
          // Use netPrice if available, otherwise revenue. 
          // Handle Prisma Decimal/Object by converting to Number explicitly
          const np = row.netPrice
          const rev = row.revenue
          const amount = (np !== null && np !== undefined) ? Number(np) : (rev !== null && rev !== undefined ? Number(rev) : 0)
          
          witelMap[mappedName][`revenue_${productCode}_ach`] += amount / 1000000 // Convert to Juta
          totalClosed++
        }
      })

      return {
        data: Object.values(witelMap),
        details: { total: totalOgp + totalClosed, ogp: totalOgp, closed: totalClosed }
      }
    }

    const legsData = await getSegmentData(['LEGS', 'DGS', 'DPS', 'GOV', 'ENTERPRISE', 'REG', 'BUMN', 'SOE', 'GOVERNMENT']) 
    const smeData = await getSegmentData(['SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE', 'ERM', 'MEDIA'])

    successResponse(
      res,
      {
        legs: legsData.data,
        sme: smeData.data,
        detailsLegs: legsData.details,
        detailsSme: smeData.details,
        // For legacy frontend support if needed
        tableData: [...legsData.data, ...smeData.data] 
      }, 'Report Analysis data retrieved successfully')
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

        return successResponse(res, {
          tableData: finalTable,
          projectData: finalProjects,
          top3Witel: top3WitelMapped,
          topUsiaByWitel: top3WitelMapped,
          top3Po: top3PoMapped,
          topUsiaByPo: top3PoMapped,
          bucketUsiaData: bucketUsiaRaw,
          trendGolive: trendRaw,
          topMitraRevenue,
          rawProjectRows: rawProjects
        }, 'Report Tambahan data retrieved successfully')  } catch (error) {
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
    const { start_date, end_date } = req.query

    const allowedWitels = ['JATIM TIMUR', 'JATIM BARAT', 'SURAMADU', 'BALI', 'NUSA TENGGARA']
    const witelIncludeFilter = `UPPER(witel) IN (${allowedWitels.map(w => `'${w}'`).join(',')})`

    let dateFilter = ''
    if (start_date && end_date) {
      const start = new Date(start_date)
      const end = new Date(end_date)
      dateFilter = `AND "order_date" >= '${start.toISOString().split('T')[0]}'::date 
                    AND "order_date" <= '${end.toISOString().split('T')[0]}'::date`
    }

    const rawData = await prisma.$queryRawUnsafe(`
      SELECT
        witel,
        witel_old,
        SUM(CASE WHEN kelompok_status = 'PRE PI' THEN 1 ELSE 0 END) as pre_pi,
        COUNT(*) as registered,
        SUM(CASE WHEN kelompok_status = 'INPROGRESS_SC' THEN 1 ELSE 0 END) as inprogress_sc,
        SUM(CASE WHEN kelompok_status = 'QC1' THEN 1 ELSE 0 END) as qc1,
        SUM(CASE WHEN kelompok_status = 'FCC' THEN 1 ELSE 0 END) as fcc,
        SUM(CASE WHEN kelompok_status = 'REJECT_FCC' THEN 1 ELSE 0 END) as cancel_by_fcc,
        SUM(CASE WHEN kelompok_status = 'SURVEY_NEW_MANJA' THEN 1 ELSE 0 END) as survey_new_manja,
        SUM(CASE WHEN kelompok_status = 'UNSC' THEN 1 ELSE 0 END) as unsc,
        SUM(CASE WHEN kelompok_status = 'PI' AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 < 24 THEN 1 ELSE 0 END) as pi_under_1_hari,
        SUM(CASE WHEN kelompok_status = 'PI' AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 >= 24 AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 <= 72 THEN 1 ELSE 0 END) as pi_1_3_hari,
        SUM(CASE WHEN kelompok_status = 'PI' AND EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600 > 72 THEN 1 ELSE 0 END) as pi_over_3_hari,
        SUM(CASE WHEN kelompok_status = 'PI' THEN 1 ELSE 0 END) as total_pi,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Pelanggan' THEN 1 ELSE 0 END) as fo_wfm_kndl_plgn,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Teknik' THEN 1 ELSE 0 END) as fo_wfm_kndl_teknis,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Lainnya' THEN 1 ELSE 0 END) as fo_wfm_kndl_sys,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND (kelompok_kendala IS NULL OR kelompok_kendala = '' OR kelompok_kendala = 'BLANK') THEN 1 ELSE 0 END) as fo_wfm_others,
        SUM(CASE WHEN kelompok_status = 'FO_UIM' THEN 1 ELSE 0 END) as fo_uim,
        SUM(CASE WHEN kelompok_status = 'FO_ASAP' THEN 1 ELSE 0 END) as fo_asp,
        SUM(CASE WHEN kelompok_status = 'FO_OSM' THEN 1 ELSE 0 END) as fo_osm,
        SUM(CASE WHEN kelompok_status IN ('FO_UIM', 'FO_ASAP', 'FO_OSM', 'FO_WFM') THEN 1 ELSE 0 END) as total_fallout,
        SUM(CASE WHEN kelompok_status = 'ACT_COM' THEN 1 ELSE 0 END) as act_comp,
        SUM(CASE WHEN kelompok_status = 'PS' THEN 1 ELSE 0 END) as jml_comp_ps,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Pelanggan' THEN 1 ELSE 0 END) as cancel_kndl_plgn,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Teknik' THEN 1 ELSE 0 END) as cancel_kndl_teknis,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Lainnya' THEN 1 ELSE 0 END) as cancel_kndl_sys,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND (kelompok_kendala IS NULL OR kelompok_kendala = '' OR kelompok_kendala = 'BLANK') THEN 1 ELSE 0 END) as cancel_others,
        SUM(CASE WHEN kelompok_status = 'CANCEL' THEN 1 ELSE 0 END) as total_cancel,
        SUM(CASE WHEN kelompok_status = 'REVOKE' THEN 1 ELSE 0 END) as revoke
      FROM hsi_data
      WHERE ${witelIncludeFilter}
        ${dateFilter}
      GROUP BY witel, witel_old
      HAVING witel_old IS NOT NULL AND witel_old != ''
      ORDER BY witel, witel_old
    `)

    const numericFields = [
      'pre_pi', 'registered', 'inprogress_sc', 'qc1', 'fcc', 'cancel_by_fcc', 'survey_new_manja', 'unsc',
      'pi_under_1_hari', 'pi_1_3_hari', 'pi_over_3_hari', 'total_pi',
      'fo_wfm_kndl_plgn', 'fo_wfm_kndl_teknis', 'fo_wfm_kndl_sys', 'fo_wfm_others',
      'fo_uim', 'fo_asp', 'fo_osm', 'total_fallout', 'act_comp', 'jml_comp_ps',
      'cancel_kndl_plgn', 'cancel_kndl_teknis', 'cancel_kndl_sys', 'cancel_others', 'total_cancel', 'revoke'
    ]

    const calculatePercentages = (item) => {
      const num_pire = item.total_pi + item.total_fallout + item.act_comp + item.jml_comp_ps + item.total_cancel
      item.pi_re_percent = item.registered > 0 ? ((num_pire / item.registered) * 100).toFixed(2) : '0.00'

      const denom_psre = item.registered - item.cancel_by_fcc - item.unsc - item.revoke
      item.ps_re_percent = denom_psre > 0 ? ((item.jml_comp_ps / denom_psre) * 100).toFixed(2) : '0.00'

      const denom_pspi = item.total_pi + item.total_fallout + item.act_comp + item.jml_comp_ps
      item.ps_pi_percent = denom_pspi > 0 ? ((item.jml_comp_ps / denom_pspi) * 100).toFixed(2) : '0.00'
    }

    rawData.forEach(row => {
      numericFields.forEach(field => {
        row[field] = Number(row[field] || 0)
      })
    })

    const groupedData = {}
    rawData.forEach(row => {
      if (!groupedData[row.witel]) groupedData[row.witel] = []
      groupedData[row.witel].push(row)
    })

    const finalReportData = []
    const witelOrder = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

    witelOrder.forEach(witel => {
      const children = groupedData[witel]
      if (!children || children.length === 0) return

      const parent = { witel_display: witel, row_type: 'main' }
      numericFields.forEach(field => {
        parent[field] = children.reduce((sum, child) => sum + child[field], 0)
      })
      calculatePercentages(parent)
      finalReportData.push(parent)

      children.sort((a, b) => (a.witel_old || '').localeCompare(b.witel_old || ''))
      children.forEach(child => {
        child.witel_display = child.witel_old || '(Blank)'
        child.row_type = 'sub'
        calculatePercentages(child)
        finalReportData.push(child)
      })
    })

    const totals = { witel_display: 'TOTAL' }
    numericFields.forEach(field => {
      totals[field] = rawData.reduce((sum, row) => sum + row[field], 0)
    })
    calculatePercentages(totals)

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Report HSI')

    const columns = [
      { header: 'Witel', key: 'witel_display', width: 20 },
      { header: 'PRE PI', key: 'pre_pi', width: 10 },
      { header: 'Registered (RE)', key: 'registered', width: 15 },
      { header: 'Inpro SC', key: 'inprogress_sc', width: 12 },
      { header: 'QC 1', key: 'qc1', width: 10 },
      { header: 'FCC', key: 'fcc', width: 10 },
      { header: 'RJCT FCC', key: 'cancel_by_fcc', width: 12 },
      { header: 'Survey Manja', key: 'survey_new_manja', width: 14 },
      { header: 'UN-SC', key: 'unsc', width: 10 },
      { header: 'PI < 1 Hari', key: 'pi_under_1_hari', width: 14 },
      { header: 'PI 1-3 Hari', key: 'pi_1_3_hari', width: 14 },
      { header: 'PI > 3 Hari', key: 'pi_over_3_hari', width: 14 },
      { header: 'Total PI', key: 'total_pi', width: 12 },
      { header: 'FO WFM KNDL Plgn', key: 'fo_wfm_kndl_plgn', width: 16 },
      { header: 'FO WFM KNDL Teknis', key: 'fo_wfm_kndl_teknis', width: 18 },
      { header: 'FO WFM KNDL System', key: 'fo_wfm_kndl_sys', width: 18 },
      { header: 'FO WFM Others', key: 'fo_wfm_others', width: 16 },
      { header: 'FO UIM', key: 'fo_uim', width: 10 },
      { header: 'FO ASP', key: 'fo_asp', width: 10 },
      { header: 'FO OSM', key: 'fo_osm', width: 10 },
      { header: 'Total Fallout', key: 'total_fallout', width: 14 },
      { header: 'ACT COMP (QC2)', key: 'act_comp', width: 15 },
      { header: 'JML COMP (PS)', key: 'jml_comp_ps', width: 15 },
      { header: 'Cancel KNDL Plgn', key: 'cancel_kndl_plgn', width: 16 },
      { header: 'Cancel KNDL Teknis', key: 'cancel_kndl_teknis', width: 16 },
      { header: 'Cancel KNDL System', key: 'cancel_kndl_sys', width: 16 },
      { header: 'Cancel Others', key: 'cancel_others', width: 14 },
      { header: 'Total Cancel', key: 'total_cancel', width: 14 },
      { header: 'Revoke', key: 'revoke', width: 10 },
      { header: 'PI/RE (%)', key: 'pi_re_percent', width: 12 },
      { header: 'PS/RE (%)', key: 'ps_re_percent', width: 12 },
      { header: 'PS/PI (%)', key: 'ps_pi_percent', width: 12 }
    ]

    worksheet.columns = columns

    finalReportData.forEach(row => {
      const rowValues = { ...row }
      rowValues.pi_re_percent = `${row.pi_re_percent}%`
      rowValues.ps_re_percent = `${row.ps_re_percent}%`
      rowValues.ps_pi_percent = `${row.ps_pi_percent}%`
      const excelRow = worksheet.addRow(rowValues)
      if (row.row_type === 'main') {
        excelRow.font = { bold: true }
      }
    })

    const totalRowValues = { ...totals, row_type: 'total' }
    totalRowValues.pi_re_percent = `${totals.pi_re_percent}%`
    totalRowValues.ps_re_percent = `${totals.ps_re_percent}%`
    totalRowValues.ps_pi_percent = `${totals.ps_pi_percent}%`
    const totalRow = worksheet.addRow(totalRowValues)
    totalRow.font = { bold: true }

    worksheet.getRow(1).font = { bold: true }

    const buffer = await workbook.xlsx.writeBuffer()
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=report-hsi-${Date.now()}.xlsx`)
    res.send(buffer)
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
      witels: ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU'],
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

    

        const witelList = witels ? witels.split(',').filter(Boolean) : []

    const isSingleWitel = witelList.length === 1



    // 1. DEFINITIONS & MAPPINGS

    

    // City/Branch Mappings

    const REGION_MAPPING = {

      'BALI': ['BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG'],

      'JATIM BARAT': ['JATIM BARAT', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG'],

      'JATIM TIMUR': ['JATIM TIMUR', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO', 'INNER - JATIM TIMUR'],

      'NUSA TENGGARA': ['NUSA TENGGARA', 'NTB', 'NTT', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA', 'INNER - NUSA TENGGARA'],

      'SURAMADU': ['SURAMADU', 'SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES']

    }



    // Helper to generate SQL CASE statement for mapping

    const generateRegionCase = (column) => {

      let sql = '(CASE '

      Object.entries(REGION_MAPPING).forEach(([region, cities]) => {

        // Escape single quotes if necessary, though these are static lists

        const list = cities.map(c => `'${c}'`).join(',')

        sql += `WHEN COALESCE(TRIM(UPPER(${column})), '') IN (${list}) THEN '${region}' `

      })

      sql += "ELSE 'OTHER' END)"

      return sql

    }



    const WITEL_COL_SOURCE = "COALESCE(TRIM(UPPER(witel_baru)), TRIM(UPPER(bill_witel)))"

    const WITEL_EXPR = generateRegionCase(WITEL_COL_SOURCE)



    // Branch Logic: Check if bill_city maps to the SAME region as the main Witel. If not, try cust_city.

    const BILL_CITY_REGION_EXPR = generateRegionCase('bill_city')

    const CUST_CITY_REGION_EXPR = generateRegionCase('cust_city')

    

    // Logic: Use BillCity directly. If null, use 'UNKNOWN'.
    const RAW_BRANCH = "COALESCE(TRIM(UPPER(bill_city)), 'UNKNOWN')"



    const STATUS_ORDER = ['IN PROCESS', 'PROV. COMPLETE', 'PROVIDE ORDER', 'READY TO BILL']

    const WITEL_ORDER = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'NUSA TENGGARA']

    

    const GROUP_COL = isSingleWitel ? RAW_BRANCH : WITEL_EXPR

    const ORDER_CLAUSE = isSingleWitel ? `${GROUP_COL} ASC` : `CASE 

          ${WITEL_ORDER.map((w, idx) => `WHEN ${WITEL_EXPR} = '${w}' THEN ${idx + 1}`).join(' ')}

          ELSE 99 END`



    const SEGMENT_EXPR = "COALESCE(TRIM(UPPER(segmen)), TRIM(UPPER(segmen_baru)), 'UNKNOWN')"
    const CATEGORY_EXPR = "COALESCE(TRIM(UPPER(kategori)), TRIM(UPPER(kategori_baru)), 'UNKNOWN')"

    let conditions = [`${WITEL_EXPR} != 'OTHER'`, "order_created_date >= '2000-01-01'"]
    const params = []
    let pIdx = 1

    if (start_date && end_date) {
      conditions.push(`order_created_date BETWEEN $${pIdx} AND $${pIdx + 1}`)
      params.push(new Date(start_date), new Date(end_date))
      pIdx += 2
    }

    if (witels && witels.length > 0) {
      const wArr = witels.split(',').filter(Boolean).map(w => w.trim().toUpperCase())
      if (wArr.length > 0) {
        conditions.push(`${WITEL_EXPR} IN (${wArr.map(() => `$${pIdx++}`).join(',')})`)
        params.push(...wArr)
      }
    }

    if (segments && segments.length > 0) {
      const sArr = segments.split(',').filter(Boolean).map(s => s.trim().toUpperCase())
      if (sArr.length > 0) {
        conditions.push(`${SEGMENT_EXPR} IN (${sArr.map(() => `$${pIdx++}`).join(',')})`)
        params.push(...sArr)
      }
    }

    if (categories && categories.length > 0) {
      const cArr = categories.split(',').filter(Boolean).map(c => c.trim().toUpperCase())
      if (cArr.length > 0) {
        conditions.push(`${CATEGORY_EXPR} IN (${cArr.map(() => `$${pIdx++}`).join(',')})`)
        params.push(...cArr)
      }
    }

    const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Helper Lists for Ordering
    const STATUS_PRIORITY = ['READY TO BILL', 'PROVIDE ORDER', 'IN PROCESS', 'PROV. COMPLETE']
    const STATUS_COL = "COALESCE(UPPER(kategori), 'UNKNOWN')"

    // --- 2. EXECUTE QUERIES ---

    const [
      kpiData,
      orderByStatus,
      revenueByStatusAge,
      statusPerWitel,
      revenueTrend,
      revenuePerWitel,
      orderPerWitel,
      revenuePerProduct
    ] = await Promise.all([
      
      // 1. KPI Cards
      prisma.$queryRawUnsafe(`
        SELECT
          COUNT(*)::int as total_order,
          SUM(CASE WHEN ${STATUS_COL} = 'READY TO BILL' THEN COALESCE(revenue,0) ELSE 0 END) as realized_revenue,
          SUM(CASE WHEN ${STATUS_COL} IN ('PROVIDE ORDER', 'IN PROCESS', 'PROV. COMPLETE') THEN COALESCE(revenue,0) ELSE 0 END) as pipeline_revenue
        FROM sos_data ${whereSql}
      `, ...params),

      // 2.1 Order by Status (Donut)
      prisma.$queryRawUnsafe(`
        SELECT ${STATUS_COL} as name, COUNT(*)::int as value
        FROM sos_data ${whereSql}
        GROUP BY ${STATUS_COL}
        ORDER BY value DESC
      `, ...params),

      // 2.2 Revenue by Status (Stacked: <3 BLN, >3 BLN)
      prisma.$queryRawUnsafe(`
        SELECT ${STATUS_COL} as name,
          SUM(CASE WHEN kategori_umur = '< 3 BLN' THEN COALESCE(revenue,0) ELSE 0 END) as revenue_lt_3,
          SUM(CASE WHEN kategori_umur = '> 3 BLN' THEN COALESCE(revenue,0) ELSE 0 END) as revenue_gt_3
        FROM sos_data ${whereSql}
        GROUP BY ${STATUS_COL}
        ORDER BY CASE 
          ${STATUS_PRIORITY.map((s, idx) => `WHEN ${STATUS_COL} = '${s}' THEN ${idx + 1}`).join(' ')}
          ELSE 99 END
      `, ...params),

      // 2.3 Status per Witel (Horizontal Stacked) - Count
      prisma.$queryRawUnsafe(`
        SELECT ${GROUP_COL} as witel, ${STATUS_COL} as status, COUNT(*)::int as count
        FROM sos_data ${whereSql}
        GROUP BY ${GROUP_COL}, ${STATUS_COL}
        ORDER BY ${ORDER_CLAUSE}
      `, ...params),

      // 3.1 Revenue Trend Over Time (Multi-Line)
      prisma.$queryRawUnsafe(`
        SELECT TO_CHAR(order_created_date, 'YYYY-MM') as month, ${STATUS_COL} as status, SUM(COALESCE(revenue,0)) as revenue
        FROM sos_data ${whereSql}
        GROUP BY month, ${STATUS_COL}
        ORDER BY month ASC
      `, ...params),

      // 3.2 Revenue per Witel (Stacked by Status)
      prisma.$queryRawUnsafe(`
        SELECT ${GROUP_COL} as witel, ${STATUS_COL} as status, SUM(COALESCE(revenue,0)) as revenue
        FROM sos_data ${whereSql}
        GROUP BY ${GROUP_COL}, ${STATUS_COL}
        ORDER BY ${ORDER_CLAUSE}
      `, ...params),

      // 3.3 Order per Witel (Dynamic: Product if single witel, else Witel)
      isSingleWitel ? prisma.$queryRawUnsafe(`
        SELECT COALESCE(li_product_name, 'UNKNOWN') as name, COUNT(*)::int as value
        FROM sos_data ${whereSql}
        GROUP BY li_product_name
        ORDER BY value DESC
      `, ...params) : prisma.$queryRawUnsafe(`
        SELECT ${WITEL_EXPR} as name, COUNT(*)::int as value
        FROM sos_data ${whereSql}
        GROUP BY ${WITEL_EXPR}
        ORDER BY CASE 
          ${WITEL_ORDER.map((w, idx) => `WHEN ${WITEL_EXPR} = '${w}' THEN ${idx + 1}`).join(' ')}
          ELSE 99 END
      `, ...params),

      // 3.4 Revenue per Product (Simple Bar)
      prisma.$queryRawUnsafe(`
        SELECT li_product_name as name, SUM(COALESCE(revenue,0)) as value
        FROM sos_data ${whereSql}
        AND li_product_name IS NOT NULL
        GROUP BY li_product_name
        ORDER BY value DESC
        LIMIT 10
      `, ...params)
    ])

    // --- 3. DATA TRANSFORMATION ---

    const kpi = {
      realizedRevenue: Number(kpiData[0]?.realized_revenue || 0),
      pipelineRevenue: Number(kpiData[0]?.pipeline_revenue || 0),
      totalOrder: Number(kpiData[0]?.total_order || 0)
    }

    const transformToStacked = (data, groupKey, stackKey, valueKey, defaultGroups = []) => {
      const grouped = {}
      // Initialize with default groups to ensure they always appear
      defaultGroups.forEach(g => {
        grouped[g] = { name: g }
      })

      data.forEach(row => {
        const group = row[groupKey]
        if (!group || group === 'OTHER') return
        if (!grouped[group]) grouped[group] = { name: group }
        grouped[group][row[stackKey]] = Number(row[valueKey] || 0)
      })
      
      // If no default groups, return as is. If default groups, ensure order matches WITEL_ORDER.
      if (defaultGroups.length > 0) {
        return defaultGroups.map(g => grouped[g] || { name: g })
      }
      return Object.values(grouped)
    }

    const section2 = {
      orderByStatus: orderByStatus.filter(r => r.name !== 'UNKNOWN').map(r => ({ name: r.name, value: Number(r.value) })),
      revenueByStatus: revenueByStatusAge.map(r => ({
        name: r.name,
        '< 3 Bulan': Number(r.revenue_lt_3 || 0),
        '> 3 Bulan': Number(r.revenue_gt_3 || 0)
      })),
      statusPerWitel: transformToStacked(statusPerWitel, 'witel', 'status', 'count', isSingleWitel ? [] : WITEL_ORDER)
    }

    const section3 = {
      revenueTrend: transformToStacked(revenueTrend, 'month', 'status', 'revenue').sort((a, b) => a.name.localeCompare(b.name)),
      revenuePerWitel: transformToStacked(revenuePerWitel, 'witel', 'status', 'revenue', isSingleWitel ? [] : WITEL_ORDER),
      orderPerWitel: isSingleWitel 
        ? orderPerWitel.map(r => ({ name: r.name || 'UNKNOWN', value: Number(r.value || 0) }))
        : WITEL_ORDER.map(w => {
            const found = orderPerWitel.find(r => r.name === w)
            return { name: w, value: Number(found?.value || 0) }
          }),
      revenuePerProduct: revenuePerProduct.map(r => ({ name: r.name, value: Number(r.value) }))
    }

    successResponse(res, { kpi, section2, section3 }, 'SOS Datin dashboard data retrieved')

  } catch (error) {
    next(error)
  }
}

// =================================================================

// DIGITAL PRODUCT DASHBOARD CHARTS

// =================================================================



/**

 * Get filter options for Digital Product Dashboard

 */

export const getDigitalProductFilters = async (req, res, next) => {
  try {
    // 1. Fixed Product List as requested
    const products = ['Antares', 'Netmonk', 'OCA', 'Pijar']

    // 2. Define RSO2 Regions
    const witels = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

    // 3. Define Branch Map (based on established RSO2 grouping)
    const branchMap = {
      'BALI': ['DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG'],
      'JATIM BARAT': ['MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG'],
      'JATIM TIMUR': ['SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO'],
      'NUSA TENGGARA': ['NTB', 'NTT', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA'],
      'SURAMADU': ['SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES']
    }

    // 4. Fetch Date Range from Database
    const dateRange = await prisma.$queryRaw`
      SELECT MIN(order_date) as min_date, MAX(order_date) as max_date 
      FROM digital_products 
      WHERE order_date IS NOT NULL
    `
    console.log('DEBUG: Digital Product Date Range:', dateRange)

    successResponse(res, {
      witels,
      branchMap,
      products,
      dateRange: {
        min: dateRange[0]?.min_date || '2024-01-01',
        max: dateRange[0]?.max_date || new Date()
      }
    }, 'Digital product filter options retrieved')
  } catch (error) {
    next(error)
  }
}



/**

 * Get chart data for Digital Product Dashboard

 * Returns: revenueByWitel, amountByWitel, productBySegment, productByChannel, productShare

 * NOTE: Using digital_products table (has data) instead of document_data (empty)

 */

export const getDigitalProductDashboard = async (req, res, next) => {
  try {
    const { start_date, end_date, witel, branch, product } = req.query

    const witelList = witel ? witel.split(',').filter(Boolean) : []
    const isSingleWitel = witelList.length === 1

    // --- 1. FILTERS & NORMALIZATION ---
    let dateFilter = ''
    const params = []
    let pIdx = 1

    if (start_date && end_date) {
      dateFilter = `AND order_date >= $${pIdx}::date AND order_date <= $${pIdx + 1}::date`
      params.push(start_date, end_date)
      pIdx += 2
    }

    const normalizedDataCTE = `
      WITH normalized_data AS (
        SELECT
          *,
          CASE
            WHEN witel IN ('BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG') THEN 'BALI'
            WHEN witel IN ('JATIM BARAT', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG') THEN 'JATIM BARAT'
            WHEN witel IN ('JATIM TIMUR', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO') THEN 'JATIM TIMUR'
            WHEN witel IN ('NUSA TENGGARA', 'NTB', 'NTT', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA') THEN 'NUSA TENGGARA'
            WHEN witel IN ('SURAMADU', 'SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES') THEN 'SURAMADU'
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
            WHEN status ILIKE '%complete%' OR status ILIKE '%completed%' OR status ILIKE '%ps%' THEN 'COMPLETED'
            ELSE 'IN PROGRESS'
          END as status_group,
          CASE
            WHEN telda IS NOT NULL AND telda != '' THEN UPPER(telda)
            ELSE UPPER(branch)
          END as branch_norm
        FROM digital_products
        WHERE 1=1
        ${dateFilter}
      )
    `

    let filterCondition = `WHERE region_norm != 'OTHER' AND product_norm != 'OTHER'`

    if (witel && witel !== 'ALL') {
      const witelArr = witel.split(',').filter(w => w)
      if (witelArr.length > 0) {
        const placeholders = witelArr.map(() => `$${pIdx++}`).join(',')
        filterCondition += ` AND region_norm IN (${placeholders})`
        params.push(...witelArr)
      }
    }

    if (branch) {
      const branchArr = branch.split(',').filter(b => b)
      if (branchArr.length > 0) {
        const placeholders = branchArr.map(() => `$${pIdx++}`).join(',')
        filterCondition += ` AND branch_norm IN (${placeholders})`
        params.push(...branchArr.map(b => b.toUpperCase()))
      }
    }

    if (product) {
      const productArr = product.split(',').filter(p => p)
      if (productArr.length > 0) {
        const placeholders = productArr.map(() => `$${pIdx++}`).join(',')
        filterCondition += ` AND product_norm IN (${placeholders})`
        params.push(...productArr)
      }
    }

    const WITEL_ORDER = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'NUSA TENGGARA']
    
    // Revenue Logic
    const REVENUE_COL = "COALESCE(NULLIF(net_price, 0), NULLIF(revenue, 0), (substring(product_name from 'Total \\\\(Sebelum PPN\\\\)\\\\s*:\\\\s*([0-9]+)')::numeric), 0)"

    // Dynamic Grouping
    const GROUP_COL = isSingleWitel ? 'branch_norm' : 'region_norm'
    const ORDER_CLAUSE = isSingleWitel ? 'branch_norm ASC' : `CASE 
          ${WITEL_ORDER.map((w, idx) => `WHEN region_norm = '${w}' THEN ${idx + 1}`).join(' ')}
          ELSE 99 END`

    // --- 2. EXECUTE QUERIES ---
    const [
      kpiData,
      orderByStatus,
      revenueByWitel,
      orderByWitel,
      revenueByProductTrend,
      productShare,
      orderTrend
    ] = await Promise.all([
      // 1. KPIs
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT
          COUNT(*)::int as total_order,
          SUM(CASE WHEN status_group = 'COMPLETED' THEN 1 ELSE 0 END)::int as completed_count,
          SUM(CASE WHEN status_group = 'COMPLETED' THEN ${REVENUE_COL} ELSE 0 END) as total_revenue,
          SUM(CASE WHEN status_group = 'IN PROGRESS' THEN ${REVENUE_COL} ELSE 0 END) as pipeline_revenue
        FROM normalized_data
        ${filterCondition}
      `, ...params),

      // Chart 1: Order by Status (Donut)
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT status_group as name, COUNT(*)::int as value
        FROM normalized_data
        ${filterCondition}
        GROUP BY status_group
      `, ...params),

      // Chart 2: Revenue by Witel (Dynamic Group)
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT ${GROUP_COL} as witel, product_norm as product, SUM(${REVENUE_COL}) as revenue
        FROM normalized_data
        ${filterCondition}
        GROUP BY ${GROUP_COL}, product_norm
        ORDER BY ${ORDER_CLAUSE}
      `, ...params),

      // Chart 3: Order by Witel (Dynamic Group)
      isSingleWitel ? prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT ${GROUP_COL} as witel, COUNT(*)::int as count
        FROM normalized_data
        ${filterCondition}
        GROUP BY ${GROUP_COL}
        ORDER BY ${ORDER_CLAUSE}
      `, ...params) : prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT ${GROUP_COL} as witel, status_group as status, COUNT(*)::int as count
        FROM normalized_data
        ${filterCondition}
        GROUP BY ${GROUP_COL}, status_group
        ORDER BY ${ORDER_CLAUSE}
      `, ...params),

      // Chart 4: Revenue Trend (Multi-Line by Product)
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT TO_CHAR(order_date, 'YYYY-MM') as month, product_norm as product, SUM(${REVENUE_COL}) as revenue
        FROM normalized_data
        ${filterCondition}
        GROUP BY month, product_norm
        ORDER BY month ASC
      `, ...params),

      // Chart 5: Product Share (Donut - Revenue)
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT product_norm as name, SUM(${REVENUE_COL}) as value
        FROM normalized_data
        ${filterCondition}
        GROUP BY product_norm
        ORDER BY value DESC
      `, ...params),

      // Chart 6: Order Trend (Multi-Line by Product)
      prisma.$queryRawUnsafe(`
        ${normalizedDataCTE}
        SELECT TO_CHAR(order_date, 'YYYY-MM') as month, product_norm as product, COUNT(*)::int as count
        FROM normalized_data
        ${filterCondition}
        GROUP BY month, product_norm
        ORDER BY month ASC
      `, ...params)
    ])

    // --- 3. DATA TRANSFORMATION ---

    const totalOrder = Number(kpiData[0]?.total_order || 0)
    const completedCount = Number(kpiData[0]?.completed_count || 0)

    const kpi = {
      totalRevenue: Number(kpiData[0]?.total_revenue || 0),
      pipelineRevenue: Number(kpiData[0]?.pipeline_revenue || 0),
      totalOrder: totalOrder,
      completionRate: totalOrder > 0 ? ((completedCount / totalOrder) * 100).toFixed(1) : 0
    }

    const transformToStacked = (data, groupKey, stackKey, valueKey, defaultGroups = []) => {
      const grouped = {}
      defaultGroups.forEach(g => { grouped[g] = { name: g } })

      data.forEach(row => {
        const group = row[groupKey]
        if (!group) return
        if (!grouped[group]) grouped[group] = { name: group }
        grouped[group][row[stackKey]] = Number(row[valueKey] || 0)
      })
      
      if (defaultGroups.length > 0) return defaultGroups.map(g => grouped[g] || { name: g })
      return Object.values(grouped)
    }

    const charts = {
      orderByStatus: orderByStatus.map(r => ({ name: r.name, value: Number(r.value) })),
      revenueByWitel: transformToStacked(revenueByWitel, 'witel', 'product', 'revenue', isSingleWitel ? [] : WITEL_ORDER),
      orderByWitel: isSingleWitel 
        ? orderByWitel.map(r => ({ name: r.witel, value: Number(r.count) }))
        : transformToStacked(orderByWitel, 'witel', 'status', 'count', WITEL_ORDER),
      revenueTrend: transformToStacked(revenueByProductTrend, 'month', 'product', 'revenue'),
      productShare: productShare.map(r => ({ name: r.name, value: Number(r.value) })),
      orderTrend: transformToStacked(orderTrend, 'month', 'product', 'count')
    }

    successResponse(res, { kpi, charts }, 'Digital Product dashboard data retrieved')

  } catch (error) {
    console.error('Error in getDigitalProductDashboard:', error)
    next(error)
  }
}
