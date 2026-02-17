import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { members, states, lgas, wards, parishes, denominations, validationLogs, adminUsers } from '@/drizzle/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getScopedFilters } from '@/lib/permissions/data-scope';
import { getUserScope } from '@/lib/permissions/rbac';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: memberId } = await params;
        const session = await verifySession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userScope = await getUserScope(session.userId);
        if (!userScope) {
            return NextResponse.json({ error: 'User scope not found' }, { status: 404 });
        }

        const scopeFilters = getScopedFilters(userScope);

        // Fetch member with full details
        const memberResult = await db
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
                validationNotes: members.validationNotes,
                stateId: members.stateId,
                lgaId: members.lgaId,
                wardId: members.wardId,
                parishId: members.parishId,
                denominationId: members.denominationId,
                stateName: states.name,
                lgaName: lgas.name,
                wardName: wards.name,
                parishName: parishes.name,
                denominationName: denominations.name,
            })
            .from(members)
            .innerJoin(states, eq(members.stateId, states.id))
            .innerJoin(lgas, eq(members.lgaId, lgas.id))
            .innerJoin(wards, eq(members.wardId, wards.id))
            .innerJoin(parishes, eq(members.parishId, parishes.id))
            .leftJoin(denominations, eq(members.denominationId, denominations.id))
            .where(and(...scopeFilters, eq(members.id, memberId)))
            .limit(1);

        if (memberResult.length === 0) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        const member = memberResult[0];

        // Fetch validation history
        const history = await db
            .select({
                id: validationLogs.id,
                action: validationLogs.action,
                previousStatus: validationLogs.previousStatus,
                newStatus: validationLogs.newStatus,
                notes: validationLogs.notes,
                createdAt: validationLogs.createdAt,
                adminFirstName: adminUsers.firstName,
                adminLastName: adminUsers.lastName,
            })
            .from(validationLogs)
            .innerJoin(adminUsers, eq(validationLogs.adminUserId, adminUsers.id))
            .where(eq(validationLogs.memberId, memberId))
            .orderBy(desc(validationLogs.createdAt));

        return NextResponse.json({
            member,
            history,
        });
    } catch (error) {
        console.error('Member detail API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
