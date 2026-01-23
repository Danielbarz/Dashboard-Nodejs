import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting CORRECT seed...')

  // Clear existing data
  await prisma.digitalProduct.deleteMany()

  const validData = [
    // BALI Region
    {
      orderNumber: 'ORD-BALI-001',
      productName: 'Antares IoT Service', // Contains 'Antares'
      witel: 'DENPASAR', // Valid Witel
      branch: 'Denpasar',
      revenue: 5000000,
      amount: 1,
      status: 'complete',
      orderDate: new Date('2024-01-15'),
      subType: 'B2B'
    },
    {
      orderNumber: 'ORD-BALI-002',
      productName: 'Netmonk Monitoring', // Contains 'Netmonk'
      witel: 'SINGARAJA',
      branch: 'Singaraja',
      revenue: 3000000,
      amount: 1,
      status: 'in-progress',
      orderDate: new Date('2024-02-01'),
      subType: 'B2B'
    },

    // JATIM TIMUR
    {
      orderNumber: 'ORD-JATIM-001',
      productName: 'OCA Blast', // Contains 'OCA'
      witel: 'SIDOARJO',
      branch: 'Sidoarjo',
      revenue: 1500000,
      amount: 10,
      status: 'complete',
      orderDate: new Date('2024-01-20'),
      subType: 'B2B'
    },
    {
      orderNumber: 'ORD-JATIM-002',
      productName: 'Pijar Sekolah', // Contains 'Pijar'
      witel: 'JEMBER',
      branch: 'Jember',
      revenue: 7500000,
      amount: 5,
      status: 'complete',
      orderDate: new Date('2024-02-10'),
      subType: 'Education'
    },

    // SURAMADU
    {
      orderNumber: 'ORD-SURA-001',
      productName: 'Antares Eazy',
      witel: 'SURABAYA',
      branch: 'Surabaya',
      revenue: 12000000,
      amount: 2,
      status: 'complete',
      orderDate: new Date('2024-03-05'),
      subType: 'B2B'
    },
    
    // JATIM BARAT
    {
      orderNumber: 'ORD-JATIM-003',
      productName: 'Netmonk Prime',
      witel: 'MALANG',
      branch: 'Malang',
      revenue: 4500000,
      amount: 1,
      status: 'ps', // mapped to COMPLETED
      orderDate: new Date('2024-01-10'),
      subType: 'B2B'
    }
  ]

  for (const item of validData) {
    await prisma.digitalProduct.create({ data: item })
    console.log(`Created: ${item.orderNumber}`)
  }

  // Create Targets as well (so achievement shows up)
  await prisma.target.deleteMany()
  
  await prisma.target.createMany({
    data: [
      {
        dashboardType: 'DIGITAL',
        periodType: 'BULANAN',
        targetType: 'REVENUE',
        witel: 'ALL',
        product: 'ALL',
        value: 50000000, // 50jt Target
        periodDate: new Date('2024-01-01')
      },
       {
        dashboardType: 'DIGITAL',
        periodType: 'BULANAN',
        targetType: 'REVENUE',
        witel: 'ALL',
        product: 'ALL',
        value: 50000000, // 50jt Target
        periodDate: new Date('2024-02-01')
      }
    ]
  })
  console.log('Created Targets')

  console.log('✅ Correct Seed Finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
