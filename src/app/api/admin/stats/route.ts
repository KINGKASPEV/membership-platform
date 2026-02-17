import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { members } from '@/drizzle/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { getScopedFilters } from '@/lib/permissions/data-scope';
import { getUserScope } from '@/lib/permissions/rbac';

export async function GET() {
    try {
        const session = await verifySession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userScope = await getUserScope(session.userId);
        if (!userScope) {
            return NextResponse.json({ error: 'User scope not found' }, { status: 404 });
        }

        const scopeFilters = getScopedFilters(userScope);

        // Get total members in scope
        const totalMembersResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(members)
            .where(scopeFilters.length > 0 ? and(...scopeFilters) : undefined);
        const totalMembers = totalMembersResult[0]?.count || 0;

        // Get pending validations
        const pendingResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(members)
            .where(scopeFilters.length > 0 ? and(...scopeFilters, eq(members.status, 'pending')) : eq(members.status, 'pending'));
        const pendingValidations = pendingResult[0]?.count || 0;

        // Get validated today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validatedTodayResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(members)
            .where(
                scopeFilters.length > 0
                    ? and(...scopeFilters, eq(members.status, 'validated'), gte(members.validatedAt, today))
                    : and(eq(members.status, 'validated'), gte(members.validatedAt, today))
            );
        const validatedToday = validatedTodayResult[0]?.count || 0;

        // Get rejected today
        const rejectedTodayResult = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(members)
            .where(
                scopeFilters.length > 0
                    ? and(...scopeFilters, eq(members.status, 'rejected'), gte(members.validatedAt, today))
                    : and(eq(members.status, 'rejected'), gte(members.validatedAt, today))
            );
        const rejectedToday = rejectedTodayResult[0]?.count || 0;

        return NextResponse.json({
            totalMembers,
            pendingValidations,
            validatedToday,
            rejectedToday,
        });
    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
