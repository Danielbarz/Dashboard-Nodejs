import prisma from './src/lib/prisma.js'

async function main() {
  try {
    console.log("--- TEST GET UNMAPPED ---");
    
    const region3Witels = [
      'BALI', 'JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU',
      'MALANG', 'SIDOARJO'
    ]
    const witelList = region3Witels.map(w => `'${w}'`).join(',')

    const sql = `
      SELECT id, order_id, po_name, bill_witel
      FROM sos_data 
      WHERE (po_name IS NULL OR po_name = '' OR po_name = '-')
      AND UPPER(bill_witel) IN (${witelList})
      LIMIT 5
    `;
    
    console.log("SQL:", sql);

    const data = await prisma.$queryRawUnsafe(sql);
    console.log("Result Count:", data.length);
    console.table(data);

  } catch (e) {
    console.error("ERROR:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
