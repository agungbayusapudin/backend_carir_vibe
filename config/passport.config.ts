import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { IAuthService } from "../src/interface/IAuthService";
import { GoogleProfile } from "../src/interface/IAuthRepository";

export class PassportConfig {
    constructor(private authService: IAuthService) {
        this.configureGoogleStrategy();
        this.serializeUser();
        this.deserializeUser();
    }

    private configureGoogleStrategy(): void {
        const googleConfig = {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        };

        passport.use(
            new GoogleStrategy(
                {
                    ...googleConfig,
                    passReqToCallback: true
                },
                async (req, accessToken, refreshToken, profile, done) => {
                    try {
                        const googleProfile: GoogleProfile = {
                            id: profile.id,
                            displayName: profile.displayName,
                            emails: profile.emails || [],
                            photos: profile.photos,
                        };

                        let role: string | undefined;
                        if (req.query.state) {
                            try {
                                const stateStr = Buffer.from(req.query.state as string, 'base64').toString('utf8');
                                const state = JSON.parse(stateStr);
                                role = state.role;
                                console.log(`[GoogleOAuth] Received Role: ${role}`);
                            } catch (e) {
                                console.error("[GoogleOAuth] Failed to parse state:", e);
                            }
                        } else {
                            console.log("[GoogleOAuth] No state received");
                        }

                        const user = await this.authService.authenticateGoogleUser(googleProfile, role);
                        return done(null, user);
                    } catch (error) {
                        return done(error as Error, undefined);
                    }
                }
            )
        );
    }

    private serializeUser(): void {
        passport.serializeUser((user: any, done) => {
            done(null, user);
        });
    }

    private deserializeUser(): void {
        passport.deserializeUser(async (user: any, done) => {
            try {
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        });
    }

    getPassport() {
        return passport;
    }
}
