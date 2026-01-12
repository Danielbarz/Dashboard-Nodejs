import prisma from './src/lib/prisma.js';

async function main() {
  console.log("--- DEBUGGING REPORT ANALYSIS LOGIC ---");

  // 1. Fetch Sample AE Data
  const sampleAE = await prisma.digitalProduct.findMany({
    where: {
      productName: { contains: 'Antares', mode: 'insensitive' }
    },
    take: 10,
    select: {
      productName: true,
      segment: true,
      witel: true,
      status: true
    }
  });

  console.log("\n1. SAMPLE AE DATA (FROM DB):");
  console.table(sampleAE);

  // 2. Simulate Logic
  const smeKeywords = ['SME', 'DSS', 'RBS', 'RETAIL', 'UMKM', 'FINANCIAL', 'LOGISTIC', 'TOURISM', 'MANUFACTURE', 'ERM', 'MEDIA'];
  const legsKeywords = ['LEGS', 'DGS', 'DPS', 'GOV', 'ENTERPRISE', 'REG', 'BUMN', 'SOE', 'GOVERNMENT'];

  console.log("\n2. SIMULATION:");
  
  sampleAE.forEach((row, idx) => {
    console.log(`\nRow #${idx + 1}: ${row.productName}`);
    
    // Check Product Code
    let productCode = '';
    const pName = (row.productName || '').toLowerCase();
    if (pName.includes('netmonk')) productCode = 'n';
    else if (pName.includes('oca')) productCode = 'o';
    else if (pName.includes('antares') || pName.includes('camera') || pName.includes('cctv') || pName.includes('iot') || pName.includes('recording') || pName.includes('eazy')) productCode = 'ae';
    else if (pName.includes('pijar')) productCode = 'ps';
    
    console.log(`   -> Product Code: '${productCode}' (Expected: 'ae')`);

    // Check Segment
    const seg = (row.segment || '').toUpperCase();
    const isSME = smeKeywords.some(k => seg.includes(k));
    const isLEGS = legsKeywords.some(k => seg.includes(k));
    
    console.log(`   -> Segment: '${seg}'`);
    console.log(`   -> Match SME? ${isSME}`);
    console.log(`   -> Match LEGS? ${isLEGS}`);

    // Check Witel Mapping
    const rawWitel = (row.witel || '').toUpperCase();
    let mappedName = null;
    
    if (rawWitel.includes('BALI') || rawWitel.includes('DENPASAR') || rawWitel.includes('SINGARAJA') || rawWitel.includes('BADUNG')) mappedName = 'BALI';
    else if (rawWitel.includes('BARAT') || rawWitel.includes('KEDIRI') || rawWitel.includes('MADIUN') || rawWitel.includes('MALANG')) mappedName = 'JATIM BARAT';
    else if (rawWitel.includes('TIMUR') || rawWitel.includes('JEMBER') || rawWitel.includes('PASURUAN') || rawWitel.includes('SIDOARJO')) mappedName = 'JATIM TIMUR';
    else if (rawWitel.includes('NUSA') || rawWitel.includes('NTB') || rawWitel.includes('NTT') || rawWitel.includes('KUPANG') || rawWitel.includes('MATARAM')) mappedName = 'NUSA TENGGARA';
    else if (rawWitel.includes('SURAMADU') || rawWitel.includes('MADURA') || rawWitel.includes('SURABAYA') || rawWitel.includes('GRESIK')) mappedName = 'SURAMADU';

    console.log(`   -> Witel: '${rawWitel}' => Mapped: '${mappedName}'`);

    if (!productCode) console.log("   ❌ FAILED: Product Code not detected");
    if (!isSME && !isLEGS) console.log("   ❌ FAILED: Segment not matched (neither SME nor LEGS)");
    if (!mappedName) console.log("   ❌ FAILED: Witel not mapped");
    if (productCode && (isSME || isLEGS) && mappedName) console.log("   ✅ SUCCESS: This row should appear in report!");
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
