import prisma from './src/lib/prisma.js'

async function debugJatimDetails() {
  try {
    const records = await prisma.sosData.findMany({
      where: {
        custWitel: { contains: 'JATIM BARAT' }
      },
      select: {
        custCity: true,
        orderCreatedDate: true,
        liStatus: true,
        segmen: true
      }
    })

    console.log(`Total JATIM BARAT records: ${records.length}`)

    // Check Madiun
    const madiuns = records.filter(r => (r.custCity || '').toUpperCase().includes('MADIUN'))
    console.log(`\n--- MADIUN Records (${madiuns.length}) ---`)
    madiuns.forEach(r => {
        console.log(`Date: ${r.orderCreatedDate ? r.orderCreatedDate.toISOString().split('T')[0] : 'NULL'}, Status: ${r.liStatus}, Segment: ${r.segmen}`)
    })

    // Check SME records that ended up lump-summed
    // Valid branches:
    const validBranches = ['KEDIRI', 'MADIUN', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEPANJEN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG']

    console.log('\n--- JATIM BARAT SME LUMP Records ---')
    const smeLumps = records.filter(r => {
        const seg = (r.segmen || '').toUpperCase()
        const isSme = ['SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE'].some(k => seg.includes(k))
        if (!isSme) return false

        // Exclude ones that match a valid branch in City
        const city = (r.custCity || '').toUpperCase()
        const matchesBranch = validBranches.some(b => city.includes(b))

        return !matchesBranch
    })

    console.log(`Count: ${smeLumps.length}`)
    smeLumps.forEach(r => {
        console.log(`City: "${r.custCity}", Date: ${r.orderCreatedDate?.toISOString().split('T')[0]}, Seg: ${r.segmen}`)
    })


  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

debugJatimDetails()
