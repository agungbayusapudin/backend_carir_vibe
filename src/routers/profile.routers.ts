import { Router } from "express";
import { ProfileController } from "../controllers/profile.controllers";
import { AuthMiddleware } from "../../middleware/auth.middleware";

import multer from "multer";

export class ProfileRouter {
    public router: Router;
    private upload: multer.Multer;

    constructor(
        private profileController: ProfileController,
        private authMiddleware: AuthMiddleware
    ) {
        this.router = Router();
        this.upload = multer({
            dest: 'uploads/',
            limits: {
                fileSize: 10 * 1024 * 1024 // 10MB limit for resume files
            },
            fileFilter: (req, file, cb) => {
                // Accept PDF and DOCX only
                const allowedTypes = [
                    'application/pdf',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Only PDF and DOCX files are allowed'));
                }
            }
        });
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.get("/resume", this.authMiddleware.authenticate, this.profileController.getResume);
        this.router.put("/resume", this.authMiddleware.authenticate, this.profileController.updateResume);
        this.router.post("/resume/upload", this.authMiddleware.authenticate, this.upload.single('resume'), this.profileController.uploadResume);

        this.router.get("/portfolio", this.authMiddleware.authenticate, this.profileController.getPortfolios);
        this.router.post("/portfolio", this.authMiddleware.authenticate, this.profileController.addPortfolio);
        this.router.delete("/portfolio/:portfolioId", this.authMiddleware.authenticate, this.profileController.removePortfolio);
    }

    getRouter(): Router {
        return this.router;
    }
}
