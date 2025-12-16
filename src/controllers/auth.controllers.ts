import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../interface/IAuthService";
import { LoginResponseDto, RegisterDto, LoginDto } from "../dtos/auth.dto";

export class AuthController {
    constructor(private authService: IAuthService) { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password, fullName, role }: RegisterDto = req.body;

            const user = await this.authService.register(email, password, fullName, role);
            const tokens = this.authService.generateTokens(user);

            const response: LoginResponseDto = {
                user: {
                    userId: user.userId,
                    email: user.email,
                    fullName: user.fullName,
                    profilePicture: user.profilePicture,
                    currentLevel: user.currentLevel,
                    totalXp: user.totalXp,
                    role: user.role,
                },
                tokens,
            };

            res.status(201).json({
                success: true,
                data: response,
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password }: LoginDto = req.body;

            const user = await this.authService.login(email, password);
            const tokens = this.authService.generateTokens(user);

            const response: LoginResponseDto = {
                user: {
                    userId: user.userId,
                    email: user.email,
                    fullName: user.fullName,
                    profilePicture: user.profilePicture,
                    currentLevel: user.currentLevel,
                    totalXp: user.totalXp,
                    role: user.role,
                },
                tokens,
            };

            res.json({
                success: true,
                data: response,
            });
        } catch (error) {
            next(error);
        }
    };

    googleCallback = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user as any;

            const tokens = this.authService.generateTokens(user);

            const response: LoginResponseDto = {
                user: {
                    userId: user.userId,
                    email: user.email,
                    fullName: user.fullName,
                    profilePicture: user.profilePicture,
                    currentLevel: user.currentLevel,
                    totalXp: user.totalXp,
                    role: user.role,
                },
                tokens,
            };

            res.json({
                success: true,
                data: response,
            });
        } catch (error) {
            next(error);
        }
    };

    getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;

            res.json({
                success: true,
                data: user,
            });
        } catch (error) {
            next(error);
        }
    };

    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;

            const tokens = await this.authService.refreshToken(refreshToken);

            res.json({
                success: true,
                data: tokens,
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.logout((err) => {
                if (err) {
                    return next(err);
                }
                res.json({
                    success: true,
                    message: "Logged out successfully",
                });
            });
        } catch (error) {
            next(error);
        }
    };
}
