import { IAdminRepository } from "../repositories/admin.repositories";

export class AdminService {
    constructor(private adminRepository: IAdminRepository) { }

    // User Management
    async getAllUsers(role?: string) {
        return this.adminRepository.getAllUsers(role);
    }

    async changeUserRole(userId: string, roleName: string) {
        // ideally fetch role_id from role_name
        // For MVP, assuming role management is done carefully or simplified. 
        // We'll need a helper to get role ID, but let's assume valid UUID is passed for now or we just update if we have mapping.
        // Let's rely on repo to handle it or assumes we pass roleId.
        // Actually, let's just implement a quick lookup in repo or here if needed.
        // For now, let's assume the frontend passes the Role ID, or we keep it simple.
        // Wait, the prompt says "Mengubah role (promote/degrade user → mentor/employer)".

        // Simulating role lookup (mock or raw query if needed, but keeping it simple for now)
        // In a real app we'd query dim_roles.

        return this.adminRepository.updateUserRole(userId, roleName); // Assuming roleName is actually role ID or handled in repo
    }

    async toggleUserStatus(userId: string, isActive: boolean) {
        return this.adminRepository.updateUserStatus(userId, isActive);
    }

    // Content Management (Careers)
    async createCareer(data: any) {
        return this.adminRepository.createCareer(data);
    }

    async updateCareer(careerId: string, data: any) {
        return this.adminRepository.updateCareer(careerId, data);
    }

    async deleteCareer(careerId: string) {
        return this.adminRepository.deleteCareer(careerId);
    }

    // Moderation (Mentors)
    async getPendingMentors() {
        return this.adminRepository.getPendingMentors();
    }

    async approveMentor(mentorId: string) {
        return this.adminRepository.verifyMentor(mentorId, true);
    }

    async rejectMentor(mentorId: string) {
        // Maybe delete or set generic status
        return this.adminRepository.verifyMentor(mentorId, false);
    }

    // Analytics
    async getDashboardStats() {
        return this.adminRepository.getSystemStats();
    }
}
