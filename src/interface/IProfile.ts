
export interface IProfileRepository {
    // Resume
    findResumeByUserId(userId: string): Promise<any>;
    upsertResume(userId: string, data: any): Promise<any>;

    // Portfolio
    findPortfoliosByUserId(userId: string): Promise<any[]>;
    createPortfolio(userId: string, data: any): Promise<any>;
    deletePortfolio(portfolioId: string): Promise<void>;

    // User Profile Extensions (Interest, Bookmarks)
    getBookmarks(userId: string): Promise<any[]>;
    addBookmark(data: any): Promise<any>;
    removeBookmark(bookmarkId: string): Promise<void>;
}

export interface IProfileService {
    getResume(userId: string): Promise<any>;
    updateResume(userId: string, data: any): Promise<any>;
    uploadResume(userId: string, file: Express.Multer.File): Promise<any>;

    getPortfolios(userId: string): Promise<any[]>;
    addPortfolio(userId: string, data: any): Promise<any>;
    removePortfolio(userId: string, portfolioId: string): Promise<void>;

    getBookmarks(userId: string): Promise<any[]>;
    toggleBookmark(userId: string, entityType: string, entityId: string): Promise<any>;
}
