import { sql, relations } from "drizzle-orm";
import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    timestamp,
    date,
    index,
    unique,
} from "drizzle-orm/pg-core";

// ----------------------------------------------------------------------
// 1. Geographic Tables
// ----------------------------------------------------------------------

export const states = pgTable("states", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).unique().notNull(),
    code: varchar("code", { length: 10 }).unique().notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const lgas = pgTable(
    "lgas",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        stateId: uuid("state_id")
            .notNull()
            .references(() => states.id, { onDelete: "cascade" }),
        name: varchar("name", { length: 100 }).notNull(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (t) => ({
        unq: unique().on(t.stateId, t.name),
        stateIdx: index("idx_lgas_state_id").on(t.stateId),
    })
);

export const wards = pgTable(
    "wards",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        lgaId: uuid("lga_id")
            .notNull()
            .references(() => lgas.id, { onDelete: "cascade" }),
        name: varchar("name", { length: 100 }).notNull(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (t) => ({
        unq: unique().on(t.lgaId, t.name),
        lgaIdx: index("idx_wards_lga_id").on(t.lgaId),
    })
);

export const parishes = pgTable(
    "parishes",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        wardId: uuid("ward_id")
            .notNull()
            .references(() => wards.id, { onDelete: "cascade" }),
        name: varchar("name", { length: 200 }).notNull(),
        address: text("address"),
        contactPhone: varchar("contact_phone", { length: 20 }),
        contactEmail: varchar("contact_email", { length: 100 }),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (t) => ({
        unq: unique().on(t.wardId, t.name),
        wardIdx: index("idx_parishes_ward_id").on(t.wardId),
    })
);

export const denominations = pgTable("denominations", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).unique().notNull(),
    isCatholic: boolean("is_catholic").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

// ----------------------------------------------------------------------
// 2. Admin & Auth Tables
// ----------------------------------------------------------------------

export const roles = pgTable("roles", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 50 }).unique().notNull(), // 'super_admin', 'state_admin', etc.
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const adminUsers = pgTable(
    "admin_users",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        email: varchar("email", { length: 150 }).unique().notNull(),
        passwordHash: varchar("password_hash", { length: 255 }).notNull(),
        firstName: varchar("first_name", { length: 100 }).notNull(),
        lastName: varchar("last_name", { length: 100 }).notNull(),
        roleId: uuid("role_id")
            .notNull()
            .references(() => roles.id),
        stateId: uuid("state_id").references(() => states.id),
        lgaId: uuid("lga_id").references(() => lgas.id),
        parishId: uuid("parish_id").references(() => parishes.id),
        isActive: boolean("is_active").default(true),
        lastLoginAt: timestamp("last_login_at"),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (t) => ({
        emailIdx: index("idx_admin_email").on(t.email),
        roleIdx: index("idx_admin_role_id").on(t.roleId),
    })
);

export const permissions = pgTable(
    "permissions",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        roleId: uuid("role_id")
            .notNull()
            .references(() => roles.id, { onDelete: "cascade" }),
        resource: varchar("resource", { length: 50 }).notNull(),
        action: varchar("action", { length: 50 }).notNull(),
        scope: varchar("scope", { length: 50 }).notNull(),
        createdAt: timestamp("created_at").defaultNow(),
    },
    (t) => ({
        unq: unique().on(t.roleId, t.resource, t.action),
    })
);

export const sessions = pgTable(
    "sessions",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id")
            .notNull()
            .references(() => adminUsers.id, { onDelete: "cascade" }),
        tokenHash: varchar("token_hash", { length: 255 }).unique().notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow(),
        ipAddress: varchar("ip_address", { length: 45 }),
        userAgent: text("user_agent"),
    },
    (t) => ({
        userIdx: index("idx_sessions_user_id").on(t.userId),
        tokenIdx: index("idx_sessions_token_hash").on(t.tokenHash),
        expiresIdx: index("idx_sessions_expires_at").on(t.expiresAt),
    })
);

// ----------------------------------------------------------------------
// 3. Members Table
// ----------------------------------------------------------------------

