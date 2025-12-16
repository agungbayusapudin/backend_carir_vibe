import { Request, Response, NextFunction } from "express";

export class RoleMiddleware {
    checkRole(...allowedRoles: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            const user = req.user as any;

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const userRole = user.role;
            console.log(`[RoleMiddleware] User Role: ${userRole}, Allowed: ${allowedRoles}`);

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: `Forbidden: Insufficient permissions. Required: ${allowedRoles.join(', ')}. Found: ${userRole}`,
                });
            }

            next();
        };
    }
}
