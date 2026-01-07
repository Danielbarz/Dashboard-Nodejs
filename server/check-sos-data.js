
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const sosCount = await prisma.sosData.count();
        console.log("SOS Data Rows:", sosCount);

        const unmappedCount = await prisma.sosData.count({
            where: {
                OR: [
                    { poName: null },
                    { poName: '' }
                ]
            }
        });
        console.log("Unmapped SOS Records:", unmappedCount);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
