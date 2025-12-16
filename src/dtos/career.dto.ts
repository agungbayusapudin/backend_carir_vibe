export interface CareerAssessmentAnswer {
    questionId: string;
    answerValue: number | string; // Score 1-5 or Multiple Choice Option
}

export interface CareerAssessmentDto {
    userId: string;
    answers: CareerAssessmentAnswer[];
}

export interface CareerRecommendationDto {
    careerId: string;
    title: string;
    description: string;
    matchPercentage: number;
    reason: string;
}

export interface SkillGapDto {
    careerId: string;
    careerTitle: string;
    missingSkills: string[];
    acquiredSkills: string[];
    matchPercentage: number;
}

export interface JobMarketInsightDto {
    careerId: string;
    careerTitle: string;
    averageSalary: number;
    salaryRange: { min: number, max: number };
    costOfLiving: number; // Mock data for a selected city
    purchasingPowerIndex: number; // Salary / COL
    trend: string;
}
