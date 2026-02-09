require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Testing connection to:', process.env.DATABASE_URL ? 'URL Found' : 'URL Missing');
    try {
        await prisma.$connect();
        console.log('Successfully connected to the database!');
        const count = await prisma.user.count();
        console.log('User count:', count);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
