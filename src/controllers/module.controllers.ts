import { Request, Response, NextFunction } from "express";
import { ModuleService } from "../services/module.services";

export class ModuleController {
    constructor(private moduleService: ModuleService) { }

    createModule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const module = await this.moduleService.createModule(req.body);
            res.status(201).json({
                success: true,
                data: module,
            });
        } catch (error) {
            next(error);
        }
    };

    updateModule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { moduleId } = req.params;
            const module = await this.moduleService.updateModule(moduleId, req.body);
            res.json({
                success: true,
                data: module,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteModule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { moduleId } = req.params;
            await this.moduleService.deleteModule(moduleId);
            res.json({
                success: true,
                message: "Module deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    getModuleById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { moduleId } = req.params;
            const module = await this.moduleService.getModuleById(moduleId);
            res.json({
                success: true,
                data: module,
            });
        } catch (error) {
            next(error);
        }
    };

    getAllModules = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any)?.userId;
            let modules;

            if (userId) {
                modules = await this.moduleService.getModulesWithProgress(userId);
            } else {
                modules = await this.moduleService.getAllModules();
            }

            res.json({
                success: true,
                data: modules,
            });
        } catch (error) {
            next(error);
        }
    };
}
