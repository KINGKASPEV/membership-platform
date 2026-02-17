import { db } from '@/lib/db';
import { adminUsers, permissions, roles } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { Resource, Action } from './definitions';
import { withRetry } from '@/lib/db/resilience';

export async function checkPermission(
    userId: string,
    resource: Resource,
    action: Action
): Promise<boolean> {
    return await withRetry(async () => {
        const result = await db
            .select({
                roleName: roles.name,
                resource: permissions.resource,
                action: permissions.action,
            })
            .from(adminUsers)
            .innerJoin(roles, eq(adminUsers.roleId, roles.id))
            .innerJoin(permissions, eq(roles.id, permissions.roleId))
            .where(
                and(
                    eq(adminUsers.id, userId),
                    eq(permissions.resource, resource),
                    eq(permissions.action, action)
                )
            )
            .limit(1);

        return result.length > 0;
    });
}

export async function getUserScope(userId: string) {
    return await withRetry(async () => {
        const result = await db
            .select({
                stateId: adminUsers.stateId,
                lgaId: adminUsers.lgaId,
                parishId: adminUsers.parishId,
                roleName: roles.name,
            })
            .from(adminUsers)
            .innerJoin(roles, eq(adminUsers.roleId, roles.id))
            .where(eq(adminUsers.id, userId))
            .limit(1);

        if (result.length === 0) return null;

        const user = result[0];

        return {
            role: user.roleName,
            stateId: user.stateId,
            lgaId: user.lgaId,
            parishId: user.parishId,
        };
    });
}

