import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { members } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { personalInfoSchema, locationSchema, denominationSchema } from '@/lib/schemas/registration';
import { z } from 'zod';

// Schema matching the store structure
const registerRequestSchema = z.object({
    personalInfo: personalInfoSchema,
    location: locationSchema,
    denomination: denominationSchema,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validationResult = registerRequestSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid registration data', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const { personalInfo, location, denomination } = validationResult.data;

        // Check if phone number already exists
        const existingMember = await db
            .select({ id: members.id })
            .from(members)
            .where(eq(members.phoneNumber, personalInfo.phoneNumber))
            .limit(1);

        if (existingMember.length > 0) {
            return NextResponse.json(
                { error: 'A member with this phone number already exists.' },
                { status: 409 }
            );
        }

        // Insert new member
        // Note: Using `returning()` to get the inserted ID
        const [newMember] = await db
            .insert(members)
            .values({
                firstName: personalInfo.firstName,
                lastName: personalInfo.lastName,
                middleName: personalInfo.middleName,
                email: personalInfo.email || null,
                phoneNumber: personalInfo.phoneNumber,
                dateOfBirth: personalInfo.dateOfBirth, // Schema ensures YYYY-MM-DD
                gender: personalInfo.gender,

                stateId: location.stateId,
                lgaId: location.lgaId,
                wardId: location.wardId,
                parishId: location.parishId,

                isCatholic: denomination.isCatholic,
                hasPvc: denomination.hasPvc,
                denominationId: denomination.denominationId || null,

                status: 'pending', // Default status
            })
            .returning({ id: members.id });

        return NextResponse.json({
            success: true,
            memberId: newMember.id,
            message: 'Registration successful',
        });

    } catch (error) {
        console.error('Registration API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
