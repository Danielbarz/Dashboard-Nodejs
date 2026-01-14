
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // List of columns to ensure exist
    const columns = [
      'serv_city', 'service_witel', 'li_billdate', 'li_status_date', 
      'is_termin', 'agree_type', 'agree_start_date', 'agree_end_date', 
      'lama_kontrak_hari', 'amortisasi', 'kategori_umur', 'umur_order', 
      'bill_city', 'po_name', 'tipe_order', 'segmen_baru', 'scalling1', 
      'scalling2', 'tipe_grup', 'witel_baru', 'kategori_baru'
    ];

    for (const col of columns) {
      try {
        // Simple hack to add column if not exists (Postgres specific)
        // Defaulting to TEXT for safety, can be cast later if needed.
        let type = 'TEXT';
        if (col.includes('date')) type = 'TIMESTAMPTZ';
        if (col.includes('hari') || col.includes('umur')) type = 'TEXT'; // or INTEGER, keeping text for safety

        await prisma.$executeRawUnsafe(`ALTER TABLE "sos_data" ADD COLUMN IF NOT EXISTS "${col}" ${type};`);
        console.log(`✅ Column "${col}" ensured.`);
      } catch (e) {
        console.log(`⚠️ Could not add "${col}": ${e.message}`);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
