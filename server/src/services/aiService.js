import { PrismaClient } from '../generated/client/index.js'

// Use the existing global prisma instance if possible, or create a new one
// Ideally we should reuse the one from ../lib/prisma.js but importing it here might cause circular deps depending on structure
// For safety, we use a new client but pointing to the same DB URL.
const prisma = new PrismaClient();

const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(val) || 0);
};

const formatNumber = (val) => {
    return new Intl.NumberFormat('id-ID').format(Number(val) || 0);
};

export const askAi = async (message, context) => {
    try {
        const lowerMsg = message.toLowerCase();
        let sql = '';
        let resultText = '';
        let data = [];

        // --- INTENT RECOGNITION ---

        // 1. HSI REVENUE / ORDER
        if (lowerMsg.includes('hsi') && (lowerMsg.includes('order') || lowerMsg.includes('total'))) {
            sql = `SELECT COUNT(*) as total FROM hsi_data`;
            const res = await prisma.$queryRawUnsafe(sql);
            resultText = `Total Order HSI saat ini adalah **${formatNumber(res[0].total)}** order.`;
        }
        
        // 2. HSI COMPLETED / PS
        else if (lowerMsg.includes('hsi') && (lowerMsg.includes('ps') || lowerMsg.includes('complete'))) {
            sql = `SELECT COUNT(*) as total FROM hsi_data WHERE status_resume = 'PS'`;
            const res = await prisma.$queryRawUnsafe(sql);
            resultText = `Jumlah order HSI yang sudah Completed (PS) adalah **${formatNumber(res[0].total)}** order.`;
        }

        // 3. TOP WITEL HSI
        else if (lowerMsg.includes('hsi') && lowerMsg.includes('top') && lowerMsg.includes('witel')) {
            sql = `
                SELECT witel, COUNT(*) as total 
                FROM hsi_data 
                GROUP BY witel 
                ORDER BY total DESC 
                LIMIT 5
            `;
            const res = await prisma.$queryRawUnsafe(sql);
            const list = res.map((r, i) => `${i+1}. ${r.witel}: **${formatNumber(r.total)}**`).join('\n');
            resultText = `**Top 5 Witel HSI (Order Terbanyak):**\n\n${list}`;
        }

        // 4. DATIN REVENUE
        else if (lowerMsg.includes('datin') && lowerMsg.includes('revenue')) {
            sql = `SELECT SUM(revenue) as total FROM sos_data`;
            const res = await prisma.$queryRawUnsafe(sql);
            resultText = `Total Revenue Datin tercatat sebesar **${formatCurrency(res[0].total)}**.`
        }

        // 5. DATIN TOP PRODUK
        else if (lowerMsg.includes('datin') && lowerMsg.includes('produk')) {
            sql = `
                SELECT product_name, COUNT(*) as total 
                FROM sos_data 
                GROUP BY product_name 
                ORDER BY total DESC 
                LIMIT 5
            `;
            const res = await prisma.$queryRawUnsafe(sql);
            const list = res.map((r, i) => `${i+1}. ${r.product_name}: **${formatNumber(r.total)}**`).join('\n');
            resultText = `**Top 5 Produk Datin:**\n\n${list}`;
        }

        // 6. JT / TAMBAHAN LOP
        else if ((lowerMsg.includes('jt') || lowerMsg.includes('tambahan')) && lowerMsg.includes('lop')) {
            sql = `SELECT COUNT(*) as total FROM spmk_mom WHERE populasi_non_drop = 'Y'`;
            const res = await prisma.$queryRawUnsafe(sql);
            resultText = `Total LOP (Non-Drop) pada Jaringan Tambahan adalah **${formatNumber(res[0].total)}** proyek.`;
        }

        // 7. JT BELUM GO LIVE
        else if ((lowerMsg.includes('jt') || lowerMsg.includes('tambahan')) && (lowerMsg.includes('belum') || lowerMsg.includes('not'))) {
            sql = `SELECT COUNT(*) as total FROM spmk_mom WHERE (go_live = 'N' OR go_live IS NULL) AND populasi_non_drop = 'Y'`;
            const res = await prisma.$queryRawUnsafe(sql);
            resultText = `Terdapat **${formatNumber(res[0].total)}** proyek Jaringan Tambahan yang saat ini **Belum Go-Live** (On Progress).`;
        }

        // 8. DIGPRO REVENUE
        else if ((lowerMsg.includes('digital') || lowerMsg.includes('digpro')) && lowerMsg.includes('revenue')) {
            // Default to current year completed revenue to match dashboard "Total Revenue"
            const currentYear = new Date().getFullYear();
            sql = `
                SELECT SUM(net_price) as total 
                FROM digital_products 
                WHERE EXTRACT(YEAR FROM order_date) = ${currentYear}
                AND (status ILIKE '%complete%' OR status ILIKE '%ps%')
            `;
            const res = await prisma.$queryRawUnsafe(sql);
            resultText = `Total Revenue Digital Product (Completed) tahun ${currentYear} adalah **${formatCurrency(res[0].total)}**.`;
        }

        // DEFAULT FALLBACK
        else {
            return {
                answer: "Maaf, saya belum mengerti pertanyaan spesifik tersebut. \n\nCoba tanyakan tentang:\n- **HSI**: Total order, Top Witel, Jumlah PS\n- **Datin**: Total Revenue, Top Produk\n- **JT**: Jumlah LOP, Proyek Belum Go-Live\n- **Digital**: Total Revenue",
                sql: null
            };
        }

        return {
            answer: resultText,
            sql: sql, // Optional: return SQL for debug if needed
            data: data
        };

    } catch (error) {
        console.error('[AI Service Error]', error);
        return {
            answer: "Maaf, terjadi kesalahan saat mengambil data dari database.",
            error: error.message
        };
    } finally {
        await prisma.$disconnect();
    }
};