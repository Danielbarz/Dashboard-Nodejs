
import prisma from './src/lib/prisma.js'

async function main() {
  const data = await prisma.digitalProduct.findMany({
    select: {
      orderDate: true
    }
  })

  const years = {}
  data.forEach(d => {
    if (d.orderDate) {
      const y = new Date(d.orderDate).getFullYear()
      years[y] = (years[y] || 0) + 1
    } else {
      years['null'] = (years['null'] || 0) + 1
    }
  })

  console.log('Year distribution:', years)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
