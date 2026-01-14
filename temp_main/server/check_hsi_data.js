
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const count = await prisma.hsiData.count()
    console.log(`Total HSI Rows: ${count}`)
    
    if (count > 0) {
      const dates = await prisma.hsiData.aggregate({
        _min: { orderDate: true },
        _max: { orderDate: true }
      })
      console.log('Date Range:', dates)
      
      const sample = await prisma.hsiData.findFirst()
      console.log('Sample Row:', JSON.stringify(sample, null, 2))
    }
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
