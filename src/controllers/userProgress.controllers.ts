import { Request, Response, NextFunction } from "express";
import { UserProgressService } from "../services/userProgress.services";

export class UserProgressController {
    constructor(private userProgressService: UserProgressService) { }

    startSession = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const { moduleId } = req.body;

            const session = await this.userProgressService.startSession(userId, moduleId);

            res.json({
                success: true,
                data: session,
            });
        } catch (error) {
            next(error);
        }
    };

    submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const { sessionId, challengeId, selectedOptionId } = req.body;

            const result = await this.userProgressService.submitAnswer(userId, sessionId, challengeId, selectedOptionId);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    finishSession = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const { sessionId } = req.body;

            const result = await this.userProgressService.finishSession(userId, sessionId);

            res.json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getUserHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;

            const history = await this.userProgressService.getUserHistory(userId);

            res.json({
                success: true,
                data: history,
            });
        } catch (error) {
            next(error);
        }
    };

    getDashboard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;

            const dashboard = await this.userProgressService.getDashboard(userId);

            res.json({
                success: true,
                data: dashboard,
            });
        } catch (error) {
            next(error);
        }
    };

    getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const leaderboard = await this.userProgressService.getLeaderboard();

            res.json({
                success: true,
                data: leaderboard,
            });
        } catch (error) {
            next(error);
        }
    };

    getSessionReview = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const { sessionId } = req.params;

            const review = await this.userProgressService.getSessionReview(userId, sessionId);

            res.json({
                success: true,
                data: review,
            });
        } catch (error) {
            next(error);
        }
    };
}
