import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  const deletedCount = await prisma.digitalProduct.deleteMany()
  console.log(`✓ Cleared ${deletedCount.count} records from digital_products table`)

  // Sample data
  const sampleProducts = [
    // WITEL JABAR
    {
      order_number: 'ORD-2024-001',
      product_name: 'Internet Fiber 30 Mbps',
      witel: 'WITEL_JABAR',
      branch: 'Bandung',
      revenue: 300000,
      amount: 10,
      status: 'complete',
      sub_type: 'Internet Retail',
    },
    {
      order_number: 'ORD-2024-002',
      product_name: 'Internet Fiber 50 Mbps',
      witel: 'WITEL_JABAR',
      branch: 'Bogor',
      revenue: 500000,
      amount: 5,
      status: 'in-progress',
      sub_type: 'Internet Retail',
    },
    {
      order_number: 'ORD-2024-003',
      product_name: 'Internet Dedicated 100 Mbps',
      witel: 'WITEL_JABAR',
      branch: 'Jakarta',
      revenue: 1500000,
      amount: 8,
      status: 'complete',
      sub_type: 'Internet Korporat',
    },
    {
      order_number: 'ORD-2024-004',
      product_name: 'VPN Service',
      witel: 'WITEL_JABAR',
      branch: 'Bandung',
      revenue: 250000,
      amount: 15,
      status: 'cancelled',
      sub_type: 'Layanan Tambahan',
    },

    // WITEL JATIM
    {
      order_number: 'ORD-2024-005',
      product_name: 'Internet Fiber 30 Mbps',
      witel: 'WITEL_JATIM',
      branch: 'Surabaya',
      revenue: 450000,
      amount: 12,
      status: 'complete',
      sub_type: 'Internet Retail',
    },
    {
      order_number: 'ORD-2024-006',
      product_name: 'Internet Fiber 50 Mbps',
      witel: 'WITEL_JATIM',
      branch: 'Malang',
      revenue: 600000,
      amount: 6,
      status: 'in-progress',
      sub_type: 'Internet Retail',
    },
    {
      order_number: 'ORD-2024-007',
      product_name: 'Cloud Storage 1TB',
      witel: 'WITEL_JATIM',
      branch: 'Surabaya',
      revenue: 200000,
      amount: 20,
      status: 'complete',
      sub_type: 'Layanan Tambahan',
    },

    // WITEL JATENG
    {
      order_number: 'ORD-2024-008',
      product_name: 'Internet Fiber 30 Mbps',
      witel: 'WITEL_JATENG',
      branch: 'Semarang',
      revenue: 350000,
      amount: 14,
      status: 'complete',
      sub_type: 'Internet Retail',
    },
    {
      order_number: 'ORD-2024-009',
      product_name: 'Internet Dedicated 200 Mbps',
      witel: 'WITEL_JATENG',
      branch: 'Solo',
      revenue: 2000000,
      amount: 3,
      status: 'in-progress',
      sub_type: 'Internet Korporat',
    },
    {
      order_number: 'ORD-2024-010',
      product_name: 'Cloud Backup Service',
      witel: 'WITEL_JATENG',
      branch: 'Yogyakarta',
      revenue: 180000,
      amount: 9,
      status: 'complete',
      sub_type: 'Layanan Tambahan',
    },
  ]

  // Insert sample data
  for (const product of sampleProducts) {
    const created = await prisma.digitalProduct.create({
      data: {
        orderNumber: product.order_number,
        productName: product.product_name,
        witel: product.witel,
        branch: product.branch,
        revenue: product.revenue,
        amount: product.amount,
        status: product.status,
        subType: product.sub_type,
      },
    })
    console.log(`Created product: ${created.orderNumber}`)
  }

  console.log(`✓ Seeded ${sampleProducts.length} digital products successfully!`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
