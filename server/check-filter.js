
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const products = ['Antares', 'Netmonk', 'OCA', 'Pijar']
    
    console.log('Checking for products:', products)

    for (const p of products) {
      const count = await prisma.digitalProduct.count({
        where: {
          productName: {
            contains: p,
            mode: 'insensitive'
          }
        }
      })
      console.log(`Product '${p}': ${count} rows`)
    }

    const total = await prisma.digitalProduct.count()
    console.log(`Total rows: ${total}`)

  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
