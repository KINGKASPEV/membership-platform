import { hashPassword, verifyPassword } from '../src/lib/auth/password';

async function verifyAuth() {
    console.log('Testing Password Utility...');
    const password = 'TestPassword123!';

    console.log(`Original: ${password}`);
    const hash = await hashPassword(password);
    console.log(`Hash: ${hash}`);

    const isValid = await verifyPassword(hash, password);
    console.log(`IsValid (Expect true): ${isValid}`);

    const isInvalid = await verifyPassword(hash, 'WrongPassword');
    console.log(`IsInvalid (Expect false): ${isInvalid}`);

    if (isValid && !isInvalid) {
        console.log('✅ Password utility passed.');
    } else {
        console.error('❌ Password utility failed.');
        process.exit(1);
    }
}

verifyAuth();
