import { db } from "../../database/db";
import { sql } from "drizzle-orm";

export interface IAdminRepository {
    // User Management
    updateUserRole(userId: string, roleId: string): Promise<any>;
    updateUserStatus(userId: string, isActive: boolean): Promise<any>;
    getAllUsers(role?: string): Promise<any[]>;

    // Content Management
    createCareer(data: any): Promise<any>;
    updateCareer(careerId: string, data: any): Promise<any>;
    deleteCareer(careerId: string): Promise<any>;

    // Moderation
    getPendingMentors(): Promise<any[]>;
    verifyMentor(mentorId: string, isVerified: boolean): Promise<any>;

    // Stats
    getSystemStats(): Promise<any>;
}

export class AdminRepository implements IAdminRepository {
    async updateUserRole(userId: string, roleId: string): Promise<any> {
        // Assuming we look up role_id from role name or pass ID directly
        // For simplicity, assuming roleId is passed (or mapped in service)
        return db.execute(sql`
            UPDATE dim_users SET role_id = ${roleId}, updated_at = NOW()
            WHERE user_id = ${userId}
            RETURNING user_id, role_id
        `);
    }

    async updateUserStatus(userId: string, isActive: boolean): Promise<any> {
        return db.execute(sql`
            UPDATE dim_users SET is_active = ${isActive}, updated_at = NOW()
            WHERE user_id = ${userId}
            RETURNING user_id, is_active
        `);
    }

    async getAllUsers(role?: string): Promise<any[]> {
        let query = sql`
            SELECT u.user_id, u.full_name, u.email, r.role_name, u.is_active, u.created_at
            FROM dim_users u
            LEFT JOIN dim_roles r ON u.role_id = r.role_id
        `;

        if (role) {
            query = sql`${query} WHERE r.role_name = ${role}`;
        }

        const result = await db.execute(query);
        return result.rows;
    }

    async createCareer(data: any): Promise<any> {
        return db.execute(sql`
            INSERT INTO dim_careers (title, description, average_salary, market_trend)
            VALUES (${data.title}, ${data.description}, ${data.averageSalary}, ${data.marketTrend})
            RETURNING *
        `);
    }

    async updateCareer(careerId: string, data: any): Promise<any> {
        return db.execute(sql`
            UPDATE dim_careers 
            SET title = COALESCE(${data.title}, title),
                description = COALESCE(${data.description}, description),
                average_salary = COALESCE(${data.averageSalary}, average_salary),
                market_trend = COALESCE(${data.marketTrend}, market_trend),
                updated_at = NOW()
            WHERE career_id = ${careerId}
            RETURNING *
        `);
    }

    async deleteCareer(careerId: string): Promise<any> {
        return db.execute(sql`DELETE FROM dim_careers WHERE career_id = ${careerId}`);
    }

    async getPendingMentors(): Promise<any[]> {
        // Return mentors where is_verified is false
        const result = await db.execute(sql`
            SELECT m.*, u.full_name, u.email 
            FROM dim_mentors m
            JOIN dim_users u ON m.user_id = u.user_id
            WHERE m.is_verified = false
        `);
        return result.rows;
    }

    async verifyMentor(mentorId: string, isVerified: boolean): Promise<any> {
        return db.execute(sql`
            UPDATE dim_mentors SET is_verified = ${isVerified}, updated_at = NOW()
            WHERE mentor_id = ${mentorId}
            RETURNING *
        `);
    }

    async getSystemStats(): Promise<any> {
        const users = await db.execute(sql`SELECT COUNT(*) as count FROM dim_users`);
        const mentors = await db.execute(sql`SELECT COUNT(*) as count FROM dim_mentors`);
        const interviews = await db.execute(sql`SELECT COUNT(*) as count FROM mock_interview_sessions`);

        return {
            totalUsers: users.rows[0].count,
            totalMentors: mentors.rows[0].count,
            totalInterviews: interviews.rows[0].count
        };
    }
}
