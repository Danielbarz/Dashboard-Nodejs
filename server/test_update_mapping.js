import prisma from './src/lib/prisma.js'

async function main() {
  try {
    console.log("--- TEST UPDATE MAPPING ---");
    
    // Ambil satu ID unmapped
    const target = await prisma.$queryRawUnsafe(`
        SELECT id, po_name FROM sos_data 
        WHERE po_name IS NULL OR po_name = '' 
        LIMIT 1
    `);

    if (target.length === 0) {
        console.log("No unmapped data found to test.");
        return;
    }

    const idToUpdate = target[0].id;
    console.log("Target ID:", idToUpdate, "Current PO:", target[0].po_name);

    // Coba Update Raw
    const result = await prisma.$executeRawUnsafe(`
      UPDATE sos_data 
      SET po_name = 'TEST_MANUAL_UPDATE', updated_at = NOW() 
      WHERE id = $1
    `, idToUpdate);

    console.log("Update Result (Rows Affected):", result);

    // Verifikasi
    const check = await prisma.$queryRawUnsafe(`SELECT po_name FROM sos_data WHERE id = $1`, idToUpdate);
    console.log("New PO:", check[0].po_name);

    // Rollback (Optional)
    await prisma.$executeRawUnsafe(`UPDATE sos_data SET po_name = NULL WHERE id = $1`, idToUpdate);
    console.log("Rolled back.");

  } catch (e) {
    console.error("UPDATE FAILED:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
