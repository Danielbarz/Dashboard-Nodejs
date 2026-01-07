const { PrismaClient } = require('@prisma/client')
require('dotenv').config()
const prisma = new PrismaClient()

async function main() {
  const nipnas = '5589643'
  const samples = await prisma.sosData.findMany({
    where: { nipnas: nipnas },
    take: 5,
    select: {
      nipnas: true,
      custWitel: true,
      custCity: true,
      segmen: true
    }
  })
  console.log(`Samples for ${nipnas}:`)
  console.log(samples)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })