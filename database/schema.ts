import { pgTable, uuid, varchar, integer, decimal, boolean, timestamp, text, primaryKey, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const dimRoles = pgTable("dim_roles", {
    roleId: uuid("role_id").primaryKey().defaultRandom(),
    roleName: varchar("role_name", { length: 50 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const dimUsers = pgTable("dim_users", {
    userId: uuid("user_id").primaryKey().defaultRandom(),
    roleId: uuid("role_id").references(() => dimRoles.roleId),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    googleId: varchar("google_id", { length: 255 }).unique(),
    profilePicture: text("profile_picture"),
    currentLevel: integer("current_level").default(1),
    totalXp: integer("total_xp").default(0),
    progressPercentage: decimal("progress_percentage", { precision: 5, scale: 2 }).default("0.00"),
    isActive: boolean("is_active").default(true),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    lastLoginAt: timestamp("last_login_at"),
});

export const dimModules = pgTable("dim_modules", {
    moduleId: varchar("module_id", { length: 50 }).primaryKey(),
    moduleName: varchar("module_name", { length: 100 }).notNull(),
    description: text("description"),
    reviewMaterial: text("review_material"),
    hrPartnerName: varchar("hr_partner_name", { length: 100 }),
    hrPartnerCompany: varchar("hr_partner_company", { length: 100 }),
    moduleOrder: integer("module_order"),
    totalChallenges: integer("total_challenges").default(0),
    isActive: boolean("is_active").default(true),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const dimChallenges = pgTable("dim_challenges", {
    challengeId: uuid("challenge_id").primaryKey().defaultRandom(),
    moduleId: varchar("module_id", { length: 50 }).notNull().references(() => dimModules.moduleId),
    challengeQuestion: text("challenge_question").notNull(),
    hrBotDialog: text("hr_bot_dialog"),
    challengeType: varchar("challenge_type", { length: 20 }).notNull(),
    expectedAnswerId: uuid("expected_answer_id"),
    xpReward: integer("xp_reward").default(100),
    isActive: boolean("is_active").default(true),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const challengeOptions = pgTable("challenge_options", {
    optionId: uuid("option_id").primaryKey().defaultRandom(),
    challengeId: uuid("challenge_id").notNull().references(() => dimChallenges.challengeId, { onDelete: "cascade" }),
    optionText: text("option_text").notNull(),
    isCorrect: boolean("is_correct").default(false),
    feedbackText: text("feedback_text"),
    xpReward: integer("xp_reward").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const dimDates = pgTable("dim_dates", {
    dateId: integer("date_id").primaryKey(),
    fullDate: timestamp("full_date").notNull().unique(),
    dayName: varchar("day_name", { length: 10 }),
    monthName: varchar("month_name", { length: 10 }),
    year: integer("year"),
});

export const userProgress = pgTable("user_progress", {
    factId: uuid("fact_id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => dimUsers.userId),
    moduleId: varchar("module_id", { length: 50 }).notNull().references(() => dimModules.moduleId),
    challengeId: uuid("challenge_id").notNull().references(() => dimChallenges.challengeId),
    dateId: integer("date_id").notNull().references(() => dimDates.dateId),
    role: varchar("role", { length: 20 }).notNull(),
    xpGained: integer("xp_gained").notNull(),
    starsReceived: integer("stars_received").notNull(),
    timeSpentSeconds: integer("time_spent_seconds"),
    userSelectedOptionId: uuid("user_selected_option_id").references(() => challengeOptions.optionId),
    isCorrectSelection: boolean("is_correct_selection").notNull(),
    finishedAt: timestamp("finished_at").defaultNow(),
}, (table) => ({
    userIdx: index("idx_progress_user").on(table.userId),
    moduleIdx: index("idx_progress_module").on(table.moduleId),
}));

// --- Career Discovery & Assessment ---

export const dimCareers = pgTable("dim_careers", {
    careerId: uuid("career_id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 100 }).notNull(),
    description: text("description"),
    averageSalary: decimal("average_salary", { precision: 12, scale: 2 }),
    marketTrend: varchar("market_trend", { length: 50 }), // 'stable', 'growing', 'declining'
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const dimSkills = pgTable("dim_skills", {
    skillId: uuid("skill_id").primaryKey().defaultRandom(),
    skillName: varchar("skill_name", { length: 100 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const mapCareerSkills = pgTable("map_career_skills", {
    careerId: uuid("career_id").notNull().references(() => dimCareers.careerId),
    skillId: uuid("skill_id").notNull().references(() => dimSkills.skillId),
    importanceLevel: integer("importance_level"), // 1-5
}, (table) => ({
    pk: primaryKey({ columns: [table.careerId, table.skillId] }),
}));

export const userCareerInterests = pgTable("user_career_interests", {
    userId: uuid("user_id").notNull().references(() => dimUsers.userId),
    careerId: uuid("career_id").notNull().references(() => dimCareers.careerId),
    interestLevel: integer("interest_level"), // 1-5
    createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
    pk: primaryKey({ columns: [table.userId, table.careerId] }),
}));

// --- Internship & Job Market ---

export const dimCompanies = pgTable("dim_companies", {
    companyId: uuid("company_id").primaryKey().defaultRandom(),
    employerUserId: uuid("employer_user_id").references(() => dimUsers.userId), // Link to user with 'employer' role
    companyName: varchar("company_name", { length: 150 }).notNull(),
    description: text("description"),
    industry: varchar("industry", { length: 100 }),
    website: varchar("website", { length: 255 }),
    location: varchar("location", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const dimPostings = pgTable("dim_postings", {
    postingId: uuid("posting_id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => dimCompanies.companyId),
    title: varchar("title", { length: 150 }).notNull(),
    type: varchar("type", { length: 50 }).notNull(), // 'internship', 'job', 'gig'
    description: text("description").notNull(),
    requirements: text("requirements"),
    location: varchar("location", { length: 100 }),
    workMode: varchar("work_mode", { length: 50 }), // 'remote', 'hybrid', 'onsite'
    stipend: varchar("stipend", { length: 100 }),
    status: varchar("status", { length: 50 }).default("active"), // 'active', 'closed', 'draft'
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobApplications = pgTable("job_applications", {
    applicationId: uuid("application_id").primaryKey().defaultRandom(),
    postingId: uuid("posting_id").notNull().references(() => dimPostings.postingId),
    userId: uuid("user_id").notNull().references(() => dimUsers.userId),
    resumeUrl: text("resume_url"),
    coverLetter: text("cover_letter"),
    status: varchar("status", { length: 50 }).default("submitted"), // 'submitted', 'review', 'interview', 'accepted', 'rejected'
    appliedAt: timestamp("applied_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// --- Mentorship ---

export const dimMentors = pgTable("dim_mentors", {
    mentorId: uuid("mentor_id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => dimUsers.userId), // Link to user record
    expertise: text("expertise"),
    bio: text("bio"),
    yearsOfExperience: integer("years_of_experience"),
    linkedinUrl: varchar("linkedin_url", { length: 255 }),
    isVerified: boolean("is_verified").default(false),
    availability: text("availability"), // JSON string or text details
    rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
    reviewCount: integer("review_count").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const mentorshipRequests = pgTable("mentorship_requests", {
    requestId: uuid("request_id").primaryKey().defaultRandom(),
    mentorId: uuid("mentor_id").notNull().references(() => dimMentors.mentorId),
    menteeId: uuid("mentee_id").notNull().references(() => dimUsers.userId),
    message: text("message"),
    status: varchar("status", { length: 50 }).default("pending"), // 'pending', 'accepted', 'rejected', 'cancelled'
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// --- Resume & Portfolio ---

export const dimResumes = pgTable("dim_resumes", {
    resumeId: uuid("resume_id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => dimUsers.userId),
    summary: text("summary"),
    education: text("education"), // JSON string or text block
    experience: text("experience"), // JSON string or text block
    skills: text("skills"), // JSON string or array
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const dimPortfolios = pgTable("dim_portfolios", {
    portfolioId: uuid("portfolio_id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => dimUsers.userId),
    title: varchar("title", { length: 150 }).notNull(),
    description: text("description"),
    projectUrl: varchar("project_url", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// --- Mock Interview ---

export const mockInterviewSessions = pgTable("mock_interview_sessions", {
    sessionId: uuid("session_id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => dimUsers.userId),
    interviewType: varchar("interview_type", { length: 50 }), // 'behavioral', 'technical'
    score: integer("score"),
    feedback: text("feedback"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow(),
});

// --- Bookmarks ---

// ... existing bookmarks table ...
export const userBookmarks = pgTable("user_bookmarks", {
    bookmarkId: uuid("bookmark_id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => dimUsers.userId),
    entityType: varchar("entity_type", { length: 50 }).notNull(), // 'career', 'internship', 'job', 'mentor'
    entityId: uuid("entity_id").notNull(), // Generic UUID, application logic must enforce relation
    createdAt: timestamp("created_at").defaultNow(),
});

// --- Notifications ---
export const notifications = pgTable("notifications", {
    notificationId: uuid("notification_id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => dimUsers.userId),
    title: varchar("title", { length: 150 }).notNull(),
    message: text("message").notNull(),
    type: varchar("type", { length: 50 }).notNull(), // 'system', 'application', 'mentorship'
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});

// --- Assessment Results ---
export const userAssessmentResults = pgTable("user_assessment_results", {
    resultId: uuid("result_id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => dimUsers.userId),
    assessmentType: varchar("assessment_type", { length: 50 }).default('career_interest'),
    scores: text("scores"), // JSON
    recommendedCareers: text("recommended_careers"), // JSON
    createdAt: timestamp("created_at").defaultNow(),
});
