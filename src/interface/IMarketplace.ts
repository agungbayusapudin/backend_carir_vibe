
export interface IMarketplaceRepository {
    // Postings
    findAllPostings(filters: any): Promise<any[]>;
    findPostingById(postingId: string): Promise<any>;
    findPostingsByCompany(companyId: string): Promise<any[]>;
    createPosting(data: any): Promise<any>;
    updatePosting(postingId: string, data: any): Promise<any>;
    deletePosting(postingId: string): Promise<void>;

    // Applications
    createApplication(data: any): Promise<any>;
    findApplicationsByPosting(postingId: string): Promise<any[]>;
    findApplicationsByUser(userId: string): Promise<any[]>;
    updateApplicationStatus(applicationId: string, status: string): Promise<any>;

    // Companies
    findCompanyByEmployer(userId: string): Promise<any>;
    createCompany(data: any): Promise<any>;
}

export interface IMarketplaceService {
    // For Students
    browseInternships(filters: any): Promise<any[]>;
    getInternshipDetail(postingId: string): Promise<any>;
    applyForInternship(userId: string, postingId: string, data: any): Promise<any>;
    getMyApplications(userId: string): Promise<any[]>;

    // For Employers
    postInternship(employerId: string, data: any): Promise<any>;
    manageInternship(employerId: string, postingId: string, data: any): Promise<any>;
    getCompanyPostings(employerId: string): Promise<any[]>;
    reviewApplication(employerId: string, applicationId: string, status: string): Promise<any>;
}
