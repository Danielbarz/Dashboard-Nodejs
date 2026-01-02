import prisma from '../lib/prisma.js'
import ExcelJS from 'exceljs'

export const listDigitalProducts = async ({ page = 1, limit = 20, search, witel, branch, status }) => {
  const offset = (page - 1) * limit

  const where = {}
  if (search) {
    where.OR = [
      { product_name: { contains: search, mode: 'insensitive' } },
      { order_number: { contains: search, mode: 'insensitive' } }
    ]
  }
  if (witel) where.witel = witel
  if (branch) where.branch = branch
  if (status) where.status = status

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
  if (branch) where.branch = branch
  if (status) where.status = status

  // Get all products matching filters
  const products = await prisma.digitalProduct.findMany({ where })

  // Calculate summary
  const summary = {
    total_revenue: products.reduce((sum, p) => sum + (p.revenue || 0), 0),
    total_amount: products.reduce((sum, p) => sum + (p.amount || 0), 0)
  }

  // Group by witel
  const byWitelMap = {}
  products.forEach(p => {
    if (!byWitelMap[p.witel]) {
      byWitelMap[p.witel] = { witel: p.witel, revenue: 0, amount: 0 }
    }
    byWitelMap[p.witel].revenue += p.revenue || 0
    byWitelMap[p.witel].amount += p.amount || 0
  })
  const byWitel = Object.values(byWitelMap).sort((a, b) => b.revenue - a.revenue)

  // Group by branch
  const byBranchMap = {}
  products.forEach(p => {
    if (!byBranchMap[p.branch]) {
      byBranchMap[p.branch] = { branch: p.branch, revenue: 0, amount: 0 }
    }
    byBranchMap[p.branch].revenue += p.revenue || 0
    byBranchMap[p.branch].amount += p.amount || 0
  })
  const byBranch = Object.values(byBranchMap).sort((a, b) => b.revenue - a.revenue)

  // Count by status
  const statusCountMap = {}
  products.forEach(p => {
    statusCountMap[p.status] = (statusCountMap[p.status] || 0) + 1
  })
  const statusCounts = Object.entries(statusCountMap).map(([status, count]) => ({ status, count }))

  return {
    summary,
    byWitel,
    byBranch,
    statusCounts
  }
}

export const exportDigitalProductsExcel = async ({ search, witel, branch, status }) => {
  const { data } = await listDigitalProducts({ page: 1, limit: 100000, search, witel, branch, status })

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Digital Products')

  sheet.columns = [
    { header: 'Order Number', key: 'order_number', width: 20 },
    { header: 'Product Name', key: 'product_name', width: 30 },
    { header: 'Witel', key: 'witel', width: 20 },
    { header: 'Branch', key: 'branch', width: 20 },
    { header: 'Revenue', key: 'revenue', width: 15 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Custom Target', key: 'custom_target', width: 15 },
    { header: 'Completed At', key: 'completed_at', width: 20 },
    { header: 'Created At', key: 'created_at', width: 20 }
  ]

  data.forEach((row) => sheet.addRow(row))

  // Format header
  sheet.getRow(1).font = { bold: true }

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}
