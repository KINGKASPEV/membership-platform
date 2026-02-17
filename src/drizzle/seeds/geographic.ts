import { db } from "../../lib/db";
import { states, lgas, wards, parishes, denominations } from "../schema";
import { eq } from "drizzle-orm";
import { withRetry } from "../../lib/db/resilience";

export async function seedGeography() {
    console.log("Seeding geographic data (placeholder)...");

    await withRetry(async () => {
        // Check if any state exists
        const existingState = await db.query.states.findFirst();

        if (!existingState) {
            const [newState] = await db.insert(states).values({
                name: "Lagos",
                code: "LA"
            }).returning();

            const [newLga] = await db.insert(lgas).values({
                name: "Ikeja",
                stateId: newState.id
            }).returning();

            const [newWard] = await db.insert(wards).values({
                name: "Ward A",
                lgaId: newLga.id
            }).returning();

            await db.insert(parishes).values({
                name: "St. Leo's",
                wardId: newWard.id,
                address: "Ikeja"
            });
        }

        // Seed denominations
        const existingDenom = await db.query.denominations.findFirst();
        if (!existingDenom) {
            await db.insert(denominations).values([
                { name: "Anglican", isCatholic: false },
                { name: "Pentecostal", isCatholic: false },
                { name: "Methodist", isCatholic: false },
                { name: "Baptist", isCatholic: false },
            ]);
        }
    });

    console.log("Geographic data seeded.");
}
