import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import ExcelJS from 'exceljs';
import { cleanWitelName, findParent, RSO2_WITELS, WITEL_HIERARCHY, fixCoordinate } from '../utils/dashboardHelpers.js'

dayjs.extend(utc)
dayjs.extend(timezone)


export const getJTDashboard = async (req, res, next) => {
  try {
    const { witel, po, search, limit } = req.query

    const whereClause = {}
    const startDate = req.query.start_date ? new Date(req.query.start_date) : null
    const endDate = req.query.end_date ? new Date(req.query.end_date) : null

    if (startDate && endDate) {
      whereClause.tanggalMom = {
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
        uraianKegiatan: true,
        populasiNonDrop: true
      }
    })

    console.log('[DEBUG JT] Total Rows:', rows.length)
    console.log('[DEBUG JT] GoLive N count:', rows.filter(r => r.goLive === 'N').length)
    console.log('[DEBUG JT] GoLive NULL count:', rows.filter(r => r.goLive === null).length)
    console.log('[DEBUG JT] Populasi Non Drop Y count:', rows.filter(r => r.populasiNonDrop === 'Y').length)


    const isDrop = (row) => {
      const pnd = (row.populasiNonDrop || '').toUpperCase()
      return pnd === 'N'
    }

    // Status pie/stack per witel
    const statusByWitel = {}
    rows.forEach((row) => {
      const key = cleanWitelName(row.witelBaru) || 'Unknown'
      if (!statusByWitel[key]) statusByWitel[key] = { golive: 0, belum_golive: 0, drop: 0 }
      
      const isGoLive = (row.goLive || '').trim().toUpperCase() === 'Y'
      
      if (isDrop(row)) {
        statusByWitel[key].drop += 1
      } else if (isGoLive) {
        statusByWitel[key].golive += 1
      } else {
        statusByWitel[key].belum_golive += 1
      }
    })

    // Aggregated Global Stats for Cards
    const globalStats = { golive: 0, belum_golive: 0, drop: 0, total_lop: 0 }
    Object.values(statusByWitel).forEach(s => {
      globalStats.golive += s.golive
      globalStats.belum_golive += s.belum_golive
      globalStats.drop += s.drop
    })
    globalStats.total_lop = globalStats.golive + globalStats.belum_golive

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
      globalStats,
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
        SUM(CASE WHEN ((status_i_hld ILIKE '%GO LIVE%' AND (go_live IS NULL OR go_live != 'N')) OR go_live = 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS golive_jml,
        SUM(CASE WHEN ((status_i_hld ILIKE '%GO LIVE%' AND (go_live IS NULL OR go_live != 'N')) OR go_live = 'Y') AND populasi_non_drop = 'Y' THEN COALESCE(revenue_plan,0) ELSE 0 END) AS golive_rev,
        SUM(CASE WHEN populasi_non_drop = 'N' THEN 1 ELSE 0 END)::int AS drop_cnt,
        
        -- Fix: cnt_initial acts as catch-all for any non-GoLive that isn't Survey/Perizinan/Instalasi/FI
        SUM(CASE 
          WHEN (go_live = 'N' OR go_live IS NULL OR go_live != 'Y') 
          AND populasi_non_drop = 'Y'
          AND (
            status_i_hld ILIKE '%Initial%' 
            OR status_i_hld IS NULL 
            OR status_i_hld = ''
            OR (
              status_i_hld NOT ILIKE '%Survey%' 
              AND status_i_hld NOT ILIKE '%Perizinan%' 
              AND status_i_hld NOT ILIKE '%Instalasi%' 
              AND status_i_hld NOT ILIKE '%FI%'
            )
          )
          THEN 1 ELSE 0 
        END)::int AS cnt_initial,

        SUM(CASE WHEN status_i_hld ILIKE '%Survey%' AND (go_live = 'N' OR go_live IS NULL OR go_live != 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_survey,
        SUM(CASE WHEN status_i_hld ILIKE '%Perizinan%' AND (go_live = 'N' OR go_live IS NULL OR go_live != 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_perizinan,
        SUM(CASE WHEN status_i_hld ILIKE '%Instalasi%' AND (go_live = 'N' OR go_live IS NULL OR go_live != 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_instalasi,
        SUM(CASE WHEN status_i_hld ILIKE '%FI%' AND (go_live = 'N' OR go_live IS NULL OR go_live != 'Y') AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS cnt_fi
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

    // TOC Data - IGNORE DATE FILTER
        const projectRowsSql = await prisma.$queryRawUnsafe(
          `SELECT TRIM(UPPER(REPLACE(COALESCE(witel_lama, witel_baru), 'WITEL ', ''))) AS witel, TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) AS parent_witel,
            SUM(CASE WHEN status_tomps_last_activity ILIKE '%DALAM%' THEN 1 ELSE 0 END)::int AS dalam_toc,
            SUM(CASE WHEN status_tomps_last_activity ILIKE '%LEWAT%' THEN 1 ELSE 0 END)::int AS lewat_toc,
            SUM(CASE WHEN (go_live = 'N' OR go_live IS NULL) AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS lop_progress
          FROM spmk_mom 
          WHERE (go_live = 'N' OR go_live IS NULL) AND populasi_non_drop = 'Y'
          GROUP BY witel_baru, witel_lama`
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

    // Aging Charts - TEST MODE: Show ALL data (limit 100) to debug frontend
    const rawActiveProjects = await prisma.spmkMom.findMany({
      where: {
        // goLive: { not: 'Y' }, // Commented out for debug
        // populasiNonDrop: 'Y'  // Commented out for debug
      },
      select: {
        witelLama: true, witelBaru: true, segmen: true, poName: true, idIHld: true,
        tanggalMom: true, revenuePlan: true, statusTompsNew: true, usia: true, uraianKegiatan: true
      },
      orderBy: { usia: 'desc' },
      take: 100
    })

    console.log(`[DEBUG JT] Raw Active Projects found: ${rawActiveProjects.length}`); // DEBUG

    // 1. Top 3 Witel Logic
    const witelGroups = {}
    rawActiveProjects.forEach(proj => {
      const w = cleanWitelName(proj.witelBaru || proj.witelLama)
      const region = findParent(w)
      if (!witelGroups[region]) witelGroups[region] = []
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
    
    console.log(`[DEBUG JT] Witel Groups keys: ${Object.keys(witelGroups).join(', ')}`); // DEBUG

    const top3WitelMapped = []
    Object.keys(witelGroups).sort().forEach(key => {
      witelGroups[key].sort((a, b) => (b.usia || 0) - (a.usia || 0))
      witelGroups[key].slice(0, 3).forEach((item, idx) => {
        top3WitelMapped.push({ ...item, rn: idx + 1 })
      })
    })
    
    console.log(`[DEBUG JT] Final Top 3 Witel count: ${top3WitelMapped.length}`); // DEBUG

    // 2. Top 3 PO Logic
    const poGroups = {}
    rawActiveProjects.forEach(proj => {
      const rawWitel = cleanWitelName(proj.witelLama || proj.witelBaru)
      const parent = findParent(rawWitel)
      const ao = findAO(rawWitel, parent, proj.segmen)
      let aoName = ao ? ao.name : (proj.poName || 'UNMAPPED PO')

      // CLEANUP: Trim spaces but ALLOW ALL POs (including PT2, PT3)
      aoName = aoName.trim()
      // Filter removed to show all data
      
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

    // Top Mitra Chart
    const rawRevenueData = await prisma.$queryRawUnsafe(`SELECT TRIM(UPPER(REPLACE(COALESCE(witel_lama, witel_baru), 'WITEL ', ''))) as witel, segmen, po_name, SUM(COALESCE(revenue_plan,0)) as total_revenue, COUNT(*)::int as project_count FROM spmk_mom ${dateFilter ? `${dateFilter} AND populasi_non_drop = 'Y'` : "WHERE populasi_non_drop = 'Y'"} GROUP BY witel_lama, witel_baru, segmen, po_name`, ...queryParams)
    const revenueMap = {}
    rawRevenueData.forEach(row => {
      const witelClean = row.witel; const parent = findParent(witelClean); const ao = findAO(witelClean, parent, row.segmen); const aoName = ao ? ao.name : (row.po_name || 'UNMAPPED PO')
      if (!revenueMap[aoName]) revenueMap[aoName] = { poName: aoName, totalRevenue: 0, projectCount: 0 }
      revenueMap[aoName].totalRevenue += Number(row.total_revenue); revenueMap[aoName].projectCount += Number(row.project_count)
    })
    const topMitraRevenue = Object.values(revenueMap).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 10)

    const bucketUsiaRaw = await prisma.$queryRawUnsafe(`SELECT CASE WHEN usia < 30 THEN '< 30 Hari' WHEN usia BETWEEN 30 AND 60 THEN '30 - 60 Hari' WHEN usia BETWEEN 61 AND 90 THEN '61 - 90 Hari' ELSE '> 90 Hari' END as range, COUNT(*)::int as count FROM spmk_mom WHERE (go_live = 'N' OR go_live IS NULL) AND populasi_non_drop = 'Y' GROUP BY range ORDER BY range`)
    const trendRaw = await prisma.$queryRawUnsafe(`SELECT TO_CHAR(tanggal_mom, 'YYYY-MM') as month, COUNT(*)::int as total_order, SUM(CASE WHEN go_live = 'Y' THEN 1 ELSE 0 END)::int as total_golive FROM spmk_mom ${dateFilter ? `${dateFilter} AND populasi_non_drop = 'Y'` : "WHERE populasi_non_drop = 'Y'"} GROUP BY month ORDER BY month`, ...queryParams)

    const formatRawWitel = (rows) => rows.map(r => ({ ...r, region: findParent(r.witel_norm || r.witel || ''), revenue_plan: Number(r.revenue_plan || 0), usia: Number(r.usia || 0), rn: Number(r.rn) }))
        const rawProjects = await prisma.spmkMom.findMany({ where: { ...(start_date && end_date && { tanggalMom: { gte: new Date(start_date), lte: new Date(end_date) } }) }, orderBy: { usia: 'desc' }, take: 500 })

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

// --- HSI CONTROLLERS ---


export const exportReportTambahan = async (req, res, next) => {
  try {
    successResponse(res, { message: 'Export Report Tambahan not implemented' }, 'Export placeholder')
  } catch (error) {
    next(error)
  }
}


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
