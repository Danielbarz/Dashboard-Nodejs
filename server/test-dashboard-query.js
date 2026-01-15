import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const RSO2_WITELS = ['JATIM BARAT', 'JATIM TIMUR', 'SURAMADU', 'BALI', 'NUSA TENGGARA']

async function testQuery() {
    console.log("Starting EXPORT query test...");

    // Simulate params for Export
    const witel = "";
    const branch = "";
    const startDate = "";
    const endDate = "";
    const detail_category = "Revoke";
    const export_detail = "true";

    let sqlConditions = [`witel IN ('${RSO2_WITELS.join("','")}')`]

    if (witel && witel.trim()) {
        const witelArr = witel.split(',').map(w => w.trim()).filter(w => w !== '')
        if (witelArr.length > 0) sqlConditions.push(`witel IN ('${witelArr.join("','")}')`)
    }

    if (detail_category === 'Revoke') {
         sqlConditions.push("data_proses = 'REVOKE'");
    }

    const whereSql = sqlConditions.length > 0 ? `WHERE ${sqlConditions.join(' AND ')}` : '';

    // EXPORT QUERY
    const query = `
        SELECT
            order_id, order_date, customer_name, witel, sto, type_layanan,
            kelompok_status, status_resume, data_proses, status_message, witel_old
        FROM hsi_data
        ${whereSql}
        ORDER BY order_date DESC
    `;

    console.log("Query:", query);

    try {
        const data = await prisma.$queryRawUnsafe(query);
        console.log("Success! Data found:", data.length);
        if (data.length > 0) {
            console.log("Sample row:", data[0]);
        }
    } catch (e) {
        console.error("Query failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testQuery();