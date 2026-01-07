import prisma from '../lib/prisma.js'
import { successResponse, errorResponse } from '../utils/response.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

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
    const regions = ['BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU']

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

    let whereClause = {}

    if (start_date && end_date) {
      whereClause.tanggalMom = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    const tableData = await prisma.spmkMom.groupBy({
      by: ['witelBaru'],
      where: whereClause,
      _count: {
        id: true
      },
      _sum: {
        revenuePlan: true
      }
    })

    const formattedTableData = tableData.map(row => ({
      witel: row.witelBaru || 'Unknown',
      jumlahLop: row._count.id,
      revAll: parseFloat(row._sum.revenuePlan || 0),
      initial: 0,
      survey: 0,
      perizinan: 0,
      instalasi: 0,
      piOgp: 0,
      golive: row.goLive === 'Y' ? row._count.id : 0,
      drop: 0
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


// ... (kode sebelumnya tetap sama)

// --- FIX: Get HSI Dashboard Overview (Stats, Chart, Table) ---
// ... imports

// --- FIX: Get HSI Dashboard Overview (Stats, Chart, Table) ---
export const getHSIDashboard = async (req, res, next) => {
  try {
    const { startDate, endDate, witel, branch, search, page = 1, limit = 10 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    // Build Filter
    let whereClause = {}
    
    // Gunakan camelCase 'orderDate'
    if (startDate && endDate) {
      whereClause.orderDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    if (witel) whereClause.witel = { in: witel.split(',') }
    if (branch) whereClause.sto = { in: branch.split(',') } // Asumsi branch filter ke STO

    if (search) {
      whereClause.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { nomor: { contains: search, mode: 'insensitive' } }
      ]
    }

    // 1. Get Cards Stats (Total, Completed, Open)
    const total = await prisma.hsiData.count({ where: whereClause })
    const completed = await prisma.hsiData.count({ where: { ...whereClause, kelompokStatus: 'PS' } })
    const open = await prisma.hsiData.count({ where: { ...whereClause, NOT: { kelompokStatus: { in: ['PS', 'CANCEL', 'REJECT'] } } } })

    // 2. Get Charts Data
    // A. Total Order per Witel
    const chartWitelRaw = await prisma.hsiData.groupBy({
      by: ['witel'],
      where: whereClause,
      _count: { id: true }
    })
    const chartWitel = chartWitelRaw.map(item => ({ name: item.witel || 'Unknown', value: item._count.id }))

    // B. PS (Completed) per Witel
    const chartPSRaw = await prisma.hsiData.groupBy({
      by: ['witel'],
      where: { ...whereClause, kelompokStatus: 'PS' },
      _count: { id: true }
    })
    const chartPS = chartPSRaw.map(item => ({ name: item.witel || 'Unknown', value: item._count.id }))

    // C. Status Composition (Pie Chart)
    const chartStatusRaw = await prisma.hsiData.groupBy({
      by: ['kelompokStatus'],
      where: whereClause,
      _count: { id: true }
    })
    const chartStatus = chartStatusRaw.map(item => ({ name: item.kelompokStatus || 'Others', value: item._count.id }))

    // D. Trend Layanan (Bar Chart)
    const chartLayananRaw = await prisma.hsiData.groupBy({
      by: ['typeLayanan'],
      where: whereClause,
      _count: { id: true }
    })
    const chartLayanan = chartLayananRaw.map(item => ({ name: item.typeLayanan || 'Unknown', value: item._count.id }))

    // E. Trend Harian (Line Chart)
    // Fetch orderDate only to aggregate in JS (Prisma doesn't support date truncation easily yet)
    const trendRaw = await prisma.hsiData.findMany({
      where: whereClause,
      select: { orderDate: true },
      orderBy: { orderDate: 'asc' }
    })
    
    const trendMap = {}
    trendRaw.forEach(item => {
      if (item.orderDate) {
        const dateStr = item.orderDate.toISOString().split('T')[0]
        trendMap[dateStr] = (trendMap[dateStr] || 0) + 1
      }
    })
    const chartTrend = Object.keys(trendMap).map(date => ({ date, count: trendMap[date] }))

    // 3. Get Table Data
    const tableData = await prisma.hsiData.findMany({
      where: whereClause,
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

    // Format table keys to snake_case for frontend consistency
    const formattedTable = tableData.map(row => ({
      order_id: row.orderId,
      order_date: row.orderDate,
      customer_name: row.customerName,
      witel: row.witel,
      sto: row.sto,
      type_layanan: row.typeLayanan,
      kelompok_status: row.kelompokStatus,
      status_resume: row.statusResume
    }))

    successResponse(res, {
      stats: { total, completed, open },
      charts: {
        orderByWitel: chartWitel,
        psByWitel: chartPS,
        statusComposition: chartStatus,
        trendLayanan: chartLayanan,
        trendDaily: chartTrend
      },
      table: formattedTable,
      pagination: {
        page: Number(page),
        total: total,
        totalPages: Math.ceil(total / Number(limit))
      }
    }, 'HSI Dashboard data retrieved')

  } catch (error) {
    console.error("HSI Dashboard Error:", error)
    next(error)
  }
}

// --- FIX: Get HSI Flow Process Stats (Funneling) ---
export const getHSIFlowStats = async (req, res, next) => {
  try {
    const { startDate, endDate, witel } = req.query
    
    let whereClause = {}
    if (startDate && endDate) {
      whereClause.orderDate = { gte: new Date(startDate), lte: new Date(endDate) } // FIX: orderDate
    }
    if (witel) whereClause.witel = { in: witel.split(',') }

    // Aggregate by kelompokStatus (camelCase)
    const statusGroups = await prisma.hsiData.groupBy({
      by: ['kelompokStatus'], 
      where: whereClause,
      _count: { id: true }
    })

    // Helper untuk mencari count berdasarkan group
    const getCount = (key) => {
      // FIX: Check against 'kelompokStatus'
      const found = statusGroups.find(g => g.kelompokStatus === key)
      return found ? found._count.id : 0
    }

    // Hitung total semua sebagai RE (Request Entry)
    const totalRE = statusGroups.reduce((acc, curr) => acc + curr._count.id, 0)
    
    const psCount = getCount('PS')
    
    // FIX: Filter menggunakan 'kelompokStatus'
    const cancelCount = statusGroups
      .filter(g => g.kelompokStatus && g.kelompokStatus.includes('CANCEL'))
      .reduce((acc, curr) => acc + curr._count.id, 0)
    
    const kendalaCount = getCount('KENDALA') + getCount('MANJA')

    const stats = {
      re: totalRE,
      valid_re: totalRE,
      valid_wo: totalRE > cancelCount ? totalRE - cancelCount : 0,
      valid_pi: (totalRE - cancelCount - kendalaCount) > 0 ? (totalRE - cancelCount - kendalaCount) : 0,
      ps_count: psCount,
      
      cancel_wo: cancelCount,
      fallout: kendalaCount,
      
      ps_re_denominator: totalRE,
      ps_pi_denominator: (totalRE - cancelCount - kendalaCount) > 0 ? (totalRE - cancelCount - kendalaCount) : 1
    }

    successResponse(res, stats, 'HSI Flow stats retrieved')
  } catch (error) {
    console.error("HSI Flow Stats Error:", error)
    next(error)
  }
}