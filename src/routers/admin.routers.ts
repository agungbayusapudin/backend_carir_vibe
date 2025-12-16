import { Router } from "express";
import { AdminController } from "../controllers/admin.controllers";
import { AuthMiddleware } from "../../middleware/auth.middleware";

export class AdminRouter {
    public router: Router;

    constructor(
        private adminController: AdminController,
        private authMiddleware: AuthMiddleware
    ) {
        this.router = Router();
        this.configureRoutes();
    }

    private configureRoutes(): void {
        // Protect all routes with Auth (and ideally Role check, but keeping simple for MVP)
        this.router.use(this.authMiddleware.authenticate);

        // Dashboard Stats
        this.router.get("/stats", this.adminController.getStats);

        // User Management
        this.router.get("/users", this.adminController.getUsers);
        this.router.put("/users/:userId/role", this.adminController.updateUserRole);
        this.router.put("/users/:userId/status", this.adminController.toggleUserStatus);

        // Career Management
        this.router.post("/careers", this.adminController.createCareer);
        this.router.put("/careers/:careerId", this.adminController.updateCareer);
        this.router.delete("/careers/:careerId", this.adminController.deleteCareer);

        // Mentor Moderation
        this.router.get("/mentors/pending", this.adminController.getPendingMentors);
        this.router.put("/mentors/:mentorId/verify", this.adminController.verifyMentor);
    }

    getRouter(): Router {
        return this.router;
    }
}
