export interface CreateModuleDto {
    moduleName: string;
    description: string;
    reviewMaterial?: string;
    hrPartnerName: string;
    hrPartnerCompany: string;
    moduleOrder: number;
}

export interface UpdateModuleDto {
    moduleName?: string;
    description?: string;
    reviewMaterial?: string;
    hrPartnerName?: string;
    hrPartnerCompany?: string;
    moduleOrder?: number;
}

export interface ModuleResponseDto {
    moduleId: string;
    moduleName: string;
    description: string | null;
    reviewMaterial: string | null;
    hrPartnerName: string | null;
    hrPartnerCompany: string | null;
    moduleOrder: number | null;
    totalChallenges: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ModuleListDto {
    moduleId: string;
    moduleName: string;
    description: string;
    reviewMaterial?: string;
    hrPartnerName: string;
    hrPartnerCompany: string;
    totalChallenges: number;
    isCompleted?: boolean;
    userProgress?: number;
}
