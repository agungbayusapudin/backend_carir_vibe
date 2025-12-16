import { db } from "../../database/db";
import { dimResumes, dimPortfolios, userBookmarks } from "../../database/schema";
import { eq, and } from "drizzle-orm";
import { IProfileRepository } from "../interface/IProfile";

export class ProfileRepository implements IProfileRepository {
    async findResumeByUserId(userId: string): Promise<any> {
        const result = await db.select().from(dimResumes).where(eq(dimResumes.userId, userId));
        return result[0];
    }

    async upsertResume(userId: string, data: any): Promise<any> {
        const existing = await this.findResumeByUserId(userId);

        if (existing) {
            const [updated] = await db.update(dimResumes)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(dimResumes.userId, userId))
                .returning();
            return updated;
        } else {
            const [created] = await db.insert(dimResumes)
                .values({ ...data, userId })
                .returning();
            return created;
        }
    }

    async findPortfoliosByUserId(userId: string): Promise<any[]> {
        return await db.select().from(dimPortfolios).where(eq(dimPortfolios.userId, userId));
    }

    async createPortfolio(userId: string, data: any): Promise<any> {
        const [pf] = await db.insert(dimPortfolios).values({ ...data, userId }).returning();
        return pf;
    }

    async deletePortfolio(portfolioId: string): Promise<void> {
        await db.delete(dimPortfolios).where(eq(dimPortfolios.portfolioId, portfolioId));
    }

    async getBookmarks(userId: string): Promise<any[]> {
        return await db.select().from(userBookmarks).where(eq(userBookmarks.userId, userId));
    }

    async addBookmark(data: any): Promise<any> {
        const [bk] = await db.insert(userBookmarks).values(data).returning();
        return bk;
    }

    async removeBookmark(bookmarkId: string): Promise<void> {
        await db.delete(userBookmarks).where(eq(userBookmarks.bookmarkId, bookmarkId));
    }
}
