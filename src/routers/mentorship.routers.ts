import { Router } from "express";
import { MentorshipController } from "../controllers/mentorship.controllers";
import { AuthMiddleware } from "../../middleware/auth.middleware";

export class MentorshipRouter {
    public router: Router;

    constructor(
        private mentorshipController: MentorshipController,
        private authMiddleware: AuthMiddleware
    ) {
        this.router = Router();
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this.router.use(this.authMiddleware.authenticate);

        // Discovery
        this.router.get("/directory", this.mentorshipController.listMentors);
        this.router.get("/profile/:mentorId", this.mentorshipController.getMentorDetail);

        // Student Actions
        this.router.post("/request", this.mentorshipController.requestMentorship);
        this.router.get("/my-mentors", this.mentorshipController.getMyMentors);

        // Mentor Actions
        this.router.post("/register", this.mentorshipController.registerAsMentor);
        this.router.get("/requests", this.mentorshipController.getIncomingRequests);
        this.router.put("/requests/:requestId/respond", this.mentorshipController.respondToRequest);
    }

    getRouter(): Router {
        return this.router;
    }
}
