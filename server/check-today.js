
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const todayStr = '2026-01-07';
        const start = new Date(`${todayStr}T00:00:00.000Z`);
        const end = new Date(`${todayStr}T23:59:59.999Z`);

        const count = await prisma.documentData.count({
            where: {
                orderDate: {
                    gte: start,
                    lte: end
                }
            }
        });
        console.log(`Orders for ${todayStr}:`, count);

        const total = await prisma.documentData.count();
        console.log("Total Orders:", total);

         const sample = await prisma.documentData.findFirst({
             take: 1
        });
        console.log("Sample:", sample);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
