import prisma from './src/lib/prisma.js'

async function main() {
  try {
    console.log("Checking columns in 'targets' table...");
    const cols = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'targets';
    `);
    console.table(cols);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
