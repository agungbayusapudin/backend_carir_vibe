import { IAIService } from "../interface/IAI";
import { GoogleGenAI } from "@google/genai";
import { aiConfig } from "../../config/ai.config";

export class AIService implements IAIService {
    private ai: GoogleGenAI;

    constructor() {
        const apiKey = aiConfig.gemini.apiKey;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set in config. AI features will run in mock mode or fail.");
        }
        // Initialize GoogleGenAI client
        this.ai = new GoogleGenAI({ apiKey: apiKey });
    }

    async generateContent(prompt: string): Promise<string> {
        if (!aiConfig.gemini.apiKey) {
            throw new Error("GEMINI_API_KEY_MISSING");
        }
        try {
            const response = await this.ai.models.generateContent({
                model: aiConfig.gemini.modelName,
                contents: prompt,
            });

            // Per user snippet, response.text contains the output
            // Type assertion might be needed if TS doesn't infer it from the new library yet, 
            // but we'll assume the library types are correct.
            return response.text as string || "";
        } catch (error) {
            console.error("Gemini generateContent Error:", error);
            throw error;
        }
    }

    async extractResumeData(text: string): Promise<any> {
        if (!aiConfig.gemini.apiKey) {
            console.warn("Skipping AI resume extraction (No API Key).");
            return {
                summary: "Resume summary unavailable (AI Key Missing)",
                skills: ["Manual Review Needed"],
                experience: "Detailed in attached document",
                education: "Detailed in attached document"
            };
        }

        const prompt = `
        Act as a professional Resume Parser. Extract the following information from the provided resume text:
        1. Professional Summary (write a concise summary if not explicitly present)
        2. Skills (extract technical and soft skills as a list of strings)
        3. Work Experience (summarize key roles, companies, and durations if available)
        4. Education (degrees, majors, and institutions)

        Resume Text:
        """
        ${text.substring(0, 10000)} 
        """
        (Text truncated if too long)

        Output purely in JSON format with this structure:
        {
            "summary": "...",
            "skills": ["skill1", "skill2"],
            "experience": "...",
            "education": "..."
        }
        Do not include markdown formatting (like \`\`\`json). Return raw JSON only.
        `;

        try {
            // Re-use the generateContent method which now uses the new SDK
            const rawResponse = await this.generateContent(prompt);
            const cleanedResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanedResponse);
        } catch (error) {
            console.error("Resume Extraction Error:", error);
            // Return raw text or empty structure if parsing fails
            return {
                summary: "Could not extract summary.",
                skills: [],
                experience: "Could not extract experience.",
                education: "Could not extract education."
            };
        }
    }
    async getJobSearchKeywords(userContext: string): Promise<string[]> {
        if (!aiConfig.gemini.apiKey) {
            return ["Software Engineer"]; // Fallback
        }

        const prompt = `
        Based on the following user profile, suggest 3 specific job titles to search for on LinkedIn in Indonesia.
        Prioritize roles that match their skills and experience.
        
        ${userContext}
        
        Output valid JSON array of strings only. Example: ["Backend Developer", "Full Stack Engineer"]
        Do not include markdown.
        `;

        try {
            const rawResponse = await this.generateContent(prompt);
            const cleanedResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const keywords = JSON.parse(cleanedResponse);
            return Array.isArray(keywords) ? keywords : ["Software Engineer"];
        } catch (error) {
            console.error("AI Keyword Extraction Error:", error);
            return ["Software Engineer"];
        }
    }

    async getAnswerReview(question: string, userAnswers: string[]): Promise<any> {
        if (!aiConfig.gemini.apiKey) {
            return this.getFallbackReview();
        }

        const answersText = userAnswers.join(", ");
        const prompt = `
        Anda adalah HR Expert. Berikan review singkat untuk jawaban interview berikut:
        
        Pertanyaan: "${question}"
        Jawaban user: ${answersText}
        
        Berikan response dalam format JSON STRICT (tanpa markdown):
        {
            "yangHarusDilakukan": ["poin 1", "poin 2", "poin 3"],
            "yangHarusDihindari": ["poin 1", "poin 2", "poin 3"],
            "contohJawabanBagus": "Contoh jawaban yang baik dan lengkap"
        }
        
        PENTING: Output HANYA JSON, tanpa backticks atau teks tambahan.
        `;

        try {
            const rawResponse = await this.generateContent(prompt);
            const cleanedResponse = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            const review = JSON.parse(cleanedResponse);
            return review;
        } catch (error) {
            console.error("AI Review Error:", error);
            return this.getFallbackReview();
        }
    }

    private getFallbackReview() {
        return {
            yangHarusDilakukan: [
                "Riset job description dengan detail",
                "Match skill-mu dengan kebutuhan mereka",
                "Berikan bukti konkret (project, achievement)"
            ],
            yangHarusDihindari: [
                "Jawaban generik tanpa bukti",
                "Terkesan arogan",
                "Fokus pada apa yang kamu dapat, bukan yang kamu beri"
            ],
            contohJawabanBagus: "Berdasarkan job desc, kalian butuh seseorang dengan skill X. Saya punya pengalaman Y tahun dan pernah mencapai Z."
        };
    }
}
