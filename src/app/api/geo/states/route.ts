import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { states } from '@/drizzle/schema';
import { withRetry } from '@/lib/db/resilience';

export async function GET() {
    try {
        const result = await withRetry(async () => {
            return await db.select().from(states).orderBy(states.name);
        });
        return NextResponse.json(result);
    } catch (error) {
        console.error("❌ GEO SYNC ERROR (States):", error);
        return NextResponse.json(
            { error: 'Institutional synchronization failure' },
            { status: 500 }
        );
    }
}
