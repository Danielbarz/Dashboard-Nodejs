import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const count = await prisma.digitalProduct.count()
    console.log(`Total digital products: ${count}`)
    
    const products = await prisma.digitalProduct.findMany({ take: 3 })
    console.log('Sample data:', products)
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
