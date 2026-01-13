import { PrismaClient } from '../generated/client/index.js'

// Initialize Prisma Client for AI Reader
const getAiDbUrl = () => {
    const originalUrl = process.env.DATABASE_URL;
    if (!originalUrl) return null;
    
    try {
        const url = new URL(originalUrl);
        url.username = 'ai_reader';
        url.password = 'secure_ai_password';
        return url.toString();
    } catch (e) {
        console.error('Error parsing DATABASE_URL:', e);
        return null;
    }
};

const aiPrisma = new PrismaClient({
    datasources: {
        db: {
            url: getAiDbUrl() || process.env.DATABASE_URL
        }
    },
    log: ['query', 'error']
});

// FORCE IPv4 to avoid localhost resolution issues
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';

const DB_SCHEMA = `
Tables: 
- digital_products (product_name, revenue, witel, regional). Use for "Digital Product".
- hsi_data (status_resume, witel). Use for "Indihome" or "HSI".
- spmk_mom (rab, status_proyek). Use for "Proyek".
`;

const SYSTEM_PROMPT = `
You are a PostgreSQL Generator. 
1. Use 'LIMIT x' for top/limit. NEVER use 'TOP x'.
2. Use ILIKE for text comparisons.
3. Output ONLY the SQL.

Examples:
Q: 5 witel revenue tertinggi?
A: SELECT witel, SUM(revenue) as total FROM digital_products GROUP BY witel ORDER BY total DESC LIMIT 5;

Q: Produk share apa aja?
A: SELECT DISTINCT product_name FROM digital_products WHERE product_name IN ('Netmonk', 'Antares', 'OCA', 'Pijar');

Q: Tampilkan 5 witel dengan revenue tertinggi pada digital product?
A: SELECT witel, SUM(revenue) as total_revenue FROM digital_products GROUP BY witel ORDER BY total_revenue DESC LIMIT 5;
`;

export const askAi = async (question) => {
    try {
        // Step 1: Generate SQL
        console.log(`[AI] Generating SQL for: "${question}" using model ${MODEL_NAME}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        const sqlResponse = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: `${SYSTEM_PROMPT}\n\nQ: ${question}\nA:`,
                stream: false,
                options: {
                    temperature: 0.1, // Lower temperature for precision
                    num_predict: 600, // Higher limit
                    stop: ["\nQ:", "Q:", "Observation:"] // Stop tokens
                }
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!sqlResponse.ok) throw new Error(`Ollama Error: ${sqlResponse.statusText}`);
        const sqlJson = await sqlResponse.json();
        let rawResponse = sqlJson.response.trim();
        
        console.log(`[AI] Full Raw Output (Pre-clean): ${rawResponse}`);

        // Remove <think> blocks
        let cleanResponse = rawResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        
        if (!cleanResponse && rawResponse.length > 0) {
             // If cleaning removed everything, maybe the model didn't use tags properly
             // Try to extract just code blocks if they exist
             const codeBlock = rawResponse.match(/```sql([\s\S]*?)```/i);
             if (codeBlock) {
                 cleanResponse = codeBlock[1].trim();
             } else {
                 cleanResponse = rawResponse;
             }
        }
        
        console.log(`[AI] Cleaned Output: ${cleanResponse}`);

        // Robust SQL Extraction: Find the SELECT statement
        // Matches "SELECT ... ;" or "SELECT ... " until end of line/string
        const sqlMatch = cleanResponse.match(/(SELECT[\s\S]+?;)/i) || cleanResponse.match(/(SELECT[\s\S]+)/i);
        
        let sql = null;
        if (sqlMatch) {
            sql = sqlMatch[0].trim();
            // Remove any markdown code blocks if still present
            sql = sql.replace(/```sql/g, '').replace(/```/g, '').trim();
        }

        if (!sql) {
            console.log('[AI] Failed to extract SQL');
            return { 
                answer: "Maaf, saya bingung. Coba tanya lebih spesifik, misal: 'Hitung total revenue di Surabaya'", 
                sql: null, 
                data: null 
            };
        }

        console.log(`[AI] Executing SQL: ${sql}`);

        // Step 2: Execute SQL
        let results;
        try {
            results = await aiPrisma.$queryRawUnsafe(sql);
        } catch (dbError) {
            console.error('[AI DB Error]', dbError.message);
            return { answer: "Gagal mengeksekusi query database.", sql: sql, error: dbError.message };
        }
        
        // Handle BigInt serialization
        const serializedResults = JSON.parse(JSON.stringify(results, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        console.log(`[AI] Results found: ${serializedResults.length} rows`);

        // Step 3: Interpret Results
        const interpController = new AbortController();
        const interpTimeout = setTimeout(() => interpController.abort(), 60000);

        const interpretationResponse = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: `
                [DATA]
                ${JSON.stringify(serializedResults).slice(0, 1000)}
                [/DATA]

                [INSTRUCTION]
                Jawab pertanyaan ini berdasarkan [DATA] di atas dalam Bahasa Indonesia: "${question}"
                
                Aturan:
                1. Jangan ulangi pertanyaan.
                2. Langsung sebutkan jawabannya.
                3. Jika data berupa daftar, sebutkan isinya (misal: "Produknya adalah: A, B, C").
                4. Jika hasil kosong, katakan "Data tidak ditemukan".
                [/INSTRUCTION]
                `,
                stream: false,
                options: { 
                    temperature: 0.1,
                    num_predict: 300
                }
            }),
            signal: interpController.signal
        });
        clearTimeout(interpTimeout);

        const interpretationJson = await interpretationResponse.json();
        let finalAnswer = interpretationJson.response;
        finalAnswer = finalAnswer.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        return {
            answer: finalAnswer,
            sql: sql,
            data: serializedResults
        };

    } catch (error) {
        console.error('[AI Service Error]', error);
        return {
            answer: "Maaf, terjadi kesalahan (Timeout/Error). Pastikan Ollama berjalan.",
            error: error.message
        };
    }
};