import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../drizzle/schema";

const connectionString = process.env.DATABASE_URL!;

// Cache the database connection in development to avoid creating multiple connections
const globalForDb = globalThis as unknown as {
    conn: postgres.Sql | undefined;
};

// Determine SSL setting: Force 'require' if production OR if connection string specifies it
const isProduction = process.env.NODE_ENV === 'production';
const forceSSL = isProduction || connectionString?.includes('sslmode=require');

const conn = globalForDb.conn ?? postgres(connectionString, {
    prepare: false,
    ssl: forceSSL ? 'require' : false,
    max: 10, // Maximum number of connections in the pool
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 30, // Connection timeout in seconds (Increased to handle cold starts/latency)
    max_lifetime: 60 * 30, // Maximum lifetime of a connection (30 minutes)
});

if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
