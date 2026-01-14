import prisma from './src/lib/prisma.js'

async function debugGolive() {
  try {
    console.log('🔍 Investigating GoLive Discrepancy...')

    // 1. Total GoLive by Status Flag
    const statusCount = await prisma.spmkMom.count({
      where: { goLive: 'Y' }
    })
    console.log(`✅ Total Projects with Status GoLive='Y': ${statusCount}`)

    // 2. Total GoLive with Valid Date
    const dateCount = await prisma.spmkMom.count({
      where: {
        goLive: 'Y',
        tanggalGolive: { not: null }
      }
    })
    console.log(`📅 Total Projects with GoLive='Y' AND Valid Date: ${dateCount}`)

    // 3. Check some samples where Date is missing
    if (statusCount > dateCount) {
      console.log(`⚠️ WARNING: ${statusCount - dateCount} projects are Done but have NO Date!`)
      const problematicRows = await prisma.spmkMom.findMany({
        where: {
          goLive: 'Y',
          tanggalGolive: null
        },
        take: 3,
        select: { id: true, poName: true, tanggalMom: true, tanggalGolive: true }
      })
      console.log('Sample Problematic Rows:', problematicRows)
    }

    // 4. Check Date Range Distribution
    const dates = await prisma.spmkMom.findMany({
      where: { tanggalGolive: { not: null } },
      select: { tanggalGolive: true }
    })

    const years = {}
    dates.forEach(d => {
      const y = d.tanggalGolive.getFullYear()
      years[y] = (years[y] || 0) + 1
    })
    console.log('📅 Date Year Distribution:', years)

  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

debugGolive()
