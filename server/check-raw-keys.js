
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.$queryRaw`SELECT * FROM "digital_products" LIMIT 1`;
        console.log("Raw Row Keys:", Object.keys(result[0]));
        console.log("order_date value:", result[0].order_date);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
