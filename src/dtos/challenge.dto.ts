export interface CreateChallengeDto {
    moduleId: string;
    challengeQuestion: string;
    hrBotDialog: string;
    challengeType: string;
    options: Array<{
        optionText: string;
        isCorrect: boolean;
        feedbackText: string;
        xpReward: number;
    }>;
}

export interface UpdateChallengeDto {
    challengeQuestion?: string;
    hrBotDialog?: string;
    challengeType?: string;
    options?: Array<{
        optionId?: string;
        optionText: string;
        isCorrect: boolean;
        feedbackText: string;
        xpReward: number;
    }>;
}

export interface ChallengeResponseDto {
    challengeId: string;
    moduleId: string;
    challengeQuestion: string;
    hrBotDialog: string | null;
    challengeType: string;
    expectedAnswerId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChallengeWithOptionsDto {
    challengeId: string;
    challengeQuestion: string;
    hrBotDialog: string;
    challengeType: string;
    options: Array<{
        optionId: string;
        optionText: string;
        isCorrect?: boolean;
        order?: number;
    }>;
}

export interface SubmitAnswerDto {
    selectedOptionId: string;
}

export interface SubmitAnswerResponseDto {
    isCorrect: boolean;
    feedbackText: string;
    xpGained: number;
    starsGained: number;
    nextChallenge: ChallengeWithOptionsDto | null;
}
