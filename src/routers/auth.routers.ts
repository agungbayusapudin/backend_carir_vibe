import { Router } from "express";
import { AuthController } from "../controllers/auth.controllers";
import { PassportConfig } from "../../config/passport.config";

export class AuthRouter {
    public router: Router;

    constructor(
        private authController: AuthController,
        private passportConfig: PassportConfig
    ) {
        this.router = Router();
        this.configureRoutes();
    }

    private configureRoutes(): void {
        const passport = this.passportConfig.getPassport();

        this.router.post("/register", this.authController.register);

        this.router.post("/login", this.authController.login);

        this.router.post("/token/refresh", this.authController.refreshToken);

        this.router.get(
            "/google",
            (req, res, next) => {
                const stateObj = { role: req.query.role || 'student' };
                const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

                passport.authenticate("google", {
                    scope: ["profile", "email"],
                    state: state
                })(req, res, next);
            }
        );

        this.router.get(
            "/google/callback",
            passport.authenticate("google", { session: false }),
            this.authController.googleCallback
        );

        this.router.post("/logout", this.authController.logout);
    }

    getRouter(): Router {
        return this.router;
    }
}
