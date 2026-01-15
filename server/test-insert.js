import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function insertData() {
  try {
    console.log('Inserting sample data...')

    const product = await prisma.digitalProduct.create({
      data: {
        orderNumber: 'ORD-TEST-001',
        productName: 'Test Product',
        witel: 'WITEL_JABAR',
        branch: 'Bandung',
        revenue: 100000,
        amount: 5,
        status: 'complete',
        subType: 'Internet Retail'
      }
    })

    console.log('✓ Created:', product.orderNumber)

    const all = await prisma.digitalProduct.findMany()
    console.log(`Total products: ${all.length}`)

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

insertData()
