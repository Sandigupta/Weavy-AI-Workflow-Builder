import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Manually parse .env
try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^"(.*)"$/, '$1');
                process.env[key] = value;
            }
        });
        console.log('Loaded .env manually');
    }
} catch (e) {
    console.log('Could not load .env:', (e as Error).message);
}

const prisma = new PrismaClient();

async function main() {
    console.log('Testing connection...');
    try {
        await prisma.$connect();
        console.log('Successfully connected to the database!');
        // Try a simple query
        try {
            const count = await prisma.user.count();
            console.log('User count:', count);
        } catch (queryErr) {
            console.warn('Connected but query failed (might be empty DB or schema mismatch):', (queryErr as Error).message);
        }
    } catch (e) {
        console.error('Connection failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
