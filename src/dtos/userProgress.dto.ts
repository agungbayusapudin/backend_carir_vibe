export interface StartSessionDto {
    moduleId: string;
}

export interface SessionResponseDto {
    sessionId: string;
    moduleId: string;
    currentChallenge: {
        challengeId: string;
        challengeQuestion: string;
        hrBotDialog: string;
        challengeType: string;
        options: Array<{
            optionId: string;
            optionText: string;
        }>;
    };
}

export interface FinishSessionDto {
    sessionId: string;
}

export interface FinishSessionResponseDto {
    totalXp: number;
    totalStars: number;
    correctAnswers: number;
    totalQuestions: number;
    newLevel: number;
    leveledUp: boolean;
}

export interface UserProgressItemDto {
    factId: string;
    moduleId: string;
    moduleName: string;
    challengeQuestion: string;
    userAnswer: string;
    isCorrect: boolean;
    feedbackText: string;
    xpGained: number;
    starsReceived: number;
    finishedAt: Date;
}
