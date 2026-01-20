import prisma from './src/lib/prisma.js'

async function main() {
  try {
    console.log("--- DEBUG DIGPRO DATA ---");
    
    // 1. Cek Top 5 Net Price Tertinggi
    const topRevenue = await prisma.$queryRawUnsafe(`
        SELECT order_number, net_price 
        FROM digital_products 
        ORDER BY net_price DESC 
        LIMIT 5
    `);
    console.log("Top 5 Revenue:", topRevenue);

    // 2. Cek Duplikasi Order Number
    const duplicates = await prisma.$queryRawUnsafe(`
        SELECT order_number, COUNT(*) as cnt
        FROM digital_products 
        GROUP BY order_number 
        HAVING COUNT(*) > 1 
        ORDER BY cnt DESC
        LIMIT 5
    `);
    console.log("Top 5 Duplicate Orders:", duplicates);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();