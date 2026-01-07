
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Seeding one dummy Unmapped Order into sos_data...");

        const dummy = await prisma.sosData.create({
            data: {
                orderId: "DUMMY-" + Date.now(),
                nipnas: "123456",
                standardName: "DUMMY CLIENT PT",
                poName: null, // This ensures it shows up in "Unmapped"
                revenue: 5000000,
                billWitel: "JATIM TIMUR",
                kategori: "Datin",
                liStatus: "Completed"
            }
        });

        console.log("Created Dummy Record:", dummy);
        console.log("You should now see 1 record in Master Data PO > Unmapped Orders.");

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
