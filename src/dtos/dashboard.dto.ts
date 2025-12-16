export interface DashboardResponseDto {
    user: {
        userId: string;
        fullName: string;
        email: string;
        profilePicture: string | null;
        currentLevel: number;
        totalXp: number;
        progressPercentage: string;
    };
    stats: {
        completedModules: number;
        totalModules: number;
        totalXp: number;
        currentLevel: number;
    };
    recentProgress: Array<{
        moduleId: string;
        moduleName: string;
        xpGained: number;
        starsReceived: number;
        finishedAt: Date;
    }>;
}

export interface LeaderboardItemDto {
    rank: number;
    userId: string;
    fullName: string;
    profilePicture: string | null;
    totalXp: number;
    currentLevel: number;
}
