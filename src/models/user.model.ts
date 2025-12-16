export class UserModel {
    userId: string;
    fullName: string;
    email: string;
    googleId: string | null;
    profilePicture: string | null;
    currentLevel: number;
    totalXp: number;
    progressPercentage: string;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;

    constructor(data: any) {
        this.userId = data.userId;
        this.fullName = data.fullName;
        this.email = data.email;
        this.googleId = data.googleId || null;
        this.profilePicture = data.profilePicture || null;
        this.currentLevel = data.currentLevel || 1;
        this.totalXp = data.totalXp || 0;
        this.progressPercentage = data.progressPercentage || "0.00";
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.deletedAt = data.deletedAt || null;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.lastLoginAt = data.lastLoginAt || null;
    }

    toJSON() {
        return {
            userId: this.userId,
            fullName: this.fullName,
            email: this.email,
            googleId: this.googleId,
            profilePicture: this.profilePicture,
            currentLevel: this.currentLevel,
            totalXp: this.totalXp,
            progressPercentage: this.progressPercentage,
            isActive: this.isActive,
            deletedAt: this.deletedAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            lastLoginAt: this.lastLoginAt,
        };
    }

    toPublicJSON() {
        return {
            userId: this.userId,
            fullName: this.fullName,
            email: this.email,
            profilePicture: this.profilePicture,
            currentLevel: this.currentLevel,
            totalXp: this.totalXp,
            progressPercentage: this.progressPercentage,
        };
    }
}
