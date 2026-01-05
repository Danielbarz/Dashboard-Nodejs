
import prisma from './src/lib/prisma.js'

async function main() {
  const data = await prisma.digitalProduct.findMany({
    select: {
      productName: true
    },
    distinct: ['productName']
  })

  console.log('Product Names:', data.map(d => d.productName))
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
