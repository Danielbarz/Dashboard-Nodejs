import prisma from './src/lib/prisma.js'

async function main() {
  try {
    console.log("--- CHECK COLUMN TYPE 'usia' ---");
    const cols = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'spmk_mom' AND column_name = 'usia';
    `);
    console.table(cols);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
