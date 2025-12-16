import { Router } from "express";
import { ModuleController } from "../controllers/module.controllers";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { RoleMiddleware } from "../../middleware/role.middleware";

export class ModuleRouter {
    public router: Router;

    constructor(
        private moduleController: ModuleController,
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
            this.moduleController.getAllModules
        );

        this.router.get(
            "/:moduleId",
            this.authMiddleware.authenticate,
            this.moduleController.getModuleById
        );

        this.router.post(
            "/",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("mentor", "admin"),
            this.moduleController.createModule
        );

        this.router.put(
            "/:moduleId",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("mentor", "admin"),
            this.moduleController.updateModule
        );

        this.router.delete(
            "/:moduleId",
            this.authMiddleware.authenticate,
            this.roleMiddleware.checkRole("mentor", "admin"),
            this.moduleController.deleteModule
        );
    }

    getRouter(): Router {
        return this.router;
    }
}
