import { Request, Response, NextFunction } from "express";
import { ICareerService } from "../interface/ICareer";
import { CareerAssessmentDto } from "../dtos/career.dto";

export class CareerController {
    constructor(private careerService: ICareerService) { }

    getAllCareers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const careers = await this.careerService.getAllCareers();
            res.json({ success: true, data: careers });
        } catch (error) {
            next(error);
        }
    };

    getCareerDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { careerId } = req.params;
            const career = await this.careerService.getCareerDetail(careerId);
            res.json({ success: true, data: career });
        } catch (error) {
            next(error);
        }
    };

    // Assessment & Recommendations\
    submitAssessment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            // Assumes body contains answers
            const dto: CareerAssessmentDto = {
                userId,
                answers: req.body.answers || []
            };

            const recommendations = await this.careerService.submitAssessment(dto);
            res.json({ success: true, data: recommendations });
        } catch (error) {
            next(error);
        }
    };

    getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const recommendations = await this.careerService.getAIRecommendations(userId);
            res.json({ success: true, data: recommendations });
        } catch (error) {
            next(error);
        }
    };

    getSkillGap = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const { careerId } = req.params;
            const gapAnalysis = await this.careerService.getSkillGapAnalysis(userId, careerId);
            res.json({ success: true, data: gapAnalysis });
        } catch (error) {
            next(error);
        }
    };

    getJobMarketInsights = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { careerId } = req.params;
            const { location } = req.query; // e.g. ?location=Jakarta
            const insights = await this.careerService.getJobMarketInsights(careerId, String(location || "Jakarta"));
            res.json({ success: true, data: insights });
        } catch (error) {
            next(error);
        }
    };
}
