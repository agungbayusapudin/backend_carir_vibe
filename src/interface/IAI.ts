
export interface IAIService {
    generateContent(prompt: string): Promise<string>;
    extractResumeData(text: string): Promise<any>;
    getJobSearchKeywords(userContext: string): Promise<string[]>;
    getAnswerReview(question: string, userAnswers: string[]): Promise<any>;
}
