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
    const selectedWitels = global_witel ? global_witel.split(',') : []
    const selectedBranches = global_branch ? global_branch.split(',') : []
    const mapStatusArr = map_status ? map_status.split(',') : []

    // Base Filter (Scope RSO2)
    let whereClause = {
      witel: { in: RSO2_WITELS }
    }

    if (selectedWitels.length > 0) {
      whereClause.witel = { in: selectedWitels }
    }
    if (selectedBranches.length > 0) {
      whereClause.witelOld = { in: selectedBranches }
    }
    if (start_date && end_date) {
      whereClause.orderDate = { 
        gte: new Date(start_date), 
        lte: new Date(end_date) 
      }
    }

    if (search) {
      whereClause.OR = [
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

    // --- CHART 1: Total Order per Dimensi ---
    const chart1Raw = await prisma.hsiData.groupBy({
      by: [dimension],
      where: whereClause,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })
    const chart1 = chart1Raw.map(i => ({ 
      product: i[dimension] || 'Unknown', 
      value: i._count.id 
    }))

    // --- CHART 2: Komposisi Status (Mapping manual) ---
    // Prisma tidak support Case When di GroupBy, jadi tarik dulu lalu grouping di JS
    // Alternatif: Query Raw jika performa lambat, tapi untuk dashboard overview ini masih aman
    const chart2Raw = await prisma.hsiData.groupBy({
      by: ['kelompokStatus'],
      where: whereClause,
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

    // --- CHART 3: Tren Jenis Layanan ---
    const chart3Raw = await prisma.hsiData.groupBy({
      by: ['typeLayanan'],
      where: whereClause,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    })
    const chart3 = chart3Raw.map(i => ({ 
      sub_type: i.typeLayanan, 
      product: 'Total', 
      total_amount: i._count.id 
    }))

    // --- CHART 4: Sebaran PS per Dimensi ---
    const chart4Raw = await prisma.hsiData.groupBy({
      by: [dimension],
      where: { ...whereClause, kelompokStatus: 'PS' },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })
    const chart4 = chart4Raw.map(i => ({ 
      product: i[dimension] || 'Unknown', 
      value: i._count.id 
    }))

    // --- CHART 5: Cancel FCC ---
    const chart5Raw = await prisma.hsiData.groupBy({
      by: [dimension, 'suberrorcode'],
      where: { ...whereClause, kelompokStatus: 'REJECT_FCC' },
      _count: { id: true }
    })
    const chart5Keys = [...new Set(chart5Raw.map(i => i.suberrorcode || 'Null'))]
    const chart5Map = {}
    chart5Raw.forEach(i => {
      const dim = i[dimension] || 'Unknown'
      const err = i.suberrorcode || 'Null'
      if (!chart5Map[dim]) chart5Map[dim] = { name: dim }
      chart5Map[dim][err] = (chart5Map[dim][err] || 0) + i._count.id
    })
    const chart5Data = Object.values(chart5Map)

    // --- CHART 6: Cancel Non-FCC (Special Filter by TGL_PS) ---
    // Logika khusus: Cancel Non-FCC biasanya difilter berdasarkan tgl_ps, bukan order_date
    let cancelWhere = { ...whereClause }
    delete cancelWhere.orderDate
    
    cancelWhere.kelompokStatus = 'CANCEL'
    if (start_date && end_date) {
      cancelWhere.tglPs = { 
        gte: new Date(start_date), 
        lte: new Date(end_date) 
      }
    }

    const chart6Raw = await prisma.hsiData.groupBy({
      by: [dimension, 'suberrorcode'], 
      where: cancelWhere,
      _count: { id: true }
    })
    const chart6Keys = [...new Set(chart6Raw.map(i => i.suberrorcode || 'Null'))]
    const chart6Map = {}
    chart6Raw.forEach(i => {
      const dim = i[dimension] || 'Unknown'
      const err = i.suberrorcode || 'Null'
      if (!chart6Map[dim]) chart6Map[dim] = { name: dim }
      chart6Map[dim][err] = (chart6Map[dim][err] || 0) + i._count.id
    })
    const chart6Data = Object.values(chart6Map)

    // --- MAP DATA ---
    const mapWhere = { 
      ...whereClause, 
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

    // --- TREND CHART ---
    const trendRaw = await prisma.hsiData.findMany({ 
      where: whereClause, 
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

    // --- TABLE DATA ---
    const skip = (Number(page) - 1) * Number(limit)
    const tableDataRaw = await prisma.hsiData.findMany({
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
      total: await prisma.hsiData.count({ where: whereClause }),
      completed: await prisma.hsiData.count({ where: { ...whereClause, kelompokStatus: 'PS' } }),
      open: await prisma.hsiData.count({ where: { ...whereClause, NOT: { kelompokStatus: { in: ['PS', 'CANCEL', 'REJECT_FCC'] } } } })
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
      const witelArr = witel.split(',').map(w => w.trim()).filter(w => w !== '')
      if (witelArr.length > 0) {
        conditions.push(`witel IN ('${witelArr.join("','")}')`)
      }
    }

    if (branch && branch.trim() !== '') {
      const branchArr = branch.split(',').map(b => b.trim()).filter(b => b !== '')
      if (branchArr.length > 0) {
        conditions.push(`witel_old IN ('${branchArr.join("','")}')`)
      }
    }

    if (startDate && endDate) {
      // Pastikan format tanggal aman untuk SQL
      conditions.push(`order_date >= '${startDate}'::date AND order_date <= '${endDate}'::date`)
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
        SUM(CASE WHEN data_proses NOT IN ('CANCEL FCC', 'UNSC', 'REVOKE') AND (group_paket != 'WMS' OR group_paket IS NULL) THEN 1 ELSE 0 END) as ps_re_denominator,
        SUM(CASE WHEN kelompok_status IN ('PI', 'FO_UIM', 'FO_ASAP', 'FO_OSM', 'FO_WFM', 'ACT_COM', 'PS') THEN 1 ELSE 0 END) as ps_pi_denominator,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' THEN 1 ELSE 0 END) as followup_completed,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '100 | REVOKE COMPLETED' THEN 1 ELSE 0 END) as revoke_completed,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = 'REVOKE ORDER' THEN 1 ELSE 0 END) as revoke_order,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke = 'PS' THEN 1 ELSE 0 END) as ps_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND (data_ps_revoke = 'PI' OR data_ps_revoke = 'ACT_COM') THEN 1 ELSE 0 END) as ogp_provi_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND (data_ps_revoke = 'FO_WFM' OR data_ps_revoke = 'FO_UIM' OR data_ps_revoke = 'FO_ASAP') THEN 1 ELSE 0 END) as fallout_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND data_ps_revoke = 'CANCEL' THEN 1 ELSE 0 END) as cancel_revoke,
        SUM(CASE WHEN data_proses = 'REVOKE' AND status_resume = '102 | FOLLOW UP COMPLETED' AND (data_ps_revoke IS NULL OR data_ps_revoke = '#N/A' OR data_ps_revoke = 'INPROGESS_SC' OR data_ps_revoke = 'REVOKE') THEN 1 ELSE 0 END) as lain_lain_revoke,
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

    // --- 3. EXPORT EXCEL LOGIC (Full Data & Valid Format) ---
    if (export_detail === 'true') {
        // FIX: Gunakan SELECT agar tidak error jika ada kolom schema yang tidak sync dengan DB
        const data = await prisma.hsiData.findMany({
            where: finalWhere,
            orderBy: { orderDate: 'desc' },
            select: {
                orderId: true,
                orderDate: true,
                customerName: true,
                witel: true,
                sto: true,
                typeLayanan: true,
                kelompokStatus: true,
                statusResume: true,
                dataProses: true,
                statusMessage: true,
                witelOld: true, // Branch
                // Tambahkan kolom lain yang PASTI ADA di database saja
                // JANGAN masukkan 'noOrderRevoke' jika itu menyebabkan error
            }
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Detail Data');

        if (data.length > 0) {
            // Generate Header Dinamis
            const columns = Object.keys(data[0]).map(key => ({
                header: key.toUpperCase().replace(/([A-Z])/g, ' $1').trim(),
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
                        formattedRow[k] = Number(formattedRow[k]);
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