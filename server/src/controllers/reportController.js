import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'

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
    if (witel) {
      const witelList = witel.split(',').map(w => w.trim()).filter(w => w)
      if (witelList.length === 1) {
        selectedRegion = witelList[0]
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
