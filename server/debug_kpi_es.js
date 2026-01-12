
import prisma from './src/lib/prisma.js';

async function main() {
  console.log("--- DEBUGGING KPI PO DATA ---");

  // 1. Check Distinct Channels
  const channels = await prisma.digitalProduct.findMany({
    distinct: ['channel'],
    select: { channel: true }
  });
  console.log("\n1. UNIQUE CHANNELS FOUND:");
  console.table(channels);

  // 2. Check Distinct Statuses
  const statuses = await prisma.digitalProduct.findMany({
    distinct: ['status'],
    select: { status: true }
  });
  console.log("\n2. UNIQUE STATUSES FOUND:");
  console.table(statuses);

  // 3. Check a sample of rows (first 10)
  const sample = await prisma.digitalProduct.findMany({
    take: 10,
    select: {
      orderNumber: true,
      productName: true,
      witel: true,
      status: true,
      channel: true
    }
  });
  console.log("\n3. SAMPLE DATA (First 10 rows):");
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
