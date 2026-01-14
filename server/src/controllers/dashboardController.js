import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import ExcelJS from 'exceljs';
dayjs.extend(utc)
dayjs.extend(timezone)

// --- CONSTANTS & HELPERS FOR JARINGAN TAMBAHAN (JT) ---
const RSO2_WITELS = ['JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'BALI', 'NUSA TENGGARA']

const WITEL_HIERARCHY = {
  'BALI': ['BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'TABANAN', 'KLUNGKUNG', 'BANGLI', 'KARANGASEM', 'JEMBRANA', 'BADUNG'],
  'JATIM BARAT': ['JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG', 'MOJOKERTO', 'TULUNGAGUNG', 'BLITAR', 'JOMBANG', 'NGANJUK', 'PONOROGO', 'TRENGGALEK', 'PACITAN', 'NGAWI', 'MAGETAN', 'BOJONEGORO', 'TUBAN', 'LAMONGAN', 'BATU'],
  'JATIM TIMUR': ['JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO', 'PROBOLINGGO', 'LUMAJANG', 'BONDOWOSO', 'SITUBONDO', 'BANYUWANGI'],
  'NUSA TENGGARA': ['NUSA TENGGARA', 'NTT', 'NTB', 'KUPANG', 'MATARAM', 'SUMBAWA', 'BIMA', 'MAUMERE', 'ENDE', 'FLORES', 'LOMBOK'],
  'SURAMADU': ['SURAMADU', 'SURABAYA UTARA', 'SURABAYA SELATAN', 'MADURA', 'PAMEKASAN', 'SUMENEP', 'BANGKALAN', 'SAMPANG', 'GRESIK', 'SIDOARJO']
}

const cleanWitelName = (w) => (w || '').toUpperCase().replace('WITEL ', '').trim()

const findParent = (w) => {
  const wClean = cleanWitelName(w)
  if (WITEL_HIERARCHY[wClean]) return wClean

  for (const [p, children] of Object.entries(WITEL_HIERARCHY)) {
    if (children.includes(wClean)) return p
    if (children.some(c => wClean.includes(c))) return p
  }
  return wClean
}

// --- CONTROLLERS ---

export const getReportTambahan = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    let dateFilter = ''
    const queryParams = []
    if (start_date && end_date) {
      dateFilter = 'WHERE tanggal_mom BETWEEN $1 AND $2'
      queryParams.push(new Date(start_date))
      queryParams.push(new Date(end_date))
    }

    const accountOfficers = await prisma.accountOfficer.findMany({ orderBy: { name: 'asc' } })
    const sortedAOs = [...accountOfficers].sort((a, b) => {
      if (!!a.specialFilterColumn && !b.specialFilterColumn) return -1
      if (!a.specialFilterColumn && !!b.specialFilterColumn) return 1
      return 0
    })

    const findAO = (cleanWitel, parentWitel, segment) => {
      const witelNorm = (cleanWitel || '').toUpperCase()
      const parentNorm = (parentWitel || '').toUpperCase()
      const segmentNorm = (segment || '').toUpperCase()
      for (const ao of sortedAOs) {
        const wFilters = (ao.filterWitelLama || '').toUpperCase().split(',').map(s=>s.trim()).filter(s=>s)
        const witelMatch = wFilters.some(f => witelNorm.includes(f) || parentNorm.includes(f))
        if (!witelMatch) continue
        if (ao.specialFilterColumn && ao.specialFilterValue) {
           const col = ao.specialFilterColumn.toLowerCase()
           const val = ao.specialFilterValue.toUpperCase()
           if ((col === 'segment' || col === 'segmen') && segmentNorm.includes(val)) return ao
        } else return ao
      }
      return null
    }

    // Aggregated Data for Table
    const rows = await prisma.$queryRawUnsafe(
      `SELECT
        TRIM(UPPER(REPLACE(COALESCE(witel_lama, witel_baru), 'WITEL ', ''))) AS witel,
        TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) AS parent_witel,
        SUM(CASE WHEN populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS jumlah_lop,
        SUM(COALESCE(revenue_plan,0)) AS rev_all,
        SUM(CASE WHEN (status_i_hld ILIKE '%GO LIVE%' OR go_live = 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS golive_jml,
        SUM(CASE WHEN (status_i_hld ILIKE '%GO LIVE%' OR go_live = 'Y') AND populasi_non_drop = 'Y' THEN COALESCE(revenue_plan,0) ELSE 0 END) AS golive_rev,
        SUM(CASE WHEN populasi_non_drop = 'N' THEN 1 ELSE 0 END)::int AS drop_cnt,
        SUM(CASE WHEN status_i_hld ILIKE '%Initial%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_initial,
        SUM(CASE WHEN status_i_hld ILIKE '%Survey%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_survey,
        SUM(CASE WHEN status_i_hld ILIKE '%Perizinan%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_perizinan,
        SUM(CASE WHEN status_i_hld ILIKE '%Instalasi%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_instalasi,
        SUM(CASE WHEN status_i_hld ILIKE '%FI%' AND go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_fi
      FROM spmk_mom
      ${dateFilter}
      GROUP BY witel_baru, witel_lama
      ORDER BY witel_baru, witel_lama`, ...queryParams
    )

    const parents = new Map()
    const tableData = []
    rows.forEach((row) => {
      const witelNorm = row.witel
      const parentKey = row.parent_witel || findParent(witelNorm)
      const r = {
        isParent: false, parentWitel: parentKey, witel: witelNorm,
        jumlahLop: Number(row.jumlah_lop), revAll: Number(row.rev_all),
        initial: Number(row.cnt_initial), survey: Number(row.cnt_survey),
        perizinan: Number(row.cnt_perizinan), instalasi: Number(row.cnt_instalasi),
        piOgp: Number(row.cnt_fi), golive_jml: Number(row.golive_jml),
        golive_rev: Number(row.golive_rev), drop: Number(row.drop_cnt)
      }
      r.persen_close = r.jumlahLop > 0 ? ((r.golive_jml / r.jumlahLop) * 100).toFixed(2) : '0.00'
      tableData.push(r)
      if (!parents.has(parentKey)) {
        parents.set(parentKey, { isParent: true, parentWitel: parentKey, witel: parentKey, jumlahLop: 0, revAll: 0, initial: 0, survey: 0, perizinan: 0, instalasi: 0, piOgp: 0, golive_jml: 0, golive_rev: 0, drop: 0 })
      }
      const p = parents.get(parentKey)
      p.jumlahLop += r.jumlahLop; p.revAll += r.revAll; p.golive_jml += r.golive_jml; p.golive_rev += r.golive_rev; p.drop += r.drop;
      p.initial += r.initial; p.survey += r.survey; p.perizinan += r.perizinan; p.instalasi += r.instalasi; p.piOgp += r.piOgp
    })

    const finalTable = []
    parents.forEach((p, key) => {
      p.persen_close = p.jumlahLop > 0 ? ((p.golive_jml / p.jumlahLop) * 100).toFixed(2) : '0.00'
      finalTable.push(p); finalTable.push(...tableData.filter(r => r.parentWitel === key))
    })

    // TOC Data
        const projectRowsSql = await prisma.$queryRawUnsafe(
          `SELECT TRIM(UPPER(REPLACE(COALESCE(witel_lama, witel_baru), 'WITEL ', ''))) AS witel, TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) AS parent_witel,
            SUM(CASE WHEN status_tomps_last_activity ILIKE '%DALAM%' THEN 1 ELSE 0 END)::int AS dalam_toc,
            SUM(CASE WHEN status_tomps_last_activity ILIKE '%LEWAT%' THEN 1 ELSE 0 END)::int AS lewat_toc,
            SUM(CASE WHEN go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS lop_progress
          FROM spmk_mom ${dateFilter ? `${dateFilter} AND go_live = 'N' AND populasi_non_drop = 'Y'` : "WHERE go_live = 'N' AND populasi_non_drop = 'Y'"}      GROUP BY witel_baru, witel_lama`, ...queryParams
    )

    const parentProjects = new Map()
    const projectData = []
    projectRowsSql.forEach((row) => {
      const witelNorm = row.witel; const parentKey = row.parent_witel || findParent(witelNorm)
      const d = { isParent: false, parentWitel: parentKey, witel: witelNorm, dalam_toc: Number(row.dalam_toc), lewat_toc: Number(row.lewat_toc), jumlah_lop_progress: Number(row.lop_progress) }
      d.persen_dalam_toc = (d.dalam_toc + d.lewat_toc) > 0 ? ((d.dalam_toc / (d.dalam_toc + d.lewat_toc)) * 100).toFixed(2) : '0.00'
      projectData.push(d)
      if (!parentProjects.has(parentKey)) parentProjects.set(parentKey, { isParent: true, parentWitel: parentKey, witel: parentKey, dalam_toc: 0, lewat_toc: 0, jumlah_lop_progress: 0 })
      const p = parentProjects.get(parentKey); p.dalam_toc += d.dalam_toc; p.lewat_toc += d.lewat_toc; p.jumlah_lop_progress += d.jumlah_lop_progress
    })

    const finalProjects = []
    parentProjects.forEach((p, key) => {
      p.persen_dalam_toc = (p.dalam_toc + p.lewat_toc) > 0 ? ((p.dalam_toc / (p.dalam_toc + p.lewat_toc)) * 100).toFixed(2) : '0.00'
      finalProjects.push(p); finalProjects.push(...projectData.filter(r => r.parentWitel === key))
    })

    // Aging Charts
    const top3WitelRaw = await prisma.$queryRawUnsafe(`WITH Ranked AS (SELECT TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) as witel_norm, id_i_hld, tanggal_mom, revenue_plan, status_tomps_new, usia, uraian_kegiatan, ROW_NUMBER() OVER (PARTITION BY TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) ORDER BY usia DESC) as rn FROM spmk_mom WHERE go_live = 'N' AND populasi_non_drop = 'Y') SELECT * FROM Ranked WHERE rn <= 3 ORDER BY witel_norm, rn`)
    const rawActiveProjects = await prisma.spmkMom.findMany({ where: { goLive: 'N', populasiNonDrop: 'Y' }, select: { witelLama: true, witelBaru: true, segmen: true, poName: true, idIHld: true, tanggalMom: true, revenuePlan: true, statusTompsNew: true, usia: true, uraianKegiatan: true }, orderBy: { usia: 'desc' } })
    const poGroups = {}
    rawActiveProjects.forEach(proj => {
      const rawWitel = cleanWitelName(proj.witelLama || proj.witelBaru); const parent = findParent(rawWitel); const ao = findAO(rawWitel, parent, proj.segmen); const aoName = ao ? ao.name : (proj.poName || 'UNMAPPED PO')
      if (!poGroups[aoName]) poGroups[aoName] = []
      if (poGroups[aoName].length < 3) poGroups[aoName].push({ po_name: aoName, witel_norm: rawWitel, id_i_hld: proj.idIHld, tanggal_mom: proj.tanggalMom, revenue_plan: Number(proj.revenuePlan || 0), status_tomps_new: proj.statusTompsNew, usia: proj.usia, uraian_kegiatan: proj.uraianKegiatan })
    })
    const top3PoMapped = []; Object.keys(poGroups).sort().forEach(key => poGroups[key].forEach((item, idx) => top3PoMapped.push({ ...item, rn: idx + 1 })))

    // Top Mitra Chart
    const rawRevenueData = await prisma.$queryRawUnsafe(`SELECT TRIM(UPPER(REPLACE(COALESCE(witel_lama, witel_baru), 'WITEL ', ''))) as witel, segmen, po_name, SUM(COALESCE(revenue_plan,0)) as total_revenue, COUNT(*)::int as project_count FROM spmk_mom ${dateFilter ? `${dateFilter} AND populasi_non_drop = 'Y'` : "WHERE populasi_non_drop = 'Y'"} GROUP BY witel_lama, witel_baru, segmen, po_name`, ...queryParams)
    const revenueMap = {}
    rawRevenueData.forEach(row => {
      const witelClean = row.witel; const parent = findParent(witelClean); const ao = findAO(witelClean, parent, row.segmen); const aoName = ao ? ao.name : (row.po_name || 'UNMAPPED PO')
      if (!revenueMap[aoName]) revenueMap[aoName] = { poName: aoName, totalRevenue: 0, projectCount: 0 }
      revenueMap[aoName].totalRevenue += Number(row.total_revenue); revenueMap[aoName].projectCount += Number(row.project_count)
    })
    const topMitraRevenue = Object.values(revenueMap).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10)

    const bucketUsiaRaw = await prisma.$queryRawUnsafe(`SELECT CASE WHEN usia < 30 THEN '< 30 Hari' WHEN usia BETWEEN 30 AND 60 THEN '30 - 60 Hari' WHEN usia BETWEEN 61 AND 90 THEN '61 - 90 Hari' ELSE '> 90 Hari' END as range, COUNT(*)::int as count FROM spmk_mom WHERE go_live = 'N' AND populasi_non_drop = 'Y' GROUP BY range ORDER BY range`)
    const trendRaw = await prisma.$queryRawUnsafe(`SELECT TO_CHAR(tanggal_mom, 'YYYY-MM') as month, COUNT(*)::int as total_order, SUM(CASE WHEN go_live = 'Y' THEN 1 ELSE 0 END)::int as total_golive FROM spmk_mom ${dateFilter ? `${dateFilter} AND populasi_non_drop = 'Y'` : "WHERE populasi_non_drop = 'Y'"} GROUP BY month ORDER BY month`, ...queryParams)

    const formatRawWitel = (rows) => rows.map(r => ({ ...r, region: findParent(r.witel_norm || r.witel || ''), revenue_plan: Number(r.revenue_plan || 0), usia: Number(r.usia || 0), rn: Number(r.rn) }))
        const rawProjects = await prisma.spmkMom.findMany({ where: { ...(start_date && end_date && { tanggalMom: { gte: new Date(start_date), lte: new Date(end_date) } }) }, orderBy: { usia: 'desc' }, take: 500 })

        return successResponse(res, {
          tableData: finalTable,
          projectData: finalProjects,
          topUsiaByWitel: formatRawWitel(top3WitelRaw),
          topUsiaByPo: top3PoMapped,
          bucketUsiaData: bucketUsiaRaw,
          trendGolive: trendRaw,
          topMitraRevenue,
          rawProjectRows: rawProjects
        }, 'Report Tambahan data retrieved successfully')  } catch (error) {
    next(error)
  }
}

