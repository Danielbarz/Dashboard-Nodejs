
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const count = await prisma.accountOfficer.count()
    console.log(`Total Account Officers: ${count}`)
    
    if (count > 0) {
      const sample = await prisma.accountOfficer.findFirst()
      console.log('Sample AO:', sample)
    }
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
