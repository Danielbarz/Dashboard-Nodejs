import prisma from './src/lib/prisma.js'

async function investigateAnomaly() {
  try {
    const products = await prisma.digitalProduct.findMany({
      where: {
        OR: [
          { productName: { contains: 'antares', mode: 'insensitive' } },
          { productName: { contains: 'camera', mode: 'insensitive' } },
          { productName: { contains: 'cctv', mode: 'insensitive' } },
          { productName: { contains: 'iot', mode: 'insensitive' } },
          { productName: { contains: 'eazy', mode: 'insensitive' } }
        ],
        witel: { in: ['BALI', 'MADIUN'] },
        // segment: { contains: 'SME', mode: 'insensitive' } // Assuming SME based on previous context, but let's check all
      },
      select: {
        productName: true,
        netPrice: true,
        witel: true,
        segment: true
      }
    })

    const extractPrice = (text) => {
       if (!text) return 0
       const match = text.match(/Total (Sebelum PPN)\s*:\s*([0-9]+)/i)
       if (match) return parseInt(match[1])
       return 0
    }

    const anomalies = products.map(p => {
        let amount = Number(p.netPrice || 0)
        let source = 'netPrice'
        
        if (amount === 0) {
            amount = extractPrice(p.productName)
            source = 'extracted'
        }

        return { ...p, amount, source }
    }).filter(p => p.amount > 100000000) // Filter for amounts > 100 Million

    console.log(`Found ${anomalies.length} anomalies > 100 Million IDR`)
    
    if (anomalies.length > 0) {
        console.table(anomalies.sort((a, b) => b.amount - a.amount).slice(0, 5))
        
        console.log('\n--- Detail Sample Anomaly ---')
        console.log('Product Name:', anomalies[0].productName)
        console.log('Extracted Amount:', anomalies[0].amount)
        console.log('Source:', anomalies[0].source)
    }

  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

investigateAnomaly()
