import { Request, Response } from "express";
import { AdminService } from "../services/admin.services";

export class AdminController {
    constructor(private adminService: AdminService) { }

    // Users
    getUsers = async (req: Request, res: Response) => {
        try {
            const { role } = req.query;
            const users = await this.adminService.getAllUsers(role as string);
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    updateUserRole = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { roleId } = req.body; // Expecting roleId (UUID)
            await this.adminService.changeUserRole(userId, roleId);
            res.json({ message: "User role updated" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    toggleUserStatus = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { isActive } = req.body;
            await this.adminService.toggleUserStatus(userId, isActive);
            res.json({ message: `User status updated to ${isActive}` });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // Careers
    createCareer = async (req: Request, res: Response) => {
        try {
            const career = await this.adminService.createCareer(req.body);
            res.status(201).json(career);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    updateCareer = async (req: Request, res: Response) => {
        try {
            const { careerId } = req.params;
            const career = await this.adminService.updateCareer(careerId, req.body);
            res.json(career);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    deleteCareer = async (req: Request, res: Response) => {
        try {
            const { careerId } = req.params;
            await this.adminService.deleteCareer(careerId);
            res.json({ message: "Career deleted" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // Mentors
    getPendingMentors = async (req: Request, res: Response) => {
        try {
            const mentors = await this.adminService.getPendingMentors();
            res.json(mentors);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    verifyMentor = async (req: Request, res: Response) => {
        try {
            const { mentorId } = req.params;
            const { approved } = req.body;
            if (approved) {
                await this.adminService.approveMentor(mentorId);
            } else {
                await this.adminService.rejectMentor(mentorId);
            }
            res.json({ message: `Mentor verification ${approved ? 'approved' : 'rejected'}` });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // Stats
    getStats = async (req: Request, res: Response) => {
        try {
            const stats = await this.adminService.getDashboardStats();
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
