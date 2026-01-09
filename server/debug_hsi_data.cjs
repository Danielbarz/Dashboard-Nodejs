

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RSO2_WITELS = ['JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'BALI', 'NUSA TENGGARA'];

async function main() {
  console.log("--- DEBUG QUERY EXECUTION ---");

  const start_date = '2026-01-01';
  const end_date = '2026-01-31';

  // Safer construction logic
  const witelString = RSO2_WITELS.map(w => `'${w.toUpperCase()}'`).join(', ');
  console.log("Witel String:", witelString);

  const conditions = [`UPPER(witel) IN (${witelString})`];
  conditions.push(`order_date >= '${start_date}'::date`);
  conditions.push(`order_date < ('${end_date}'::date + INTERVAL '1 day')`);

  const whereSql = `WHERE ${conditions.join(' AND ')}`;
  console.log("Where Clause:", whereSql);

  const query = `
      SELECT
        witel,
        witel_old,
        COUNT(*) as registered
      FROM hsi_data
      ${whereSql}
      GROUP BY witel, witel_old
      ORDER BY witel
  `;

  try {
    const result = await prisma.$queryRawUnsafe(query);
    console.log(`\nReturned ${result.length} rows.`);
    if (result.length > 0) {
        console.log("Sample Data:", result.slice(0, 3));
    }
  } catch (e) {
    console.error("Query Error:", e.message);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
