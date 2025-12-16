import { GoogleProfile, User } from "./IAuthRepository";

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

export interface IAuthService {
    authenticateGoogleUser(profile: GoogleProfile, role?: string): Promise<User>;
    register(email: string, password: string, fullName: string, role?: string): Promise<User>;
    login(email: string, password: string): Promise<User>;
    generateTokens(user: User): AuthTokens;
    refreshToken(refreshToken: string): Promise<AuthTokens>;
    verifyAccessToken(token: string): Promise<User | null>;
}
