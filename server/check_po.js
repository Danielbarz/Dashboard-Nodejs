import prisma from './src/lib/prisma.js'

async function checkMasterPO() {
  try {
    const count = await prisma.poMaster.count()
    console.log(`📊 Master PO Count: ${count}`)
    
    if (count > 0) {
      const samples = await prisma.poMaster.findMany({ take: 5 })
      console.log('Sample POs:', samples)
    }
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

checkMasterPO()
