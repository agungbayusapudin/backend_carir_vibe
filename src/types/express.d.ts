export interface User {
    userId?: string;
    fullName?: string;
    email?: string;
}

declare global {
    namespace Express {
        interface User {
            userId: string;
            fullName: string;
            email: string;
            googleId: string | null;
            profilePicture: string | null;
            currentLevel: number;
            totalXp: number;
            role: string;
        }


    }
}
