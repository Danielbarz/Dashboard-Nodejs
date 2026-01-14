import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  try {
    // Delete existing
    const deleted = await prisma.digitalProduct.deleteMany()
    console.log(`Deleted ${deleted.count} existing products`)

    // Insert sample products
    const products = [
      { orderNumber: 'ORD-2024-001', productName: 'Internet Fiber 30 Mbps', witel: 'WITEL_JABAR', branch: 'Bandung', revenue: 300000, amount: 10, status: 'complete', subType: 'Internet Retail' },
      { orderNumber: 'ORD-2024-002', productName: 'Internet Fiber 50 Mbps', witel: 'WITEL_JABAR', branch: 'Bogor', revenue: 500000, amount: 5, status: 'in-progress', subType: 'Internet Retail' },
      { orderNumber: 'ORD-2024-003', productName: 'Internet Dedicated 100 Mbps', witel: 'WITEL_JABAR', branch: 'Jakarta', revenue: 1500000, amount: 8, status: 'complete', subType: 'Internet Korporat' },
      { orderNumber: 'ORD-2024-004', productName: 'VPN Service', witel: 'WITEL_JABAR', branch: 'Bandung', revenue: 250000, amount: 15, status: 'cancelled', subType: 'Layanan Tambahan' },
      { orderNumber: 'ORD-2024-005', productName: 'Internet Fiber 30 Mbps', witel: 'WITEL_JATIM', branch: 'Surabaya', revenue: 450000, amount: 12, status: 'complete', subType: 'Internet Retail' },
      { orderNumber: 'ORD-2024-006', productName: 'Internet Fiber 50 Mbps', witel: 'WITEL_JATIM', branch: 'Malang', revenue: 600000, amount: 6, status: 'in-progress', subType: 'Internet Retail' },
      { orderNumber: 'ORD-2024-007', productName: 'Cloud Storage 1TB', witel: 'WITEL_JATIM', branch: 'Surabaya', revenue: 200000, amount: 20, status: 'complete', subType: 'Layanan Tambahan' },
      { orderNumber: 'ORD-2024-008', productName: 'Internet Fiber 30 Mbps', witel: 'WITEL_JATENG', branch: 'Semarang', revenue: 350000, amount: 14, status: 'complete', subType: 'Internet Retail' },
      { orderNumber: 'ORD-2024-009', productName: 'Internet Dedicated 200 Mbps', witel: 'WITEL_JATENG', branch: 'Solo', revenue: 2000000, amount: 3, status: 'in-progress', subType: 'Internet Korporat' },
      { orderNumber: 'ORD-2024-010', productName: 'Cloud Backup Service', witel: 'WITEL_JATENG', branch: 'Yogyakarta', revenue: 180000, amount: 9, status: 'complete', subType: 'Layanan Tambahan' }
    ]

    for (const product of products) {
      await prisma.digitalProduct.create({ data: product })
      console.log(`✓ Created ${product.orderNumber}`)
    }

    const count = await prisma.digitalProduct.count()
    console.log(`\n✅ Successfully seeded ${count} products!`)
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
