import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exeptions/http.exception";

export const errorHandler = (
    err: Error | HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof HttpException) {
        return res.status(err.status).json({
            success: false,
            message: err.message,
            status: err.status,
        });
    }

    // Log unhandled errors dengan detail
    console.error("❌ Unhandled error:", err);
    if (process.env.NODE_ENV === "development") {
        console.error("Stack trace:", err.stack);
    }

    // Di production, jangan expose error details
    return res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message || "Internal server error",
        status: 500,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
