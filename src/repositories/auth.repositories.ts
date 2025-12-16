import { db } from "../../database/db";
import { dimUsers, dimRoles } from "../../database/schema";
import { eq } from "drizzle-orm";
import { IAuthRepository, GoogleProfile, User } from "../interface/IAuthRepository";

export class AuthRepository implements IAuthRepository {
    async findUserByEmail(email: string): Promise<User | null> {
        const users = await db
            .select({
                user: dimUsers,
                role: dimRoles,
            })
            .from(dimUsers)
            .leftJoin(dimRoles, eq(dimUsers.roleId, dimRoles.roleId))
            .where(eq(dimUsers.email, email))
            .limit(1);

        if (users.length === 0) return null;

        return this.mapToUser(users[0].user, users[0].role?.roleName || "student");
    }

    async findUserByGoogleId(googleId: string): Promise<User | null> {
        const users = await db
            .select({
                user: dimUsers,
                role: dimRoles,
            })
            .from(dimUsers)
            .leftJoin(dimRoles, eq(dimUsers.roleId, dimRoles.roleId))
            .where(eq(dimUsers.googleId, googleId))
            .limit(1);

        if (users.length === 0) return null;

        return this.mapToUser(users[0].user, users[0].role?.roleName || "student");
    }

    async createUserFromGoogle(profile: GoogleProfile, roleName?: string): Promise<User> {
        const email = profile.emails[0].value;
        const profilePicture = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

        // Determine role to assign
        let assignedRole;
        if (roleName) {
            assignedRole = await this.getOrCreateRole(roleName);
        } else {
            assignedRole = await this.getOrCreateStudentRole();
        }

        const [newUser] = await db
            .insert(dimUsers)
            .values({
                googleId: profile.id,
                email: email,
                fullName: profile.displayName,
                profilePicture: profilePicture,
                lastLoginAt: new Date(),
                roleId: assignedRole.roleId,
            })
            .returning();

        return this.mapToUser(newUser, assignedRole.roleName);
    }

    async createUser(email: string, password: string, fullName: string, roleName?: string): Promise<User> {
        // Determine role to assign
        let assignedRole;
        if (roleName) {
            assignedRole = await this.getOrCreateRole(roleName);
        } else {
            assignedRole = await this.getOrCreateStudentRole();
        }

        const [newUser] = await db
            .insert(dimUsers)
            .values({
                email,
                password,
                fullName,
                lastLoginAt: new Date(),
                roleId: assignedRole.roleId,
            })
            .returning();

        return this.mapToUser(newUser, assignedRole.roleName);
    }

    async updateUserRole(userId: string, roleName: string): Promise<User> {
        const assignedRole = await this.getOrCreateRole(roleName);

        await db
            .update(dimUsers)
            .set({
                roleId: assignedRole.roleId,
                updatedAt: new Date()
            })
            .where(eq(dimUsers.userId, userId));

        // Return updated user (fetch again to be sure or construct)
        const user = await this.findUserByEmail((await db.select().from(dimUsers).where(eq(dimUsers.userId, userId)))[0].email);
        return user as User;
    }

    async updateLastLogin(userId: string): Promise<void> {
        await db
            .update(dimUsers)
            .set({
                lastLoginAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(dimUsers.userId, userId));
    }

    private async getOrCreateRole(roleName: string) {
        // Find existing role
        let role = await db
            .select()
            .from(dimRoles)
            .where(eq(dimRoles.roleName, roleName))
            .limit(1);

        if (role.length > 0) {
            return role[0];
        }

        // Create if not exists (with default description)
        const [newRole] = await db
            .insert(dimRoles)
            .values({
                roleName: roleName,
                description: "Custom role created via registration",
            })
            .returning();

        return newRole;
    }

    private async getOrCreateStudentRole() {
        // Find existing 'student' role
        let role = await db
            .select()
            .from(dimRoles)
            .where(eq(dimRoles.roleName, "student"))
            .limit(1);

        if (role.length > 0) {
            return role[0];
        }

        // Create if not exists
        const [newRole] = await db
            .insert(dimRoles)
            .values({
                roleName: "student",
                description: "Default user role",
            })
            .returning();

        return newRole;
    }

    private mapToUser(dbUser: any, roleName: string): User {
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
            role: roleName,
        };
    }
}
