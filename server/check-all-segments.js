import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Segment Distribution ---')
  const segments = await prisma.sosData.groupBy({
    by: ['segmen'],
    _count: { id: true }
  })
  console.log(JSON.stringify(segments, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  , 2))
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })