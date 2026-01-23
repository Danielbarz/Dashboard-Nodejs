import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.sosData.findMany({
      distinct: ['liProductName'],
      select: {
        liProductName: true,
      },
      where: {
        liProductName: {
          not: null,
        },
      },
    });

    console.log('Products found in sos_data:');
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.liProductName}`);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
