import { IMarketplaceService, IMarketplaceRepository } from "../interface/IMarketplace";

export class MarketplaceService implements IMarketplaceService {
    constructor(private marketplaceRepository: IMarketplaceRepository) { }

    async browseInternships(filters: any): Promise<any[]> {
        return this.marketplaceRepository.findAllPostings(filters);
    }

    async getInternshipDetail(postingId: string): Promise<any> {
        const posting = await this.marketplaceRepository.findPostingById(postingId);
        if (!posting) throw new Error("Posting not found");
        return posting;
    }

    async applyForInternship(userId: string, postingId: string, data: any): Promise<any> {
        // Validation: Check if already applied
        const existing = await this.marketplaceRepository.findApplicationsByUser(userId);
        const hasApplied = existing.some((app: any) => app.postingId === postingId);

        if (hasApplied) {
            throw new Error("Already applied to this position");
        }

        return this.marketplaceRepository.createApplication({
            userId,
            postingId,
            ...data
        });
    }

    async getMyApplications(userId: string): Promise<any[]> {
        return this.marketplaceRepository.findApplicationsByUser(userId);
    }

    async postInternship(employerId: string, data: any): Promise<any> {
        // Ensure employer has a company profile
        let company = await this.marketplaceRepository.findCompanyByEmployer(employerId);

        if (!company) {
            // Auto-create dummy company profile if missing (or throw error)
            company = await this.marketplaceRepository.createCompany({
                employerUserId: employerId,
                companyName: "My Company", // Placeholder
            });
        }

        return this.marketplaceRepository.createPosting({
            ...data,
            companyId: company.companyId
        });
    }

    async manageInternship(employerId: string, postingId: string, data: any): Promise<any> {
        // Verify ownership logic should go here
        return this.marketplaceRepository.updatePosting(postingId, data);
    }

    async getCompanyPostings(employerId: string): Promise<any[]> {
        const company = await this.marketplaceRepository.findCompanyByEmployer(employerId);
        if (!company) return [];
        return this.marketplaceRepository.findPostingsByCompany(company.companyId);
    }

    async reviewApplication(employerId: string, applicationId: string, status: string): Promise<any> {
        // Verify ownership
        return this.marketplaceRepository.updateApplicationStatus(applicationId, status);
    }
}