export const members = pgTable(
    "members",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        firstName: varchar("first_name", { length: 100 }).notNull(),
        lastName: varchar("last_name", { length: 100 }).notNull(),
        middleName: varchar("middle_name", { length: 100 }),
        phoneNumber: varchar("phone_number", { length: 20 }).unique().notNull(),
        email: varchar("email", { length: 150 }),
        dateOfBirth: date("date_of_birth").notNull(),
        gender: varchar("gender", { length: 20 }).notNull(), // 'Male', 'Female', 'Other' (Enforced by app logic or enum)

        // Location
        stateId: uuid("state_id")
            .notNull()
            .references(() => states.id),
        lgaId: uuid("lga_id").notNull().references(() => lgas.id),
        wardId: uuid("ward_id").notNull().references(() => wards.id),
        parishId: uuid("parish_id")
            .notNull()
            .references(() => parishes.id),

        // Denomination & PVC
        denominationId: uuid("denomination_id").references(() => denominations.id),
        isCatholic: boolean("is_catholic").default(true).notNull(),
        hasPvc: boolean("has_pvc").default(false).notNull(),

        // Validation
        status: varchar("status", { length: 20 })
            .default("pending")
            .notNull(), // 'pending', 'validated', 'rejected'
        validatedAt: timestamp("validated_at"),
        validatedBy: uuid("validated_by").references(() => adminUsers.id),
        validationNotes: text("validation_notes"),

        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (t) => ({
        phoneIdx: index("idx_members_phone").on(t.phoneNumber),
        parishIdx: index("idx_members_parish_id").on(t.parishId),
        wardIdx: index("idx_members_ward_id").on(t.wardId),
        lgaIdx: index("idx_members_lga_id").on(t.lgaId),
        stateIdx: index("idx_members_state_id").on(t.stateId),
        statusIdx: index("idx_members_status").on(t.status),
        pvcIdx: index("idx_members_pvc").on(t.hasPvc),
        denominationIdx: index("idx_members_denomination_id").on(t.denominationId),
        createdIdx: index("idx_members_created_at").on(t.createdAt),
        // Composite
        locationIdx: index("idx_members_composite_location").on(
            t.stateId,
            t.lgaId,
            t.wardId,
            t.parishId
        ),
        validationIdx: index("idx_members_composite_validation").on(
            t.status,
            t.validatedAt,
            t.parishId
        ),
    })
);

// ----------------------------------------------------------------------
// 4. Logs
// ----------------------------------------------------------------------

export const validationLogs = pgTable(
    "validation_logs",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        memberId: uuid("member_id")
            .notNull()
            .references(() => members.id, { onDelete: "cascade" }),
        adminUserId: uuid("admin_user_id")
            .notNull()
            .references(() => adminUsers.id),
        action: varchar("action", { length: 20 }).notNull(), // 'approved', 'rejected', 'edited'
        previousStatus: varchar("previous_status", { length: 20 }),
        newStatus: varchar("new_status", { length: 20 }),
        notes: text("notes"),
        createdAt: timestamp("created_at").defaultNow(),
    },
    (t) => ({
        memberIdx: index("idx_validation_logs_member_id").on(t.memberId),
        adminIdx: index("idx_validation_logs_admin_user_id").on(t.adminUserId),
        createdIdx: index("idx_validation_logs_created_at").on(t.createdAt),
    })
);

export const auditLogs = pgTable(
    "audit_logs",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: uuid("user_id").references(() => adminUsers.id),
        action: varchar("action", { length: 100 }).notNull(),
        resourceType: varchar("resource_type", { length: 50 }),
        resourceId: uuid("resource_id"),
        ipAddress: varchar("ip_address", { length: 45 }),
        userAgent: text("user_agent"),
        metadata: text("metadata"), // Storing JSON as text or jsonb if preferred
        createdAt: timestamp("created_at").defaultNow(),
    },
    (t) => ({
        userIdx: index("idx_audit_logs_user_id").on(t.userId),
        actionIdx: index("idx_audit_logs_action").on(t.action),
        createdIdx: index("idx_audit_logs_created_at").on(t.createdAt),
        resourceIdx: index("idx_audit_logs_resource").on(
            t.resourceType,
            t.resourceId
        ),
    })
);

// ----------------------------------------------------------------------
// Relations
// ----------------------------------------------------------------------

export const adminUsersRelations = relations(adminUsers, ({ one }) => ({
    role: one(roles, {
        fields: [adminUsers.roleId],
        references: [roles.id],
    }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
    adminUsers: many(adminUsers),
}));
