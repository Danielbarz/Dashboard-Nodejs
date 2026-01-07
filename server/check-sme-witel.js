
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('--- Debugging SME Data ---')
  
  // Directly query specific known segments from the previous check-segments.js output
  const targetSegments = [
    'ERM RBS', 
    'RBS', 
    'RETAIL AND MEDIA', 
    'FINANCIAL AND WELFARE', 
    'LOGISTIC AND MANUFACTURING', 
    'MANUFACTURE AND INFRASTRUCTURE', 
    'TOURISM AND WELFARE',
    'DSS'
  ]

  const rows = await prisma.sosData.findMany({
    where: {
      segmen: { in: targetSegments }
    },
    select: {
      segmen: true,
      custWitel: true,
      serviceWitel: true
    },
    take: 50
  })

  console.log(`Found ${rows.length} rows matching SME segments directly.`)
  if (rows.length > 0) {
    console.log('Sample rows:', JSON.stringify(rows.slice(0, 5), null, 2))
  } else {
    console.log('No rows found! This is strange because check-segments.js said they exist.')
  }

  const witels = await prisma.sosData.groupBy({
    by: ['custWitel', 'serviceWitel'],
    where: {
      segmen: { in: targetSegments }
    },
    _count: { id: true }
  })
  
  console.log('Witels for these segments:', JSON.stringify(witels, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
