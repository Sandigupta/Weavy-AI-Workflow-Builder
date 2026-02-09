import { auth } from '@clerk/nextjs/server';
import { prisma } from './prisma';

/**
 * Get or create a user from Clerk authentication
 * This bridges Clerk's auth with our Prisma User model
 */
export async function getAuthUser() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    // Find or create user by clerkId
    const user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {}, // No updates needed
        create: {
            clerkId: userId,
            email: `${userId}@clerk.user`, // Placeholder, will be updated from Clerk webhook
            name: 'User',
        },
    });

    return user;
}

/**
 * Require authenticated user or throw
 */
export async function requireAuthUser() {
    const user = await getAuthUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    return user;
}
