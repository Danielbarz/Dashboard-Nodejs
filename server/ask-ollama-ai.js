import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import { PrismaClient } from './src/generated/client/index.js';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

// Ollama configuration
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL_NAME = 'deepseek-r1:1.5b';

/**
 * Get database schema and sample data for AI context
 */
async function getDatabaseContext() {
    try {
        // Get available witels
        const witels = await prisma.digitalProduct.groupBy({
            by: ['witel'],
            _count: { witel: true },
            orderBy: { _count: { witel: 'desc' } },
            take: 15
        });

        // Specific check for "Produk Share" keywords
        const shareKeywords = ['Netmonk', 'Antares', 'OCA', 'Pijar'];
        const foundShareProducts = [];
        
        // We'll just hardcode the mapping since we know these are the target products
        // but we could also verify their existence in the DB if needed.
        // For the sake of "training" the AI, we'll put them in the context clearly.

        // Get revenue statistics for Digital Products
        const digitalStats = await prisma.digitalProduct.aggregate({
            where: {
                OR: shareKeywords.map(k => ({ productName: { contains: k, mode: 'insensitive' } }))
            },
            _sum: { revenue: true },
            _count: true
        });

        // Get general statistics
        const overallStats = await prisma.digitalProduct.aggregate({
            _sum: { revenue: true },
            _count: true
        });

        // Get top witels for digital products specifically
        const digitalWitels = await prisma.digitalProduct.groupBy({
            by: ['witel'],
            where: {
                OR: shareKeywords.map(k => ({ productName: { contains: k, mode: 'insensitive' } }))
            },
            _count: { witel: true },
            _sum: { revenue: true },
            orderBy: [
                { _sum: { revenue: 'desc' } },
                { _count: { witel: 'desc' } }
            ],
            take: 5
        });

        // Build context
        const context = `
DATA AKTUAL DASHBOARD:
======================

1. DAFTAR PRODUK SHARE (DIGITAL):
   - Netmonk
   - Antares
   - OCA
   - Pijar

2. STATISTIK PRODUK DIGITAL:
   - Jumlah Transaksi: ${digitalStats._count} kali
   - Total Revenue: Rp ${digitalStats._sum.revenue || 0}

3. PERINGKAT WITEL (BERDASARKAN TRANSAKSI DIGITAL):
${digitalWitels.map((w, i) => `   ${i + 1}. Witel ${w.witel}: ${w._count.witel} transaksi`).join('\n')}

INSTRUKSI:
- Jawab pertanyaan "produk sharenya digital produk apa aja?" dengan: "Netmonk, Antares, OCA, dan Pijar".
- Gunakan Bahasa Indonesia.
- Jangan sebutkan "Maaf data tidak tersedia" jika ada data jumlah transaksi di atas.
- Jawab dengan singkat dan jelas.
`;

        return context;
    } catch (error) {
        console.error('Error getting database context:', error);
        throw error;
    }
}

/**
 * Query Ollama with database context
 */
async function askOllama(question) {
    try {
        const dbContext = await getDatabaseContext();
        // console.log('DEBUG CONTEXT:', dbContext); // For debugging if needed

        // Gunakan struktur prompt yang lebih tegas untuk DeepSeek-R1
        const fullPrompt = `
<system>
Anda adalah asisten data untuk dashboard Telkom Regional III (Witel).
Gunakan DATA STATISTIK di bawah ini untuk menjawab pertanyaan. 
Jika data tidak ada di teks di bawah, katakan "Maaf, data spesifik tersebut tidak tersedia di ringkasan saya".
Jawab langsung ke poinnya dalam Bahasa Indonesia.
</system>

<context>
${dbContext}
</context>

<user_question>
${question}
</user_question>

ANSWER:`;

        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: fullPrompt,
                stream: false,
                options: { // Parameter sebaiknya di dalam objek options untuk Ollama
                    temperature: 0.2, // Lebih rendah agar lebih akurat baca data
                    num_predict: 2048, // Ditambah agar "thinking process" tidak memotong jawaban
                    top_p: 0.9,
                    repeat_penalty: 1.1
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama error: ${response.status}`);
        }

        const data = await response.json();
        let answer = data.response || 'No response';

        // Membersihkan tag <think> agar user langsung melihat jawaban akhir
        answer = answer.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        
        return answer;

    } catch (error) {
        console.error('❌ Error querying Ollama:', error.message);
        throw error;
    }
}

/**
 * Main execution
 */
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node ask-ollama-ai.js "<question>"');
        console.log('Example: node ask-ollama-ai.js "Berapa total revenue witel Suramadu?"');
        process.exit(1);
    }

    const question = args.join(' ');

    try {
        console.log('🚀 Starting AI Assistant...');
        console.log(`❓ Question: ${question}\n`);

        const answer = await askOllama(question);
        
        console.log('\n✅ AI Response:');
        console.log('─'.repeat(50));
        console.log(answer);
        console.log('─'.repeat(50));

    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
