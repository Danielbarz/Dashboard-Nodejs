import prisma from './src/lib/prisma.js'

async function debugData() {
  try {
    console.log('🔍 Checking SPMK MOM Data...')

    const count = await prisma.spmkMom.count()
    console.log(`📊 Total Rows: ${count}`)

    if (count === 0) {
      console.log('❌ Table is empty! Did upload succeed?')
      return
    }

    const rows = await prisma.spmkMom.findMany({
      take: 5,
      orderBy: { id: 'desc' }, // Get latest
      select: {
        id: true,
        poName: true,
        revenuePlan: true,
        tanggalMom: true,
        tanggalGolive: true,
        witelBaru: true
      }
    })

    console.log('📄 Latest 5 Rows Data:')
    console.log(JSON.stringify(rows, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2))

    // Check Aggregations
    const trendTest = await prisma.spmkMom.findMany({
      where: {
        tanggalMom: { not: null }
      },
      take: 5,
      select: { tanggalMom: true }
    })
    console.log(`📅 Valid Tanggal MOM found: ${trendTest.length} samples`, trendTest)

    const revenueTest = await prisma.spmkMom.aggregate({
        _sum: { revenuePlan: true }
    })
    console.log(`💰 Total Revenue in DB: ${revenueTest._sum.revenuePlan}`)

  } catch (e) {
    console.error('Error:', e)
  } finally {
    await prisma.$disconnect()
  }
}

debugData()