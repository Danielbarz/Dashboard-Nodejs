
import prisma from './src/lib/prisma.js'

async function main() {
  const data = await prisma.digitalProduct.findMany({
    select: {
      segment: true
    },
    distinct: ['segment']
  })

  console.log('Segments:', data.map(d => d.segment))
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
