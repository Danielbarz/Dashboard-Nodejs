import prisma from './src/lib/prisma.js'

async function debugActionCd() {
  try {
    const actions = await prisma.sosData.groupBy({
      by: ['actionCd'],
      _count: { _all: true }
    })
    
    console.log('--- Action Codes ---')
    actions.forEach(a => console.log(`"${a.actionCd}": ${a._count._all}`))

  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

debugActionCd()
