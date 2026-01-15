import prisma from './src/lib/prisma.js'

async function checkWitels() {
  try {
    const witels = await prisma.digitalProduct.findMany({
      distinct: ['witel'],
      select: {
        witel: true
      },
      orderBy: {
        witel: 'asc'
      }
    })
    console.log(witels.map(w => w.witel))
  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

checkWitels()
