
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.documentData.groupBy({
            by: ['namaWitel'],
            where: {
                product: { contains: 'NETMONK', mode: 'insensitive' }
            },
            _count: { id: true },
            orderBy: { namaWitel: 'asc' }
        });
        console.log("Witels for Netmonk:", result);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
