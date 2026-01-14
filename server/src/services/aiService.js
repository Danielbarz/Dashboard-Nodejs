import prisma from '../lib/prisma.js';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

// Ollama configuration
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL_NAME = 'deepseek-r1:1.5b';

/**
 * Mengambil ringkasan seluruh database untuk konteks AI
 */
async function getDatabaseContext() {
    try {
        console.log('[AI-Context] Fetching comprehensive data from DB...');
        
        // 1. DIGITAL PRODUCT STATS
        const shareKeywords = ['Netmonk', 'Antares', 'OCA', 'Pijar'];
        const digitalStats = await prisma.digitalProduct.aggregate({
            where: { OR: shareKeywords.map(k => ({ productName: { contains: k, mode: 'insensitive' } })) },
            _sum: { revenue: true },
            _count: true
        });

        const digitalWitels = await prisma.digitalProduct.groupBy({
            by: ['witel'],
            where: { OR: shareKeywords.map(k => ({ productName: { contains: k, mode: 'insensitive' } })) },
            _count: { witel: true },
            orderBy: { _count: { witel: 'desc' } },
            take: 3
        });

        // 2. HSI / INDIHOME STATS
        const hsiStats = await prisma.hsiData.aggregate({
            _count: true
        });

        const hsiStatus = await prisma.hsiData.groupBy({
            by: ['statusResume'],
            _count: { statusResume: true },
            orderBy: { _count: { statusResume: 'desc' } }
        });

        // 3. PROJECT / SPMK STATS
        const projectStats = await prisma.spmkMom.aggregate({
            _sum: { rab: true },
            _count: true
        });

        const projectStatus = await prisma.spmkMom.groupBy({
            by: ['statusProyek'],
            _count: { statusProyek: true }
        });

        // 4. SOS DATA (Connectivity)
        const sosStats = await prisma.sosData.aggregate({
            _sum: { revenue: true },
            _count: true
        });

        // Build context string
        return `
RINGKASAN DATA DASHBOARD TELKOM (ALL TABLES):
=============================================

A. DIGITAL PRODUCT (Product Share):
- Produk: Netmonk, Antares, OCA, Pijar.
- Total Transaksi: ${digitalStats._count}
- Total Revenue: Rp ${digitalStats._sum.revenue || 0}
- Witel Teraktif: ${digitalWitels.map(w => `${w.witel} (${w._count.witel})`).join(', ')}

B. HIGH SPEED INTERNET (HSI/Indihome):
- Total Order: ${hsiStats._count}
- Status Terbanyak: ${hsiStatus.map(s => `${s.statusResume || 'N/A'}: ${s._count.statusResume}`).join(', ')}

C. PROYEK (SPMK/Konstruksi):
- Total Proyek: ${projectStats._count}
- Total Nilai RAB: Rp ${projectStats._sum.rab || 0}
- Status Proyek: ${projectStatus.map(p => `${p.statusProyek || 'N/A'}: ${p._count.statusProyek}`).join(', ')}

D. CONNECTIVITY (SOS Data):
- Total Record: ${sosStats._count}
- Total Revenue: Rp ${sosStats._sum.revenue || 0}

INSTRUKSI:
- Jawab pertanyaan user secara spesifik menggunakan data kategori A, B, C, atau D di atas.
- Jika user bertanya tentang "produk share", gunakan data kategori A.
- Jika user bertanya tentang "proyek" atau "RAB", gunakan data kategori C.
- Jika user bertanya tentang "Indihome" atau "HSI", gunakan data kategori B.
- Jawab dalam Bahasa Indonesia yang profesional.
`;
    } catch (error) {
        console.error('[AI-Context] Error:', error);
        return "Gagal memuat ringkasan data.";
    }
}

export const askAi = async (question) => {
    try {
        const dbContext = await getDatabaseContext();

        const fullPrompt = `
<system>Anda adalah asisten cerdas Dashboard Telkom Regional. Gunakan konteks data di bawah untuk menjawab secara akurat.</system>
<context>${dbContext}</context>
<user_question>${question}</user_question>
ANSWER:`;

        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: fullPrompt,
                stream: false,
                options: { temperature: 0.1, num_predict: 800 }
            })
        });

        const data = await response.json();
        let answer = data.response || 'Maaf, saya tidak menemukan jawaban dalam data.';
        answer = answer.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        return { answer: answer };

    } catch (error) {
        console.error('[AI Service Error]', error);
        return { answer: "Maaf, chatbot sedang mengalami gangguan koneksi ke database." };
    }
};
