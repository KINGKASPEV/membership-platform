import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db'; // Ensure this path is correct based on your setup
import { adminUsers } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import rateLimit from '@/lib/security/rate-limit';
import { withRetry } from '@/lib/db/resilience';

const limiter = rateLimit({
    interval: 60 * 1000 * 15, // 15 minutes
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
        const response = new NextResponse();

        // Skip rate limiting in development
        if (process.env.NODE_ENV !== 'development') {
            try {
                await limiter.check(response, 5, ip); // 5 requests per 15 minutes
            } catch {
                return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
            }
        }

        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        // Institutional lookup with resilience - increased for critical access
        const user = await withRetry(async () => {
            return await db.query.adminUsers.findFirst({
                where: eq(adminUsers.email, email),
                with: {
                    role: true,
                }
            });
        }, 6);

        if (!user) {
            return NextResponse.json(
                { error: 'Institutional credentials rejected' },
                { status: 401 }
            );
        }

        const isValidPassword = await verifyPassword(user.passwordHash, password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Institutional credentials rejected' },
                { status: 401 }
            );
        }

        if (!user.isActive) {
            return NextResponse.json(
                { error: 'Institutional account is currently deactivated' },
                { status: 403 }
            );
        }

        await createSession(user.id);

        return NextResponse.json({ success: true, redirect: '/admin/dashboard' });
    } catch (error) {
        // Only log truly critical errors, suppress transient noise
        if (!((error as any)?.code === 'CONNECT_TIMEOUT')) {
            console.error("❌ LOGIN CRITICAL ERROR:", error);
        }

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Institutional credentials format invalid' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Institutional synchronization failure. Please retry.' },
            { status: 500 }
        );
    }
}
