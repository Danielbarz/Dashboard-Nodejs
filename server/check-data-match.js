
import prisma from './src/lib/prisma.js'

async function main() {
  const start_date = '2025-01-01'
  const end_date = '2025-12-31'
  const segment = 'SME'
  const witel = ''

  let whereClause = {}
  if (start_date && end_date) {
    whereClause.orderDate = {
      gte: new Date(start_date),
      lte: new Date(end_date)
    }
  }

  if (segment) {
    const segmentList = segment.split(',').map(s => s.trim()).filter(s => s)
    if (segmentList.length > 0) {
      const expandedSegments = []
      segmentList.forEach(s => {
        if (s.toUpperCase() === 'SME') {
          expandedSegments.push('SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE')
        } else if (s.toUpperCase() === 'LEGS') {
          expandedSegments.push('LEGS', 'DGS', 'DPS', 'GOV', 'ENTERPRISE', 'REG')
        } else {
          expandedSegments.push(s)
        }
      })

      whereClause.OR = expandedSegments.map(s => ({
        segment: { contains: s, mode: 'insensitive' }
      }))
    }
  }

  const productFilter = {
    OR: [
      { productName: { contains: 'netmonk', mode: 'insensitive' } },
      { productName: { contains: 'oca', mode: 'insensitive' } },
      { productName: { contains: 'antares', mode: 'insensitive' } },
      { productName: { contains: 'camera', mode: 'insensitive' } },
      { productName: { contains: 'cctv', mode: 'insensitive' } },
      { productName: { contains: 'iot', mode: 'insensitive' } },
      { productName: { contains: 'recording', mode: 'insensitive' } },
      { productName: { contains: 'pijar', mode: 'insensitive' } }
    ]
  }

  const finalWhere = {
    AND: [
      whereClause,
      productFilter
    ]
  }

  console.log('Final Where:', JSON.stringify(finalWhere, null, 2))

  const count = await prisma.digitalProduct.count({
    where: finalWhere
  })

  console.log('Count:', count)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
