const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
  try {
    console.log("--- DEBUGGING SOS_DATA ---");
    
    // 1. Cek Total Data
    const count = await prisma.sosData.count();
    console.log(`Total Rows in sos_data: ${count}`);

    if (count === 0) {
      console.log("TABLE IS EMPTY!");
      return;
    }

    // 2. Cek Sample Witel (untuk melihat format penulisan)
    const witels = await prisma.sosData.groupBy({
      by: ['witelBaru'],
      _count: { id: true },
      take: 10,
      orderBy: { _count: { id: 'desc' } }
    });
    console.log("\nTop 10 Witel Baru (Raw):");
    console.table(witels);

    // 3. Cek Sample Kategori
    const categories = await prisma.sosData.groupBy({
      by: ['kategori'],
      _count: { id: true }
    });
    console.log("\nCategories found:");
    console.table(categories);

    // 4. Cek Sample Tanggal
    const dates = await prisma.sosData.aggregate({
      _min: { orderCreatedDate: true },
      _max: { orderCreatedDate: true }
    });
    console.log("\nDate Range:");
    console.log(dates);

  } catch (e) {
    console.error("ERROR:", e);
  } finally {
    await prisma.$disconnect();
  }
}

debug();
