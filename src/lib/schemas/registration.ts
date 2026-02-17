import { z } from "zod";
import { sanitizedString, phoneString } from '@/lib/security/sanitize';

export const personalInfoSchema = z.object({
    firstName: sanitizedString.pipe(z.string().min(2, "First name must be at least 2 characters")),
    lastName: sanitizedString.pipe(z.string().min(2, "Last name must be at least 2 characters")),
    middleName: sanitizedString.optional(),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phoneNumber: phoneString,
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    gender: z.enum(["Male", "Female", "Other"]),
});

export const locationSchema = z.object({
    stateId: z.string().min(1, "State is required"),
    lgaId: z.string().min(1, "LGA is required"),
    wardId: z.string().min(1, "Ward is required"),
    parishId: z.string().min(1, "Parish is required"),
});

export const denominationSchema = z.object({
    isCatholic: z.boolean(),
    hasPvc: z.boolean(),
    denominationId: z.string().optional(), // Required if !isCatholic, logic handled in component/refinement
}).refine((data) => {
    if (!data.isCatholic && !data.denominationId) {
        return false;
    }
    return true;
}, {
    message: "Denomination is required if not Catholic",
    path: ["denominationId"]
});

export const registrationSchema = z.object({
    personal: personalInfoSchema,
    location: locationSchema,
    denomination: denominationSchema,
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type LocationData = z.infer<typeof locationSchema>;
export type DenominationData = z.infer<typeof denominationSchema>;
export type RegistrationData = z.infer<typeof registrationSchema>;
