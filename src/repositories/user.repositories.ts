import { db } from "../../database/db";
import { dimUsers } from "../../database/schema";
import { eq, sql } from "drizzle-orm";

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
    lastLoginAt: Date | null;
}

export interface IUserRepository {
    getAllUsers(): Promise<User[]>;
    getUserById(userId: string): Promise<User | null>;
    updateUser(userId: string, data: any): Promise<User>;
    deactivateUser(userId: string): Promise<void>;
    resetUserXp(userIds: string[]): Promise<void>;
    checkDatabaseHealth(): Promise<{ connected: boolean; responseTime: number }>;
}

export class UserRepository implements IUserRepository {
    async getAllUsers(): Promise<User[]> {
        const users = await db.select().from(dimUsers);
        return users.map(this.mapToUser);
    }

    async getUserById(userId: string): Promise<User | null> {
        const users = await db
            .select()
            .from(dimUsers)
            .where(eq(dimUsers.userId, userId))
            .limit(1);

        return users.length > 0 ? this.mapToUser(users[0]) : null;
    }

    async updateUser(userId: string, data: any): Promise<User> {
        const [user] = await db
            .update(dimUsers)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(dimUsers.userId, userId))
            .returning();

        return this.mapToUser(user);
    }

    async deactivateUser(userId: string): Promise<void> {
        await db
            .update(dimUsers)
            .set({
                isActive: false,
                deletedAt: new Date(),
            })
            .where(eq(dimUsers.userId, userId));
    }

    async resetUserXp(userIds: string[]): Promise<void> {
        for (const userId of userIds) {
            await db
                .update(dimUsers)
                .set({
                    totalXp: 0,
                    currentLevel: 1,
                    progressPercentage: "0.00",
                    updatedAt: new Date(),
                })
                .where(eq(dimUsers.userId, userId));
        }
    }

    async checkDatabaseHealth(): Promise<{ connected: boolean; responseTime: number }> {
        const startTime = Date.now();

        try {
            await db.select().from(dimUsers).limit(1);
            const responseTime = Date.now() - startTime;

            return {
                connected: true,
                responseTime,
            };
        } catch (error) {
            return {
                connected: false,
                responseTime: Date.now() - startTime,
            };
        }
    }

    private mapToUser(dbUser: any): User {
        return {
            userId: dbUser.userId,
            fullName: dbUser.fullName,
            email: dbUser.email,
            password: dbUser.password,
            googleId: dbUser.googleId,
            profilePicture: dbUser.profilePicture,
            currentLevel: dbUser.currentLevel ?? 1,
            totalXp: dbUser.totalXp ?? 0,
            progressPercentage: dbUser.progressPercentage ?? "0.00",
            isActive: dbUser.isActive ?? true,
            deletedAt: dbUser.deletedAt,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
            lastLoginAt: dbUser.lastLoginAt,
        };
    }
}
