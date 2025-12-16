import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IAuthService, AuthTokens } from "../interface/IAuthService";
import { IAuthRepository, GoogleProfile, User } from "../interface/IAuthRepository";
import { ConflictException, UnauthorizedException } from "../../exeptions/http.exception";

export class AuthService implements IAuthService {
    private jwtSecret: string;
    private jwtExpiresIn: string;
    private saltRounds: number = 10;

    constructor(private authRepository: IAuthRepository) {
        this.jwtSecret = process.env.JWT_SECRET || "your-secret-key-change-this";
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
    }

    async register(email: string, password: string, fullName: string, role?: string): Promise<User> {
        const existingUser = await this.authRepository.findUserByEmail(email);

        if (existingUser) {
            throw new ConflictException("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, this.saltRounds);
        const user = await this.authRepository.createUser(email, hashedPassword, fullName, role);

        return user;
    }

    async login(email: string, password: string): Promise<User> {
        const user = await this.authRepository.findUserByEmail(email);

        if (!user || !user.password) {
            throw new UnauthorizedException("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid email or password");
        }

        await this.authRepository.updateLastLogin(user.userId);

        return user;
    }

    async authenticateGoogleUser(profile: GoogleProfile, role?: string): Promise<User> {
        console.log(`[AuthService] Authenticating Google User: ${profile.emails[0].value}, Requested Role: ${role}`);
        let user = await this.authRepository.findUserByGoogleId(profile.id);

        if (!user) {
            const email = profile.emails[0].value;
            user = await this.authRepository.findUserByEmail(email);

            if (user) {
                console.log(`[AuthService] User found by email but not Google ID. Linking...`);
                // Ideally we should link, but for now throwing conflict as per existing logic, 
                // OR we could update the user to add googleId.
                // Existing logic threw ConflictException. 
                // But wait, if I throw conflict, user can't login.
                // Let's stick to existing logic for now, but log it.
                // Modify: The user wants "Role dulu obtained...". 
                throw new ConflictException("Email already registered with different method");
            }

            console.log(`[AuthService] Creating new user with role: ${role}`);
            user = await this.authRepository.createUserFromGoogle(profile, role);
        } else {
            console.log(`[AuthService] User found. Current Role: ${user.role}, Requested Role: ${role}`);
            // Check if we need to update the role
            // Allow update if role is provided and different from current
            if (role && user.role !== role) {
                console.log(`[AuthService] Updating user role from ${user.role} to ${role}`);
                user = await this.authRepository.updateUserRole(user.userId, role);
            }
            await this.authRepository.updateLastLogin(user.userId);
        }

        return user;
    }

    generateTokens(user: User): AuthTokens {
        const payload = {
            userId: user.userId,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
        };

        const accessToken = jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn,
        } as jwt.SignOptions);

        const refreshToken = jwt.sign(
            { userId: user.userId },
            this.jwtSecret,
            { expiresIn: "30d" } as jwt.SignOptions
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        try {
            const decoded = jwt.verify(refreshToken, this.jwtSecret) as any;
            const user = await this.authRepository.findUserByEmail(decoded.email || "");

            if (!user || !decoded.userId || decoded.userId !== user.userId) {
                throw new UnauthorizedException("Invalid refresh token");
            }

            return this.generateTokens(user);
        } catch (error) {
            throw new UnauthorizedException("Invalid refresh token");
        }
    }

    async verifyAccessToken(token: string): Promise<User | null> {
        try {
            const decoded = jwt.verify(token, this.jwtSecret) as any;
            const user = await this.authRepository.findUserByEmail(decoded.email);
            return user;
        } catch (error) {
            return null;
        }
    }
}
