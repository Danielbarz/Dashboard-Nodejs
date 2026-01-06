
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const count = await prisma.digitalProduct.count()
    console.log(`Total DigitalProduct rows: ${count}`)
    
    if (count > 0) {
      const sample = await prisma.digitalProduct.findFirst()
      console.log('Sample row:', sample)
    }
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
