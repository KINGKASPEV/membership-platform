import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { members } from '@/drizzle/schema';
import { eq, sql, and, gte, lt } from 'drizzle-orm';
import { getScopedFilters } from '@/lib/permissions/data-scope';
import { getUserScope } from '@/lib/permissions/rbac';
import { subDays, startOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
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

        // Get current period stats
        const currentStats = await db
            .select({
                total: sql<number>`count(*)::int`,
                validated: sql<number>`count(*) filter (where ${members.status} = 'validated')::int`,
                pending: sql<number>`count(*) filter (where ${members.status} = 'pending')::int`,
                rejected: sql<number>`count(*) filter (where ${members.status} = 'rejected')::int`,
            })
            .from(members)
            .where(scopeFilters.length > 0 ? and(...scopeFilters) : undefined);

        const stats = currentStats[0];

        // Calculate rates
        const validationRate = stats.total > 0 ? (stats.validated / stats.total) * 100 : 0;
        const rejectionRate = stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0;
        const pendingRate = stats.total > 0 ? (stats.pending / stats.total) * 100 : 0;

        // Get this week's validated count
        const thisWeekStart = startOfDay(subDays(new Date(), 7));
        const thisWeekStats = await db
            .select({
                validated: sql<number>`count(*) filter (where ${members.status} = 'validated')::int`,
            })
            .from(members)
            .where(
                scopeFilters.length > 0
                    ? and(...scopeFilters, gte(members.validatedAt, thisWeekStart))
                    : gte(members.validatedAt, thisWeekStart)
            );

        // Get last week's validated count
        const lastWeekStart = startOfDay(subDays(new Date(), 14));
        const lastWeekEnd = startOfDay(subDays(new Date(), 7));
        const lastWeekStats = await db
            .select({
                validated: sql<number>`count(*) filter (where ${members.status} = 'validated')::int`,
            })
            .from(members)
            .where(
                scopeFilters.length > 0
                    ? and(
                        ...scopeFilters,
                        gte(members.validatedAt, lastWeekStart),
                        lt(members.validatedAt, lastWeekEnd)
                    )
                    : and(gte(members.validatedAt, lastWeekStart), lt(members.validatedAt, lastWeekEnd))
            );

        const thisWeekValidated = thisWeekStats[0]?.validated || 0;
        const lastWeekValidated = lastWeekStats[0]?.validated || 0;
        const weekOverWeekChange =
            lastWeekValidated > 0 ? ((thisWeekValidated - lastWeekValidated) / lastWeekValidated) * 100 : 0;

        return NextResponse.json({
            total: stats.total,
            validated: stats.validated,
            pending: stats.pending,
            rejected: stats.rejected,
            validationRate: Math.round(validationRate * 10) / 10,
            rejectionRate: Math.round(rejectionRate * 10) / 10,
            pendingRate: Math.round(pendingRate * 10) / 10,
            thisWeekValidated,
            lastWeekValidated,
            weekOverWeekChange: Math.round(weekOverWeekChange * 10) / 10,
        });
    } catch (error) {
        console.error('Validation rate API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
