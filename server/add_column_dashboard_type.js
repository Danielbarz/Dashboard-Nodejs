import prisma from './src/lib/prisma.js'

async function main() {
  try {
    console.log("Checking if 'dashboard_type' column exists in 'targets' table...");
    
    // Check if column exists (Postgres specific)
    const result = await prisma.$queryRawUnsafe(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='targets' AND column_name='dashboard_type';
    `);

    if (result.length === 0) {
      console.log("Column 'dashboard_type' missing. Adding it now...");
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "targets" 
        ADD COLUMN "dashboard_type" VARCHAR(50) DEFAULT 'DIGITAL';
      `);
      console.log("Column added successfully!");
    } else {
      console.log("Column 'dashboard_type' already exists.");
    }

  } catch (e) {
    console.error("Error adding column:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
