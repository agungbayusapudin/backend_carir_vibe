export interface GoogleUserDto {
    googleId: string;
    email: string;
    fullName: string;
    profilePicture?: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    fullName: string;
    role?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RefreshTokenDto {
    refreshToken: string;
}

export interface LoginResponseDto {
    user: {
        userId: string;
        email: string;
        fullName: string;
        profilePicture: string | null;
        currentLevel: number;
        totalXp: number;
        role: string;
    };
    tokens: {
        accessToken: string;
        refreshToken?: string;
    };
}