// --- HSI CONTROLLERS ---

export const getHSIDashboard = async (req, res, next) => {
  try {
    const { start_date, end_date, global_witel, global_branch, map_status, search, page = 1, limit = 10 } = req.query
    const selectedWitels = global_witel ? global_witel.split(',') : []
    const selectedBranches = global_branch ? global_branch.split(',') : []
    const mapStatusArr = map_status ? map_status.split(',') : []
    let whereClause = { witel: { in: RSO2_WITELS } }
    if (selectedWitels.length > 0) whereClause.witel = { in: selectedWitels }
    if (selectedBranches.length > 0) whereClause.witelOld = { in: selectedBranches }
    if (start_date && end_date) whereClause.orderDate = { gte: new Date(start_date), lte: new Date(end_date) }
    if (search) whereClause.OR = [{ orderId: { contains: search, mode: 'insensitive' } }, { customerName: { contains: search, mode: 'insensitive' } }]
    let dim = (selectedBranches.length > 0 || selectedWitels.length > 0) ? 'witelOld' : 'witel'
    const chart1Raw = await prisma.hsiData.groupBy({ by: [dim], where: whereClause, _count: { id: true }, orderBy: { _count: { id: 'desc' } } })
    const chart1 = chart1Raw.map(i => ({ product: i[dim] || 'Unknown', value: i._count.id }))
    const chart2Raw = await prisma.hsiData.groupBy({ by: ['kelompokStatus'], where: whereClause, _count: { id: true } })
    const sGroups = { Completed: 0, Cancel: 0, Open: 0 }
    chart2Raw.forEach(item => { if (item.kelompokStatus === 'PS') sGroups.Completed += item._count.id; else if (['CANCEL', 'REJECT_FCC'].includes(item.kelompokStatus)) sGroups.Cancel += item._count.id; else sGroups.Open += item._count.id })
    const chart2 = Object.keys(sGroups).map(k => ({ product: k, value: sGroups[k] }))
    const chart3Raw = await prisma.hsiData.groupBy({ by: ['typeLayanan'], where: whereClause, _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 10 })
    const chart3 = chart3Raw.map(i => ({ sub_type: i.typeLayanan, product: 'Total', total_amount: i._count.id }))
    const chart4Raw = await prisma.hsiData.groupBy({ by: [dim], where: { ...whereClause, kelompokStatus: 'PS' }, _count: { id: true }, orderBy: { _count: { id: 'desc' } } })
    const chart4 = chart4Raw.map(i => ({ product: i[dim] || 'Unknown', value: i._count.id }))
    const stats = { total: await prisma.hsiData.count({ where: whereClause }), completed: await prisma.hsiData.count({ where: { ...whereClause, kelompokStatus: 'PS' } }), open: await prisma.hsiData.count({ where: { ...whereClause, NOT: { kelompokStatus: { in: ['PS', 'CANCEL', 'REJECT_FCC'] } } } }) }
    const branchesRaw = await prisma.hsiData.groupBy({ by: ['witel', 'witelOld'], where: { witel: { in: RSO2_WITELS }, witelOld: { not: null } } })
    const branchMap = {}; branchesRaw.forEach(b => { if (!branchMap[b.witel]) branchMap[b.witel] = []; if (b.witelOld && !branchMap[b.witel].includes(b.witelOld)) branchMap[b.witel].push(b.witelOld) })
    successResponse(res, { stats, chart1, chart2, chart3, chart4, branchMap }, 'Dashboard data retrieved')
  } catch (error) { next(error) }
}

