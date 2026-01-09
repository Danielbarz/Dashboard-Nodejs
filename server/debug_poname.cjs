const { PrismaClient } = require('@prisma/client')
require('dotenv').config()
const prisma = new PrismaClient()

async function main() {
  console.log('Checking poName in sosData...')
  
  const totalCount = await prisma.sosData.count()
  console.log(`Total records: ${totalCount}`)

  const countWithPoName = await prisma.sosData.count({
    where: {
      poName: {
        not: null
      }
    }
  })
  console.log(`Records with poName (not null): ${countWithPoName}`)

  const countWithPoNameAndNotEmpty = await prisma.sosData.count({
    where: {
        AND: [
            { poName: { not: null } },
            { poName: { not: '' } }
        ]
    }
  })
  console.log(`Records with poName (not null and not empty): ${countWithPoNameAndNotEmpty}`)

  const samples = await prisma.sosData.findMany({
    where: {
      poName: {
        not: null
      }
    },
    take: 10,
    select: {
      id: true,
      poName: true,
      segmen: true,
      witel: true
    }
  })
  
  console.log('Sample records with poName:')
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
