import { db } from "../../database/db";
import { dimCareers, dimSkills, mapCareerSkills } from "../../database/schema";
import { eq, like, inArray } from "drizzle-orm";
import { ICareerRepository } from "../interface/ICareer";

export class CareerRepository implements ICareerRepository {
    async findAllCareers(): Promise<any[]> {
        return await db.select().from(dimCareers).where(eq(dimCareers.isActive, true));
    }

    async findCareerById(careerId: string): Promise<any> {
        const career = await db.select().from(dimCareers).where(eq(dimCareers.careerId, careerId));
        return career[0];
    }

    async findRecommendedCareers(userSkills: string[]): Promise<any[]> {
        // Simple mock recommendation logic for now
        // In real app: join with mapCareerSkills and count matches
        return await db.select().from(dimCareers).limit(5);
    }

    async createCareer(data: any): Promise<any> {
        const [newCareer] = await db.insert(dimCareers).values(data).returning();
        return newCareer;
    }

    async updateCareer(careerId: string, data: any): Promise<any> {
        const [updated] = await db.update(dimCareers)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(dimCareers.careerId, careerId))
            .returning();
        return updated;
    }

    async deleteCareer(careerId: string): Promise<void> {
        await db.update(dimCareers)
            .set({ isActive: false })
            .where(eq(dimCareers.careerId, careerId));
    }

    async saveAssessmentResult(userId: string, result: any): Promise<void> {
        // In a real implementation, we would save this to a 'career_assessment_results' table
        // For now, we'll just log it or maybe update a user preference column
        console.log(`[Repository] Saving assessment result for user ${userId}:`, result);
        // Placeholder: await db.insert(careerAssessmentResults).values({...})
    }

    async getCareerSkills(careerId: string): Promise<string[]> {
        // Query map_career_skills joined with dim_skills
        const skills = await db
            .select({
                skillName: dimSkills.skillName
            })
            .from(mapCareerSkills)
            .innerJoin(dimSkills, eq(mapCareerSkills.skillId, dimSkills.skillId))
            .where(eq(mapCareerSkills.careerId, careerId));

        return skills.map(s => s.skillName);
    }
}
