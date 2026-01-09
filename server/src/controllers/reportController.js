import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import PO_MAPPING from '../utils/poMapping.js'

// Get Report Tambahan (JT/Jaringan Tambahan) - from SPMK MOM data
export const getReportTambahan = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query

    // Accept all spmk_mom rows (JT import includes all records)
    // Filter out: SEMARANG, SOLO, YOGYA, PURWOKERTO, MAGELANG, UNKNOWN (both Parent and Child)
    const excludedWitels = [
      'WITEL SEMARANG JATENG UTARA',
      'WITEL SOLO JATENG TIMUR',
      'WITEL YOGYA JATENG SELATAN',
      'SEMARANG JATENG UTARA',
      'SOLO JATENG TIMUR',
      'YOGYA JATENG SELATAN',
      'WITEL SEMARANG',
      'WITEL SOLO',
      'WITEL YOGYA',
      'WITEL PURWOKERTO',
      'WITEL MAGELANG',
      'SEMARANG',
      'SOLO',
      'YOGYA',
      'PURWOKERTO',
      'MAGELANG',
      'Unknown',
      ''
    ]

    const whereClause = {
      witelBaru: {
        notIn: excludedWitels,
        not: null
      },
      witelLama: {
        notIn: excludedWitels,
        not: null
      }
    }

    const applyDateFilter = (clause) => {
      if (start_date && end_date) {
        return {
          ...clause,
          AND: [
            {
              OR: [
                {
                  tanggalMom: {
                    gte: new Date(start_date),
                    lte: new Date(end_date)
                  }
                },
                {
                  createdAt: {
                    gte: new Date(start_date),
                    lte: new Date(end_date)
                  }
                }
              ]
            }
          ]
        }
      }
      return clause
    }

    // Fetch raw data; if empty with date filter, fallback to no date filter
    let rawData = await prisma.spmkMom.findMany({
      where: applyDateFilter(whereClause),
      select: {
        witelBaru: true,
        witelLama: true,
        revenuePlan: true,
        goLive: true,
        populasiNonDrop: true,
        baDrop: true,
        statusTompsLastActivity: true,
        statusIHld: true,
        statusTompsNew: true,
        poName: true
      }
    })

    if (rawData.length === 0 && start_date && end_date) {
      rawData = await prisma.spmkMom.findMany({
        where: whereClause,
        select: {
          witelBaru: true,
          witelLama: true,
          revenuePlan: true,
          goLive: true,
          populasiNonDrop: true,
          baDrop: true,
          statusTompsLastActivity: true,
          statusIHld: true,
          statusTompsNew: true
        }
      })
    }

    // Aggregate data: parent by witelBaru, child by witelLama
    const witelMap = {}
    
    // Helper for parent witel (witelBaru is already parent)
    const getParentWitel = (witelBaru) => witelBaru || 'OTHER'

    rawData.forEach(row => {
      const parent = row.witelBaru || 'Unknown'
      const child = row.witelLama || 'Unknown'
      const parentKey = parent
      const childKey = `${parent}|${child}` // unique key for parent+child combo

      // Initialize parent if not exists
      if (!witelMap[parentKey]) {
        witelMap[parentKey] = {
          witel: parent,
          parentWitel: parent,
          isParent: true,
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
        }
      }

      // Initialize child if not exists
      if (!witelMap[childKey]) {
        witelMap[childKey] = {
          witel: child,
          parentWitel: parent,
          isParent: false,
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
        }
      }

      const revenue = parseFloat(row.revenuePlan || 0)

      // Logic "Progress Deploy" (User Source: ReportJTController.php)
      // 1. Drop: populasiNonDrop='N'
      // 2. GoLive: goLive='Y' && populasiNonDrop='Y'
      // 3. Progress: goLive='N' && populasiNonDrop='Y' -> Check status_tomps_new

      const isDrop = row.populasiNonDrop === 'N'
      // If not drop, assuming populasiNonDrop is 'Y'
      const isGoLive = row.goLive === 'Y' && !isDrop

      if (isDrop) {
        witelMap[parentKey].drop++
        witelMap[childKey].drop++
        // Drop excluded from jumlahLop and revAll
      } else {
        // Non-Drop (Includes GoLive and Progress)
        witelMap[parentKey].jumlahLop++
        witelMap[parentKey].revAll += revenue
        witelMap[childKey].jumlahLop++
        witelMap[childKey].revAll += revenue

        if (isGoLive) {
          witelMap[parentKey].golive_jml++
          witelMap[parentKey].golive_rev += revenue
          witelMap[childKey].golive_jml++
          witelMap[childKey].golive_rev += revenue
          
          // ALSO count GoLive projects as "FI-OGP Live" in Progress buckets so the chart isn't empty
          witelMap[parentKey]['piOgp']++
          witelMap[childKey]['piOgp']++
        } else {
          // Progress Phase (goLive='N' && nonDrop)
          // Map status using statusIHld (contains phase info like 'Instalasi')
          // statusTompsNew usually only contains 'INPROGRESS - XX%'
          const statusText = (row.statusIHld || row.statusTompsNew || '').toUpperCase()
          let bucket = 'initial'

          if (statusText.includes('SURVEY') || statusText.includes('DRM') || statusText.includes('DESIGN')) {
            bucket = 'survey'
          } else if (statusText.includes('PERIZINAN') || statusText.includes('MOS') || statusText.includes('PERMIT') || statusText.includes('SITAC')) {
            bucket = 'perizinan'
          } else if (statusText.includes('INSTALASI') || statusText.includes('INSTALLATION') || statusText.includes('COMMTEST') || statusText.includes('UT') || statusText.includes('UJI TERIMA') || statusText.includes('CONSTRUCTION')) {
            bucket = 'instalasi'
          } else if (statusText.includes('FI') || statusText.includes('OGP') || statusText.includes('BAST') || statusText.includes('REKON') || statusText.includes('GO LIVE') || statusText.includes('GOLIVE') || statusText.includes('COMPLETED') || statusText.includes('CLOSED') || statusText.includes('LIVE')) {
            bucket = 'piOgp'
          } else {
            bucket = 'initial' // Default to Initial (including actual 'INITIAL' or unknown)
          }

          witelMap[parentKey][bucket]++
          witelMap[childKey][bucket]++
        }
      }
    })

    const formattedTableData = Object.values(witelMap)
      .sort((a, b) => {
        if (a.parentWitel < b.parentWitel) return -1
        if (a.parentWitel > b.parentWitel) return 1
        if (a.isParent && !b.isParent) return -1
        if (!a.isParent && b.isParent) return 1
        if (a.witel < b.witel) return -1
        if (a.witel > b.witel) return 1
        return 0
      })
      .map(row => ({
      ...row,
      persen_close: row.jumlahLop > 0 ? ((row.golive_jml / row.jumlah_lop) * 100).toFixed(1) + '%' : '0.0%'
    }))

    // Project data (All Non-Drop projects, including Go Live)
    // Modified to show history of longest projects regardless of status
    let projectRows = await prisma.spmkMom.findMany({
      where: {
        ...applyDateFilter(whereClause),
        populasiNonDrop: { not: 'N' }
      },
      select: {
        witelBaru: true,
        witelLama: true,
        region: true,
        revenuePlan: true,
        usia: true,
        templateDurasi: true,
        idIHld: true,
        uraianKegiatan: true,
        statusTompsLastActivity: true,
        tanggalMom: true,
        poName: true,
        goLive: true, // Need this to check status
        statusProyek: true
      }
    })

    if (projectRows.length === 0 && start_date && end_date) {
      projectRows = await prisma.spmkMom.findMany({
        where: {
          ...whereClause,
          populasiNonDrop: { not: 'N' }
        },
        select: {
          witelBaru: true,
          witelLama: true,
          region: true,
          revenuePlan: true,
          usia: true,
          templateDurasi: true,
          idIHld: true,
          uraianKegiatan: true,
          statusTompsLastActivity: true,
          tanggalMom: true,
          poName: true,
          goLive: true,
          statusProyek: true
        }
      })
    }

    const projectMap = {}
    projectRows.forEach(row => {
      const parent = row.witelBaru || 'Unknown'
      const child = row.witelLama || 'Unknown'
      const parentKey = parent
      const childKey = `${parent}|${child}`
      const usiaVal = typeof row.usia === 'number' ? row.usia : null
      const tocThreshold = row.templateDurasi ? parseInt(row.templateDurasi) : 90
      const dalamToc = usiaVal !== null && usiaVal <= tocThreshold

      // Initialize parent if not exists
      if (!projectMap[parentKey]) {
        projectMap[parentKey] = {
          witel: parent,
          parentWitel: parent,
          isParent: true,
          dalam_toc: 0,
          lewat_toc: 0,
          jumlah_lop_progress: 0,
          persen_dalam_toc: '0%'
        }
      }

      // Initialize child if not exists
      if (!projectMap[childKey]) {
        projectMap[childKey] = {
          witel: child,
          parentWitel: parent,
          isParent: false,
          dalam_toc: 0,
          lewat_toc: 0,
          jumlah_lop_progress: 0,
          persen_dalam_toc: '0%'
        }
      }

      // Count in both parent and child
      if (usiaVal !== null) {
        if (dalamToc) {
          projectMap[parentKey].dalam_toc += 1
          projectMap[childKey].dalam_toc += 1
        } else {
          projectMap[parentKey].lewat_toc += 1
          projectMap[childKey].lewat_toc += 1
        }
      }

      projectMap[parentKey].jumlah_lop_progress += 1
      projectMap[childKey].jumlah_lop_progress += 1
    })

    const projectData = Object.values(projectMap)
      .sort((a, b) => {
        if (a.parentWitel < b.parentWitel) return -1
        if (a.parentWitel > b.parentWitel) return 1
        if (a.isParent && !b.isParent) return -1
        if (!a.isParent && b.isParent) return 1
        if (a.witel < b.witel) return -1
        if (a.witel > b.witel) return 1
        return 0
      })
      .map(row => ({
      ...row,
      persen_dalam_toc: row.jumlah_lop_progress > 0
        ? `${((row.dalam_toc / row.jumlah_lop_progress) * 100).toFixed(1)}%`
        : '0%'
    }))

    // Top 3 usia per witel baru saja (tanpa witel lama)
    const topByWitel = {}
    projectRows.forEach(row => {
      const witel = row.witelBaru || 'Unknown'
      const usiaVal = typeof row.usia === 'number' ? row.usia : null
      if (usiaVal === null) return

      if (!topByWitel[witel]) topByWitel[witel] = []
      topByWitel[witel].push({
        witel,
        ihld: row.idIHld,
        nama_project: row.uraianKegiatan,
        tanggal_mom: row.tanggalMom,
        revenue: row.revenuePlan,
        status_tomps: row.statusTompsLastActivity,
        usia: usiaVal
      })
    })

    const topUsiaByWitel = Object.entries(topByWitel).map(([witel, items]) => ({
      witel,
      items: items.sort((a, b) => (b.usia || 0) - (a.usia || 0)).slice(0, 3)
    }))

    // Top 3 usia per PO dengan parent-child
    const topByPo = {}
    projectRows.forEach(row => {
      const po = row.poName || 'Unknown'
      const parent = row.witelBaru || 'Unknown'
      const child = row.witelLama || 'Unknown'
      const usiaVal = typeof row.usia === 'number' ? row.usia : null
      if (usiaVal === null) return
      if (!topByPo[po]) topByPo[po] = []
      topByPo[po].push({
        po,
        witel: parent,
        parentWitel: parent,
        childWitel: child,
        ihld: row.idIHld,
        nama_project: row.uraianKegiatan,
        tanggal_mom: row.tanggalMom,
        revenue: row.revenuePlan,
        status_tomps: row.statusTompsLastActivity,
        usia: usiaVal
      })
    })

    const topUsiaByPo = Object.entries(topByPo).map(([po, items]) => ({
      po,
      items: items.sort((a, b) => (b.usia || 0) - (a.usia || 0)).slice(0, 3)
    }))

    // --- NEW CHARTS AGGREGATION ---

    // 1. Top 10 Mitra by Revenue
    const mitraRevenueMap = {}
    rawData.forEach(row => {
      const po = (row.poName || '').trim() || 'Unknown'
      // Skip Unknown POs for the chart to keep it clean
      if (po === 'Unknown' || po === '#NAME?' || po === '#REF!') return

      const revenue = parseFloat(row.revenuePlan || 0)
      if (!mitraRevenueMap[po]) {
        mitraRevenueMap[po] = { poName: po, totalRevenue: 0, projectCount: 0 }
      }
      mitraRevenueMap[po].totalRevenue += revenue
      mitraRevenueMap[po].projectCount += 1
    })
    
    const topMitraRevenue = Object.values(mitraRevenueMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10)

    // 2. Trend Go-Live (Input vs Output)
    // Use wider date range if not specified (e.g. 12 months back) to show meaningful trend
    let trendStartDate = start_date ? new Date(start_date) : new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    let trendEndDate = end_date ? new Date(end_date) : new Date()
    
    const trendMap = {}
    
    // RE-FETCHING raw data with dates included (Optimization: could be merged with initial query but let's keep safe)
    const trendRows = await prisma.spmkMom.findMany({
      where: {
        AND: [
          {
            OR: [
              { tanggalMom: { gte: trendStartDate, lte: trendEndDate } },
              { tanggalGolive: { gte: trendStartDate, lte: trendEndDate } }
            ]
          },
          // Apply same witel exclusions as main report
          { witelBaru: { notIn: excludedWitels } }
        ]
      },
      select: {
        tanggalMom: true, // Input
        tanggalGolive: true, // Output
        goLive: true // Status needed for proxy logic
      }
    })

    trendRows.forEach(row => {
      // Input Trend (Based on MOM Date)
      if (row.tanggalMom && row.tanggalMom >= trendStartDate && row.tanggalMom <= trendEndDate) {
        const monthKey = row.tanggalMom.toISOString().slice(0, 7) // YYYY-MM
        if (!trendMap[monthKey]) trendMap[monthKey] = { month: monthKey, input: 0, output: 0 }
        trendMap[monthKey].input++
      }

      // Output Trend (Based on GoLive Date OR Proxy)
      let outputDate = row.tanggalGolive
      
      // Fallback: If Done but no date, use MOM date as proxy
      if (!outputDate && row.goLive === 'Y' && row.tanggalMom) {
        outputDate = row.tanggalMom
      }

      if (outputDate && outputDate >= trendStartDate && outputDate <= trendEndDate) {
        const monthKey = outputDate.toISOString().slice(0, 7) // YYYY-MM
        if (!trendMap[monthKey]) trendMap[monthKey] = { month: monthKey, input: 0, output: 0 }
        trendMap[monthKey].output++
      }
    })

    const trendGolive = Object.values(trendMap).sort((a, b) => a.month.localeCompare(b.month))

    // 3. Distribusi Bucket Usia (Health Check)
    // Only for NOT GoLive projects
    const bucketUsia = {
      under30: 0,
      between30and60: 0,
      between60and90: 0,
      over90: 0
    }

    projectRows.forEach(row => { // projectRows is already filtered for GoLive='N'
      const usia = typeof row.usia === 'number' ? row.usia : 0
      if (usia < 30) bucketUsia.under30++
      else if (usia <= 60) bucketUsia.between30and60++
      else if (usia <= 90) bucketUsia.between60and90++
      else bucketUsia.over90++
    })

    const bucketUsiaData = [
      { label: '< 30 Hari', count: bucketUsia.under30, color: '#22c55e' }, // Green
      { label: '30 - 60 Hari', count: bucketUsia.between30and60, color: '#eab308' }, // Yellow
      { label: '60 - 90 Hari', count: bucketUsia.between60and90, color: '#f97316' }, // Orange
      { label: '> 90 Hari', count: bucketUsia.over90, color: '#ef4444' } // Red
    ]

    successResponse(
      res,
      {
        tableData: formattedTableData,
        projectData,
        rawProjectRows: projectRows, // Send raw rows for Preview Table
        topUsiaByWitel,
        topUsiaByPo,
        topMitraRevenue,
        trendGolive,
        bucketUsiaData
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
      
      // Case 1: Single Region Selected -> Drilldown to Branches
      if (witelList.length === 1 && regionMapping[witelList[0]]) {
        selectedRegion = witelList[0]
        targetRows = regionMapping[selectedRegion]
      } 
      // Case 2: Multiple Regions Selected -> Filter the list of Major Witels
      else if (selectedWitels.length > 0) {
        targetRows = targetRows.filter(r => witelList.includes(r))
      }
    }

    // Helper to get data for a segment
    const getSegmentData = async (segmentKeywords) => {
      // Allow single string or array of strings
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
          revenue: true
        }
      })

      // Process data
      const witelMap = {}
      
      targetRows.forEach(w => {
        witelMap[w] = {
          nama_witel: w,
          in_progress_n: 0, in_progress_o: 0, in_progress_ae: 0, in_progress_ps: 0,
          prov_comp_n_realisasi: 0, prov_comp_o_realisasi: 0, prov_comp_ae_realisasi: 0, prov_comp_ps_realisasi: 0,
          revenue_n_ach: 0, revenue_n_target: 0,
          revenue_o_ach: 0, revenue_o_target: 0,
          revenue_ae_ach: 0, revenue_ae_target: 0,
          revenue_ps_ach: 0, revenue_ps_target: 0
        }
      })

      let totalOgp = 0
      let totalClosed = 0

      data.forEach(row => {
        let rawWitel = (row.witel || '').toUpperCase()
        let mappedName = null

        if (selectedRegion) {
          // Drill down logic: Check if rawWitel matches one of the branches in the selected region
          const branches = regionMapping[selectedRegion] || []
          // Find which branch this rawWitel belongs to (e.g. "KOTA MALANG" -> "MALANG")
          const foundBranch = branches.find(b => rawWitel.includes(b))
          
          if (foundBranch) {
            mappedName = foundBranch
          }
        } else {
          // Default logic: Map to Region
          // Iterate through all regions to find where this rawWitel belongs
          for (const [region, branches] of Object.entries(regionMapping)) {
            if (branches.some(b => rawWitel.includes(b))) {
              mappedName = region
              break
            }
          }
          
          // Fallback for special cases or if not found in mapping but contains region name
          if (!mappedName) {
             if (rawWitel.includes('BALI')) mappedName = 'BALI'
             else if (rawWitel.includes('JATIM BARAT')) mappedName = 'JATIM BARAT'
             else if (rawWitel.includes('JATIM TIMUR')) mappedName = 'JATIM TIMUR'
             else if (rawWitel.includes('NUSA TENGGARA')) mappedName = 'NUSA TENGGARA'
             else if (rawWitel.includes('SURAMADU')) mappedName = 'SURAMADU'
          }
        }
        
        if (!mappedName || !witelMap[mappedName]) return 

        let productCode = ''
        const pName = (row.productName || '').toLowerCase()
        if (pName.includes('netmonk')) productCode = 'n'
        else if (pName.includes('oca')) productCode = 'o'
        else if (pName.includes('antares') || pName.includes('camera') || pName.includes('cctv') || pName.includes('iot') || pName.includes('recording')) productCode = 'ae'
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
          witelMap[mappedName][`revenue_${productCode}_ach`] += parseFloat(row.revenue || 0) / 1000000 // Convert to Juta
          totalClosed++
        }
      })

      return {
        data: Object.values(witelMap),
        details: {
          total: totalOgp + totalClosed,
          ogp: totalOgp,
          closed: totalClosed
        }
      }
    }

    const legsData = await getSegmentData(['LEGS', 'DGS', 'DPS', 'GOV', 'ENTERPRISE', 'REG']) 
    const smeData = await getSegmentData(['SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE'])

    successResponse(
      res,
      {
        legs: legsData.data,
        sme: smeData.data,
        detailsLegs: legsData.details,
        detailsSme: smeData.details
      },
      'Report Analysis data retrieved successfully'
    )
  } catch (error) {
    next(error)
  }
}

