import { dimCareers, dimSkills } from "../../database/schema";
import { CareerAssessmentDto, CareerRecommendationDto, SkillGapDto, JobMarketInsightDto } from "../dtos/career.dto";

export interface ICareerRepository {
    findAllCareers(): Promise<any[]>;
    findCareerById(careerId: string): Promise<any>;
    findRecommendedCareers(userSkills: string[]): Promise<any[]>;
    createCareer(data: any): Promise<any>;
    updateCareer(careerId: string, data: any): Promise<any>;
    deleteCareer(careerId: string): Promise<void>;

    // New methods
    saveAssessmentResult(userId: string, result: any): Promise<void>;
    getCareerSkills(careerId: string): Promise<string[]>; // Returns skill names or IDs
}

export interface ICareerService {
    getAllCareers(): Promise<any[]>;
    getCareerDetail(careerId: string): Promise<any>;
    manageCareer(action: 'create' | 'update' | 'delete', data?: any, id?: string): Promise<any>;

    // Enhanced Features
    submitAssessment(data: CareerAssessmentDto): Promise<any[]>;
    getAIRecommendations(userId: string): Promise<any[]>;
    getSkillGapAnalysis(userId: string, careerId: string): Promise<SkillGapDto>;
    getJobMarketInsights(careerId: string, location: string): Promise<JobMarketInsightDto>;
}
