import { IModuleRepository } from "../repositories/module.repositories";
import { CreateModuleDto, UpdateModuleDto, ModuleResponseDto, ModuleListDto } from "../dtos/module.dto";

export class ModuleService {
    constructor(private moduleRepository: IModuleRepository) { }

    async createModule(data: CreateModuleDto): Promise<ModuleResponseDto> {
        const module = await this.moduleRepository.createModule(data);
        return this.toResponseDto(module);
    }

    async updateModule(moduleId: string, data: UpdateModuleDto): Promise<ModuleResponseDto> {
        const module = await this.moduleRepository.updateModule(moduleId, data);
        return this.toResponseDto(module);
    }

    async deleteModule(moduleId: string): Promise<void> {
        await this.moduleRepository.deleteModule(moduleId);
    }

    async getModuleById(moduleId: string): Promise<ModuleResponseDto | null> {
        const module = await this.moduleRepository.getModuleById(moduleId);
        return module ? this.toResponseDto(module) : null;
    }

    async getAllModules(): Promise<ModuleListDto[]> {
        const modules = await this.moduleRepository.getAllModules();
        return modules.map(m => ({
            moduleId: m.moduleId,
            moduleName: m.moduleName,
            description: m.description || "",
            reviewMaterial: m.reviewMaterial || "",
            hrPartnerName: m.hrPartnerName || "",
            hrPartnerCompany: m.hrPartnerCompany || "",
            totalChallenges: m.totalChallenges,
        }));
    }

    async getModulesWithProgress(userId: string): Promise<ModuleListDto[]> {
        const modules = await this.moduleRepository.getModulesWithProgress(userId);
        return modules.map(m => ({
            moduleId: m.moduleId,
            moduleName: m.moduleName,
            description: m.description || "",
            reviewMaterial: m.reviewMaterial || "",
            hrPartnerName: m.hrPartnerName || "",
            hrPartnerCompany: m.hrPartnerCompany || "",
            totalChallenges: m.totalChallenges,
            isCompleted: m.isCompleted,
            userProgress: m.userProgress,
        }));
    }

    private toResponseDto(module: any): ModuleResponseDto {
        return {
            moduleId: module.moduleId,
            moduleName: module.moduleName,
            description: module.description,
            reviewMaterial: module.reviewMaterial,
            hrPartnerName: module.hrPartnerName,
            hrPartnerCompany: module.hrPartnerCompany,
            moduleOrder: module.moduleOrder,
            totalChallenges: module.totalChallenges,
            isActive: module.isActive,
            createdAt: module.createdAt,
            updatedAt: module.updatedAt,
        };
    }
}
