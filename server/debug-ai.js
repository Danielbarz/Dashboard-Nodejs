import { PrismaClient } from './src/generated/client/index.js';
import dotenv from 'dotenv';

dotenv.config();

// FORCE IPv4
const OLLAMA_HOST = 'http://127.0.0.1:11434';

async function testOllama() {
    console.log('Testing Ollama connection...');
    
    // 1. Test Version/Root
    try {
        const res = await fetch(`${OLLAMA_HOST}/`);
        if (res.ok) console.log('✅ Ollama Server is UP (Root check passed)');
        else console.log('❌ Ollama Server unreachable at root');
    } catch (e) {
        console.log('❌ Ollama Server connection failed:', e.message);
        return false;
    }

    // 2. Check Installed Models
    let models = [];
    try {
        const res = await fetch(`${OLLAMA_HOST}/api/tags`);
        const data = await res.json();
        models = data.models.map(m => m.name);
        console.log('📋 Installed Models:', models);
    } catch (e) {
        console.log('❌ Could not fetch models list:', e.message);
    }

    // 3. Test Generation with correct model
    // Check if configured model exists
    const configuredModel = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';
    const exactMatch = models.find(m => m === configuredModel);
    // Find closest match if exact not found
    const targetModel = exactMatch || models[0];

    if (!targetModel) {
        console.log('❌ No models found in Ollama! Run "ollama run deepseek-r1:1.5b" first.');
        return false;
    }

    console.log(`\nTesting generation with model: "${targetModel}"...`);
    
    try {
        const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: targetModel,
                prompt: 'Say "Ready"',
                stream: false
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Ollama API Error (${response.status}): ${errText}`);
        }

        const data = await response.json();
        console.log('✅ Ollama Generation Success. Response:', data.response.trim());
        return true;
    } catch (error) {
        console.error('❌ Ollama Generation failed:', error.message);
        return false;
    }
}

async function run() {
    console.log('--- AI System Diagnostic (IPv4) ---\n');
    await testOllama();
    console.log('\n--- End Diagnostic ---');
}

run();