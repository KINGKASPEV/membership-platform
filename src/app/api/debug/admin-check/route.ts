import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers, roles } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { withRetry } from '@/lib/db/resilience';

/**
 * Institutional Diagnostic Route
 * VERIFIES: Seeded SuperAdmin presence and credential status
 * SECURITY: Restricted to development environment
 */
export async function GET() {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Access Denied: Production Environment' }, { status: 403 });
    }

    try {
        const diagnostics = await withRetry(async () => {
            // Check roles
            const allRoles = await db.select().from(roles);

            // Check superadmin
            const superAdmin = await db.query.adminUsers.findFirst({
                where: eq(adminUsers.email, 'admin@nmrvp.com'),
                with: {
                    role: true
                }
            });

            return {
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV,
                rolesPresent: allRoles.map(r => r.name),
                superAdminStatus: superAdmin ? {
                    exists: true,
                    email: superAdmin.email,
                    role: superAdmin.role?.name,
                    isActive: superAdmin.isActive,
                    createdAt: superAdmin.createdAt,
                } : { exists: false }
            };
        });

        return NextResponse.json(diagnostics);
    } catch (error: any) {
        return NextResponse.json({
            error: 'Diagnostic Protocol Failure',
            message: error.message,
            code: error.code
        }, { status: 500 });
    }
}
