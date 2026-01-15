
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: './server/.env' });
const prisma = new PrismaClient();

async function main() {
    try {
        const url = process.env.DATABASE_URL;
        console.log("Connecting to:", url ? url.substring(0, 20) + "..." : "UNDEFINED");

        // 1. Check Table Counts
        console.log("\nChecking Table Counts:");

        const sosCount = await prisma.sosData.count();
        console.log(`- sos_data (SosData): ${sosCount} rows`);

        const docCount = await prisma.digitalProduct.count();
        console.log(`- digital_products (DigitalProduct): ${docCount} rows`);

        const userCount = await prisma.user.count();
        console.log(`- users: ${userCount} rows`);

        // 3. Check "Unmapped" and "PO Master" counts
        const unmappedCount = await prisma.sosData.count({
            where: {
                OR: [
                    { poName: null },
                    { poName: '' }
                ]
            }
        });
        console.log(`\n- Unmapped SOS Orders (poName is null/empty): ${unmappedCount}`);

        const poMasterCount = await prisma.poMaster.count();
        console.log(`- PO Master List (po_master): ${poMasterCount} rows`);


    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
