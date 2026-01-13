
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- DEBUG LAST_UPDATED_DATE DATA ---");

  const statuses = ['PS', 'CANCEL', 'REJECT_FCC'];
  
  for (const status of statuses) {
      console.log(`\nChecking status: ${status}`);
      const range = await prisma.hsiData.aggregate({
          where: { kelompokStatus: status },
          _min: { lastUpdatedDate: true },
          _max: { lastUpdatedDate: true },
          _count: { id: true }
      });
      console.log(`Count: ${range._count.id}`);
      console.log(`Min Last Updated: ${range._min.lastUpdatedDate}`);
      console.log(`Max Last Updated: ${range._max.lastUpdatedDate}`);
      
      const nullCount = await prisma.hsiData.count({
          where: { kelompokStatus: status, lastUpdatedDate: null }
      });
      console.log(`Rows with NULL Last Updated: ${nullCount}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

