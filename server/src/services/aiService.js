import { PrismaClient } from '../generated/client/index.js'

// Initialize Prisma Client for AI Reader
// We need to construct the connection string dynamically for the ai_reader user
// Assuming the default connection string is in process.env.DATABASE_URL
// Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

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
            url: getAiDbUrl() || process.env.DATABASE_URL // Fallback to default if parsing fails (warn user!)
        }
    },
    log: ['query', 'error']
});

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';

const DB_SCHEMA = `
Table: digital_products
Columns: product_name (String), revenue (Decimal), witel (String), regional (String), order_date (DateTime), status (String), segment (String)

Table: hsi_data
Columns: order_id (String), witel (String), datel (String), status_resume (String), order_date (DateTime), customer_name (String), package_name (String)

Table: sos_data
Columns: order_id (String), revenue (Decimal), witel (String), bill_witel (String), order_date (DateTime), segment (String), product_name (String)

Table: users
Columns: name (String), email (String), role (String)
`;

const SYSTEM_PROMPT = `
You are an expert SQL Data Analyst for Telkom Indonesia.
Your task is to answer user questions by generating SQL queries against the provided database schema.

RULES:
1. Use ONLY the provided tables: digital_products, hsi_data, sos_data, users.
2. Return ONLY the raw SQL query. Do not use Markdown formatting (no triple backticks).
3. Do not include explanations in the SQL response.
4. Ensure the SQL is valid PostgreSQL.
5. If the user asks about something not in the schema, answer "I cannot answer that based on the available data."
6. Current date context: ${new Date().toISOString()}
7. For aggregation, use standard SQL functions (SUM, COUNT, AVG).
8. Text matching should be case-insensitive (ILIKE).

SCHEMA:
${DB_SCHEMA}
`;

export const askAi = async (question) => {
    try {
        // Step 1: Generate SQL
        console.log(`[AI] Generating SQL for: "${question}"`);
        const sqlResponse = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: `${SYSTEM_PROMPT}\n\nUser Question: ${question}\nSQL Query:`,
                stream: false,
                options: {
                    temperature: 0.1 // Deterministic
                }
            })
        });

        if (!sqlResponse.ok) throw new Error('Ollama connection failed');
        const sqlJson = await sqlResponse.json();
        let sql = sqlJson.response.trim();
        
        // Clean up SQL (remove think tags if any, remove markdown)
        sql = sql.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        sql = sql.replace(/```sql/g, '').replace(/```/g, '').trim();

        console.log(`[AI] Generated SQL: ${sql}`);

        // Step 2: Execute SQL (Safe Read-Only)
        // Basic safety check
        if (!sql.toLowerCase().startsWith('select')) {
             // If it's not a SELECT, it might be an apology or refusal
             return { answer: sql, sql: null, data: null };
        }

        const results = await aiPrisma.$queryRawUnsafe(sql);
        
        // Handle BigInt serialization
        const serializedResults = JSON.parse(JSON.stringify(results, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

        console.log(`[AI] SQL Results: ${JSON.stringify(serializedResults).slice(0, 100)}...`);

        // Step 3: Interpret Results
        const interpretationResponse = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: `
                User Question: ${question}
                SQL Query Used: ${sql}
                Data Results: ${JSON.stringify(serializedResults)}
                
Please provide a concise, natural language answer summarizing these results. 
Do not mention "SQL" or "query" in the final answer. 
If the result is empty, say "No data found."
                `,
                stream: false
            })
        });

        const interpretationJson = await interpretationResponse.json();
        let finalAnswer = interpretationJson.response;
        
        // Remove think tags
        finalAnswer = finalAnswer.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        return {
            answer: finalAnswer,
            sql: sql,
            data: serializedResults
        };

    } catch (error) {
        console.error('[AI Service Error]', error);
        return {
            answer: "Sorry, I encountered an error processing your request. Please ensure Ollama is running.",
            error: error.message
        };
    }
};
