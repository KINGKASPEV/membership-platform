import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { members, states, lgas, wards, parishes } from '@/drizzle/schema';
import { eq, sql, and } from 'drizzle-orm';
import { getScopedFilters } from '@/lib/permissions/data-scope';
import { getUserScope } from '@/lib/permissions/rbac';

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

        // Determine level based on user scope
        let distribution: any[] = [];

        if (userScope.role === 'super_admin') {
            // Show state-level distribution
            distribution = await db
                .select({
                    id: states.id,
                    name: states.name,
                    count: sql<number>`count(${members.id})::int`,
                })
                .from(states)
                .leftJoin(members, eq(members.stateId, states.id))
                .groupBy(states.id, states.name)
                .orderBy(states.name);
        } else if (userScope.stateId && !userScope.lgaId) {
            // State admin - show LGA distribution
            distribution = await db
                .select({
                    id: lgas.id,
                    name: lgas.name,
                    count: sql<number>`count(${members.id})::int`,
                })
                .from(lgas)
                .leftJoin(members, eq(members.lgaId, lgas.id))
                .where(eq(lgas.stateId, userScope.stateId))
                .groupBy(lgas.id, lgas.name)
                .orderBy(lgas.name);
        } else if (userScope.lgaId && !userScope.parishId) {
            // LGA admin - show ward distribution
            distribution = await db
                .select({
                    id: wards.id,
                    name: wards.name,
                    count: sql<number>`count(${members.id})::int`,
                })
                .from(wards)
                .leftJoin(members, eq(members.wardId, wards.id))
                .where(eq(wards.lgaId, userScope.lgaId))
                .groupBy(wards.id, wards.name)
                .orderBy(wards.name);
        } else if (userScope.parishId) {
            // Parish admin - show parish stats only
            distribution = await db
                .select({
                    id: parishes.id,
                    name: parishes.name,
                    count: sql<number>`count(${members.id})::int`,
                })
                .from(parishes)
                .leftJoin(members, eq(members.parishId, parishes.id))
                .where(eq(parishes.id, userScope.parishId))
                .groupBy(parishes.id, parishes.name);
        }

        return NextResponse.json({
            level: userScope.parishId
                ? 'parish'
                : userScope.lgaId
                    ? 'ward'
                    : userScope.stateId
                        ? 'lga'
                        : 'state',
            distribution,
        });
    } catch (error) {
        console.error('Geographic distribution API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
