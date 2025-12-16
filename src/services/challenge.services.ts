import { IChallengeRepository } from "../repositories/challenge.repositories";
import { CreateChallengeDto, UpdateChallengeDto, ChallengeResponseDto, ChallengeWithOptionsDto } from "../dtos/challenge.dto";

export class ChallengeService {
    constructor(private challengeRepository: IChallengeRepository) { }

    async createChallenge(data: CreateChallengeDto): Promise<ChallengeResponseDto> {
        const challenge = await this.challengeRepository.createChallenge(data);
        return this.toResponseDto(challenge);
    }

    async updateChallenge(challengeId: string, data: UpdateChallengeDto): Promise<ChallengeResponseDto> {
        const challenge = await this.challengeRepository.updateChallenge(challengeId, data);
        return this.toResponseDto(challenge);
    }

    async deleteChallenge(challengeId: string): Promise<void> {
        await this.challengeRepository.deleteChallenge(challengeId);
    }

    async getChallengeById(challengeId: string): Promise<ChallengeWithOptionsDto | null> {
        const challenge = await this.challengeRepository.getChallengeById(challengeId);
        if (!challenge) return null;

        const options = await this.challengeRepository.getChallengeOptions(challengeId);

        return {
            challengeId: challenge.challengeId,
            challengeQuestion: challenge.challengeQuestion,
            hrBotDialog: challenge.hrBotDialog || "",
            challengeType: challenge.challengeType,
            options: options.map((opt, index) => ({
                optionId: opt.optionId,
                optionText: opt.optionText,
                order: index + 1 // 1, 2, 3, 4
            })),
        };
    }

    async getChallengesByModule(moduleId: string): Promise<ChallengeResponseDto[]> {
        const challenges = await this.challengeRepository.getChallengesByModule(moduleId);
        return challenges.map(this.toResponseDto);
    }

    async getChallengeAnalytics(moduleId: string): Promise<any> {
        const analytics = await this.challengeRepository.getChallengeAnalytics(moduleId);

        const totalAttempts = analytics.reduce((sum: number, ch: any) => sum + ch.totalAttempts, 0);
        const totalCorrect = analytics.reduce((sum: number, ch: any) => sum + ch.correctCount, 0);
        const averageScore = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

        return {
            totalAttempts,
            averageScore: Math.round(averageScore * 100) / 100,
            difficultyAnalysis: analytics.map((ch: any) => ({
                challengeId: ch.challenge.challengeId,
                challengeQuestion: ch.challenge.challengeQuestion,
                totalAttempts: ch.totalAttempts,
                correctRate: ch.totalAttempts > 0 ? (ch.correctCount / ch.totalAttempts) * 100 : 0,
                incorrectRate: ch.totalAttempts > 0 ? (ch.incorrectCount / ch.totalAttempts) * 100 : 0,
            })),
        };
    }

    private toResponseDto(challenge: any): ChallengeResponseDto {
        return {
            challengeId: challenge.challengeId,
            moduleId: challenge.moduleId,
            challengeQuestion: challenge.challengeQuestion,
            hrBotDialog: challenge.hrBotDialog,
            challengeType: challenge.challengeType,
            expectedAnswerId: challenge.expectedAnswerId,
            isActive: challenge.isActive,
            createdAt: challenge.createdAt,
            updatedAt: challenge.updatedAt,
        };
    }
}
