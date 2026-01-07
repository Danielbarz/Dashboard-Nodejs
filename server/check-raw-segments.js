
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('--- Inspecting Raw Data for Segments ---')
  
  // Fetch ALL distinct segments again just to be sure
  const segments = await prisma.sosData.groupBy({
    by: ['segmen'],
    _count: { id: true }
  })
  
  console.log('Segments from DB:', JSON.stringify(segments, null, 2))

  // Try to find ANY row with 'RBS'
  const rbs = await prisma.sosData.findFirst({
    where: {
      segmen: { contains: 'RBS' } 
    }
  })
  console.log('Row with RBS (contains match):', rbs)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
