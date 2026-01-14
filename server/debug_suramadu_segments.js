
import prisma from './src/lib/prisma.js';

async function main() {
  console.log("--- DEBUGGING SEGMENT VALUES IN SURAMADU ---");

  const segments = await prisma.digitalProduct.groupBy({
    by: ['segment'],
    where: {
      witel: { contains: 'SURAMADU' }
    },
    _count: {
      id: true
    }
  });

  console.table(segments);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
