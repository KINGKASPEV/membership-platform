import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { lgas } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { withRetry } from '@/lib/db/resilience';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const stateId = searchParams.get('stateId');

        if (!stateId) {
            return NextResponse.json({ message: 'State ID required' }, { status: 400 });
        }

        const result = await withRetry(async () => {
            return await db
                .select()
                .from(lgas)
                .where(eq(lgas.stateId, stateId))
                .orderBy(lgas.name);
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("❌ GEO SYNC ERROR (LGAs):", error);
        return NextResponse.json(
            { error: 'Institutional synchronization failure' },
            { status: 500 }
        );
    }
}
