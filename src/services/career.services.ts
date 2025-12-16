import { ICareerService, ICareerRepository } from "../interface/ICareer";
import { IProfileRepository } from "../interface/IProfile";
import { CareerAssessmentDto, CareerRecommendationDto, SkillGapDto, JobMarketInsightDto } from "../dtos/career.dto";
import { IAIService } from "../interface/IAI";
// @ts-ignore
import linkedIn from "linkedin-jobs-api";

export class CareerService implements ICareerService {

    constructor(
        private careerRepository: ICareerRepository,
        private profileRepository: IProfileRepository,
        private aiService: IAIService // Injected dependency
    ) {
    }

    async getAllCareers(): Promise<any[]> {
        return this.careerRepository.findAllCareers();
    }

    async getCareerDetail(careerId: string): Promise<any> {
        const career = await this.careerRepository.findCareerById(careerId);
        if (!career) throw new Error("Career not found");
        return career;
    }

    async manageCareer(action: 'create' | 'update' | 'delete', data?: any, id?: string): Promise<any> {
        switch (action) {
            case 'create':
                return this.careerRepository.createCareer(data);
            case 'update':
                if (!id) throw new Error("ID required for update");
                return this.careerRepository.updateCareer(id, data);
            case 'delete':
                if (!id) throw new Error("ID required for delete");
                return this.careerRepository.deleteCareer(id);
        }
    }

    /**
     * REQUIRED: Career Assessment Quiz
     */
    async submitAssessment(data: CareerAssessmentDto): Promise<any[]> {
        console.log("Processing assessment for user:", data.userId);

        // Mock Result scoring - In real app, this logic analyzes the answers provided
        const result = {
            userId: data.userId,
            answers: data.answers,
            timestamp: new Date()
        };

        await this.careerRepository.saveAssessmentResult(data.userId, result);

        // Use the assessment data + profile for AI recommendations
        return this.getAIRecommendations(data.userId);
    }

    /**
     * REQUIRED: AI Recommendations with Gemini
     * Combines User CV/Profile + Assessment Data to generate recommendations.
     */
    async getAIRecommendations(userId: string): Promise<any[]> {
        try {
            // 1. Fetch User Profile & Resume
            const resume = await this.profileRepository.findResumeByUserId(userId);

            // Construct User Context
            let userContext = `User ID: ${userId}.`;
            if (resume) {
                userContext += `
                Professional Summary: ${resume.summary || "N/A"}
                Skills: ${resume.skills || "N/A"}
                Experience: ${resume.experience || "N/A"}
                Education: ${resume.education || "N/A"}
                `;
            } else {
                userContext += " No resume/CV uploaded yet.";
            }

            // 2. Get Search Keywords from AI
            const keywords = await this.aiService.getJobSearchKeywords(userContext);
            console.log("AI Suggested Keywords:", keywords);

            // 3. Search LinkedIn for each keyword
            const allJobs: any[] = [];

            // Limit to first 2 keywords to avoid timeout/rate limits if any
            const searchKeywords = keywords.slice(0, 2);

            for (const keyword of searchKeywords) {
                const queryOptions = {
                    keyword: keyword,
                    location: 'Indonesia',
                    dateSincePosted: 'past Month',
                    jobType: 'full time',
                    remoteFilter: 'remote',
                    salary: '',
                    experienceLevel: '',
                    limit: '5',
                    page: "0",
                    has_verification: false,
                    under_10_applicants: false,
                };

                try {
                    const jobs = await linkedIn.query(queryOptions);
                    // Add keyword context to job
                    const jobsWithContext = jobs.map((j: any) => ({ ...j, matchedKeyword: keyword }));
                    allJobs.push(...jobsWithContext);
                } catch (err) {
                    console.error(`LinkedIn search failed for ${keyword}:`, err);
                }
            }

            return allJobs;

        } catch (error) {
            console.error("Gemini AI/LinkedIn Error:", error);
            return this.getMockRecommendations();
        }
    }

    private getMockRecommendations(): any[] {
        return [
            {
                position: "Software Engineer (Fallback)",
                company: "Tech Demo Corp",
                companyLogo: "",
                location: "Jakarta, Indonesia",
                date: new Date().toISOString(),
                agoTime: "Just now",
                salary: "IDR 15,000,000",
                jobUrl: "#",
                matchedKeyword: "Software Engineer"
            }
        ];
    }

    /**
     * NICE TO HAVE: Skill Gap Analysis
     * Compares user skills vs career requirements
     */
    async getSkillGapAnalysis(userId: string, careerId: string): Promise<SkillGapDto> {
        const career = await this.getCareerDetail(careerId);
        const careerSkills = await this.careerRepository.getCareerSkills(careerId);

        // Fetch real user Resume/Skills
        const resume = await this.profileRepository.findResumeByUserId(userId);
        // Assuming resume.skills is a JSON string or comma-separated string
        let userSkillsVars: string[] = [];
        if (resume && resume.skills) {
            // simplified parsing logic
            userSkillsVars = typeof resume.skills === 'string'
                ? resume.skills.split(',').map((s: string) => s.trim())
                : resume.skills;
        }

        const missingSkills = careerSkills.filter(skill => !userSkillsVars.includes(skill));
        const acquiredSkills = careerSkills.filter(skill => userSkillsVars.includes(skill));

        const matchPercentage = careerSkills.length > 0
            ? Math.round((acquiredSkills.length / careerSkills.length) * 100)
            : 0;

        return {
            careerId: career.careerId,
            careerTitle: career.title,
            missingSkills,
            acquiredSkills,
            matchPercentage
        };
    }

    /**
     * PENDING: Job Market Reality Check
     * Compares Salary vs Cost of Living
     */
    async getJobMarketInsights(careerId: string, location: string): Promise<JobMarketInsightDto> {
        const career = await this.getCareerDetail(careerId);

        // Mock Data for City Costs (In real app, fetch from database or external API)
        const cityCosts: Record<string, number> = {
            "Jakarta": 5000000,
            "Bandung": 3500000,
            "Surabaya": 4000000,
            "Remote": 0
        };

        const costOfLiving = cityCosts[location] || 4500000; // Default average
        const avgSalary = parseFloat(career.averageSalary) || 8000000;

        // Basic Logic
        const purchasingPowerIndex = avgSalary / costOfLiving;

        let trend = "Stable";
        if (career.marketTrend === 'growing') trend = "High Growth 🚀";
        if (career.marketTrend === 'declining') trend = "Declining 📉";

        // Salary Range estimation ( +/- 20% of avg)
        const minSalary = avgSalary * 0.8;
        const maxSalary = avgSalary * 1.2;

        return {
            careerId: career.careerId,
            careerTitle: career.title,
            averageSalary: avgSalary,
            salaryRange: { min: minSalary, max: maxSalary },
            costOfLiving,
            purchasingPowerIndex: parseFloat(purchasingPowerIndex.toFixed(2)),
            trend
        };
    }
}