// --- OTHER PLACEHOLDERS ---
export const getRevenueByWitel = async (req, res, next) => { successResponse(res, []) }
export const getAmountByWitel = async (req, res, next) => { successResponse(res, []) }
export const getKPIData = async (req, res, next) => { successResponse(res, {}) }
export const getTotalOrderByRegional = async (req, res, next) => { successResponse(res, []) }
export const getSebaranDataPS = async (req, res, next) => { successResponse(res, []) }
export const getCancelByFCC = async (req, res, next) => { successResponse(res, []) }
export const getFilterOptions = async (req, res, next) => { successResponse(res, {}) }
export const getDashboardData = async (req, res, next) => { successResponse(res, []) }
export const getReportDatin = async (req, res, next) => { successResponse(res, []) }
export const getReportAnalysis = async (req, res, next) => { successResponse(res, []) }
export const getReportHSI = async (req, res, next) => { successResponse(res, []) }
export const getJTDashboard = async (req, res, next) => { successResponse(res, {}) }
export const getJTFilters = async (req, res, next) => { successResponse(res, {}) }
export const getJTReport = async (req, res, next) => { successResponse(res, {}) }
export const exportReportAnalysis = async (req, res, next) => { successResponse(res, {}) }
export const exportReportDatin = async (req, res, next) => { successResponse(res, {}) }
export const exportReportTambahan = async (req, res, next) => { successResponse(res, {}) }
export const exportReportHSI = async (req, res, next) => { successResponse(res, {}) }
export const exportJTReport = async (req, res, next) => { successResponse(res, {}) }
export const getHSIFlowStats = async (req, res, next) => { successResponse(res, {}) }
export const getHSIFlowDetail = async (req, res, next) => { successResponse(res, {}) }
