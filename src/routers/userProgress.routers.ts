import { Router } from "express";
import { UserProgressController } from "../controllers/userProgress.controllers";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { RoleMiddleware } from "../../middleware/role.middleware";

export class UserProgressRouter {
    public router: Router;

    constructor(
        private userProgressController: UserProgressController,
        private authMiddleware: AuthMiddleware,
        private roleMiddleware: RoleMiddleware
    ) {
        this.router = Router();
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.post(
            "/session/start",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("student"),
            this.userProgressController.startSession
        );

        this.router.post(
            "/session/submit",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("student"),
            this.userProgressController.submitAnswer
        );

        this.router.post(
            "/session/finish",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("student"),
            this.userProgressController.finishSession
        );

        this.router.get(
            "/history",
            this.authMiddleware.authenticate,
            this.userProgressController.getUserHistory
        );

        this.router.get(
            "/dashboard",
            this.authMiddleware.authenticate,
            this.userProgressController.getDashboard
        );

        this.router.get(
            "/leaderboard",
            this.userProgressController.getLeaderboard
        );

        this.router.get(
            "/session/:sessionId/review",
            this.authMiddleware.authenticate,
            this.userProgressController.getSessionReview
        );
    }

    getRouter(): Router {
        return this.router;
    }
}
