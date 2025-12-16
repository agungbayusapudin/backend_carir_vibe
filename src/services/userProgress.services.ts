import { IUserProgressRepository } from "../repositories/userProgress.repositories";
import { IChallengeRepository } from "../repositories/challenge.repositories";
import { IAIService } from "../interface/IAI";
import { SessionResponseDto, FinishSessionResponseDto, UserProgressItemDto } from "../dtos/userProgress.dto";
import { SubmitAnswerResponseDto } from "../dtos/challenge.dto";
import { DashboardResponseDto, LeaderboardItemDto } from "../dtos/dashboard.dto";

export class UserProgressService {
    private sessionStore: Map<string, any> = new Map();

    constructor(
        private userProgressRepository: IUserProgressRepository,
        private challengeRepository: IChallengeRepository,
        private aiService: IAIService
    ) { }

    async startSession(userId: string, moduleId: string): Promise<SessionResponseDto> {
        const sessionId = `session_${userId}_${Date.now()}`;
        const challenges = await this.challengeRepository.getChallengesByModule(moduleId);

        if (challenges.length === 0) {
            throw new Error("No challenges found for this module");
        }

        const firstChallenge = challenges[0];
        const options = await this.challengeRepository.getChallengeOptions(firstChallenge.challengeId);

        this.sessionStore.set(sessionId, {
            userId,
            moduleId,
            challenges,
            currentIndex: 0,
            totalXp: 0,
            totalStars: 0,
            correctAnswers: 0,
        });

        return {
            sessionId,
            moduleId,
            currentChallenge: {
                challengeId: firstChallenge.challengeId,
                challengeQuestion: firstChallenge.challengeQuestion,
                hrBotDialog: firstChallenge.hrBotDialog || "",
                challengeType: firstChallenge.challengeType,
                options: options.map(opt => ({
                    optionId: opt.optionId,
                    optionText: opt.optionText,
                })),
            },
        };
    }

