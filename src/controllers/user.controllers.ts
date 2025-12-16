import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.services";

export class UserController {
    constructor(private userService: UserService) { }

    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getAllUsers();

            res.json({
                success: true,
                data: users,
            });
        } catch (error) {
            next(error);
        }
    };

    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            const user = await this.userService.getUserById(userId);

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            const user = await this.userService.updateUser(userId, req.body);

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    };

    deactivateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            await this.userService.deactivateUser(userId);

            res.json({
                success: true,
                message: "User deactivated successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    getSystemHealth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const health = await this.userService.getSystemHealth();

            res.json({
                success: true,
                data: health,
            });
        } catch (error) {
            next(error);
        }
    };

    resetXp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.userService.resetXp(req.body);

            res.json({
                success: true,
                message: "XP reset successfully",
            });
        } catch (error) {
            next(error);
        }
    };
}
