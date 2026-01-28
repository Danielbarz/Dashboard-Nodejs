import prisma from '../lib/prisma.js'
import ExcelJS from 'exceljs'

export const listDigitalProducts = async ({ page = 1, limit = 20, search, witel, branch, status, startDate, endDate }) => {
  const offset = (page - 1) * limit

  const where = {}
  if (search) {
    where.OR = [
      { product: { contains: search, mode: 'insensitive' } },
      { orderId: { contains: search, mode: 'insensitive' } }
    ]
  }
  if (witel) where.witel = witel
  if (branch) where.telda = branch
  if (status) where.orderStatus = status

  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setDate(end.getDate() + 1) // Add 1 day for exclusive upper bound

    where.orderDate = {
      gte: start,
      lt: end
    }
  }

  const [data, total] = await Promise.all([
    prisma.digitalProduct.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.digitalProduct.count({ where })
  ])

  return { data, total }
}

export const getDigitalProductStats = async ({ witel, branch, status }) => {
  const where = {}
  if (witel) where.witel = witel
  if (branch) where.telda = branch
  if (status) where.orderStatus = status

  // Get all products matching filters
  const products = await prisma.digitalProduct.findMany({ where })

  // Calculate summary
  const summary = {
    total_revenue: products.reduce((sum, p) => sum + Number(p.netPrice || 0), 0),
    total_amount: 0 // amount is deprecated, use count or something else if needed
  }

  // Group by witel
  const byWitelMap = {}
  products.forEach(p => {
    if (!byWitelMap[p.witel]) {
      byWitelMap[p.witel] = { witel: p.witel, revenue: 0 }
    }
    byWitelMap[p.witel].revenue += Number(p.netPrice || 0)
  })
  const byWitel = Object.values(byWitelMap).sort((a, b) => b.revenue - a.revenue)

  // Group by branch (telda)
  const byBranchMap = {}
  products.forEach(p => {
    const b = p.telda || 'Unknown'
    if (!byBranchMap[b]) {
      byBranchMap[b] = { branch: b, revenue: 0 }
    }
    byBranchMap[b].revenue += Number(p.netPrice || 0)
  })
  const byBranch = Object.values(byBranchMap).sort((a, b) => b.revenue - a.revenue)

  // Count by status
  const statusCountMap = {}
  products.forEach(p => {
    const s = p.orderStatus || 'Unknown'
    statusCountMap[s] = (statusCountMap[s] || 0) + 1
  })
  const statusCounts = Object.entries(statusCountMap).map(([status, count]) => ({ status, count }))

  return {
    summary,
    byWitel,
    byBranch,
    statusCounts
  }
}

export const exportDigitalProductsExcel = async ({ search, witel, branch, status, startDate, endDate }) => {
  const { data } = await listDigitalProducts({ page: 1, limit: 100000, search, witel, branch, status, startDate, endDate })

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Digital Products')

  sheet.columns = [
    { header: 'Order ID', key: 'orderId', width: 25 },
    { header: 'Product Order ID', key: 'productOrderId', width: 25 },
    { header: 'Product', key: 'product', width: 30 },
    { header: 'Filter Product', key: 'filterProduct', width: 20 },
    { header: 'Product Detail', key: 'productDetail', width: 40 },
    { header: 'Customer', key: 'custName', width: 30 },
    { header: 'Segment', key: 'segmen', width: 15 },
    { header: 'Kategori', key: 'kategori', width: 15 },
    { header: 'Channel', key: 'channel', width: 15 },
    { header: 'Layanan', key: 'layanan', width: 20 },
    { header: 'Order Subtype', key: 'orderSubtype', width: 20 },
    { header: 'Milestone', key: 'milestone', width: 20 },
    { header: 'Week', key: 'week', width: 10 },
    { header: 'Regional', key: 'regional', width: 15 },
    { header: 'Witel', key: 'witel', width: 20 },
    { header: 'Telda', key: 'telda', width: 20 },
    { header: 'STO', key: 'sto', width: 10 },
    { header: 'Net Price', key: 'netPrice', width: 15 },
    { header: 'ACH', key: 'ach', width: 10 },
    { header: 'Active User', key: 'activeUser', width: 15 },
    { header: 'Reg Antares Eazy', key: 'regAntaresEazy', width: 20 },
    { header: 'Status', key: 'orderStatus', width: 15 },
    { header: 'Status N', key: 'orderStatusN', width: 15 },
    { header: 'Order Date', key: 'orderDate', width: 20 },
    { header: 'Billcomp Date', key: 'billcompDate', width: 20 },
    { header: 'Last Update', key: 'lastUpdate', width: 20 },
    { header: 'Created At', key: 'createdAt', width: 20 },
    { header: 'Batch ID', key: 'batchId', width: 25 }
  ]

  data.forEach((row) => sheet.addRow(row))

  // Format header
  sheet.getRow(1).font = { bold: true }

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}