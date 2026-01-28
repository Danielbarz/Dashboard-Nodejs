import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function fixNullStrings() {
  console.log('🧹 Cleaning string "null" from database tables...');
  try {
    const rawResult = await prisma.$executeRawUnsafe(`
      UPDATE digital_product_raws 
      SET product = '' WHERE product = 'null';
    `);
    
    const finalResult = await prisma.$executeRawUnsafe(`
      UPDATE digital_products 
      SET product = '' WHERE product = 'null';
    `);

    console.log(`✅ Fixed ${rawResult} rows in Raw table.`);
    console.log(`✅ Fixed ${finalResult} rows in Final table.`);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

fixNullStrings();