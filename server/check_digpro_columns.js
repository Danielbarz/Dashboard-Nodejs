import prisma from './src/lib/prisma.js'

async function main() {
  try {
    console.log("--- CHECK DIGPRO COLUMNS ---");
    const cols = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'digital_products'
      ORDER BY column_name;
    `);
    console.table(cols);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
