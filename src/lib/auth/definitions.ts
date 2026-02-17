export type SessionPayload = {
    userId: string;
    expiresAt: Date;
};

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
    permissions: string[];
};

export type Session = {
    id: string;
    userId: string;
    expiresAt: Date;
};
