import { db } from "../../lib/db";
import { roles, permissions } from "../schema";
import { eq } from "drizzle-orm";
import { Role, Resource, Action, Scope } from "../../lib/permissions/definitions";
import { withRetry } from "../../lib/db/resilience";

const DEFAULT_ROLES = [
    { name: 'super_admin', description: 'Full system access' },
    { name: 'state_admin', description: 'State level administration' },
    { name: 'lga_admin', description: 'LGA level administration' },
    { name: 'parish_admin', description: 'Parish level administration' },
] as const;

export async function seedRoles() {
    console.log("Seeding roles...");

    await withRetry(async () => {
        for (const role of DEFAULT_ROLES) {
            const existing = await db.query.roles.findFirst({
                where: eq(roles.name, role.name),
            });

            if (!existing) {
                await db.insert(roles).values(role);
                console.log(`Created role: ${role.name}`);
            }
        }
    });
    console.log("Roles seeded.");
}
