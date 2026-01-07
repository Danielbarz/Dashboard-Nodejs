import prisma from './src/lib/prisma.js'

async function testData() {
  try {
    const data = await prisma.sosData.findFirst({
      select: {
        orderId: true,
        poName: true,
        standardName: true,
        liProductName: true,
        segmen: true,
        subSegmen: true,
        kategoriUmur: true,
        billWitel: true,
        serviceWitel: true,
        liMilestone: true,
        biayaPasang: true,
        hrgBulanan: true,
        lamaKontrakHari: true,
        agreeType: true,
        orderCreatedDate: true,
        liStatus: true,
        nipnas: true,
        custWitel: true,
        billCity: true,
        revenue: true
      }
    })
    
    if (data) {
      console.log('✓ Data found in SosData table:')
      console.log(JSON.stringify(data, null, 2))
    } else {
      console.log('✗ No data found in SosData table')
    }
    
    const count = await prisma.sosData.count()
    console.log(`\nTotal records in SosData: ${count}`)
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testData()
