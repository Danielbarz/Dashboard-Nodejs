import prisma from './src/lib/prisma.js';

async function main() {
  console.log("--- DEBUGGING SPECIFIC AOs ---");

  // 1. Get Config for Dwieka & Ferizka
  const aos = await prisma.accountOfficer.findMany({
    where: {
      name: { in: ['Dwieka Septian', 'Ferizka Paramita', 'Ferizka Paramitha'] } // Handling potential typo in name
    }
  });
  console.log("\n1. AO CONFIGURATION:");
  console.table(aos);

  if (aos.length === 0) {
    console.log("No AO found with these names. Check spelling.");
    return;
  }

  // 2. Get Distinct Witels from Digital Product Data
  const distinctWitels = await prisma.digitalProduct.findMany({
    distinct: ['witel'],
    select: { witel: true },
    orderBy: { witel: 'asc' }
  });
  const availableWitels = distinctWitels.map(d => d.witel).filter(Boolean);
  
  console.log("\n2. AVAILABLE WITELS IN DATA (First 20):");
  console.log(availableWitels.slice(0, 20));

  // 3. Simulate Matching
  console.log("\n3. MATCHING ANALYSIS:");
  
  for (const ao of aos) {
    console.log(`\nChecking AO: ${ao.name}`);
    const targetWitels = (ao.filterWitelLama || '').split(',').map(s => s.trim().toUpperCase());
    console.log(`   Targets: ${JSON.stringify(targetWitels)}`);
    
    // Find matching witels in DB
    const matches = availableWitels.filter(w => targetWitels.some(t => w.toUpperCase().includes(t)));
    console.log(`   Matches Found in DB: ${JSON.stringify(matches)}`);
    
    if (matches.length > 0) {
      // Check count for first match
      const count = await prisma.digitalProduct.count({
        where: { witel: matches[0] }
      });
      console.log(`   Row count for '${matches[0]}': ${count}`);
    } else {
      console.log("   ❌ NO MATCHING WITELS FOUND IN DATA!");
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
