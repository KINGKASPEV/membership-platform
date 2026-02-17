import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { members, validationLogs } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { getScopedFilters } from '@/lib/permissions/data-scope';
import { getUserScope } from '@/lib/permissions/rbac';
import { z } from 'zod';
import rateLimit from '@/lib/security/rate-limit';

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

const validateSchema = z.object({
    action: z.enum(['approve', 'reject']),
    notes: z.string().optional(),
});

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: memberId } = await params;
        const session = await verifySession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
        try {
            await limiter.check(NextResponse.next(), 20, ip); // 20 requests per minute
        } catch {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const userScope = await getUserScope(session.userId);
        if (!userScope) {
            return NextResponse.json({ error: 'User scope not found' }, { status: 404 });
        }

        const body = await request.json();
        const validation = validateSchema.parse(body);

        const scopeFilters = getScopedFilters(userScope);

        // Fetch member to ensure it exists and is in scope
        const memberResult = await db
            .select({
                id: members.id,
                status: members.status,
            })
            .from(members)
            .where(and(...scopeFilters, eq(members.id, memberId)))
            .limit(1);

        if (memberResult.length === 0) {
            return NextResponse.json({ error: 'Member not found or not in your scope' }, { status: 404 });
        }

        const member = memberResult[0];
        const previousStatus = member.status;
        const newStatus = validation.action === 'approve' ? 'validated' : 'rejected';

        // Transaction: Update member and create log
        await db.transaction(async (tx) => {
            // Update member status
            await tx
                .update(members)
                .set({
                    status: newStatus,
                    validatedAt: new Date(),
                    validatedBy: session.userId,
                    validationNotes: validation.notes,
                    updatedAt: new Date(),
                })
                .where(eq(members.id, memberId));

            // Create validation log
            await tx.insert(validationLogs).values({
                memberId,
                adminUserId: session.userId,
                action: validation.action === 'approve' ? 'approved' : 'rejected',
                previousStatus,
                newStatus,
                notes: validation.notes,
            });
        });

        return NextResponse.json({
            success: true,
            message: `Member ${validation.action === 'approve' ? 'approved' : 'rejected'} successfully`,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 });
        }
        console.error('Validation API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
