import { db } from "../../database/db";
import { dimPostings, dimCompanies, jobApplications } from "../../database/schema";
import { eq, and } from "drizzle-orm";
import { IMarketplaceRepository } from "../interface/IMarketplace";

export class MarketplaceRepository implements IMarketplaceRepository {
    async findAllPostings(filters: any): Promise<any[]> {
        let query = db.select({
            posting: dimPostings,
            company: dimCompanies
        })
            .from(dimPostings)
            .leftJoin(dimCompanies, eq(dimPostings.companyId, dimCompanies.companyId))
            .where(eq(dimPostings.isActive, true));

        // Note: Add dynamic filters here if needed

        return await query;
    }

    async findPostingById(postingId: string): Promise<any> {
        const result = await db.select({
            posting: dimPostings,
            company: dimCompanies
        })
            .from(dimPostings)
            .leftJoin(dimCompanies, eq(dimPostings.companyId, dimCompanies.companyId))
            .where(eq(dimPostings.postingId, postingId));

        return result[0];
    }

    async findPostingsByCompany(companyId: string): Promise<any[]> {
        return await db.select().from(dimPostings).where(eq(dimPostings.companyId, companyId));
    }

    async createPosting(data: any): Promise<any> {
        const [posting] = await db.insert(dimPostings).values(data).returning();
        return posting;
    }

    async updatePosting(postingId: string, data: any): Promise<any> {
        const [updated] = await db.update(dimPostings)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(dimPostings.postingId, postingId))
            .returning();
        return updated;
    }

    async deletePosting(postingId: string): Promise<void> {
        await db.update(dimPostings)
            .set({ isActive: false })
            .where(eq(dimPostings.postingId, postingId));
    }

    async createApplication(data: any): Promise<any> {
        const [app] = await db.insert(jobApplications).values(data).returning();
        return app;
    }

    async findApplicationsByPosting(postingId: string): Promise<any[]> {
        return await db.select().from(jobApplications).where(eq(jobApplications.postingId, postingId));
    }

    async findApplicationsByUser(userId: string): Promise<any[]> {
        return await db.select().from(jobApplications).where(eq(jobApplications.userId, userId));
    }

    async updateApplicationStatus(applicationId: string, status: string): Promise<any> {
        const [updated] = await db.update(jobApplications)
            .set({ status: status, updatedAt: new Date() })
            .where(eq(jobApplications.applicationId, applicationId))
            .returning();
        return updated;
    }

    async findCompanyByEmployer(userId: string): Promise<any> {
        const result = await db.select().from(dimCompanies).where(eq(dimCompanies.employerUserId, userId));
        return result[0];
    }

    async createCompany(data: any): Promise<any> {
        const [company] = await db.insert(dimCompanies).values(data).returning();
        return company;
    }
}
