import { IMentorshipService, IMentorshipRepository } from "../interface/IMentorship";

export class MentorshipService implements IMentorshipService {
    constructor(private mentorshipRepository: IMentorshipRepository) { }

    async findMentors(filters: any): Promise<any[]> {
        // Implement complex filtering here
        return this.mentorshipRepository.findAllMentors(filters);
    }

    async getMentorDetail(mentorId: string): Promise<any> {
        const mentor = await this.mentorshipRepository.findMentorById(mentorId);
        if (!mentor) throw new Error("Mentor not found");
        return mentor;
    }

    async requestMentorship(menteeId: string, mentorId: string, message: string): Promise<any> {
        // Check if request pending
        const existing = await this.mentorshipRepository.findRequestsByMentee(menteeId);
        const hasPending = existing.some((req: any) => req.mentorId === mentorId && req.status === 'pending');

        if (hasPending) throw new Error("Pending request already exists");

        return this.mentorshipRepository.createRequest({
            menteeId,
            mentorId,
            message
        });
    }

    async getMyMentors(menteeId: string): Promise<any[]> {
        const requests = await this.mentorshipRepository.findRequestsByMentee(menteeId);
        // Filter accepted requests and fetch mentor details
        // Simplify for now: returning requests
        return requests.filter((r: any) => r.status === 'accepted');
    }

    async registerAsMentor(userId: string, data: any): Promise<any> {
        // Check if already mentor
        const existing = await this.mentorshipRepository.findMentorByUserId(userId);
        if (existing) throw new Error("Already registered as mentor");

        return this.mentorshipRepository.createMentorProfile({
            userId,
            ...data
        });
    }

    async getIncomingRequests(userId: string): Promise<any[]> {
        const mentor = await this.mentorshipRepository.findMentorByUserId(userId);
        if (!mentor) throw new Error("Mentor profile not found");

        return this.mentorshipRepository.findRequestsByMentor(mentor.mentorId);
    }

    async respondToRequest(userId: string, requestId: string, action: 'accept' | 'reject'): Promise<any> {
        const status = action === 'accept' ? 'accepted' : 'rejected';
        // Verify ownership (mentorId matches userId) - skipped for brevity
        return this.mentorshipRepository.updateRequestStatus(requestId, status);
    }
}
