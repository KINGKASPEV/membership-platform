import { db } from "../../lib/db";
import { adminUsers, roles } from "../schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "../../lib/auth/password";
import { withRetry } from "../../lib/db/resilience";

export async function seedSuperAdmin() {
    console.log("Creating super admin...");

    await withRetry(async () => {
        const superAdminRole = await db.query.roles.findFirst({
            where: eq(roles.name, "super_admin"),
        });

        if (!superAdminRole) {
            throw new Error("Super admin role not found. Run roles seed first.");
        }

        const existingAdmin = await db.query.adminUsers.findFirst({
            where: eq(adminUsers.email, "admin@nmrvp.com"),
        });

        if (!existingAdmin) {
            const passwordHash = await hashPassword("SuperAdmin123!");

            await db.insert(adminUsers).values({
                email: "admin@nmrvp.com",
                passwordHash,
                firstName: "Super",
                lastName: "Admin",
                roleId: superAdminRole.id,
                isActive: true,
            });
            console.log("Super admin created with email: admin@nmrvp.com");
            console.log("Password: SuperAdmin123!");
        } else {
            console.log("Super admin already exists.");
        }
    });
}
