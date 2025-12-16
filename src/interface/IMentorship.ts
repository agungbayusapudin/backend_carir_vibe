
export interface IMentorshipRepository {
    // Mentors
    findAllMentors(filters: any): Promise<any[]>;
    findMentorById(mentorId: string): Promise<any>;
    findMentorByUserId(userId: string): Promise<any>;
    createMentorProfile(data: any): Promise<any>;
    updateMentorProfile(mentorId: string, data: any): Promise<any>;

    // Requests
    createRequest(data: any): Promise<any>;
    findRequestsByMentor(mentorId: string): Promise<any[]>;
    findRequestsByMentee(menteeId: string): Promise<any[]>;
    updateRequestStatus(requestId: string, status: string): Promise<any>;
}

export interface IMentorshipService {
    // For Students
    findMentors(filters: any): Promise<any[]>;
    getMentorDetail(mentorId: string): Promise<any>;
    requestMentorship(menteeId: string, mentorId: string, message: string): Promise<any>;
    getMyMentors(menteeId: string): Promise<any[]>;

    // For Mentors
    registerAsMentor(userId: string, data: any): Promise<any>;
    getIncomingRequests(userId: string): Promise<any[]>;
    respondToRequest(userId: string, requestId: string, action: 'accept' | 'reject'): Promise<any>;
}
