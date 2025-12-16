import { Request, Response, NextFunction } from "express";
import { ChallengeService } from "../services/challenge.services";

export class ChallengeController {
    constructor(private challengeService: ChallengeService) { }

    createChallenge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const challenge = await this.challengeService.createChallenge(req.body);
            res.status(201).json({
                success: true,
                data: challenge,
            });
        } catch (error) {
            next(error);
        }
    };

    updateChallenge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { challengeId } = req.params;
            const challenge = await this.challengeService.updateChallenge(challengeId, req.body);
            res.json({
                success: true,
                data: challenge,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteChallenge = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { challengeId } = req.params;
            await this.challengeService.deleteChallenge(challengeId);
            res.json({
                success: true,
                message: "Challenge deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    };

    getChallengeById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { challengeId } = req.params;
            const challenge = await this.challengeService.getChallengeById(challengeId);
            res.json({
                success: true,
                data: challenge,
            });
        } catch (error) {
            next(error);
        }
    };

    getChallengesByModule = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { moduleId } = req.params;
            const challenges = await this.challengeService.getChallengesByModule(moduleId);
            res.json({
                success: true,
                data: challenges,
            });
        } catch (error) {
            next(error);
        }
    };

    getChallengeAnalytics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { moduleId } = req.params;
            const analytics = await this.challengeService.getChallengeAnalytics(moduleId);
            res.json({
                success: true,
                data: analytics,
            });
        } catch (error) {
            next(error);
        }
    };
}
