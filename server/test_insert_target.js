import prisma from './src/lib/prisma.js'

async function main() {
  try {
    console.log("--- TEST INSERT TARGET ---");
    
    // Simulasi Data dari Frontend
    const reqBody = {
        periodType: 'BULANAN',
        targetType: 'REVENUE',
        witel: 'TEST_WITEL',
        product: 'TEST_PRODUCT',
        value: '15000000',
        periodDate: '2024-02-01',
        dashboardType: 'DATIN'
    };

    console.log("Data:", reqBody);

    const { periodType, targetType, witel, product, value, periodDate, dashboardType } = reqBody;

    // RAW QUERY PERSIS SEPERTI DI CONTROLLER
    await prisma.$executeRawUnsafe(`
      INSERT INTO targets (segment, metric_type, nama_witel, product_name, target_value, period, dashboard_type, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
    `, periodType, targetType, witel, product, parseFloat(value), new Date(periodDate), dashboardType || 'DIGITAL');

    console.log("SUCCESS: Target inserted!");

  } catch (e) {
    console.error("FAILED TO INSERT:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
