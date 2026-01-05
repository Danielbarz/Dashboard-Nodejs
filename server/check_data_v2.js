
import prisma from './src/lib/prisma.js'

async function checkData() {
  try {
    const totalCount = await prisma.sosData.count()
    const validDateCount = await prisma.sosData.count({
      where: {
        orderCreatedDate: { not: null }
      }
    })

    console.log(`Total Records: ${totalCount}`)
    console.log(`Records with valid Date: ${validDateCount}`)

    if (validDateCount > 0) {
      const sample = await prisma.sosData.findFirst({
        where: { orderCreatedDate: { not: null } },
        select: { orderCreatedDate: true, segmen: true, custWitel: true, liProductName: true }
      })
      console.log('Sample Record:', sample)

      const minDate = await prisma.sosData.aggregate({
        _min: { orderCreatedDate: true }
      })
      const maxDate = await prisma.sosData.aggregate({
        _max: { orderCreatedDate: true }
      })
      console.log('Date Range:', minDate._min.orderCreatedDate, 'to', maxDate._max.orderCreatedDate)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkData()
