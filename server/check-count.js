import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const count = await prisma.sosData.count()
  console.log(`Total SOS Data Rows: ${count}`)
  
  const segments = await prisma.sosData.groupBy({
    by: ['segmen'],
    _count: { id: true }
  })
  console.log('Segments:', JSON.stringify(segments, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2))
}

main()
  .finally(() => prisma.$disconnect())