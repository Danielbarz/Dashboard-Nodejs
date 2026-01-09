
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.sosData.count();
    console.log(`Total SOS Records: ${count}`);

    const nullDates = await prisma.sosData.count({
      where: { orderCreatedDate: null }
    });
    console.log(`Records with NULL orderCreatedDate: ${nullDates}`);

    const dateRange = await prisma.sosData.aggregate({
      _min: { orderCreatedDate: true },
      _max: { orderCreatedDate: true }
    });
    console.log(`Min Date: ${dateRange._min.orderCreatedDate}`);
    console.log(`Max Date: ${dateRange._max.orderCreatedDate}`);

    const sample = await prisma.sosData.findMany({
      take: 5,
      select: { orderId: true, orderCreatedDate: true }
    });
    console.log('Sample Data:', sample);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
