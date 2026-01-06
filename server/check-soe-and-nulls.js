
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('--- Analyzing SOE Data Details ---')
  
  // Fetch sample SOE rows to see actionCd and dates
  const soeSamples = await prisma.sosData.findMany({
    where: {
      segmen: { contains: 'State-Owned', mode: 'insensitive' },
      custWitel: { in: ['BALI', 'NUSA TENGGARA', 'SURAMADU'] } // Filter to relevant witels
    },
    take: 10,
    select: {
      id: true,
      custWitel: true,
      segmen: true,
      actionCd: true,
      orderCreatedDate: true,
      liStatus: true,
      revenue: true
    }
  })
  console.log('Sample SOE Rows (Relevant Witels):', JSON.stringify(soeSamples, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  , 2))

  console.log('\n--- Analyzing "Regional" Segment Data ---')
  const regSamples = await prisma.sosData.findMany({
    where: { segmen: 'Regional' },
    take: 10,
    select: { id: true, standardName: true, segmen: true, orderCreatedDate: true }
  })
  console.log('Regional Samples:', JSON.stringify(regSamples, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2))

  console.log('\n--- Analyzing Min/Max Dates ---')
  const dateAgg = await prisma.sosData.aggregate({
    _min: { orderCreatedDate: true },
    _max: { orderCreatedDate: true }
  })
  console.log(`Min Date: ${dateAgg._min.orderCreatedDate}`)
  console.log(`Max Date: ${dateAgg._max.orderCreatedDate}`)



  console.log('\n--- Analyzing Action Code Distribution for SOE ---')
  const soeActions = await prisma.sosData.groupBy({
    by: ['actionCd'],
    where: {
      segmen: { contains: 'State-Owned', mode: 'insensitive' }
    },
    _count: { id: true }
  })
  console.log('SOE Action Codes:', JSON.stringify(soeActions, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  , 2))

  console.log('\n--- Analyzing "Empty" Segments ---')
  // Check for empty string segments
  const emptySegCount = await prisma.sosData.count({
    where: { segmen: '' }
  })
  console.log(`Total rows with empty string segment: ${emptySegCount}`)
  
  // Check for "null" string segments
  const stringNullCount = await prisma.sosData.count({
    where: { segmen: 'null' }
  })
  console.log(`Total rows with "null" string segment: ${stringNullCount}`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
