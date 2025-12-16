import { Router } from "express";
import { ChallengeController } from "../controllers/challenge.controllers";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { RoleMiddleware } from "../../middleware/role.middleware";

export class ChallengeRouter {
    public router: Router;

    constructor(
        private challengeController: ChallengeController,
        private authMiddleware: AuthMiddleware,
        private roleMiddleware: RoleMiddleware
    ) {
        this.router = Router();
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.get(
            "/module/:moduleId",
            this.authMiddleware.authenticate,
            this.challengeController.getChallengesByModule
        );

        this.router.get(
            "/:challengeId",
            this.authMiddleware.authenticate,
            this.challengeController.getChallengeById
        );

        this.router.post(
            "/",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("mentor", "admin"),
            this.challengeController.createChallenge
        );

        this.router.put(
            "/:challengeId",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("mentor", "admin"),
            this.challengeController.updateChallenge
        );

        this.router.delete(
            "/:challengeId",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("mentor", "admin"),
            this.challengeController.deleteChallenge
        );

        this.router.get(
            "/analytics/:moduleId",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("mentor", "admin"),
            this.challengeController.getChallengeAnalytics
        );
    }

    getRouter(): Router {
        return this.router;
    }
}
