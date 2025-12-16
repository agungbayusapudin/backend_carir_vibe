import { AuthRepository } from "./repositories/auth.repositories";
import { ModuleRepository } from "./repositories/module.repositories";
import { ChallengeRepository } from "./repositories/challenge.repositories";
import { UserProgressRepository } from "./repositories/userProgress.repositories";
import { UserRepository } from "./repositories/user.repositories";
import { CareerRepository } from "./repositories/career.repositories";
import { ProfileRepository } from "./repositories/profile.repositories";
import { AdminRepository } from "./repositories/admin.repositories";
import { MentorshipRepository } from "./repositories/mentorship.repositories";

import { AuthService } from "./services/auth.services";
import { ModuleService } from "./services/module.services";
import { ChallengeService } from "./services/challenge.services";
import { UserProgressService } from "./services/userProgress.services";
import { UserService } from "./services/user.services";
import { CareerService } from "./services/career.services";
import { ProfileService } from "./services/profile.services";
import { AdminService } from "./services/admin.services";
import { MentorshipService } from "./services/mentorship.services";
import { AIService } from "./services/ai.service";

import { AuthController } from "./controllers/auth.controllers";
import { ModuleController } from "./controllers/module.controllers";
import { ChallengeController } from "./controllers/challenge.controllers";
import { UserProgressController } from "./controllers/userProgress.controllers";
import { UserController } from "./controllers/user.controllers";
import { CareerController } from "./controllers/career.controllers";
import { ProfileController } from "./controllers/profile.controllers";
import { AdminController } from "./controllers/admin.controllers";
import { MentorshipController } from "./controllers/mentorship.controllers";

import { AuthRouter } from "./routers/auth.routers";
import { ModuleRouter } from "./routers/module.routers";
import { ChallengeRouter } from "./routers/challenge.routers";
import { UserProgressRouter } from "./routers/userProgress.routers";
import { UserRouter } from "./routers/user.routers";
import { CareerRouter } from "./routers/career.routers";
import { ProfileRouter } from "./routers/profile.routers";
import { AdminRouter } from "./routers/admin.routers";
import { MentorshipRouter } from "./routers/mentorship.routers";

import { PassportConfig } from "../config/passport.config";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { RoleMiddleware } from "../middleware/role.middleware";

export class Container {
    private static instance: Container;

    public authRepository: AuthRepository;
    public moduleRepository: ModuleRepository;
    public challengeRepository: ChallengeRepository;
    public userProgressRepository: UserProgressRepository;
    public userRepository: UserRepository;
    public careerRepository: CareerRepository;
    public profileRepository: ProfileRepository;
    public adminRepository: AdminRepository;
    public mentorshipRepository: MentorshipRepository;

    public authService: AuthService;
    public moduleService: ModuleService;
    public challengeService: ChallengeService;
    public userProgressService: UserProgressService;
    public userService: UserService;
    public careerService: CareerService;
    public profileService: ProfileService;
    public adminService: AdminService;
    public mentorshipService: MentorshipService;
    public aiService: AIService;

    public authController: AuthController;
    public moduleController: ModuleController;
    public challengeController: ChallengeController;
    public userProgressController: UserProgressController;
    public userController: UserController;
    public careerController: CareerController;
    public profileController: ProfileController;
    public adminController: AdminController;
    public mentorshipController: MentorshipController;

    public authRouter: AuthRouter;
    public moduleRouter: ModuleRouter;
    public challengeRouter: ChallengeRouter;
    public userProgressRouter: UserProgressRouter;
    public userRouter: UserRouter;
    public careerRouter: CareerRouter;
    public profileRouter: ProfileRouter;
    public adminRouter: AdminRouter;
    public mentorshipRouter: MentorshipRouter;

    public passportConfig: PassportConfig;
    public authMiddleware: AuthMiddleware;
    public roleMiddleware: RoleMiddleware;

    private constructor() {
        this.authRepository = new AuthRepository();
        this.moduleRepository = new ModuleRepository();
        this.challengeRepository = new ChallengeRepository();
        this.userProgressRepository = new UserProgressRepository();
        this.userRepository = new UserRepository();
        this.careerRepository = new CareerRepository();
        this.profileRepository = new ProfileRepository();
        this.adminRepository = new AdminRepository();
        this.mentorshipRepository = new MentorshipRepository();

        this.authService = new AuthService(this.authRepository);
        this.moduleService = new ModuleService(this.moduleRepository);
        this.challengeService = new ChallengeService(this.challengeRepository);
        this.aiService = new AIService();
        this.userProgressService = new UserProgressService(this.userProgressRepository, this.challengeRepository, this.aiService);
        this.userService = new UserService(this.userRepository);
        this.careerService = new CareerService(this.careerRepository, this.profileRepository, this.aiService);
        this.profileService = new ProfileService(this.profileRepository, this.aiService);
        this.adminService = new AdminService(this.adminRepository);
        this.mentorshipService = new MentorshipService(this.mentorshipRepository);

        this.authController = new AuthController(this.authService);
        this.moduleController = new ModuleController(this.moduleService);
        this.challengeController = new ChallengeController(this.challengeService);
        this.userProgressController = new UserProgressController(this.userProgressService);
        this.userController = new UserController(this.userService);
        this.careerController = new CareerController(this.careerService);
        this.profileController = new ProfileController(this.profileService);
        this.adminController = new AdminController(this.adminService);
        this.mentorshipController = new MentorshipController(this.mentorshipService);

        this.passportConfig = new PassportConfig(this.authService);
        this.authMiddleware = new AuthMiddleware(this.authService);
        this.roleMiddleware = new RoleMiddleware();

        this.authRouter = new AuthRouter(this.authController, this.passportConfig);
        this.moduleRouter = new ModuleRouter(this.moduleController, this.authMiddleware, this.roleMiddleware);
        this.challengeRouter = new ChallengeRouter(this.challengeController, this.authMiddleware, this.roleMiddleware);
        this.userProgressRouter = new UserProgressRouter(this.userProgressController, this.authMiddleware, this.roleMiddleware);
        this.userRouter = new UserRouter(this.userController, this.authMiddleware, this.roleMiddleware);
        this.careerRouter = new CareerRouter(this.careerController, this.authMiddleware);
        this.profileRouter = new ProfileRouter(this.profileController, this.authMiddleware);
        this.adminRouter = new AdminRouter(this.adminController, this.authMiddleware);
        this.mentorshipRouter = new MentorshipRouter(this.mentorshipController, this.authMiddleware);
    }

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }
}
