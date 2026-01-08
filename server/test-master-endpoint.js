
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Testing getUnmappedOrders query...");
        
        const unmappedOrders = await prisma.sosData.findMany({
            where: {
                OR: [
                    { poName: null },
                    { poName: '' }
                ]
            },
            select: {
                id: true,
                orderId: true,
                nipnas: true,
                standardName: true,
                custCity: true,
                servCity: true,
                billWitel: true,
                billCity: true,
                segmen: true,
                poName: true
            },
            take: 100,
            orderBy: { createdAt: 'desc' }
        });

        console.log(`Query returned ${unmappedOrders.length} records.`);
        if (unmappedOrders.length > 0) {
            console.log("First record sample:", unmappedOrders[0]);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
