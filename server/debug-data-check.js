import { PrismaClient } from './src/generated/client/index.js';
import dotenv from 'dotenv';

dotenv.config();

// FORCE IPv4
const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';

const prisma = new PrismaClient({
    datasources: {
        db: { url: process.env.DATABASE_URL }
    }
});

const SYSTEM_PROMPT = `
You are a SQL Generator. 
User asks a question -> You reply with ONLY the SQL query.

RULES:
1. Output MUST be a single valid PostgreSQL SELECT statement.
2. NO conversational text, NO markdown, NO explanations.
3. Use ILIKE for text comparisons (case-insensitive).
4. If checking for specific witel (e.g. 'Suramadu'), use: WHERE witel ILIKE '%suramadu%'
5. For "Revenue", use SUM(revenue) from table 'digital_products' unless specified.

EXAMPLES:
Q: Berapa revenue witel Malang?
A: SELECT SUM(revenue) FROM digital_products WHERE witel ILIKE '%malang%';

Q: Berapa order HSI status completed?
A: SELECT COUNT(*) FROM hsi_data WHERE status_resume ILIKE '%completed%';
`;

async function checkData() {
    console.log('--- Checking Database Content ---');
    try {
        // Check Witels in Digital Products
        const witels = await prisma.digitalProduct.groupBy({
            by: ['witel'],
            _count: { witel: true },
            orderBy: { witel: 'asc' },
            take: 20
        });
        console.log('Available Witels (DigitalProduct):');
        console.table(witels);

        // Check if 'Suramadu' exists specifically
        const suramadu = await prisma.digitalProduct.findFirst({
            where: { witel: { contains: 'suramadu', mode: 'insensitive' } }
        });
        console.log("Sample 'Suramadu' record:", suramadu ? 'Found' : 'NOT FOUND');

    } catch (e) {
        console.error('DB Error:', e);
    }
}

async function testAI(question) {
    console.log(`\n--- Testing AI with Question: "${question}" ---`);
    try {
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: `${SYSTEM_PROMPT}\n\nQ: ${question}\nA:`,
                stream: false,
                options: { temperature: 0.1 }
            })
        });

        const json = await response.json();
        let raw = json.response;
        // Remove think blocks
        let clean = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        
        console.log('Raw AI Response:', clean);

        // Extract SQL
        const sqlMatch = clean.match(/(SELECT[\s\S]+?;)/i) || clean.match(/(SELECT[\s\S]+)/i);
        if (sqlMatch) {
            const sql = sqlMatch[0].trim();
            console.log('Extracted SQL:', sql);
            
            // Execute
            try {
                const res = await prisma.$queryRawUnsafe(sql);
                // Handle BigInt
                const serialized = JSON.parse(JSON.stringify(res, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value
                ));
                console.log('Query Result:', serialized);
            } catch (e) {
                console.log('Query Execution Failed:', e.message);
            }
        } else {
            console.log('FAILED to extract SQL');
        }

    } catch (e) {
        console.error('AI Error:', e);
    }
}

async function run() {
    await checkData();
    await testAI("Berapa revenue witel suramadu?");
    await prisma.$disconnect();
}

run();
