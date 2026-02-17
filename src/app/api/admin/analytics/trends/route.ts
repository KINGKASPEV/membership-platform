import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { members } from '@/drizzle/schema';
import { eq, gte, lte, sql, and } from 'drizzle-orm';
import { getScopedFilters } from '@/lib/permissions/data-scope';
import { getUserScope } from '@/lib/permissions/rbac';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';

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

        const searchParams = request.nextUrl.searchParams;
        const period = searchParams.get('period') || 'daily'; // daily, weekly, monthly
        const days = parseInt(searchParams.get('days') || '30');

        const scopeFilters = getScopedFilters(userScope);
        const startDate = startOfDay(subDays(new Date(), days));
        const endDate = endOfDay(new Date());

        // Determine date truncation based on period
        let dateTrunc = 'day';
        if (period === 'weekly') dateTrunc = 'week';
        if (period === 'monthly') dateTrunc = 'month';

        // Query registration trends
        const trends = await db
            .select({
                date: sql<string>`date_trunc(${sql.raw(`'${dateTrunc}'`)}, ${members.createdAt})::date`,
                total: sql<number>`count(*)::int`,
                validated: sql<number>`count(*) filter (where ${members.status} = 'validated')::int`,
                pending: sql<number>`count(*) filter (where ${members.status} = 'pending')::int`,
                rejected: sql<number>`count(*) filter (where ${members.status} = 'rejected')::int`,
            })
            .from(members)
            .where(
                scopeFilters.length > 0
                    ? and(...scopeFilters, gte(members.createdAt, startDate), lte(members.createdAt, endDate))
                    : and(gte(members.createdAt, startDate), lte(members.createdAt, endDate))
            )
            .groupBy(sql`date_trunc(${sql.raw(`'${dateTrunc}'`)}, ${members.createdAt})`)
            .orderBy(sql`date_trunc(${sql.raw(`'${dateTrunc}'`)}, ${members.createdAt})`);

        // Format dates for response
        const formattedTrends = trends.map((t) => ({
            date: t.date,
            total: t.total,
            validated: t.validated,
            pending: t.pending,
            rejected: t.rejected,
        }));

        return NextResponse.json({
            period,
            days,
            trends: formattedTrends,
        });
    } catch (error) {
        console.error('Trends API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
