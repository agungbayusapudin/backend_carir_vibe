import { db } from "../../database/db";
import { dimModules, userProgress } from "../../database/schema";
import { eq, and, sql } from "drizzle-orm";

export interface Module {
    moduleId: string;
    moduleName: string;
    description: string | null;
    reviewMaterial: string | null;
    hrPartnerName: string | null;
    hrPartnerCompany: string | null;
    moduleOrder: number | null;
    totalChallenges: number;
    isActive: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IModuleRepository {
    createModule(data: any): Promise<Module>;
    updateModule(moduleId: string, data: any): Promise<Module>;
    deleteModule(moduleId: string): Promise<void>;
    getModuleById(moduleId: string): Promise<Module | null>;
    getAllModules(): Promise<Module[]>;
    getModulesWithProgress(userId: string): Promise<Array<Module & { isCompleted: boolean; userProgress: number }>>;
}

export class ModuleRepository implements IModuleRepository {
    async createModule(data: any): Promise<Module> {
        const [module] = await db
            .insert(dimModules)
            .values({
                moduleId: `module_${Date.now()}`,
                moduleName: data.moduleName,
                description: data.description,
                reviewMaterial: data.reviewMaterial,
                hrPartnerName: data.hrPartnerName,
                hrPartnerCompany: data.hrPartnerCompany,
                moduleOrder: data.moduleOrder,
                totalChallenges: 0,
            })
            .returning();

        return this.mapToModule(module);
    }

    async updateModule(moduleId: string, data: any): Promise<Module> {
        const [module] = await db
            .update(dimModules)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(dimModules.moduleId, moduleId))
            .returning();

        return this.mapToModule(module);
    }

    async deleteModule(moduleId: string): Promise<void> {
        await db
            .update(dimModules)
            .set({
                isActive: false,
                deletedAt: new Date(),
            })
            .where(eq(dimModules.moduleId, moduleId));
    }

    async getModuleById(moduleId: string): Promise<Module | null> {
        const modules = await db
            .select()
            .from(dimModules)
            .where(and(eq(dimModules.moduleId, moduleId), eq(dimModules.isActive, true)))
            .limit(1);

        return modules.length > 0 ? this.mapToModule(modules[0]) : null;
    }

    async getAllModules(): Promise<Module[]> {
        const modules = await db
            .select()
            .from(dimModules)
            .where(eq(dimModules.isActive, true))
            .orderBy(dimModules.moduleOrder);

        return modules.map(this.mapToModule);
    }

    async getModulesWithProgress(userId: string): Promise<Array<Module & { isCompleted: boolean; userProgress: number }>> {
        const modules = await this.getAllModules();

        const modulesWithProgress = await Promise.all(
            modules.map(async (module) => {
                const progressResult = await db
                    .select()
                    .from(userProgress)
                    .where(
                        and(
                            eq(userProgress.userId, userId),
                            eq(userProgress.moduleId, module.moduleId)
                        )
                    );

                const totalChallenges = module.totalChallenges || 0;
                const completedChallenges = progressResult.length;
                const isCompleted = totalChallenges > 0 && completedChallenges >= totalChallenges;
                const progress = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

                return {
                    ...module,
                    isCompleted,
                    userProgress: Math.min(progress, 100),
                };
            })
        );

        return modulesWithProgress;
    }

    private mapToModule(dbModule: any): Module {
        return {
            moduleId: dbModule.moduleId,
            moduleName: dbModule.moduleName,
            description: dbModule.description,
            reviewMaterial: dbModule.reviewMaterial,
            hrPartnerName: dbModule.hrPartnerName,
            hrPartnerCompany: dbModule.hrPartnerCompany,
            moduleOrder: dbModule.moduleOrder,
            totalChallenges: dbModule.totalChallenges ?? 0,
            isActive: dbModule.isActive ?? true,
            deletedAt: dbModule.deletedAt,
            createdAt: dbModule.createdAt,
            updatedAt: dbModule.updatedAt,
        };
    }
}
