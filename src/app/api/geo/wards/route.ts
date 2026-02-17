import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { wards } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { withRetry } from '@/lib/db/resilience';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const lgaId = searchParams.get('lgaId');

        if (!lgaId) {
            return NextResponse.json({ message: 'LGA ID required' }, { status: 400 });
        }

        const result = await withRetry(async () => {
            return await db
                .select()
                .from(wards)
                .where(eq(wards.lgaId, lgaId))
                .orderBy(wards.name);
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("❌ GEO SYNC ERROR (Wards):", error);
        return NextResponse.json(
            { error: 'Institutional synchronization failure' },
            { status: 500 }
        );
    }
}
