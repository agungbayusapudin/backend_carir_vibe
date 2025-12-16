export interface GoogleProfile {
    id: string;
    displayName: string;
    emails: Array<{ value: string; verified: boolean }>;
    photos?: Array<{ value: string }>;
}

export interface User {
    userId: string;
    fullName: string;
    email: string;
    password?: string | null;
    googleId: string | null;
    profilePicture: string | null;
    currentLevel: number;
    totalXp: number;
    progressPercentage: string;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    lastLoginAt: Date | null;
}

export interface IAuthRepository {
    findUserByEmail(email: string): Promise<User | null>;
    findUserByGoogleId(googleId: string): Promise<User | null>;
    createUserFromGoogle(profile: GoogleProfile, role?: string): Promise<User>;
    createUser(email: string, password: string, fullName: string, role?: string): Promise<User>;
    updateUserRole(userId: string, roleName: string): Promise<User>;
    updateLastLogin(userId: string): Promise<void>;
}
