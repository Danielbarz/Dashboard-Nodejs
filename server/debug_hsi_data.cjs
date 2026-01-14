const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RSO2_WITELS = ['JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'BALI', 'NUSA TENGGARA'];

async function main() {
  console.log("--- DEBUG REVOKE DATA ---");

  // Filter for Follow Up Completed
  const query = `
      SELECT
        data_ps_revoke,
        COUNT(*) as count
      FROM hsi_data
      WHERE data_proses = 'REVOKE'
        AND status_resume = '102 | FOLLOW UP COMPLETED'
      GROUP BY data_ps_revoke
      ORDER BY count DESC
  `;

  try {
    const result = await prisma.$queryRawUnsafe(query);
    console.log(`\nDistribution of data_ps_revoke for '102 | FOLLOW UP COMPLETED':`);
    console.table(result.map(r => ({ ...r, count: Number(r.count) })));
  } catch (e) {
    console.error("Query Error:", e.message);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());