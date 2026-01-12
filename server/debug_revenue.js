
import prisma from './src/lib/prisma.js';

async function main() {
  console.log("--- DEBUGGING REVENUE COLUMNS ---");
  
  const sample = await prisma.digitalProduct.findMany({
    take: 5,
    select: {
      orderNumber: true,
      revenue: true,
      amount: true,
      netPrice: true
    }
  });
  
  console.table(sample);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
