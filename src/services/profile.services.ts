import { IProfileService, IProfileRepository } from "../interface/IProfile";
import { IAIService } from "../interface/IAI";
import mammoth from "mammoth";
import { extractText } from "unpdf";
import fs from "fs";

export class ProfileService implements IProfileService {
    constructor(
        private profileRepository: IProfileRepository,
        private aiService: IAIService
    ) { }

    async getResume(userId: string): Promise<any> {
        return this.profileRepository.findResumeByUserId(userId);
    }

    async updateResume(userId: string, data: any): Promise<any> {
        return this.profileRepository.upsertResume(userId, data);
    }

    async uploadResume(userId: string, file: Express.Multer.File): Promise<any> {
        let textContent = "";

        try {
            if (file.mimetype === "application/pdf") {
                const dataBuffer = fs.readFileSync(file.path);
                const { text } = await extractText(new Uint8Array(dataBuffer));
                textContent = Array.isArray(text) ? text.join("\n") : text;
            } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                const result = await mammoth.extractRawText({ path: file.path });
                textContent = result.value;
            } else {
                throw new Error("Unsupported file format. Please upload PDF or DOCX.");
            }

            // Extract data using AI
            const extractedData = await this.aiService.extractResumeData(textContent);

            // Save to DB
            const resumeData = {
                fileUrl: file.path, // In real app, upload to S3/Cloudinary and save URL
                summary: extractedData.summary,
                skills: extractedData.skills, // Array of strings
                experience: extractedData.experience,
                education: extractedData.education,
                rawText: textContent
            };

            await this.profileRepository.upsertResume(userId, resumeData);

            // Clean up temp file
            fs.unlinkSync(file.path);

            return resumeData;

        } catch (error) {
            // Clean up temp file if error
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            throw error;
        }
    }

    async getPortfolios(userId: string): Promise<any[]> {
        return this.profileRepository.findPortfoliosByUserId(userId);
    }

    async addPortfolio(userId: string, data: any): Promise<any> {
        return this.profileRepository.createPortfolio(userId, data);
    }

    async removePortfolio(userId: string, portfolioId: string): Promise<void> {
        return this.profileRepository.deletePortfolio(portfolioId);
    }

    async getBookmarks(userId: string): Promise<any[]> {
        return this.profileRepository.getBookmarks(userId);
    }

    async toggleBookmark(userId: string, entityType: string, entityId: string): Promise<any> {
        // Check if exists
        const bookmarks = await this.getBookmarks(userId);
        const exists = bookmarks.find((b: any) => b.entityType === entityType && b.entityId === entityId);

        if (exists) {
            await this.profileRepository.removeBookmark(exists.bookmarkId);
            return { action: 'removed' };
        } else {
            const newBookmark = await this.profileRepository.addBookmark({
                userId,
                entityType,
                entityId
            });
            return { action: 'added', bookmark: newBookmark };
        }
    }
}
