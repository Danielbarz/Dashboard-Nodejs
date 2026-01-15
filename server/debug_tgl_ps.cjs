
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- DEBUG TGL_PS DATA ---");

  // Check TGL_PS range for specific statuses
  const statuses = ['PS', 'CANCEL', 'REJECT_FCC'];
  
  for (const status of statuses) {
      console.log(`\nChecking status: ${status}`);
      const range = await prisma.hsiData.aggregate({
          where: { kelompokStatus: status },
          _min: { tglPs: true },
          _max: { tglPs: true },
          _count: { id: true }
      });
      console.log(`Count: ${range._count.id}`);
      console.log(`Min Tgl PS: ${range._min.tglPs}`);
      console.log(`Max Tgl PS: ${range._max.tglPs}`);
      
      // Sample empty/null tgl_ps
      const nullCount = await prisma.hsiData.count({
          where: { kelompokStatus: status, tglPs: null }
      });
      console.log(`Rows with NULL Tgl PS: ${nullCount}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

