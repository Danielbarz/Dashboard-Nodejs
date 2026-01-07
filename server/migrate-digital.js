
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("Starting Migration from DigitalProduct to DocumentData...");

  const total = await prisma.digitalProduct.count();
  console.log(`Found ${total} records to migrate.`);

  // Process in batches
  const BATCH_SIZE = 1000;
  let processed = 0;

  // Clean target table first
  console.log("Cleaning DocumentData table...");
  await prisma.$executeRaw`TRUNCATE TABLE "document_data" RESTART IDENTITY CASCADE`;

  while (processed < total) {
    const batch = await prisma.$queryRawUnsafe(`
      SELECT * FROM "digital_products"
      ORDER BY id
      LIMIT ${BATCH_SIZE} OFFSET ${processed}
    `);

    const mappedData = batch.map(row => ({
      orderId: row.order_number || `ORD-${row.id}`,
      product: row.product_name,
      netPrice: row.revenue, // revenue -> netPrice
      customerName: row.customer_name,
      namaWitel: row.witel,
      telda: row.branch,
      segment: row.segment,
      orderSubType: row.sub_type,
      statusWfm: row.status,
      orderDate: row.order_date || new Date(), // Fallback if null (shouldn't be based on check)
      channel: null,
      // Defaults
      isTemplatePrice: false,
      productsProcessed: false,
    }));

    await prisma.documentData.createMany({
      data: mappedData,
      skipDuplicates: true // In case re-running
    });

    processed += batch.length;
    console.log(`Migrated ${processed}/${total} records...`);
  }

  console.log("Migration Complete.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
