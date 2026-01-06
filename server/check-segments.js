
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const segments = await prisma.digitalProduct.groupBy({
      by: ['segment'],
      _count: {
        id: true
      }
    })
    console.log('Segments found:', segments)
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
