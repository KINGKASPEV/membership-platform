import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { denominations } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { withRetry } from '@/lib/db/resilience';

export async function GET() {
    try {
        const result = await withRetry(async () => {
            return await db
                .select()
                .from(denominations)
                .where(eq(denominations.isCatholic, false))
                .orderBy(denominations.name);
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("❌ GEO SYNC ERROR (Denominations):", error);
        return NextResponse.json(
            { error: 'Institutional synchronization failure' },
            { status: 500 }
        );
    }
}
