import { Router } from "express";
import { CareerController } from "../controllers/career.controllers";
import { AuthMiddleware } from "../../middleware/auth.middleware";

export class CareerRouter {
    public router: Router;

    constructor(
        private careerController: CareerController,
        private authMiddleware: AuthMiddleware
    ) {
        this.router = Router();
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.get("/", this.authMiddleware.authenticate, this.careerController.getAllCareers);
        this.router.get("/:careerId", this.authMiddleware.authenticate, this.careerController.getCareerDetail);

        // Assessment & AI
        this.router.post("/assessment", this.authMiddleware.authenticate, this.careerController.submitAssessment);
        this.router.get("/recommendations/ai", this.authMiddleware.authenticate, this.careerController.getRecommendations);

        // Insights
        this.router.get("/:careerId/skill-gap", this.authMiddleware.authenticate, this.careerController.getSkillGap);
        this.router.get("/:careerId/market-insights", this.authMiddleware.authenticate, this.careerController.getJobMarketInsights);
    }

    getRouter(): Router {
        return this.router;
    }
}
