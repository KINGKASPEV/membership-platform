import "./preload-env"; // Must be first!
import { seedRoles } from "./roles";
import { seedSuperAdmin } from "./admin";
import { seedGeography } from "./geographic";

async function main() {
    console.log("🌱 Starting seeding...");

    try {
        await seedRoles();
        await seedSuperAdmin();
        await seedGeography();
        console.log("✅ Seeding completed.");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

main();
