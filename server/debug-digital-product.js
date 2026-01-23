import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

async function main() {
  try {
    const normalizedDataCTE = `
      WITH normalized_data AS (
        SELECT
          product_name,
          witel,
          CASE
            WHEN witel IN ('BALI', 'DENPASAR', 'SINGARAJA', 'GIANYAR', 'JEMBRANA', 'JIMBARAN', 'KLUNGKUNG', 'SANUR', 'TABANAN', 'UBUNG', 'BADUNG', 'BULELENG') THEN 'BALI'
            WHEN witel IN ('JATIM BARAT', 'MALANG', 'BATU', 'BLITAR', 'BOJONEGORO', 'KEDIRI', 'KEPANJEN', 'MADIUN', 'NGANJUK', 'NGAWI', 'PONOROGO', 'TRENGGALEK', 'TUBAN', 'TULUNGAGUNG') THEN 'JATIM BARAT'
            WHEN witel IN ('JATIM TIMUR', 'SIDOARJO', 'BANYUWANGI', 'BONDOWOSO', 'JEMBER', 'JOMBANG', 'LUMAJANG', 'MOJOKERTO', 'PASURUAN', 'PROBOLINGGO', 'SITUBONDO') THEN 'JATIM TIMUR'
            WHEN witel IN ('NUSA TENGGARA', 'NTB', 'NTT', 'ATAMBUA', 'BIMA', 'ENDE', 'KUPANG', 'LABOAN BAJO', 'LOMBOK BARAT TENGAH', 'LOMBOK TIMUR UTARA', 'MAUMERE', 'SUMBAWA', 'WAIKABUBAK', 'WAINGAPU', 'MATARAM', 'SUMBA') THEN 'NUSA TENGGARA'
            WHEN witel IN ('SURAMADU', 'SURABAYA', 'MADURA', 'BANGKALAN', 'GRESIK', 'KENJERAN', 'KETINTANG', 'LAMONGAN', 'MANYAR', 'PAMEKASAN', 'TANDES') THEN 'SURAMADU'
            ELSE 'OTHER' 
          END as region_norm,
          CASE
            WHEN product_name ILIKE '%Netmonk%' THEN 'Netmonk'
            WHEN product_name ILIKE '%OCA%' THEN 'OCA'
            WHEN product_name ILIKE '%Pijar%' THEN 'Pijar'
            WHEN product_name ILIKE '%Antares%' OR product_name ILIKE '%IOT%' OR product_name ILIKE '%CCTV%' THEN 'Antares'
            ELSE 'OTHER'
          END as product_norm
        FROM digital_products
      )
    `

    console.log('--- DEBUG: Raw Distribution ---')
    const distribution = await prisma.$queryRawUnsafe(`
      ${normalizedDataCTE}
      SELECT region_norm, product_norm, COUNT(*)::int as count
      FROM normalized_data
      GROUP BY region_norm, product_norm
      ORDER BY count DESC
    `)
    console.table(distribution)

    console.log('\n--- DEBUG: Filtered KPIs (Simulation) ---')
    // Simulating the filterCondition used in controller: WHERE region_norm != 'OTHER' AND product_norm != 'OTHER'
    const kpi = await prisma.$queryRawUnsafe(`
      ${normalizedDataCTE}
      SELECT
        COUNT(*)::int as total,
        SUM(CASE WHEN region_norm != 'OTHER' AND product_norm != 'OTHER' THEN 1 ELSE 0 END)::int as valid_rows
      FROM normalized_data
    `)
    console.log('Total Rows in Table:', kpi[0].total)
    console.log('Rows passing filters (NOT OTHER):', kpi[0].valid_rows)

  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
