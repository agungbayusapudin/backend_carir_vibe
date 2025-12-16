import { IUserRepository } from "../repositories/user.repositories";
import { UserListItemDto, UpdateUserDto, SystemHealthDto, ResetXpDto } from "../dtos/user.dto";

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    async getAllUsers(): Promise<UserListItemDto[]> {
        const users = await this.userRepository.getAllUsers();

        return users.map(user => ({
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            role: "student",
            totalXp: user.totalXp,
            currentLevel: user.currentLevel,
            isActive: user.isActive,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
        }));
    }

    async getUserById(userId: string): Promise<UserListItemDto | null> {
        const user = await this.userRepository.getUserById(userId);
        if (!user) return null;

        return {
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            role: "student",
            totalXp: user.totalXp,
            currentLevel: user.currentLevel,
            isActive: user.isActive,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
        };
    }

    async updateUser(userId: string, data: UpdateUserDto): Promise<UserListItemDto> {
        const user = await this.userRepository.updateUser(userId, data);

        return {
            userId: user.userId,
            fullName: user.fullName,
            email: user.email,
            role: "student",
            totalXp: user.totalXp,
            currentLevel: user.currentLevel,
            isActive: user.isActive,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
        };
    }

    async deactivateUser(userId: string): Promise<void> {
        await this.userRepository.deactivateUser(userId);
    }

    async getSystemHealth(): Promise<SystemHealthDto> {
        const dbHealth = await this.userRepository.checkDatabaseHealth();
        const uptime = process.uptime();

        return {
            status: dbHealth.connected ? "healthy" : "unhealthy",
            database: dbHealth,
            uptime,
            timestamp: new Date(),
        };
    }

    async resetXp(data: ResetXpDto): Promise<void> {
        if (data.resetAll) {
            const allUsers = await this.userRepository.getAllUsers();
            const allUserIds = allUsers.map(user => user.userId);
            await this.userRepository.resetUserXp(allUserIds);
        } else if (data.userIds && data.userIds.length > 0) {
            await this.userRepository.resetUserXp(data.userIds);
        }
    }
}
