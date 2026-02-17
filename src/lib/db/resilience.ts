import { db } from "./index";

/**
 * Executes a database query with exponential backoff retries.
 * Specifically designed to handle transient "CONNECT_TIMEOUT" and other 
 * recoverable database connectivity issues common in serverless/pooled environments.
 */
export async function withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 5,
    initialDelay: number = 500
): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error: any) {
            lastError = error;

            // Only retry on specific transient connection errors
            const isTransient =
                error?.code === 'CONNECT_TIMEOUT' ||
                error?.message?.includes('timeout') ||
                error?.message?.includes('connection') ||
                error?.message?.includes('Failed query');

            if (!isTransient || attempt === maxRetries - 1) {
                throw error;
            }

            // Exponential backoff + jitter for institutional stability
            const jitter = Math.random() * 200;
            const delay = (initialDelay * Math.pow(2, attempt)) + jitter;

            console.warn(`[DB Resilience] Transient error detected (Attempt ${attempt + 1}/${maxRetries}). Retrying in ${Math.round(delay)}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}
