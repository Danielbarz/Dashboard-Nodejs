import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

async function main() {
  try {
    const RSO2_WITELS = ['JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'BALI', 'NUSA TENGGARA']
    
    // Test 1: getHSIDashboard Logic
    console.log('--- TEST 1: Dashboard Stats ---')
    const whereOrderDate = { 
        witel: { in: RSO2_WITELS },
        // Simulate date filter if needed, e.g. 2025
        orderDate: { gte: new Date('2025-01-01'), lte: new Date('2026-01-01') }
    } 
    
    const count = await prisma.hsiData.count({ where: whereOrderDate })
    console.log('Count (with Date):', count)
    
    const countAll = await prisma.hsiData.count({ where: { witel: { in: RSO2_WITELS } } })
    console.log('Count (All Time):', countAll)

    // Test 2: Flow Stats Logic (Raw SQL)
    console.log('\n--- TEST 2: Flow Stats ---')
    const conditions = [`witel IN ('${RSO2_WITELS.join("', '")}')`]
    const whereSql = `WHERE ${conditions.join(' AND ')}`
    
    const query = `SELECT COUNT(*) as re FROM hsi_data ${whereSql}`
    const result = await prisma.$queryRawUnsafe(query)
    console.log('Flow Stats Result:', result)

  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
