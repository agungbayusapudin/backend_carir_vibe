import { db } from "../../database/db";
import { dimMentors, mentorshipRequests } from "../../database/schema";
import { eq, and } from "drizzle-orm";
import { IMentorshipRepository } from "../interface/IMentorship";

export class MentorshipRepository implements IMentorshipRepository {
    async findAllMentors(filters: any): Promise<any[]> {
        return await db.select().from(dimMentors).where(eq(dimMentors.isActive, true));
    }

    async findMentorById(mentorId: string): Promise<any> {
        const result = await db.select().from(dimMentors).where(eq(dimMentors.mentorId, mentorId));
        return result[0];
    }

    async findMentorByUserId(userId: string): Promise<any> {
        const result = await db.select().from(dimMentors).where(eq(dimMentors.userId, userId));
        return result[0];
    }

    async createMentorProfile(data: any): Promise<any> {
        const [mentor] = await db.insert(dimMentors).values(data).returning();
        return mentor;
    }

    async updateMentorProfile(mentorId: string, data: any): Promise<any> {
        const [updated] = await db.update(dimMentors)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(dimMentors.mentorId, mentorId))
            .returning();
        return updated;
    }

    async createRequest(data: any): Promise<any> {
        const [req] = await db.insert(mentorshipRequests).values(data).returning();
        return req;
    }

    async findRequestsByMentor(mentorId: string): Promise<any[]> {
        return await db.select().from(mentorshipRequests).where(eq(mentorshipRequests.mentorId, mentorId));
    }

    async findRequestsByMentee(menteeId: string): Promise<any[]> {
        return await db.select().from(mentorshipRequests).where(eq(mentorshipRequests.menteeId, menteeId));
    }

    async updateRequestStatus(requestId: string, status: string): Promise<any> {
        const [updated] = await db.update(mentorshipRequests)
            .set({ status: status, updatedAt: new Date() })
            .where(eq(mentorshipRequests.requestId, requestId))
            .returning();
        return updated;
    }
}
