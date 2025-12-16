export interface UserListItemDto {
    userId: string;
    fullName: string;
    email: string;
    role: string;
    totalXp: number;
    currentLevel: number;
    isActive: boolean;
    createdAt: Date;
    lastLoginAt: Date | null;
}

export interface UpdateUserRoleDto {
    role: string;
}

export interface UpdateUserDto {
    fullName?: string;
    email?: string;
}

export interface SystemHealthDto {
    status: string;
    database: {
        connected: boolean;
        responseTime: number;
    };
    uptime: number;
    timestamp: Date;
}

export interface ResetXpDto {
    userIds?: string[];
    resetAll?: boolean;
}

export interface AnalyticsResponseDto {
    moduleId: string;
    moduleName: string;
    totalAttempts: number;
    averageScore: number;
    difficultyAnalysis: Array<{
        challengeId: string;
        challengeQuestion: string;
        totalAttempts: number;
        correctRate: number;
        incorrectRate: number;
    }>;
}
