import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../src/interface/IAuthService";

export class AuthMiddleware {
    constructor(private authService: IAuthService) { }

    authenticate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "No token provided",
                });
            }

            const token = authHeader.substring(7);
            const user = await this.authService.verifyAccessToken(token);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired token",
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed",
            });
        }
    };
}
