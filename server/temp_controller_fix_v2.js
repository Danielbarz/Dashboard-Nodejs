const getReportTambahan = async (req, res, next) => {
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

    // 1. Fetch Master Data PO (Account Officers)
    const accountOfficers = await prisma.accountOfficer.findMany({
      orderBy: { name: 'asc' }
    })

    // Sort AOs: Specific filters first
    const sortedAOs = [...accountOfficers].sort((a, b) => {
      const aHasSpecial = !!a.specialFilterColumn
      const bHasSpecial = !!b.specialFilterColumn
      if (aHasSpecial && !bHasSpecial) return -1
      if (!aHasSpecial && bHasSpecial) return 1
      return 0
    })

    // Segment Normalizer
    const normalizeSegment = (seg) => {
       const s = (seg || '').toUpperCase()
       if (['LEGS', 'DGS', 'DPS', 'GOV', 'ENTERPRISE', 'REG', 'BUMN', 'SOE', 'GOVERNMENT', 'KORPORAT', 'EBIS'].includes(s)) return 'LEGS'
       if (['DBS', 'SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE', 'WIB'].includes(s)) return 'SME'
       return 'SME'
    }

    // Improved Matcher: Checks both specific Witel and Parent Region, and Normalizes Segment
    const findAO = (cleanWitel, parentWitel, segment) => {
      const witelNorm = (cleanWitel || '').toUpperCase()
      const parentNorm = (parentWitel || '').toUpperCase()
      const segmentNorm = normalizeSegment(segment)

      for (const ao of sortedAOs) {
        const wFilters = (ao.filterWitelLama || '').toUpperCase().split(',').map(s=>s.trim()).filter(s=>s)
        const witelMatch = wFilters.some(f => witelNorm.includes(f) || parentNorm.includes(f))

        if (!witelMatch) continue

        if (ao.specialFilterColumn && ao.specialFilterValue) {
           const col = ao.specialFilterColumn.toLowerCase()
           const val = ao.specialFilterValue.toUpperCase()
           if (col === 'segment' || col === 'segmen') {
              if (segmentNorm === val || segmentNorm.includes(val)) return ao
           }
        } else {
           return ao
        }
      }
      return null
    }

    // Constants & Helpers
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

    const formatRaw = (rows) => rows.map(r => ({
      ...r,
      region: findParent(r.witel_norm || r.witel || ''),
      revenue_plan: Number(r.revenue_plan || 0),
      usia: Number(r.usia || 0),
      rn: Number(r.rn)
    }))

    // 2. Fetch Aggregated Data for Table
    const rows = await prisma.$queryRawUnsafe(
      `SELECT
        TRIM(UPPER(REPLACE(COALESCE(witel_lama, witel_baru), 'WITEL ', ''))) AS witel,
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

    // Build table data
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

    // Project data
    const projectRows = await prisma.$queryRawUnsafe(
      `SELECT
        TRIM(UPPER(REPLACE(COALESCE(witel_lama, witel_baru), 'WITEL ', ''))) AS witel,
        TRIM(UPPER(REPLACE(witel_baru, 'WITEL ', ''))) AS parent_witel,
        SUM(CASE WHEN status_tomps_last_activity ILIKE '%DALAM%' THEN 1 ELSE 0 END)::int AS dalam_toc,
        SUM(CASE WHEN status_tomps_last_activity ILIKE '%LEWAT%' THEN 1 ELSE 0 END)::int AS lewat_toc,
        SUM(CASE WHEN go_live = 'N' AND populasi_non_drop = 'Y' THEN 1 ELSE 0 END)::int AS lop_progress
      FROM spmk_mom
      ${dateFilter ? `${dateFilter} AND go_live = 'N' AND populasi_non_drop = 'Y'` : "WHERE go_live = 'N' AND populasi_non_drop = 'Y'"}
      GROUP BY witel_baru, witel_lama`,
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

    // --- TOP 3 AGING WITEL ---
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

    // Group and Sort Witels by max age
    const formattedWitelRows = formatRaw(top3WitelRaw)
    const witelMap = {}
    formattedWitelRows.forEach(r => {
      const key = r.region || 'Unknown'
      if (!witelMap[key]) witelMap[key] = []
      witelMap[key].push(r)
    })

    const top3WitelFinal = []
    Object.keys(witelMap)
      .sort((a, b) => (witelMap[b][0]?.usia || 0) - (witelMap[a][0]?.usia || 0))
      .forEach(key => {
        top3WitelFinal.push(...witelMap[key])
      })

    // --- TOP 3 PO MAPPING ---
    const rawActiveProjects = await prisma.spmkMom.findMany({
      where: { goLive: 'N', populasiNonDrop: 'Y' },
      select: {
        witelLama: true, witelBaru: true, segmen: true, poName: true,
        idIHld: true, tanggalMom: true, revenuePlan: true,
        statusTompsNew: true, usia: true, uraianKegiatan: true
      },
      orderBy: { usia: 'desc' }
    })

    const poGroups = {}
    rawActiveProjects.forEach(proj => {
      const rawWitel = cleanWitelName(proj.witelLama || proj.witelBaru)
      const parent = findParent(rawWitel)
      const ao = findAO(rawWitel, parent, proj.segmen)
      const aoName = ao ? ao.name : (proj.poName || 'UNMAPPED PO')

      if (!poGroups[aoName]) poGroups[aoName] = []
      if (poGroups[aoName].length < 3) {
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
      }
    })

    const top3PoFinal = []
    // Sort POs by age and limit to Top 3 POs
    Object.keys(poGroups)
      .sort((a, b) => (poGroups[b][0]?.usia || 0) - (poGroups[a][0]?.usia || 0))
      .slice(0, 3)
      .forEach(key => {
        poGroups[key].forEach((item, idx) => {
          top3PoFinal.push({ ...item, rn: idx + 1 })
        })
      })

    // --- TOP MITRA REVENUE MAPPING ---
    const rawRevenueData = await prisma.$queryRawUnsafe(
      `SELECT
        TRIM(UPPER(REPLACE(COALESCE(witel_lama, witel_baru), 'WITEL ', ''))) as witel,
        segmen, po_name,
        SUM(COALESCE(revenue_plan,0)) as total_revenue,
        COUNT(*)::int as project_count
       FROM spmk_mom
       ${dateFilter ? `${dateFilter} AND populasi_non_drop = 'Y'` : "WHERE populasi_non_drop = 'Y'"}
       GROUP BY witel_lama, witel_baru, segmen, po_name`
       , ...params
    )

    const revenueMap = {}
    rawRevenueData.forEach(row => {
      const parent = findParent(row.witel)
      const ao = findAO(row.witel, parent, row.segmen)
      const aoName = ao ? ao.name : (row.po_name || 'UNMAPPED PO')

      if (!revenueMap[aoName]) {
        revenueMap[aoName] = { poName: aoName, totalRevenue: 0, projectCount: 0 }
      }
      revenueMap[aoName].totalRevenue += Number(row.total_revenue || 0)
      revenueMap[aoName].projectCount += Number(row.project_count || 0)
    })

    const topMitraRevenue = Object.values(revenueMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10)

    // --- OTHER CHARTS ---
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

    successResponse(
      res,
      {
        tableData: finalTable,
        projectData: finalProjects,
        top3Witel: top3WitelFinal,
        top3Po: top3PoFinal,
        bucketUsiaData: bucketUsiaRaw,
        trendGolive: trendRaw,
        topMitraRevenue
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