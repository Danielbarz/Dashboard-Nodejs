
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getReportDetails() {
  try {
    // Simulate query params (empty)
    const start_date = undefined
    const end_date = undefined
    const segment = undefined
    const witel = undefined
    const status = undefined

    let whereClause = {}
    if (start_date && end_date) {
      whereClause.orderDate = {
        gte: new Date(start_date),
        lte: new Date(end_date)
      }
    }

    const productFilter = {
      OR: [
        { productName: { contains: 'netmonk', mode: 'insensitive' } },
        { productName: { contains: 'oca', mode: 'insensitive' } },
        { productName: { contains: 'antares', mode: 'insensitive' } },
        { productName: { contains: 'pijar', mode: 'insensitive' } }
      ]
    }

    const finalWhere = {
      AND: [
        whereClause,
        productFilter
      ]
    }

    console.log('Querying with:', JSON.stringify(finalWhere, null, 2))

    const data = await prisma.digitalProduct.findMany({
      where: finalWhere,
      take: 5
    })

    console.log(`Found ${data.length} rows`)
    if (data.length > 0) {
      console.log('Sample:', data[0])
    }

  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

getReportDetails()
