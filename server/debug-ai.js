import { PrismaClient } from './src/generated/client/index.js';
import dotenv from 'dotenv';

dotenv.config();

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'deepseek-r1:14b';

async function testOllama() {
    console.log('Testing Ollama connection...');
    try {
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: 'Say "Hello"',
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama returned status ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Ollama is reachable. Response:', data.response.trim());
        return true;
    } catch (error) {
        console.error('❌ Ollama connection failed:', error.message);
        if (error.cause) console.error('   Cause:', error.cause);
        return false;
    }
}

async function testDatabase() {
    console.log('\nTesting Database connection (ai_reader)...');
    
    const originalUrl = process.env.DATABASE_URL;
    let dbUrl;
    
    try {
        const url = new URL(originalUrl);
        url.username = 'ai_reader';
        url.password = 'secure_ai_password';
        dbUrl = url.toString();
        console.log('Using connection string (hidden password):', dbUrl.replace(url.password, '******'));
    } catch (e) {
        console.error('❌ Failed to construct DB URL:', e.message);
        return false;
    }

    const prisma = new PrismaClient({
        datasources: {
            db: { url: dbUrl }
        }
    });

    try {
        // Try a simple query
        const result = await prisma.$queryRawUnsafe('SELECT 1 as check_val');
        
        // Handle BigInt serialization for logging
        const serialized = JSON.parse(JSON.stringify(result, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
        
        console.log('✅ Database connection successful. Result:', serialized);
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

async function run() {
    console.log('--- AI System Diagnostic ---\n');
    await testOllama();
    await testDatabase();
    console.log('\n--- End Diagnostic ---');
}

run();
