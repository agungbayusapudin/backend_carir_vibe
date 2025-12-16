import { Request, Response } from "express";
import { MentorshipService } from "../services/mentorship.services";

export class MentorshipController {
    constructor(private mentorshipService: MentorshipService) { }

    // Public / Student
    listMentors = async (req: Request, res: Response) => {
        try {
            const filters = req.query;
            const mentors = await this.mentorshipService.findMentors(filters);
            res.json(mentors);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getMentorDetail = async (req: Request, res: Response) => {
        try {
            const { mentorId } = req.params;
            const mentor = await this.mentorshipService.getMentorDetail(mentorId);
            res.json(mentor);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    requestMentorship = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { mentorId, message } = req.body;
            const request = await this.mentorshipService.requestMentorship(userId, mentorId, message);
            res.status(201).json(request);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getMyMentors = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const mentors = await this.mentorshipService.getMyMentors(userId);
            res.json(mentors);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    // Mentor Role Actions
    registerAsMentor = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const data = req.body;
            const mentor = await this.mentorshipService.registerAsMentor(userId, data);
            res.status(201).json(mentor);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getIncomingRequests = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const requests = await this.mentorshipService.getIncomingRequests(userId);
            res.json(requests);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    respondToRequest = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { requestId } = req.params;
            const { action } = req.body; // 'accept' | 'reject'
            const result = await this.mentorshipService.respondToRequest(userId, requestId, action);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
}
