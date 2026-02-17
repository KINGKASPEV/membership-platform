import { z } from 'zod';

/**
 * Sanitizes a string by removing potential XSS vectors.
 * This is a basic implementation. For robust sanitization, use a library like dompurify (on client) or xss (on server).
 * Since we are mostly using React which escapes output by default, this is a secondary layer of defense.
 */
export function sanitizeInput(input: string): string {
    if (!input) return '';
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Validates and formats a phone number to standard format (e.g., +234...)
 */
export function validatePhone(phone: string): boolean {
    // Basic Regex for Nigerian phone numbers (can be expanded)
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Zod schema helper for sanitized strings
 */
export const sanitizedString = z.string().transform((str) => sanitizeInput(str.trim()));

/**
 * Zod schema helper for phone numbers
 */
export const phoneString = z.string().refine(validatePhone, {
    message: 'Invalid phone number format',
});
