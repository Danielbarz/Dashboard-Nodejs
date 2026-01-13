import prisma from './src/lib/prisma.js'

async function checkPsSmeDetails() {
  try {
    const smeKeywords = ['SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE', 'ERM', 'MEDIA']
    
    const products = await prisma.digitalProduct.findMany({
      where: {
        productName: { contains: 'pijar', mode: 'insensitive' },
        netPrice: { gt: 0 } // Only check those with price
      },
      select: {
        status: true,
        orderDate: true,
        segment: true
      }
    })

    const smeProducts = products.filter(p => p.segment && smeKeywords.some(k => p.segment.toUpperCase().includes(k)))

    console.log(`Total PS SME with price > 0: ${smeProducts.length}`)

    // Analyze Statuses
    const statusCounts = {}
    smeProducts.forEach(p => {
        const s = p.status || 'NULL'
        statusCounts[s] = (statusCounts[s] || 0) + 1
    })
    console.log('\nStatuses found:')
    console.table(statusCounts)

    // Analyze Dates
    const dates = smeProducts.map(p => p.orderDate).filter(d => d).sort((a, b) => a - b)
    if (dates.length > 0) {
        console.log(`\nDate Range: ${dates[0].toISOString().split('T')[0]} to ${dates[dates.length - 1].toISOString().split('T')[0]}`)
    } else {
        console.log('\nNo dates found.')
    }

  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPsSmeDetails()
