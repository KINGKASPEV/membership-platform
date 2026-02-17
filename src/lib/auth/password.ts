import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (hash: string, password: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Password verification failed:', error);
        return false;
    }
};