    async submitAnswer(userId: string, sessionId: string, challengeId: string, selectedOptionId: string): Promise<SubmitAnswerResponseDto> {
        const session = this.sessionStore.get(sessionId);
        if (!session || session.userId !== userId) {
            throw new Error("Invalid session");
        }

        const options = await this.challengeRepository.getChallengeOptions(challengeId);
        const selectedOption = options.find(opt => opt.optionId === selectedOptionId);

        if (!selectedOption) {
            throw new Error("Invalid option selected");
        }

        const isCorrect = selectedOption.isCorrect;
        const xpGained = isCorrect ? selectedOption.xpReward : 0;
        const starsGained = isCorrect ? 1 : 0;

        session.totalXp += xpGained;
        session.totalStars += starsGained;
        if (isCorrect) session.correctAnswers++;

        const dateId = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ""));

        await this.userProgressRepository.createProgress({
            userId,
            moduleId: session.moduleId,
            challengeId,
            dateId,
            role: "student",
            xpGained,
            starsReceived: starsGained,
            timeSpentSeconds: 0,
            userSelectedOptionId: selectedOptionId,
            isCorrectSelection: isCorrect,
        });

        session.currentIndex++;
        this.sessionStore.set(sessionId, session);

        let nextChallenge = null;
        if (session.currentIndex < session.challenges.length) {
            const next = session.challenges[session.currentIndex];
            const nextOptions = await this.challengeRepository.getChallengeOptions(next.challengeId);

            nextChallenge = {
                challengeId: next.challengeId,
                challengeQuestion: next.challengeQuestion,
                hrBotDialog: next.hrBotDialog || "",
                challengeType: next.challengeType,
                options: nextOptions.map((opt: any) => ({
                    optionId: opt.optionId,
                    optionText: opt.optionText,
                })),
            };
        }

        return {
            isCorrect,
            feedbackText: selectedOption.feedbackText || "",
            xpGained,
            starsGained,
            nextChallenge,
        };
    }

    async finishSession(userId: string, sessionId: string): Promise<FinishSessionResponseDto> {
        const session = this.sessionStore.get(sessionId);
        if (!session || session.userId !== userId) {
            throw new Error("Invalid session");
        }

        await this.userProgressRepository.updateUserXp(userId, session.totalXp);

        const dashboard = await this.userProgressRepository.getDashboard(userId);
        const newLevel = dashboard.user.currentLevel;
        const oldLevel = Math.floor((dashboard.user.totalXp - session.totalXp) / 1000) + 1;

        const response: FinishSessionResponseDto = {
            totalXp: session.totalXp,
            totalStars: session.totalStars,
            correctAnswers: session.correctAnswers,
            totalQuestions: session.challenges.length,
            newLevel,
            leveledUp: newLevel > oldLevel,
        };

        this.sessionStore.delete(sessionId);

        return response;
    }

    async getUserHistory(userId: string): Promise<UserProgressItemDto[]> {
        const history = await this.userProgressRepository.getUserHistory(userId);

        return history.map(item => ({
            factId: item.factId,
            moduleId: item.moduleId,
            moduleName: "",
            challengeQuestion: "",
            userAnswer: "",
            isCorrect: item.isCorrectSelection,
            feedbackText: "",
            xpGained: item.xpGained,
            starsReceived: item.starsReceived,
            finishedAt: item.finishedAt,
        }));
    }

    async getDashboard(userId: string): Promise<DashboardResponseDto> {
        const dashboard = await this.userProgressRepository.getDashboard(userId);

        return {
            user: {
                userId: dashboard.user.userId,
                fullName: dashboard.user.fullName,
                email: dashboard.user.email,
                profilePicture: dashboard.user.profilePicture,
                currentLevel: dashboard.user.currentLevel,
                totalXp: dashboard.user.totalXp,
                progressPercentage: dashboard.user.progressPercentage,
            },
            stats: {
                completedModules: dashboard.completedModules,
                totalModules: dashboard.totalModules,
                totalXp: dashboard.user.totalXp,
                currentLevel: dashboard.user.currentLevel,
            },
            recentProgress: dashboard.recentProgress.map((p: any) => ({
                moduleId: p.moduleId,
                moduleName: "",
                xpGained: p.xpGained,
                starsReceived: p.starsReceived,
                finishedAt: p.finishedAt,
            })),
        };
    }

    async getLeaderboard(): Promise<LeaderboardItemDto[]> {
        const users = await this.userProgressRepository.getLeaderboard(100);

        return users.map((user, index) => ({
            rank: index + 1,
            userId: user.userId,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            totalXp: user.totalXp,
            currentLevel: user.currentLevel,
        }));
    }

    async getSessionReview(userId: string, sessionId: string): Promise<any> {
        const session = this.sessionStore.get(sessionId);
        if (!session || session.userId !== userId) {
            throw new Error("Invalid session");
        }

        // Ambil semua jawaban user dari session
        const answeredChallenges = session.challenges.slice(0, session.currentIndex);

        if (answeredChallenges.length === 0) {
            throw new Error("No answers yet");
        }

        // Ambil progress records untuk session ini
        const history = await this.userProgressRepository.getUserHistory(userId);

        // Buat context untuk AI
        const reviewPromises = answeredChallenges.map(async (challenge: any) => {
            const options = await this.challengeRepository.getChallengeOptions(challenge.challengeId);
            const userProgress = history.find(h => h.challengeId === challenge.challengeId);

            if (!userProgress) return null;

            const selectedOption = options.find(opt => opt.optionId === userProgress.userSelectedOptionId);
            const userAnswerText = selectedOption ? selectedOption.optionText : "Unknown";

            const aiReview = await this.aiService.getAnswerReview(
                challenge.challengeQuestion,
                [userAnswerText]
            );

            return {
                question: challenge.challengeQuestion,
                userAnswer: userAnswerText,
                isCorrect: userProgress.isCorrectSelection,
                review: aiReview
            };
        });

        const reviews = await Promise.all(reviewPromises);

        return {
            sessionId,
            totalAnswered: answeredChallenges.length,
            reviews: reviews.filter(r => r !== null)
        };
    }
}
