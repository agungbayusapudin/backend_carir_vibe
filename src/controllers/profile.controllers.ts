import { Request, Response, NextFunction } from "express";
import { IProfileService } from "../interface/IProfile";

export class ProfileController {
    constructor(private profileService: IProfileService) { }

    getResume = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const resume = await this.profileService.getResume(userId);
            res.json({ success: true, data: resume });
        } catch (error) {
            next(error);
        }
    };

    uploadResume = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const file = req.file;

            if (!file) {
                res.status(400).json({ success: false, message: "No file uploaded" });
                return;
            }

            const result = await this.profileService.uploadResume(userId, file);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    updateResume = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const updatedResume = await this.profileService.updateResume(userId, req.body);
            res.json({ success: true, data: updatedResume });
        } catch (error) {
            next(error);
        }
    };

    getPortfolios = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const portfolios = await this.profileService.getPortfolios(userId);
            res.json({ success: true, data: portfolios });
        } catch (error) {
            next(error);
        }
    };

    addPortfolio = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const portfolio = await this.profileService.addPortfolio(userId, req.body);
            res.json({ success: true, data: portfolio });
        } catch (error) {
            next(error);
        }
    };

    removePortfolio = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req.user as any).userId;
            const { portfolioId } = req.params;
            await this.profileService.removePortfolio(userId, portfolioId);
            res.json({ success: true, message: "Portfolio removed" });
        } catch (error) {
            next(error);
        }
    };
}
