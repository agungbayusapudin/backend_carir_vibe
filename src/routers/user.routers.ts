import { Router } from "express";
import { UserController } from "../controllers/user.controllers";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { RoleMiddleware } from "../../middleware/role.middleware";

export class UserRouter {
    public router: Router;

    constructor(
        private userController: UserController,
        private authMiddleware: AuthMiddleware,
        private roleMiddleware: RoleMiddleware
    ) {
        this.router = Router();
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.get(
            "/",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("admin"),
            this.userController.getAllUsers
        );

        this.router.get(
            "/:userId",
            this.authMiddleware.authenticate,
            this.userController.getUserById
        );

        this.router.put(
            "/:userId",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("admin"),
            this.userController.updateUser
        );

        this.router.delete(
            "/:userId",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("admin"),
            this.userController.deactivateUser
        );

        this.router.get(
            "/system/health",
            this.userController.getSystemHealth
        );

        this.router.post(
            "/system/reset-xp",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("admin"),
            this.userController.resetXp
        );
    }

    getRouter(): Router {
        return this.router;
    }
}
