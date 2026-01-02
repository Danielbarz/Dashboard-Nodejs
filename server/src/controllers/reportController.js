import { PrismaClient } from '@prisma/client'
import { successResponse, errorResponse } from '../utils/response.js'

const prisma = new PrismaClient()

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

    // Fetch all raw data to aggregate in memory for complex logic
    const rawData = await prisma.spmkMom.findMany({
      where: whereClause,
      select: {
        witelBaru: true,
        revenuePlan: true,
        goLive: true,
        populasiNonDrop: true,
        baDrop: true,
        statusTompsLastActivity: true,
        statusIHld: true
      }
    })

    // Aggregate data
    const witelMap = {}
    
    // Helper for parent witel
    const getParentWitel = (witel) => {
      const w = witel.toUpperCase()
      if (['BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG'].includes(w)) return 'BALI'
      if (['JATIM BARAT', 'KEDIRI', 'MADIUN', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEPANJEN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG'].includes(w)) return 'JATIM BARAT'
      if (['JATIM TIMUR', 'JEMBER', 'PASURUAN', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PROBOLINGGO', 'SITUBONDO'].includes(w)) return 'JATIM TIMUR'
      if (['NUSA TENGGARA', 'NTT', 'NTB', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU'].includes(w)) return 'NUSA TENGGARA'
      if (['SURAMADU', 'SURABAYA UTARA', 'SURABAYA SELATAN', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES'].includes(w)) return 'SURAMADU'
      return 'OTHER'
    }

    rawData.forEach(row => {
      const witel = row.witelBaru || 'Unknown'
      if (!witelMap[witel]) {
        witelMap[witel] = {
          witel,
          parentWitel: getParentWitel(witel),
          isParent: witel === getParentWitel(witel), // Mark as parent if name matches
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
      const isDrop = row.populasiNonDrop === 'N' || row.baDrop !== null
      const isGoLive = row.goLive === 'Y'

      if (isDrop) {
        witelMap[witel].drop++
      } else {
        witelMap[witel].jumlahLop++
        witelMap[witel].revAll += revenue

        if (isGoLive) {
          witelMap[witel].golive_jml++
          witelMap[witel].golive_rev += revenue
        } else {
          // Map status to progress columns
          const status = (row.statusTompsLastActivity || '').toLowerCase()
          
          if (status.includes('survey') || status.includes('drm')) {
            witelMap[witel].survey++
          } else if (status.includes('izin') || status.includes('mos')) {
            witelMap[witel].perizinan++
          } else if (status.includes('instal') || status.includes('deploy')) {
            witelMap[witel].instalasi++
          } else if (status.includes('ogp') || status.includes('live')) {
            witelMap[witel].piOgp++
          } else {
            witelMap[witel].initial++
          }
        }
      }
    })

    const formattedTableData = Object.values(witelMap).map(row => ({
      ...row,
      persen_close: row.jumlahLop > 0 ? ((row.golive_jml / row.jumlahLop) * 100).toFixed(1) + '%' : '0.0%'
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
    const { start_date, end_date, witel } = req.query

    let whereClause = {}
    if (start_date && end_date) {
      whereClause.orderCreatedDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    // Region Mapping
    const regionMapping = {
      'BALI': ['GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'Non-Telda (NCX)', 'SANUR', 'SINGARAJA', 'TABANAN', 'UBUNG'],
      'JATIM BARAT': ['BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'Non-Telda (NCX)', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG'],
      'JATIM TIMUR': ['BANYUWANGI', 'BONDOWOSO', 'INNER - JATIM TIMUR', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'Non-Telda (NCX)', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO'],
      'NUSA TENGGARA': ['ATAMBUA', 'BIMA', 'ENDE', 'INNER - NUSA TENGGARA', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'Non-Telda (NCX)', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU'],
      'SURAMADU': ['BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'Non-Telda (NCX)', 'PAMEKASAN', 'TANDES']
    }

    let selectedRegion = null
    if (witel) {
      const witelList = witel.split(',').map(w => w.trim()).filter(w => w)
      if (witelList.length === 1) {
        selectedRegion = witelList[0]
      }
    }

    // Helper to get data for a segment
    const getSegmentData = async (segmentKeyword) => {
      const data = await prisma.sosData.findMany({
        where: {
          ...whereClause,
          segmen: { contains: segmentKeyword, mode: 'insensitive' }
        },
        select: {
          billWitel: true,
          liProductName: true,
          liStatus: true,
          revenue: true
        }
      })

      // Process data
      const witelMap = {}
      let targetRows = []

      if (selectedRegion && regionMapping[selectedRegion]) {
        // Drill down mode: Show branches for the selected region
        targetRows = regionMapping[selectedRegion]
      } else {
        // Default mode: Show all regions
        targetRows = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']
      }
      
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
        let rawWitel = (row.billWitel || '').toUpperCase()
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
        const pName = (row.liProductName || '').toLowerCase()
        if (pName.includes('netmonk')) productCode = 'n'
        else if (pName.includes('oca')) productCode = 'o'
        else if (pName.includes('antares')) productCode = 'ae'
        else if (pName.includes('pijar')) productCode = 'ps'
        
        if (!productCode) return

        const status = (row.liStatus || '').toLowerCase()
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

    const legsData = await getSegmentData('LEGS') // Assuming 'LEGS' is the keyword
    const smeData = await getSegmentData('SME')

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

// Get Report Details - Detailed list
export const getReportDetails = async (req, res, next) => {
  try {
    const { start_date, end_date, segment, witel, status } = req.query

    let whereClause = {}
    if (start_date && end_date) {
      whereClause.orderCreatedDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    if (segment) {
      const segmentList = segment.split(',').map(s => s.trim()).filter(s => s)
      if (segmentList.length > 0) {
        whereClause.OR = segmentList.map(s => ({
          segmen: { contains: s, mode: 'insensitive' }
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
          whereClause.billWitel = { in: targetWitels }
        }
      }
    }

    // Filter for relevant products (Netmonk, OCA, Antares, Pijar)
    // and In Progress status (NOT completed/activated/live/done/closed)
    
    // Combine existing OR (from segment) with Product OR
    // Prisma AND/OR structure needs care.
    // If we already have an OR from segment, we need to wrap it.
    // Actually, Prisma supports multiple conditions in AND array implicitly if we use AND: [...]
    // But here we are mixing top-level properties.
    // If whereClause.OR exists (from segment), we can't just overwrite it with Product OR.
    // We should use AND to combine them.
    
    const productFilter = {
      OR: [
        { liProductName: { contains: 'netmonk', mode: 'insensitive' } },
        { liProductName: { contains: 'oca', mode: 'insensitive' } },
        { liProductName: { contains: 'antares', mode: 'insensitive' } },
        { liProductName: { contains: 'pijar', mode: 'insensitive' } }
      ]
    }

    let statusFilter = {}
    if (status) {
      const statusList = status.split(',').map(s => s.trim()).filter(s => s)
      if (statusList.length > 0) {
        statusFilter = {
          OR: statusList.map(s => ({ liStatus: { contains: s, mode: 'insensitive' } }))
        }
      }
    }

    // Construct final where clause
    // If whereClause has OR (from segment), we need to preserve it.
    // We can put everything into AND array to be safe.
    
    const finalWhere = {
      AND: [
        whereClause,
        productFilter
      ]
    }

    if (Object.keys(statusFilter).length > 0) {
      finalWhere.AND.push(statusFilter)
    }

    const data = await prisma.sosData.findMany({
      where: finalWhere,
      select: {
        orderId: true,
        liProductName: true,
        billWitel: true,
        standardName: true, // Customer Name
        liMilestone: true, // Milestone
        orderCreatedDate: true,
        segmen: true,
        batchId: true,
        orderSubtype: true,
        liStatus: true,
        revenue: true,
        kategori: true,
      },
      orderBy: {
        orderCreatedDate: 'desc'
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

    const formattedData = data.map(row => ({
      order_id: row.orderId,
      product_name: row.liProductName,
      witel: row.billWitel,
      customer_name: row.standardName,
      milestone: row.liMilestone,
      order_created_date: row.orderCreatedDate,
      segment: row.segmen,
      branch: row.billWitel, // Using billWitel as proxy for branch
      batch_id: row.batchId,
      order_subtype: row.orderSubtype,
      order_status: row.liStatus,
      net_price: parseFloat(row.revenue || 0),
      week: getWeekNumber(row.orderCreatedDate),
      channel: '-', // Not available in SosData
      layanan: row.kategori
    }))

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
      whereClause.orderCreatedDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    // 3. Filter for relevant products
    const products = ['Antares', 'Netmonk', 'OCA', 'Pijar']
    const productFilter = {
      OR: products.map(p => ({ liProductName: { contains: p, mode: 'insensitive' } }))
    }

    // 4. Fetch SOS Data
    const sosData = await prisma.sosData.findMany({
      where: {
        AND: [
          whereClause,
          productFilter
        ]
      },
      select: {
        billWitel: true,
        liStatus: true,
        liProductName: true,
        segmen: true // Needed for special filter
      }
    })

    // 5. Process Data
    const result = accountOfficers.map(ao => {
      // Filter data for this AO
      const relevantData = sosData.filter(row => {
        // 1. Witel Filter
        const filterWitels = (ao.filterWitelLama || '').split(',').map(s => s.trim().toLowerCase())
        const rowWitel = (row.billWitel || '').toLowerCase()
        
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
           // Note: In Prisma result, 'segmen' is the property name for segment
           const rowCol = col === 'segment' ? 'segmen' : col

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
        const isNcx = row.billWitel && row.billWitel.toUpperCase().includes('NCX')
        const isDone = ['completed', 'activated', 'live', 'closed', 'done'].includes((row.liStatus || '').toLowerCase())

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