// REPORT HSI (MIGRATED FROM LARAVEL)
// ==========================================

// Helper: Fetch HSI Data (Shared by View and Export)
const fetchHSIReportData = async (start_date, end_date) => {
    const RSO2_WITELS = ['JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'BALI', 'NUSA TENGGARA']

    // Base conditions
    const conditions = [`UPPER(witel) IN (${RSO2_WITELS.map(w => `'${w.toUpperCase()}'`).join(',')})`]
    
    // Filter by Date
    if (start_date && end_date) {
      conditions.push(`order_date >= '${start_date}'::date`)
      conditions.push(`order_date < ('${end_date}'::date + INTERVAL '1 day')`)
    }

    const whereSql = `WHERE ${conditions.join(' AND ')}`

    const query = `
      SELECT
        witel,
        witel_old,
        
        -- 1. PRE PI
        SUM(CASE WHEN kelompok_status = 'PRE PI' THEN 1 ELSE 0 END) as pre_pi,
        
        -- 2. REGISTERED (RE)
        COUNT(*) as registered,
        
        -- 3. INPROGRESS SC
        SUM(CASE WHEN kelompok_status = 'INPROGRESS_SC' THEN 1 ELSE 0 END) as inprogress_sc,
        
        -- 4. QC1
        SUM(CASE WHEN kelompok_status = 'QC1' THEN 1 ELSE 0 END) as qc1,
        
        -- 5. FCC
        SUM(CASE WHEN kelompok_status = 'FCC' THEN 1 ELSE 0 END) as fcc,
        
        -- 6. CANCEL BY FCC
        SUM(CASE WHEN kelompok_status = 'REJECT_FCC' THEN 1 ELSE 0 END) as cancel_by_fcc,
        
        -- 7. SURVEY NEW MANJA
        SUM(CASE WHEN kelompok_status = 'SURVEY_NEW_MANJA' THEN 1 ELSE 0 END) as survey_new_manja,
        
        -- 8. UN-SC
        SUM(CASE WHEN kelompok_status = 'UNSC' THEN 1 ELSE 0 END) as un_sc,
        
        -- PI AGING (Based on last_updated_date)
        SUM(CASE WHEN kelompok_status = 'PI' AND (EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600) < 24 THEN 1 ELSE 0 END) as pi_under_1_hari,
        SUM(CASE WHEN kelompok_status = 'PI' AND (EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600) >= 24 AND (EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600) <= 72 THEN 1 ELSE 0 END) as pi_1_3_hari,
        SUM(CASE WHEN kelompok_status = 'PI' AND (EXTRACT(EPOCH FROM (NOW() - last_updated_date))/3600) > 72 THEN 1 ELSE 0 END) as pi_over_3_hari,
        SUM(CASE WHEN kelompok_status = 'PI' THEN 1 ELSE 0 END) as total_pi,

        -- FALLOUT WFM
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Pelanggan' THEN 1 ELSE 0 END) as fo_wfm_kndl_plgn,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Teknik' THEN 1 ELSE 0 END) as fo_wfm_kndl_teknis,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND kelompok_kendala = 'Kendala Lainnya' THEN 1 ELSE 0 END) as fo_wfm_kndl_sys,
        SUM(CASE WHEN kelompok_status = 'FO_WFM' AND (kelompok_kendala IS NULL OR kelompok_kendala = '' OR kelompok_kendala = 'BLANK') THEN 1 ELSE 0 END) as fo_wfm_others,
        
        -- OTHER FALLOUTS
        SUM(CASE WHEN kelompok_status = 'FO_UIM' THEN 1 ELSE 0 END) as fo_uim,
        SUM(CASE WHEN kelompok_status = 'FO_ASAP' THEN 1 ELSE 0 END) as fo_asp,
        SUM(CASE WHEN kelompok_status = 'FO_OSM' THEN 1 ELSE 0 END) as fo_osm,
        
        -- TOTAL FALLOUT
        SUM(CASE WHEN kelompok_status IN ('FO_UIM', 'FO_ASAP', 'FO_OSM', 'FO_WFM') THEN 1 ELSE 0 END) as total_fallout,

        -- COMPLETION
        SUM(CASE WHEN kelompok_status = 'ACT_COM' THEN 1 ELSE 0 END) as act_comp,
        SUM(CASE WHEN kelompok_status = 'PS' THEN 1 ELSE 0 END) as jml_comp_ps,

        -- CANCEL DETAILS
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Pelanggan' THEN 1 ELSE 0 END) as cancel_kndl_plgn,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Teknik' THEN 1 ELSE 0 END) as cancel_kndl_teknis,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND kelompok_kendala = 'Kendala Lainnya' THEN 1 ELSE 0 END) as cancel_kndl_sys,
        SUM(CASE WHEN kelompok_status = 'CANCEL' AND (kelompok_kendala IS NULL OR kelompok_kendala = '' OR kelompok_kendala = 'BLANK') THEN 1 ELSE 0 END) as cancel_others,
        SUM(CASE WHEN kelompok_status = 'CANCEL' THEN 1 ELSE 0 END) as total_cancel,

        -- REVOKE
        SUM(CASE WHEN kelompok_status = 'REVOKE' THEN 1 ELSE 0 END) as revoke

      FROM hsi_data
      ${whereSql}
      GROUP BY witel, witel_old
      ORDER BY witel, witel_old
    `

    const rawData = await prisma.$queryRawUnsafe(query)

    // --- Process Logic in JS ---
    const numericFields = [
      'pre_pi', 'registered', 'inprogress_sc', 'qc1', 'fcc', 'cancel_by_fcc', 'survey_new_manja', 'un_sc',
      'pi_under_1_hari', 'pi_1_3_hari', 'pi_over_3_hari', 'total_pi',
      'fo_wfm_kndl_plgn', 'fo_wfm_kndl_teknis', 'fo_wfm_kndl_sys', 'fo_wfm_others',
      'fo_uim', 'fo_asp', 'fo_osm', 'total_fallout',
      'act_comp', 'jml_comp_ps',
      'cancel_kndl_plgn', 'cancel_kndl_teknis', 'cancel_kndl_sys', 'cancel_others', 'total_cancel',
      'revoke'
    ]

    const calculatePercentages = (item) => {
        const val = (k) => Number(item[k] || 0)
        const num_pire = val('total_pi') + val('total_fallout') + val('act_comp') + val('jml_comp_ps') + val('total_cancel');
        item.pi_re_percent = val('registered') > 0 ? ((num_pire / val('registered')) * 100).toFixed(2) : 0;

        const denom_psre = val('registered') - val('cancel_by_fcc') - val('un_sc') - val('revoke');
        item.ps_re_percent = denom_psre > 0 ? ((val('jml_comp_ps') / denom_psre) * 100).toFixed(2) : 0;

        const denom_pspi = val('total_pi') + val('total_fallout') + val('act_comp') + val('jml_comp_ps');
        item.ps_pi_percent = denom_pspi > 0 ? ((val('jml_comp_ps') / denom_pspi) * 100).toFixed(2) : 0;
    };

    const grouped = {}
    rawData.forEach(row => {
      const witel = row.witel
      if (!grouped[witel]) {
        grouped[witel] = {
          witel_display: witel,
          witel: witel,
          row_type: 'main',
          children: []
        }
        numericFields.forEach(f => grouped[witel][f] = 0)
      }

      const cleanRow = {}
      for (const [k, v] of Object.entries(row)) cleanRow[k] = typeof v === 'bigint' ? Number(v) : v
      
      cleanRow.witel_display = cleanRow.witel_old || '(Blank)'
      cleanRow.row_type = 'sub'
      calculatePercentages(cleanRow)
      grouped[witel].children.push(cleanRow)

      numericFields.forEach(f => grouped[witel][f] += (cleanRow[f] || 0))
    })

    const finalReportData = []
    const grandTotal = { witel_display: 'GRAND TOTAL', row_type: 'total' }
    numericFields.forEach(f => grandTotal[f] = 0)

    Object.values(grouped).forEach(parent => {
      calculatePercentages(parent)
      finalReportData.push(parent)
      numericFields.forEach(f => grandTotal[f] += parent[f])
      parent.children.forEach(child => finalReportData.push(child))
      delete parent.children
    })

    calculatePercentages(grandTotal)

    return { tableData: finalReportData, totals: grandTotal }
}

// Get Report HSI - from HSI data table
export const getReportHSI = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query
    const data = await fetchHSIReportData(start_date, end_date)
    successResponse(res, data, 'Report HSI data retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get Report Details - Detailed list
export const getReportDetails = async (req, res, next) => {
  try {
    const { start_date, end_date, segment, witel, status } = req.query

    let whereClause = {}
    if (start_date && end_date) {
      whereClause.orderDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    if (segment) {
      const segmentList = segment.split(',').map(s => s.trim()).filter(s => s)
      if (segmentList.length > 0) {
        // Expand 'SME' to include its sub-segments
        const expandedSegments = []
        segmentList.forEach(s => {
          if (s.toUpperCase() === 'SME') {
            expandedSegments.push('SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE')
          } else if (s.toUpperCase() === 'LEGS') {
            expandedSegments.push('LEGS', 'DGS', 'DPS', 'GOV', 'ENTERPRISE', 'REG')
          } else {
            expandedSegments.push(s)
          }
        })

        whereClause.OR = expandedSegments.map(s => ({
          segment: { contains: s, mode: 'insensitive' }
        }))
      }
    }

    if (witel) {
      const selectedRegions = witel.split(',').map(w => w.trim()).filter(w => w)
      
      if (selectedRegions.length > 0) {
        // Mapping Region to Witel Cities
        const regionMapping = {
          'BALI': ['GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'Non-Telda (NCX)', 'SANUR', 'SINGARAJA', 'TABANAN', 'UBUNG'],
          'JATIM BARAT': ['BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'Non-Telda (NCX)', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG'],
          'JATIM TIMUR': ['BANYUWANGI', 'BONDOWOSO', 'INNER - JATIM TIMUR', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'Non-Telda (NCX)', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO'],
          'NUSA TENGGARA': ['ATAMBUA', 'BIMA', 'ENDE', 'INNER - NUSA TENGGARA', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'Non-Telda (NCX)', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU'],
          'SURAMADU': ['BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'Non-Telda (NCX)', 'PAMEKASAN', 'TANDES']
        }

        let targetWitels = []
        
        selectedRegions.forEach(region => {
          if (regionMapping[region]) {
            targetWitels = [...targetWitels, ...regionMapping[region]]
          } else {
            // If not a known region, assume it's a direct witel name
            targetWitels.push(region)
          }
        })

        if (targetWitels.length > 0) {
          whereClause.witel = { in: targetWitels }
        }
      }
    }

    // Filter for relevant products (Netmonk, OCA, Antares, Pijar)
    const productFilter = {
      OR: [
        { productName: { contains: 'netmonk', mode: 'insensitive' } },
        { productName: { contains: 'oca', mode: 'insensitive' } },
        { productName: { contains: 'antares', mode: 'insensitive' } },
        { productName: { contains: 'camera', mode: 'insensitive' } },
        { productName: { contains: 'cctv', mode: 'insensitive' } },
        { productName: { contains: 'iot', mode: 'insensitive' } },
        { productName: { contains: 'recording', mode: 'insensitive' } },
        { productName: { contains: 'pijar', mode: 'insensitive' } }
      ]
    }

    let statusFilter = {}
    if (status) {
      const statusList = status.split(',').map(s => s.trim()).filter(s => s)
      if (statusList.length > 0) {
        statusFilter = {
          OR: statusList.map(s => ({ status: { contains: s, mode: 'insensitive' } }))
        }
      }
    }

    // Construct final where clause
    const finalWhere = {
      AND: [
        whereClause,
        productFilter
      ]
    }

    if (Object.keys(statusFilter).length > 0) {
      finalWhere.AND.push(statusFilter)
    }

    const data = await prisma.digitalProduct.findMany({
      where: finalWhere,
      select: {
        orderNumber: true,
        productName: true,
        witel: true,
        customerName: true,
        milestone: true,
        orderDate: true,
        segment: true,
        batchId: true,
        subType: true,
        status: true,
        revenue: true,
        category: true,
      },
      orderBy: {
        orderDate: 'desc'
      }
    })

    const getWeekNumber = (d) => {
      if (!d) return null;
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      return weekNo;
    }

    const formattedData = data.map(row => {
      // Product Name Shortening
      let shortProductName = row.productName || '-'
      const pNameLower = shortProductName.toLowerCase()
      
      if (pNameLower.includes('netmonk')) shortProductName = 'Netmonk'
      else if (pNameLower.includes('oca')) shortProductName = 'OCA'
      else if (pNameLower.includes('pijar')) shortProductName = 'Pijar'
      else if (pNameLower.includes('antares') || pNameLower.includes('iot') || pNameLower.includes('camera') || pNameLower.includes('cctv') || pNameLower.includes('recording')) shortProductName = 'Antares'
      
      // Channel Logic
      let channel = 'SC-ONE'
      if ((row.witel && row.witel.includes('NCX')) || (row.branch && row.branch.includes('NCX'))) {
        channel = 'NCX'
      }

      return {
        order_id: row.orderNumber,
        product_name: shortProductName,
        witel: row.witel,
        customer_name: row.customerName,
        milestone: row.milestone,
        order_created_date: row.orderDate,
        segment: row.segment,
        branch: row.witel, // Using witel as proxy for branch
        batch_id: row.batchId,
        order_subtype: row.subType,
        order_status: row.status,
        net_price: parseFloat(row.revenue || 0),
        week: getWeekNumber(row.orderDate),
        channel: channel, 
        layanan: row.category
      }
    })

    successResponse(res, formattedData, 'Report details retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get KPI PO Data
export const getKPIPOData = async (req, res, next) => {
  try {
    const { start_date, end_date, witel } = req.query

    // 1. Fetch Account Officers
    const accountOfficers = await prisma.accountOfficer.findMany({
      orderBy: { name: 'asc' }
    })

    if (!accountOfficers || accountOfficers.length === 0) {
      return successResponse(res, [], 'No Account Officers found')
    }

    // 2. Build Date Filter
    let whereClause = {}
    if (start_date && end_date) {
      whereClause.orderDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    // 3. Filter for relevant products
    const productFilter = {
      OR: [
        { productName: { contains: 'netmonk', mode: 'insensitive' } },
        { productName: { contains: 'oca', mode: 'insensitive' } },
        { productName: { contains: 'antares', mode: 'insensitive' } },
        { productName: { contains: 'camera', mode: 'insensitive' } },
        { productName: { contains: 'cctv', mode: 'insensitive' } },
        { productName: { contains: 'iot', mode: 'insensitive' } },
        { productName: { contains: 'recording', mode: 'insensitive' } },
        { productName: { contains: 'pijar', mode: 'insensitive' } }
      ]
    }

    // 4. Fetch Digital Product Data
    const digitalData = await prisma.digitalProduct.findMany({
      where: {
        AND: [
          whereClause,
          productFilter
        ]
      },
      select: {
        witel: true,
        status: true,
        productName: true,
        segment: true // Needed for special filter
      }
    })

    // 5. Process Data
    const result = accountOfficers.map(ao => {
      // Filter data for this AO
      const relevantData = digitalData.filter(row => {
        // 1. Witel Filter
        const filterWitels = (ao.filterWitelLama || '').split(',').map(s => s.trim().toLowerCase())
        const rowWitel = (row.witel || '').toLowerCase()
        
        if (filterWitels.length === 0 || (filterWitels.length === 1 && filterWitels[0] === '')) {
           return false
        }

        const witelMatch = filterWitels.some(f => rowWitel.includes(f))
        
        // 2. Special Filter (if exists)
        let specialMatch = true
        if (ao.specialFilterColumn && ao.specialFilterValue) {
           const col = ao.specialFilterColumn // e.g. 'segment'
           const val = ao.specialFilterValue // e.g. 'SME'
           
           // Check if row has this column
           // Note: In Prisma result, 'segment' is the property name for segment
           const rowCol = col === 'segment' ? 'segment' : col

           if (row[rowCol] === undefined) {
             specialMatch = false
           } else {
             const rowVal = (row[rowCol] || '').toLowerCase()
             if (!rowVal.includes(val.toLowerCase())) {
               specialMatch = false
             }
           }
        }

        return witelMatch && specialMatch
      })

      // Calculate Metrics
      let done_ncx = 0
      let done_scone = 0
      let ogp_ncx = 0
      let ogp_scone = 0

      relevantData.forEach(row => {
        const isNcx = row.witel && row.witel.toUpperCase().includes('NCX')
        const statusLower = (row.status || '').toLowerCase()
        const isDone = ['completed', 'activated', 'live', 'closed', 'done'].some(s => statusLower.includes(s))

        if (isDone) {
          if (isNcx) done_ncx++
          else done_scone++
        } else {
          if (isNcx) ogp_ncx++
          else ogp_scone++
        }
      })

      const total = done_ncx + done_scone + ogp_ncx + ogp_scone
      const ach_ytd = total > 0 ? ((done_ncx + done_scone) / total * 100).toFixed(1) : 0
      const ach_q3 = 0 // Placeholder

      return {
        nama_po: ao.name,
        witel: ao.displayWitel,
        done_ncx,
        done_scone,
        ogp_ncx,
        ogp_scone,
        total,
        ach_ytd,
        ach_q3
      }
    })

    // 5. Apply Witel Filter from Query (if provided)
    let finalResult = result
    if (witel) {
      const selectedWitels = witel.split(',').map(w => w.trim().toLowerCase())
      finalResult = result.filter(r => selectedWitels.includes(r.witel.toLowerCase()))
    }

    successResponse(res, finalResult, 'KPI PO data retrieved successfully')
  } catch (error) {
    next(error)
  }
}

// Get Report Datin Details - from SosData
export const getReportDatinDetails = async (req, res, next) => {
  try {
    const { start_date, end_date, witel, segment, kategori, search, page = 1, limit = 10 } = req.query

    let whereClause = {}

    // Date Filter (using orderCreatedDate)
    if (start_date && end_date) {
      // Parse DD/MM/YYYY to Date object
      const parseDate = (dateStr) => {
        if (!dateStr) return null
        const parts = dateStr.split('/')
        if (parts.length === 3) {
           return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
        }
        return new Date(dateStr)
      }
      
      const startDateObj = parseDate(start_date)
      const endDateObj = parseDate(end_date)

      if (startDateObj && !isNaN(startDateObj) && endDateObj && !isNaN(endDateObj)) {
        // Set end date to end of day
        endDateObj.setHours(23, 59, 59, 999)
        
        whereClause.orderCreatedDate = {
          gte: startDateObj,
          lte: endDateObj
        }
      }
    }

    // Witel Filter
    if (witel && !witel.includes('Pilih Witel')) {
       whereClause.custWitel = { contains: witel, mode: 'insensitive' }
    }

    // Segment Filter
    if (segment && !segment.includes('Pilih Segmen')) {
       whereClause.segmen = { contains: segment, mode: 'insensitive' }
    }

    // Kategori Filter
    if (kategori && !kategori.includes('Pilih Kategori')) {
       whereClause.kategori = { contains: kategori, mode: 'insensitive' }
    }

    // Search Filter
    if (search) {
      whereClause.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
        { standardName: { contains: search, mode: 'insensitive' } },
        { liProductName: { contains: search, mode: 'insensitive' } }
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit)

    const [data, total] = await Promise.all([
      prisma.sosData.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { orderCreatedDate: 'desc' }
      }),
      prisma.sosData.count({ where: whereClause })
    ])

    const formattedData = data.map(row => ({
      orderId: row.orderId,
      orderDate: row.orderCreatedDate ? row.orderCreatedDate.toISOString().split('T')[0] : '-',
      nipnas: row.nipnas,
      name: row.standardName,
      produk: row.liProductName,
      revenue: parseFloat(row.revenue || 0),
      segmen: row.segmen,
      subSegmen: row.subSegmen,
      kategori: row.kategori,
      
      // Detailed Fields
      kategoriUmur: row.kategoriUmur,
      umurOrder: row.umurOrder,
      lamaKontrak: row.lamaKontrakHari,
      amortisasi: row.amortisasi,
      
      billWitel: row.billWitel,
      custWitel: row.custWitel,
      serviceWitel: row.serviceWitel,
      witelBaru: row.witelBaru || row.custWitel, // Fallback if witelBaru empty
      
      billCity: row.billCity,
      custCity: row.custCity,
      servCity: row.servCity,
      
      status: row.liStatus,
      milestone: row.liMilestone,
      statusDate: row.liStatusDate ? row.liStatusDate.toISOString().split('T')[0] : '-',
      billDate: row.liBilldate ? row.liBilldate.toISOString().split('T')[0] : '-',
      
      biayaPasang: parseFloat(row.biayaPasang || 0),
      hargaBulanan: parseFloat(row.hrgBulanan || 0),
      
      tipeOrder: row.actionCd || row.tipeOrder || row.agreeType, // Prioritize Action CD
      agreeType: row.agreeType,
      agreeStartDate: row.agreeStartDate ? row.agreeStartDate.toISOString().split('T')[0] : '-',
      agreeEndDate: row.agreeEndDate ? row.agreeEndDate.toISOString().split('T')[0] : '-',
      isTermin: row.isTermin,
      
      poName: row.poName,
      segmenBaru: row.segmenBaru,
      kategoriBaru: row.kategoriBaru,
      tipeGrup: row.tipeGrup,
      scalling1: row.scalling1,
      scalling2: row.scalling2
    }))

    successResponse(res, {
      data: formattedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, 'Report Datin Details retrieved successfully')

  } catch (error) {
    next(error)
  }
}

// Get Report Datin Summary - Aggregated for ReportsDatin.js
export const getReportDatinSummary = async (req, res, next) => {
  try {
    const { start_date, end_date, witel: witelFilter } = req.query

    let whereClause = {}

    if (start_date && end_date) {
      const parseDate = (dateStr) => {
        if (!dateStr) return null
        const parts = dateStr.split('-') // Expecting YYYY-MM-DD from frontend
        if (parts.length === 3) {
           return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`)
        }
        return new Date(dateStr)
      }
      
      const startDateObj = parseDate(start_date)
      const endDateObj = parseDate(end_date)

      if (startDateObj && !isNaN(startDateObj) && endDateObj && !isNaN(endDateObj)) {
        endDateObj.setHours(23, 59, 59, 999)
        whereClause.orderCreatedDate = {
          gte: startDateObj,
          lte: endDateObj
        }
      }
    }

    // Mapping Constants
    const witelMappings = {
      'BALI': ['DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG'],
      'JATIM BARAT': ['KEDIRI', 'MADIUN', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEPANJEN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG'],
      'JATIM TIMUR': ['JEMBER', 'PASURUAN', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PROBOLINGGO', 'SITUBONDO'],
      'NUSA TENGGARA': ['NTT', 'NTB', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA'],
      'SURAMADU': ['SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES']
    }

    const data = await prisma.sosData.findMany({
      where: whereClause,
      select: {
        segmen: true,
        custWitel: true,
        custCity: true,
        serviceWitel: true,
        orderCreatedDate: true,
        actionCd: true,
        liStatus: true,
        revenue: true,
        poName: true,
        nipnas: true
      }
    })

    // Helper Functions
    const getCategory = (segmen) => {
      const s = (segmen || '').toUpperCase()
      // SOE check first to catch "State-Owned Enterprise" before it matches "Enterprise" in GOV
      if (['BUMN', 'SOE', 'STATE-OWNED'].some(k => s.includes(k))) return 'SOE'
      if (['SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE', 'REGIONAL', 'REG'].some(k => s.includes(k))) return 'SME'
      if (['GOV', 'LEGS', 'DGS', 'DPS', 'ENTERPRISE'].some(k => s.includes(k))) return 'GOV'
      return 'PRIVATE'
    }

    // Determine Grouping Strategy
    let targetWitels = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']
    let isBranchMode = false

    if (witelFilter) {
      const selected = witelFilter.split(',').filter(w => w.trim() !== '')
      
      // Case 1: Single Region Selected -> Drilldown to Branches
      if (selected.length === 1 && witelMappings[selected[0]]) {
        targetWitels = witelMappings[selected[0]]
        isBranchMode = true
      } 
      // Case 2: Multiple Regions Selected -> Filter the list of Major Witels
      else if (selected.length > 0) {
        // Filter targetWitels to only keep the selected ones
        // Note: Use the original list as source of truth for valid regions
        const originalRegions = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']
        const validSelections = selected.filter(s => originalRegions.includes(s))
        
        if (validSelections.length > 0) {
          targetWitels = validSelections
        }
      }
    }

    const getWitelKey = (witelStr) => {
      const w = (witelStr || '').toUpperCase()
      
      // If filtering by specific witel (e.g. BALI), we map to the exact branch (e.g. DENPASAR)
      if (isBranchMode) {
        // Find which branch it matches in the selected list
        const match = targetWitels.find(k => w.includes(k))
        return match || 'OTHER'
      }

      // Default: Map to Major Witel (Frontend witelList: BALI, JATIM BARAT, JATIM TIMUR, NUSA TENGGARA, SURAMADU)
      if (['BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG'].some(k => w.includes(k))) return 'BALI'
      if (['JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEPANJEN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG'].some(k => w.includes(k))) return 'JATIM BARAT'
      if (['JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PROBOLINGGO', 'SITUBONDO'].some(k => w.includes(k))) return 'JATIM TIMUR'
      if (['NUSA TENGGARA', 'NTT', 'NTB', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA'].some(k => w.includes(k))) return 'NUSA TENGGARA'
      if (['SURAMADU', 'SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES'].some(k => w.includes(k))) return 'SURAMADU'
      
      // Fallback: Check if the string itself contains the major region names
      if (w.includes('BALI')) return 'BALI'
      if (w.includes('BARAT')) return 'JATIM BARAT'
      if (w.includes('TIMUR')) return 'JATIM TIMUR'
      if (w.includes('NUSA') || w.includes('NTB') || w.includes('NTT')) return 'NUSA TENGGARA'
      if (w.includes('SURAMADU') || w.includes('MADURA') || w.includes('SURABAYA')) return 'SURAMADU'

      return 'OTHER'
    }

    const getOrderType = (actionCd) => {
      const a = (actionCd || '').toUpperCase()
      if (a.startsWith('A') || a.startsWith('NEW') || a.startsWith('INST')) return 'AO' // Add -> AO
      if (a.startsWith('S')) return 'SO' // Suspend -> SO
      if (a.startsWith('D') || a.startsWith('TERM')) return 'DO' // Delete -> DO
      if (a.startsWith('M') || a.startsWith('U') || a.startsWith('CH')) return 'MO' // Modify/Move/Update/Change -> MO
      if (a.startsWith('R')) return 'RO' // Resume -> RO
      return 'OTHER'
    }

    // Helper to normalize PO name - just uppercase, nothing else
    const normalizePOName = (poName) => {
      if (!poName) return null
      const trimmed = (poName || '').trim()
      return trimmed.length > 0 ? trimmed.toUpperCase() : null
    }

    const getStatusGroup = (status) => {
      const s = (status || '').toUpperCase()
      if (s.includes('PROVIDE')) return 'PROVIDE_ORDER'
      if (s.includes('BILL') || s.includes('COMPLETED') || s.includes('CLOSED') || s.includes('LIVE')) return 'READY_BILL'
      return 'IN_PROCESS'
    }

    // Initialize Data Structures
    const categories = ['SME', 'GOV', 'PRIVATE', 'SOE']
    
    // Table 1 Structure
    const table1Map = {}
    categories.forEach(cat => {
      table1Map[cat] = {
        category: cat,
        witels: {}
      }
      targetWitels.forEach(w => {
        table1Map[cat].witels[w] = {
          ao_3bln: 0, est_ao_3bln: 0,
          so_3bln: 0, est_so_3bln: 0,
          do_3bln: 0, est_do_3bln: 0,
          mo_3bln: 0, est_mo_3bln: 0,
          ro_3bln: 0, est_ro_3bln: 0,
          total_3bln: 0, est_3bln: 0,

          ao_3bln2: 0, est_ao_3bln2: 0,
          so_3bln2: 0, est_so_3bln2: 0,
          do_3bln2: 0, est_do_3bln2: 0,
          mo_3bln2: 0, est_mo_3bln2: 0,
          ro_3bln2: 0, est_ro_3bln2: 0,
          total_3bln2: 0, est_3bln2: 0,

          grand_total: 0
        }
      })
    })

    // Table 2 Structure
    const table2Map = {}
    categories.forEach(cat => {
      table2Map[cat] = {
        category: cat,
        witels: {}
      }
      targetWitels.forEach(w => {
        table2Map[cat].witels[w] = {
          provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0,
          provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0,
          grand_total: 0
        }
      })
    })

    // Galaksi Structure
    const galaksiMap = {}

    // Process Data
    const now = new Date()
    
    data.forEach(row => {
      const category = getCategory(row.segmen)
      
      // Process Galaksi FIRST (before witel validation skip)
      const orderDate = row.orderCreatedDate ? new Date(row.orderCreatedDate) : now
      const diffTime = Math.abs(now - orderDate)
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)) 
      const isLessThan3Months = diffMonths <= 3
      const orderType = getOrderType(row.actionCd)
      
      // Update Galaksi - process this BEFORE witel validation
      let poKey = row.poName

      // If poName is not available, try to map from NIPNAS
      if (!poKey && row.nipnas) {
         const mappedName = PO_MAPPING[row.nipnas]
         if (mappedName) {
            poKey = mappedName
         }
      }

      // Only process if we have a valid PO name
      if (poKey) {
        const poName = normalizePOName(poKey)
        
        if (poName) {
          if (!galaksiMap[poName]) {
            galaksiMap[poName] = {
               po: poName,
               ao_3bln: 0, so_3bln: 0, do_3bln: 0, mo_3bln: 0, ro_3bln: 0, total_3bln: 0,
               ao_3bln2: 0, so_3bln2: 0, do_3bln2: 0, mo_3bln2: 0, ro_3bln2: 0, total_3bln2: 0
            }
          }
          
          const g = galaksiMap[poName]
          if (isLessThan3Months) {
            if (orderType === 'AO') g.ao_3bln++
            else if (orderType === 'SO') g.so_3bln++
            else if (orderType === 'DO') g.do_3bln++
            else if (orderType === 'MO') g.mo_3bln++
            else if (orderType === 'RO') g.ro_3bln++
            
            g.total_3bln++
          } else {
            if (orderType === 'AO') g.ao_3bln2++
            else if (orderType === 'SO') g.so_3bln2++
            else if (orderType === 'DO') g.do_3bln2++
            else if (orderType === 'MO') g.mo_3bln2++
            else if (orderType === 'RO') g.ro_3bln2++
            
            g.total_3bln2++
          }
        }
      }
      
      // ============ NOW do witel validation for tables 1 & 2 ============
      // Try to resolve Witel/Branch from most specific source (City) to least specific (Region)
      // Check City first (often contains granular branch data like 'Denpasar', 'Malang')
      let witel = getWitelKey(row.custCity)
      
      if (row.custCity && (row.custCity.includes('MADIUN') || row.custCity.includes('KEDIRI'))) {
          // console.log(`DEBUG: City=${row.custCity}, ResolvedWitel=${witel}, isBranchMode=${isBranchMode}`)
      }

      // If City didn't yield a valid branch (returned OTHER) or just returned the generic Region name
      // Try the Witel columns
      const isGeneric = (w) => ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU'].includes(w)
      
      if (witel === 'OTHER') {
         witel = getWitelKey(row.serviceWitel || row.custWitel)
      } else if (isBranchMode && isGeneric(witel)) {
         // If City returned a generic name (unlikely but possible), see if Witel col has something different?
         // Actually usually if City is generic, Witel is also generic. 
         // But let's check just in case Witel has a specific override (unlikely).
         const alt = getWitelKey(row.serviceWitel || row.custWitel)
         if (alt !== 'OTHER' && !isGeneric(alt)) {
             witel = alt
         }
      }
      
      if (witel === 'OTHER') return // Skip unknown witels for table processing

      const orderDate2 = row.orderCreatedDate ? new Date(row.orderCreatedDate) : now
      const diffTime2 = Math.abs(now - orderDate2)
      const diffMonths2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24 * 30)) 
      const isLessThan3Months2 = diffMonths2 <= 3
      const orderType2 = getOrderType(row.actionCd)

      const status = getStatusGroup(row.liStatus)
      const revenue = parseFloat(row.revenue || 0)

      // Update Table 1
      const t1 = table1Map[category].witels[witel]
      if (t1) {
        if (isLessThan3Months2) {
          if (orderType2 === 'AO') { 
            t1.ao_3bln++; t1.est_ao_3bln += revenue;
            t1.est_3bln += revenue; t1.total_3bln++;
          }
          else if (orderType2 === 'DO') { 
            t1.do_3bln++; t1.est_do_3bln += revenue;
            t1.est_3bln += revenue; t1.total_3bln++;
          }
          else if (orderType2 === 'MO') { 
            t1.mo_3bln++; t1.est_mo_3bln += revenue;
            t1.est_3bln += revenue; t1.total_3bln++;
          }
          else if (orderType2 === 'SO') { t1.so_3bln++; t1.est_so_3bln += revenue; }
          else if (orderType2 === 'RO') { t1.ro_3bln++; t1.est_ro_3bln += revenue; }
          
          // Grand Total should match visible total for consistency
          if (['AO', 'DO', 'MO'].includes(orderType2)) {
             t1.grand_total++
          }
        } else {
          if (orderType2 === 'AO') { 
            t1.ao_3bln2++; t1.est_ao_3bln2 += revenue;
            t1.est_3bln2 += revenue; t1.total_3bln2++;
          }
          else if (orderType2 === 'DO') { 
            t1.do_3bln2++; t1.est_do_3bln2 += revenue;
            t1.est_3bln2 += revenue; t1.total_3bln2++;
          }
          else if (orderType2 === 'MO') { 
            t1.mo_3bln2++; t1.est_mo_3bln2 += revenue;
            t1.est_3bln2 += revenue; t1.total_3bln2++;
          }
          else if (orderType2 === 'SO') { t1.so_3bln2++; t1.est_so_3bln2 += revenue; }
          else if (orderType2 === 'RO') { t1.ro_3bln2++; t1.est_ro_3bln2 += revenue; }
          
          if (['AO', 'DO', 'MO'].includes(orderType2)) {
             t1.grand_total++
          }
        }
      }

      // Update Table 2
      const t2 = table2Map[category].witels[witel]
      if (t2) {
        if (isLessThan3Months2) {
          if (status === 'PROVIDE_ORDER') t2.provide_order++
          else if (status === 'IN_PROCESS') t2.in_process++
          else if (status === 'READY_BILL') t2.ready_bill++
          
          t2.total_3bln++
        } else {
          if (status === 'PROVIDE_ORDER') t2.provide_order2++
          else if (status === 'IN_PROCESS') t2.in_process2++
          else if (status === 'READY_BILL') t2.ready_bill2++
          
          t2.total_3bln2++
        }
        t2.grand_total++
      }
    })

    // Format Output for Frontend
    const table1Data = []
    const table2Data = []
    let idCounter = 1

    categories.forEach(cat => {
      // Header Row for Category
      const catHeader1 = {
        id: idCounter++,
        category: cat,
        witel: '',
        ao_3bln: 0, est_ao_3bln: 0, so_3bln: 0, est_so_3bln: 0, do_3bln: 0, est_do_3bln: 0, mo_3bln: 0, est_mo_3bln: 0, ro_3bln: 0, est_ro_3bln: 0, est_3bln: 0, total_3bln: 0,
        ao_3bln2: 0, est_ao_3bln2: 0, so_3bln2: 0, est_so_3bln2: 0, do_3bln2: 0, est_do_3bln2: 0, mo_3bln2: 0, est_mo_3bln2: 0, ro_3bln2: 0, est_ro_3bln2: 0, est_3bln2: 0, total_3bln2: 0,
        grand_total: 0,
        isCategoryHeader: true
      }
      
      const catHeader2 = {
        id: idCounter++,
        witel: cat, // In Table 2, category is shown in witel column for header
        provide_order: 0, in_process: 0, ready_bill: 0, total_3bln: 0,
        provide_order2: 0, in_process2: 0, ready_bill2: 0, total_3bln2: 0,
        grand_total: 0,
        isCategoryHeader: true
      }

      const witelRows1 = []
      const witelRows2 = []

      targetWitels.forEach(w => {
        const d1 = table1Map[cat].witels[w]
        const d2 = table2Map[cat].witels[w]

        // Add to Category Header Totals
        catHeader1.ao_3bln += d1.ao_3bln; catHeader1.est_ao_3bln += d1.est_ao_3bln;
        catHeader1.so_3bln += d1.so_3bln; catHeader1.est_so_3bln += d1.est_so_3bln;
        catHeader1.do_3bln += d1.do_3bln; catHeader1.est_do_3bln += d1.est_do_3bln;
        catHeader1.mo_3bln += d1.mo_3bln; catHeader1.est_mo_3bln += d1.est_mo_3bln;
        catHeader1.ro_3bln += d1.ro_3bln; catHeader1.est_ro_3bln += d1.est_ro_3bln;
        catHeader1.est_3bln += d1.est_3bln; catHeader1.total_3bln += d1.total_3bln;

        catHeader1.ao_3bln2 += d1.ao_3bln2; catHeader1.est_ao_3bln2 += d1.est_ao_3bln2;
        catHeader1.so_3bln2 += d1.so_3bln2; catHeader1.est_so_3bln2 += d1.est_so_3bln2;
        catHeader1.do_3bln2 += d1.do_3bln2; catHeader1.est_do_3bln2 += d1.est_do_3bln2;
        catHeader1.mo_3bln2 += d1.mo_3bln2; catHeader1.est_mo_3bln2 += d1.est_mo_3bln2;
        catHeader1.ro_3bln2 += d1.ro_3bln2; catHeader1.est_ro_3bln2 += d1.est_ro_3bln2;
        catHeader1.est_3bln2 += d1.est_3bln2; catHeader1.total_3bln2 += d1.total_3bln2;
        
        catHeader1.grand_total += d1.grand_total;

        catHeader2.provide_order += d2.provide_order; catHeader2.in_process += d2.in_process; catHeader2.ready_bill += d2.ready_bill; catHeader2.total_3bln += d2.total_3bln;
        catHeader2.provide_order2 += d2.provide_order2; catHeader2.in_process2 += d2.in_process2; catHeader2.ready_bill2 += d2.ready_bill2; catHeader2.total_3bln2 += d2.total_3bln2;
        catHeader2.grand_total += d2.grand_total;

        witelRows1.push({
          id: idCounter++,
          category: '',
          witel: w,
          ...d1,
          est_ao_3bln: (d1.est_ao_3bln / 1000000).toFixed(2),
          est_do_3bln: (d1.est_do_3bln / 1000000).toFixed(2),
          est_mo_3bln: (d1.est_mo_3bln / 1000000).toFixed(2),
          est_3bln: (d1.est_3bln / 1000000).toFixed(2),
          
          est_ao_3bln2: (d1.est_ao_3bln2 / 1000000).toFixed(2),
          est_do_3bln2: (d1.est_do_3bln2 / 1000000).toFixed(2),
          est_mo_3bln2: (d1.est_mo_3bln2 / 1000000).toFixed(2),
          est_3bln2: (d1.est_3bln2 / 1000000).toFixed(2),
          isCategoryHeader: false
        })

        witelRows2.push({
          id: idCounter++,
          witel: w,
          ...d2
        })
      })

      // Format Header Money
      catHeader1.est_ao_3bln = (catHeader1.est_ao_3bln / 1000000).toFixed(2)
      catHeader1.est_do_3bln = (catHeader1.est_do_3bln / 1000000).toFixed(2)
      catHeader1.est_mo_3bln = (catHeader1.est_mo_3bln / 1000000).toFixed(2)
      catHeader1.est_3bln = (catHeader1.est_3bln / 1000000).toFixed(2)

      catHeader1.est_ao_3bln2 = (catHeader1.est_ao_3bln2 / 1000000).toFixed(2)
      catHeader1.est_do_3bln2 = (catHeader1.est_do_3bln2 / 1000000).toFixed(2)
      catHeader1.est_mo_3bln2 = (catHeader1.est_mo_3bln2 / 1000000).toFixed(2)
      catHeader1.est_3bln2 = (catHeader1.est_3bln2 / 1000000).toFixed(2)

      table1Data.push(catHeader1, ...witelRows1)
      table2Data.push(catHeader2, ...witelRows2)
    })

    const galaksiData = Object.values(galaksiMap).map((item, index) => ({
      ...item,
      id: index + 1,
      achievement: '0%' // Placeholder
    })).sort((a, b) => a.po.localeCompare(b.po))

    successResponse(res, {
      table1Data,
      table2Data,
      galaksiData
    }, 'Report Datin Summary retrieved successfully')

  } catch (error) {
    next(error)
  }
}
