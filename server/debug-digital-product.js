import { PrismaClient } from './src/generated/client/index.js';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- DEBUG DIGITAL PRODUCT REVENUE ---');

    // 1. Check Raw Data Count
    const totalCount = await prisma.digitalProduct.count();
    console.log(`Total Rows in digital_products: ${totalCount}`);

    if (totalCount === 0) {
      console.log('❌ Table digital_products is EMPTY.');
      return;
    }

    // 2. Check Status Values
    const statuses = await prisma.$queryRawUnsafe(`
      SELECT status, COUNT(*) as count 
      FROM digital_products 
      GROUP BY status 
      ORDER BY count DESC
    `);
    console.log('\nStatuses in DB:');
    console.table(statuses);

    // 3. Check Revenue Values (Sample)
    console.log('\nChecking Net Price Sample (Non-zero):');
    const netPriceSample = await prisma.digitalProduct.findMany({
      where: { netPrice: { not: 0 } },
      take: 5,
      select: { orderNumber: true, status: true, revenue: true, netPrice: true, productName: true }
    });
    console.table(netPriceSample);

    // 4. Test KPI Query Logic (Completed Revenue using netPrice)
    const kpiTest = await prisma.$queryRawUnsafe(`
      SELECT
        SUM(CASE WHEN status ILIKE '%complete%' OR status ILIKE '%ps%' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN status ILIKE '%complete%' OR status ILIKE '%ps%' THEN COALESCE(net_price, 0) ELSE 0 END) as total_revenue_net
      FROM digital_products
    `);
    console.log('\nKPI Query Result (Using net_price):');
    console.table(kpiTest);

    // 5. Test Revenue by Witel (Normalization Check)
    const witelRevenue = await prisma.$queryRawUnsafe(`
      SELECT 
        witel, 
        SUM(COALESCE(revenue,0)) as total_rev
      FROM digital_products
      GROUP BY witel
      ORDER BY total_rev DESC
      LIMIT 10
    `);
    console.log('\nRevenue by Witel (Raw):');
    console.table(witelRevenue);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
