import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers, roles } from "@/drizzle/schema";
import { createAdminSchema } from "@/lib/schemas/admin";
import { eq, desc } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";

export async function GET() {
    try {
        // Fetch users with their role names
        const users = await db
            .select({
                id: adminUsers.id,
                firstName: adminUsers.firstName,
                lastName: adminUsers.lastName,
                email: adminUsers.email,
                roleId: adminUsers.roleId,
                roleName: roles.name,
                isActive: adminUsers.isActive,
                lastLoginAt: adminUsers.lastLoginAt,
                createdAt: adminUsers.createdAt,
            })
            .from(adminUsers)
            .leftJoin(roles, eq(adminUsers.roleId, roles.id))
            .orderBy(desc(adminUsers.createdAt));

        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch admin users:", error);
        return NextResponse.json(
            { error: "Failed to fetch admin users" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = createAdminSchema.parse(body);

        // Check if email already exists
        const existingUser = await db
            .select()
            .from(adminUsers)
            .where(eq(adminUsers.email, validatedData.email))
            .limit(1);

        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(validatedData.password);

        // Create user
        const [newUser] = await db
            .insert(adminUsers)
            .values({
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                email: validatedData.email,
                passwordHash,
                roleId: validatedData.roleId,
                stateId: validatedData.stateId,
                lgaId: validatedData.lgaId,
                parishId: validatedData.parishId,
                isActive: true,
            })
            .returning({
                id: adminUsers.id,
                firstName: adminUsers.firstName,
                lastName: adminUsers.lastName,
                email: adminUsers.email,
                roleId: adminUsers.roleId,
                createdAt: adminUsers.createdAt,
            });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message.includes("JSON")) {
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }
        // Zod validation error handling could be improved here but basic catch works for now
        console.error("Failed to create admin user:", error);
        return NextResponse.json(
            { error: "Failed to create admin user" },
            { status: 500 }
        );
    }
}
