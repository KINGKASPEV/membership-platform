import { z } from "zod";

export const createAdminSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    roleId: z.string().uuid("Invalid role ID"),
    // Optional location fields for localized admins
    stateId: z.string().uuid().optional().nullable(),
    lgaId: z.string().uuid().optional().nullable(),
    parishId: z.string().uuid().optional().nullable(),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
