
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const netmonk = await prisma.documentData.count({
            where: { product: { contains: 'NETMONK', mode: 'insensitive' } }
        });
        const oca = await prisma.documentData.count({
            where: { product: { contains: 'OCA', mode: 'insensitive' } }
        });
        const antares = await prisma.documentData.count({
            where: { product: { contains: 'ANTARES', mode: 'insensitive' } }
        });
        const pijar = await prisma.documentData.count({
            where: { product: { contains: 'PIJAR', mode: 'insensitive' } }
        });

        console.log({ netmonk, oca, antares, pijar });

        // Check what products ARE there
        const sampleProducts = await prisma.documentData.findMany({
            select: { product: true },
            take: 5
        });
        console.log("Samples:", sampleProducts);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
