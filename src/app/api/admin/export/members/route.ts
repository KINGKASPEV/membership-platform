import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { members, states, lgas, wards, parishes } from '@/drizzle/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { getScopedFilters } from '@/lib/permissions/data-scope';
import { getUserScope } from '@/lib/permissions/rbac';
import { format } from 'date-fns';

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
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const scopeFilters = getScopedFilters(userScope);
        const filters = [...scopeFilters];

        if (status) {
            filters.push(eq(members.status, status));
        }
        if (startDate) {
            filters.push(gte(members.createdAt, new Date(startDate)));
        }
        if (endDate) {
            filters.push(lte(members.createdAt, new Date(endDate)));
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
            .orderBy(members.createdAt);

        // Generate CSV
        const csvRows: string[] = [];

        // Header
        csvRows.push(
            [
                'ID',
                'First Name',
                'Last Name',
                'Middle Name',
                'Phone Number',
                'Email',
                'Date of Birth',
                'Gender',
                'Status',
                'Catholic',
                'Has PVC',
                'State',
                'LGA',
                'Ward',
                'Parish',
                'Registration Date',
                'Validation Date',
            ].join(',')
        );

        // Data rows
        membersList.forEach((member) => {
            csvRows.push(
                [
                    member.id,
                    escapeCSV(member.firstName),
                    escapeCSV(member.lastName),
                    escapeCSV(member.middleName || ''),
                    escapeCSV(member.phoneNumber),
                    escapeCSV(member.email || ''),
                    member.dateOfBirth ? format(new Date(member.dateOfBirth), 'yyyy-MM-dd') : '',
                    member.gender,
                    member.status,
                    member.isCatholic ? 'Yes' : 'No',
                    member.hasPvc ? 'Yes' : 'No',
                    escapeCSV(member.stateName),
                    escapeCSV(member.lgaName),
                    escapeCSV(member.wardName),
                    escapeCSV(member.parishName),
                    member.createdAt ? format(new Date(member.createdAt), 'yyyy-MM-dd HH:mm:ss') : '',
                    member.validatedAt ? format(new Date(member.validatedAt), 'yyyy-MM-dd HH:mm:ss') : '',
                ].join(',')
            );
        });

        const csv = csvRows.join('\n');
        const filename = `members_export_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('Export API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
