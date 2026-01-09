const { PrismaClient } = require('@prisma/client')
require('dotenv').config()
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.sosData.groupBy({
    by: ['nipnas', 'custWitel'],
    _count: {
      nipnas: true
    },
    orderBy: {
      _count: {
        nipnas: 'desc'
      }
    },
    take: 20
  })
  console.log(result)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })