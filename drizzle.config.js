const { defineConfig } = require("drizzle-kit");
require("dotenv").config({ path: ".env.local" });

module.exports = defineConfig({
    schema: "./drizzle/schema.ts",
    out: "./drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
});
