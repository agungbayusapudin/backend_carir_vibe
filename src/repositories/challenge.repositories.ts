import { db } from "../../database/db";
import { dimChallenges, challengeOptions, dimModules, userProgress } from "../../database/schema";
import { eq, and, sql } from "drizzle-orm";

export interface Challenge {
    challengeId: string;
    moduleId: string;
    challengeQuestion: string;
    hrBotDialog: string | null;
    challengeType: string;
    expectedAnswerId: string | null;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChallengeOption {
    optionId: string;
    challengeId: string;
    optionText: string;
    isCorrect: boolean;
    feedbackText: string | null;
    xpReward: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IChallengeRepository {
    createChallenge(data: any): Promise<Challenge>;
    updateChallenge(challengeId: string, data: any): Promise<Challenge>;
    deleteChallenge(challengeId: string): Promise<void>;
    getChallengeById(challengeId: string): Promise<Challenge | null>;
    getChallengesByModule(moduleId: string): Promise<Challenge[]>;
    getChallengeOptions(challengeId: string): Promise<ChallengeOption[]>;
    getChallengeAnalytics(moduleId: string): Promise<any>;
}

export class ChallengeRepository implements IChallengeRepository {
    async createChallenge(data: any): Promise<Challenge> {
        const [challenge] = await db
            .insert(dimChallenges)
            .values({
                moduleId: data.moduleId,
                challengeQuestion: data.challengeQuestion,
                hrBotDialog: data.hrBotDialog,
                challengeType: data.challengeType,
            })
            .returning();

        let expectedAnswerId: string | null = null;

        for (const option of data.options) {
            const [createdOption] = await db
                .insert(challengeOptions)
                .values({
                    challengeId: challenge.challengeId,
                    optionText: option.optionText,
                    isCorrect: option.isCorrect,
                    feedbackText: option.feedbackText,
                    xpReward: option.xpReward,
                })
                .returning();

            if (option.isCorrect) {
                expectedAnswerId = createdOption.optionId;
            }
        }

        if (expectedAnswerId) {
            await db
                .update(dimChallenges)
                .set({ expectedAnswerId })
                .where(eq(dimChallenges.challengeId, challenge.challengeId));
        }

        await db
            .update(dimModules)
            .set({ totalChallenges: sql`${dimModules.totalChallenges} + 1` })
            .where(eq(dimModules.moduleId, data.moduleId));

        return this.mapToChallenge(challenge);
    }

    async updateChallenge(challengeId: string, data: any): Promise<Challenge> {
        const updateData: any = {};
        if (data.challengeQuestion) updateData.challengeQuestion = data.challengeQuestion;
        if (data.hrBotDialog) updateData.hrBotDialog = data.hrBotDialog;
        if (data.challengeType) updateData.challengeType = data.challengeType;

        const [challenge] = await db
            .update(dimChallenges)
            .set({ ...updateData, updatedAt: new Date() })
            .where(eq(dimChallenges.challengeId, challengeId))
            .returning();

        if (data.options && data.options.length > 0) {
            await db.delete(challengeOptions).where(eq(challengeOptions.challengeId, challengeId));

            let expectedAnswerId: string | null = null;

            for (const option of data.options) {
                const [createdOption] = await db
                    .insert(challengeOptions)
                    .values({
                        challengeId,
                        optionText: option.optionText,
                        isCorrect: option.isCorrect,
                        feedbackText: option.feedbackText,
                        xpReward: option.xpReward,
                    })
                    .returning();

                if (option.isCorrect) {
                    expectedAnswerId = createdOption.optionId;
                }
            }

            if (expectedAnswerId) {
                await db
                    .update(dimChallenges)
                    .set({ expectedAnswerId })
                    .where(eq(dimChallenges.challengeId, challengeId));
            }
        }

        return this.mapToChallenge(challenge);
    }

    async deleteChallenge(challengeId: string): Promise<void> {
        await db
            .update(dimChallenges)
            .set({ isActive: false, deletedAt: new Date() })
            .where(eq(dimChallenges.challengeId, challengeId));
    }

    async getChallengeById(challengeId: string): Promise<Challenge | null> {
        const challenges = await db
            .select()
            .from(dimChallenges)
            .where(and(eq(dimChallenges.challengeId, challengeId), eq(dimChallenges.isActive, true)))
            .limit(1);

        return challenges.length > 0 ? this.mapToChallenge(challenges[0]) : null;
    }

    async getChallengesByModule(moduleId: string): Promise<Challenge[]> {
        const challenges = await db
            .select()
            .from(dimChallenges)
            .where(and(eq(dimChallenges.moduleId, moduleId), eq(dimChallenges.isActive, true)));

        return challenges.map(this.mapToChallenge);
    }

    async getChallengeOptions(challengeId: string): Promise<ChallengeOption[]> {
        const options = await db
            .select()
            .from(challengeOptions)
            .where(eq(challengeOptions.challengeId, challengeId));

        return options.map(this.mapToChallengeOption);
    }

    async getChallengeAnalytics(moduleId: string): Promise<any> {
        const challenges = await this.getChallengesByModule(moduleId);

        const challengesWithStats = await Promise.all(
            challenges.map(async (challenge) => {
                const stats = await db
                    .select({
                        total: sql<number>`count(*)`,
                        correct: sql<number>`sum(case when ${userProgress.isCorrectSelection} = true then 1 else 0 end)`,
                    })
                    .from(userProgress)
                    .where(eq(userProgress.challengeId, challenge.challengeId));

                const totalAttempts = Number(stats[0]?.total || 0);
                const correctCount = Number(stats[0]?.correct || 0);

                return {
                    challenge,
                    totalAttempts,
                    correctCount,
                    incorrectCount: totalAttempts - correctCount,
                };
            })
        );

        return challengesWithStats;
    }

    private mapToChallenge(dbChallenge: any): Challenge {
        return {
            challengeId: dbChallenge.challengeId,
            moduleId: dbChallenge.moduleId,
            challengeQuestion: dbChallenge.challengeQuestion,
            hrBotDialog: dbChallenge.hrBotDialog,
            challengeType: dbChallenge.challengeType,
            expectedAnswerId: dbChallenge.expectedAnswerId,
            isActive: dbChallenge.isActive ?? true,
            deletedAt: dbChallenge.deletedAt,
            createdAt: dbChallenge.createdAt,
            updatedAt: dbChallenge.updatedAt,
        };
    }

    private mapToChallengeOption(dbOption: any): ChallengeOption {
        return {
            optionId: dbOption.optionId,
            challengeId: dbOption.challengeId,
            optionText: dbOption.optionText,
            isCorrect: dbOption.isCorrect ?? false,
            feedbackText: dbOption.feedbackText,
            xpReward: dbOption.xpReward ?? 0,
            createdAt: dbOption.createdAt,
            updatedAt: dbOption.updatedAt,
        };
    }
}
