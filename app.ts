import express, { Request, Response, Application } from "express";
import session from "express-session";
import morgan from "morgan";
import * as dotenv from "dotenv";
import cors from "cors";
import { Container } from "./src/container";
import { testConnection } from "./database/db";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

const container = Container.getInstance();

// Manual CORS to ensure headers are always present
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// app.use(cors({ origin: '*' })); // Commented out in favor of manual middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// HTTP Request Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Format: :method :url :status :response-time ms
} else {
  app.use(morgan("combined")); // Format lengkap untuk production
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const passport = container.passportConfig.getPassport();
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Gamifikasi Wawancara API",
    version: "1.0.0",
  });
});

app.use("/api/v1/auth", container.authRouter.getRouter());
app.use("/api/v1/modules", container.moduleRouter.getRouter());
app.use("/api/v1/challenges", container.challengeRouter.getRouter());
app.use("/api/v1/progress", container.userProgressRouter.getRouter());
app.use("/api/v1/users", container.userRouter.getRouter());
app.use("/api/v1/career", container.careerRouter.getRouter());
app.use("/api/v1/profile", container.profileRouter.getRouter());
app.use("/api/v1/admin", container.adminRouter.getRouter());
app.use("/api/v1/mentorship", container.mentorshipRouter.getRouter());

import { errorHandler } from "./middleware/error.middleware";
app.use(errorHandler);

async function startServer() {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;

