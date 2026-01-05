
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const segments = await prisma.digitalProduct.findMany({
      select: { segment: true },
      distinct: ['segment']
    })
    console.log('Distinct Segments:', segments.map(w => w.segment).sort())
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
