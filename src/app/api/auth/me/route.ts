import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { adminUsers } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    const session = await verifySession();

    if (!session) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    }

    const user = await db.query.adminUsers.findFirst({
        where: eq(adminUsers.id, session.userId),
        columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            roleId: true,
        },
        with: {
            role: {
                columns: {
                    name: true,
                    description: true,
                }
            }
        }
    });

    if (!user) {
        return NextResponse.json(
            { message: 'User not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ user });
}
