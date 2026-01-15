import { PrismaClient } from './src/generated/client/index.js';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('--- DEBUG BRANCH CODES FOR MAPPING ---');

    const regions = ['JATIM BARAT', 'JATIM TIMUR', 'NUSA TENGGARA', 'SURAMADU'];
    
    // We need to use the same logic to identify regions first
    const REGION_CASE = `
      CASE
        WHEN witel IN ('JATIM BARAT', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG') THEN 'JATIM BARAT'
        WHEN witel IN ('JATIM TIMUR', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO') THEN 'JATIM TIMUR'
        WHEN witel IN ('NUSA TENGGARA', 'NTB', 'NTT', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA') THEN 'NUSA TENGGARA'
        WHEN witel IN ('SURAMADU', 'SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES') THEN 'SURAMADU'
        ELSE 'OTHER' 
      END
    `;

    const branches = await prisma.$queryRawUnsafe(`
      SELECT 
        ${REGION_CASE} as region,
        branch, 
        COUNT(*) as count
      FROM digital_products
      WHERE ${REGION_CASE} IN ('${regions.join("','")}')
      GROUP BY region, branch
      ORDER BY region, count DESC
    `);

    console.table(branches);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
