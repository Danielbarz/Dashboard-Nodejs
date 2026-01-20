import prisma from './src/lib/prisma.js'

async function main() {
  try {
    console.log("--- DEBUG JT TOC ---");
    
    // Cek isi status_tomps_last_activity untuk data On Progress
    const tocStats = await prisma.spmkMom.groupBy({
      by: ['statusTompsLastActivity'],
      where: { goLive: 'N', populasiNonDrop: 'Y' },
      _count: { id: true }
    });
    console.log("TOC Stats (On Progress):", tocStats);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();