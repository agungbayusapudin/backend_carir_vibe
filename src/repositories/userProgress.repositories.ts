import { db } from "../../database/db";
import { userProgress, dimUsers, dimModules, dimChallenges, challengeOptions, dimDates } from "../../database/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export interface UserProgress {
    factId: string;
    userId: string;
    moduleId: string;
    challengeId: string;
    dateId: number;
    role: string;
    xpGained: number;
    starsReceived: number;
    timeSpentSeconds: number;
    userSelectedOptionId: string;
    isCorrectSelection: boolean;
    finishedAt: Date;
}

export interface IUserProgressRepository {
    createProgress(data: Omit<UserProgress, 'factId' | 'finishedAt'>): Promise<UserProgress>;
    getUserHistory(userId: string): Promise<UserProgress[]>;
    updateUserXp(userId: string, xpToAdd: number): Promise<void>;
    getDashboard(userId: string): Promise<any>;
    getLeaderboard(limit: number): Promise<any[]>;
}

export class UserProgressRepository implements IUserProgressRepository {
    async createProgress(data: Omit<UserProgress, 'factId' | 'finishedAt'>): Promise<UserProgress> {
        // Ensure date exists in dimDates
        const dateId = data.dateId;
        const dateExists = await db.select().from(dimDates).where(eq(dimDates.dateId, dateId)).limit(1);

        if (dateExists.length === 0) {
            // Create date entry
            // This is a simplified insertion. proper dim_dates usually pre-populated.
            // Converting 20251216 to Date object? 
            // dateId is YYYYMMDD.
            const year = Math.floor(dateId / 10000);
            const month = Math.floor((dateId % 10000) / 100);
            const day = dateId % 100;
            const fullDate = new Date(year, month - 1, day);

            await db.insert(dimDates).values({
                dateId: dateId,
                fullDate: fullDate,
                year: year,
                monthName: fullDate.toLocaleString('default', { month: 'long' }),
                dayName: fullDate.toLocaleString('default', { weekday: 'long' }),
            });
        }

        const [result] = await db
            .insert(userProgress)
            .values({
                ...data,
                finishedAt: new Date(),
            })
            .returning();

        return this.mapToUserProgress(result);
    }

    async getUserHistory(userId: string): Promise<UserProgress[]> {
        const history = await db
            .select()
            .from(userProgress)
            .where(eq(userProgress.userId, userId))
            .orderBy(desc(userProgress.finishedAt));

        return history.map(this.mapToUserProgress);
    }

    async updateUserXp(userId: string, xpToAdd: number): Promise<void> {
        await db
            .update(dimUsers)
            .set({
                totalXp: sql`${dimUsers.totalXp} + ${xpToAdd}`,
                currentLevel: sql`FLOOR((${dimUsers.totalXp} + ${xpToAdd}) / 1000) + 1`,
                progressPercentage: sql`((${dimUsers.totalXp} + ${xpToAdd}) % 1000) / 10.0`,
                updatedAt: new Date(),
            })
            .where(eq(dimUsers.userId, userId));
    }

    async getDashboard(userId: string): Promise<any> {
        const userResult = await db
            .select()
            .from(dimUsers)
            .where(eq(dimUsers.userId, userId))
            .limit(1);

        if (userResult.length === 0) {
            throw new Error("User not found");
        }

        const user = userResult[0];

        const totalModulesResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(dimModules)
            .where(eq(dimModules.isActive, true));

        const completedModulesResult = await db
            .select({ moduleId: userProgress.moduleId })
            .from(userProgress)
            .where(eq(userProgress.userId, userId))
            .groupBy(userProgress.moduleId);

        const recentProgressResult = await db
            .select()
            .from(userProgress)
            .where(eq(userProgress.userId, userId))
            .orderBy(desc(userProgress.finishedAt))
            .limit(5);

        return {
            user,
            completedModules: completedModulesResult.length,
            totalModules: Number(totalModulesResult[0].count),
            recentProgress: recentProgressResult,
        };
    }

    async getLeaderboard(limit: number): Promise<any[]> {
        const users = await db
            .select()
            .from(dimUsers)
            .where(eq(dimUsers.isActive, true))
            .orderBy(desc(dimUsers.totalXp))
            .limit(limit);

        return users;
    }

    private mapToUserProgress(dbProgress: any): UserProgress {
        return {
            factId: dbProgress.factId,
            userId: dbProgress.userId,
            moduleId: dbProgress.moduleId,
            challengeId: dbProgress.challengeId,
            dateId: dbProgress.dateId,
            role: dbProgress.role,
            xpGained: dbProgress.xpGained,
            starsReceived: dbProgress.starsReceived,
            timeSpentSeconds: dbProgress.timeSpentSeconds,
            userSelectedOptionId: dbProgress.userSelectedOptionId,
            isCorrectSelection: dbProgress.isCorrectSelection,
            finishedAt: dbProgress.finishedAt,
        };
    }
}
