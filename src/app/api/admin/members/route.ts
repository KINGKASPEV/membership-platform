import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { members, states, lgas, wards, parishes } from '@/drizzle/schema';
import { eq, and, like, or, desc } from 'drizzle-orm';
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

        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        // Build filters
        const scopeFilters = getScopedFilters(userScope);
        const filters = [...scopeFilters];

        if (status) {
            filters.push(eq(members.status, status));
        }

        if (search) {
            filters.push(
                or(
                    like(members.firstName, `%${search}%`),
                    like(members.lastName, `%${search}%`),
                    like(members.phoneNumber, `%${search}%`)
                )!
            );
        }

        // Fetch members with location details
        const membersList = await db
            .select({
                id: members.id,
                firstName: members.firstName,
                lastName: members.lastName,
                middleName: members.middleName,
                phoneNumber: members.phoneNumber,
                email: members.email,
                dateOfBirth: members.dateOfBirth,
                gender: members.gender,
                status: members.status,
                isCatholic: members.isCatholic,
                hasPvc: members.hasPvc,
                createdAt: members.createdAt,
                validatedAt: members.validatedAt,
                stateName: states.name,
                lgaName: lgas.name,
                wardName: wards.name,
                parishName: parishes.name,
            })
            .from(members)
            .innerJoin(states, eq(members.stateId, states.id))
            .innerJoin(lgas, eq(members.lgaId, lgas.id))
            .innerJoin(wards, eq(members.wardId, wards.id))
            .innerJoin(parishes, eq(members.parishId, parishes.id))
            .where(filters.length > 0 ? and(...filters) : undefined)
            .orderBy(desc(members.createdAt))
            .limit(limit)
            .offset(offset);

        return NextResponse.json({
            members: membersList,
            page,
            limit,
            hasMore: membersList.length === limit,
        });
    } catch (error) {
        console.error('Members API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
