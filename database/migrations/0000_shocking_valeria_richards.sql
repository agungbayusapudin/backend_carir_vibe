CREATE TABLE "challenge_options" (
	"option_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" uuid NOT NULL,
	"option_text" text NOT NULL,
	"is_correct" boolean DEFAULT false,
	"feedback_text" text,
	"xp_reward" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dim_careers" (
	"career_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text,
	"average_salary" numeric(12, 2),
	"market_trend" varchar(50),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dim_challenges" (
	"challenge_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" varchar(50) NOT NULL,
	"challenge_question" text NOT NULL,
	"hr_bot_dialog" text,
	"challenge_type" varchar(20) NOT NULL,
	"expected_answer_id" uuid,
	"xp_reward" integer DEFAULT 100,
	"is_active" boolean DEFAULT true,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dim_companies" (
	"company_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employer_user_id" uuid,
	"company_name" varchar(150) NOT NULL,
	"description" text,
	"industry" varchar(100),
	"website" varchar(255),
	"location" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dim_dates" (
	"date_id" integer PRIMARY KEY NOT NULL,
	"full_date" timestamp NOT NULL,
	"day_name" varchar(10),
	"month_name" varchar(10),
	"year" integer,
	CONSTRAINT "dim_dates_full_date_unique" UNIQUE("full_date")
);
--> statement-breakpoint
CREATE TABLE "dim_mentors" (
	"mentor_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"expertise" text,
	"bio" text,
	"years_of_experience" integer,
	"linkedin_url" varchar(255),
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dim_modules" (
	"module_id" varchar(50) PRIMARY KEY NOT NULL,
	"module_name" varchar(100) NOT NULL,
	"description" text,
	"review_material" text,
	"hr_partner_name" varchar(100),
	"hr_partner_company" varchar(100),
	"module_order" integer,
	"total_challenges" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dim_portfolios" (
	"portfolio_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(150) NOT NULL,
	"description" text,
	"project_url" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dim_postings" (
	"posting_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"title" varchar(150) NOT NULL,
	"type" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"requirements" text,
	"location" varchar(100),
	"work_mode" varchar(50),
	"stipend" varchar(100),
	"status" varchar(50) DEFAULT 'active',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dim_resumes" (
	"resume_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"summary" text,
	"education" text,
	"experience" text,
	"skills" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dim_roles" (
	"role_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_name" varchar(50) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "dim_roles_role_name_unique" UNIQUE("role_name")
);
--> statement-breakpoint
CREATE TABLE "dim_skills" (
	"skill_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "dim_skills_skill_name_unique" UNIQUE("skill_name")
);
--> statement-breakpoint
CREATE TABLE "dim_users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid,
	"full_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"google_id" varchar(255),
	"profile_picture" text,
	"current_level" integer DEFAULT 1,
	"total_xp" integer DEFAULT 0,
	"progress_percentage" numeric(5, 2) DEFAULT '0.00',
	"is_active" boolean DEFAULT true,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_login_at" timestamp,
	CONSTRAINT "dim_users_email_unique" UNIQUE("email"),
	CONSTRAINT "dim_users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"application_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"posting_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"resume_url" text,
	"cover_letter" text,
	"status" varchar(50) DEFAULT 'submitted',
	"applied_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "map_career_skills" (
	"career_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"importance_level" integer,
	CONSTRAINT "map_career_skills_career_id_skill_id_pk" PRIMARY KEY("career_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "mentorship_requests" (
	"request_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mentor_id" uuid NOT NULL,
	"mentee_id" uuid NOT NULL,
	"message" text,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mock_interview_sessions" (
	"session_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"interview_type" varchar(50),
	"score" integer,
	"feedback" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_bookmarks" (
	"bookmark_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_career_interests" (
	"user_id" uuid NOT NULL,
	"career_id" uuid NOT NULL,
	"interest_level" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_career_interests_user_id_career_id_pk" PRIMARY KEY("user_id","career_id")
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"fact_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"module_id" varchar(50) NOT NULL,
	"challenge_id" uuid NOT NULL,
	"date_id" integer NOT NULL,
	"role" varchar(20) NOT NULL,
	"xp_gained" integer NOT NULL,
	"stars_received" integer NOT NULL,
	"time_spent_seconds" integer,
	"user_selected_option_id" uuid,
	"is_correct_selection" boolean NOT NULL,
	"finished_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "challenge_options" ADD CONSTRAINT "challenge_options_challenge_id_dim_challenges_challenge_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."dim_challenges"("challenge_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dim_challenges" ADD CONSTRAINT "dim_challenges_module_id_dim_modules_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."dim_modules"("module_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dim_companies" ADD CONSTRAINT "dim_companies_employer_user_id_dim_users_user_id_fk" FOREIGN KEY ("employer_user_id") REFERENCES "public"."dim_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dim_mentors" ADD CONSTRAINT "dim_mentors_user_id_dim_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dim_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dim_portfolios" ADD CONSTRAINT "dim_portfolios_user_id_dim_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dim_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dim_postings" ADD CONSTRAINT "dim_postings_company_id_dim_companies_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."dim_companies"("company_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dim_resumes" ADD CONSTRAINT "dim_resumes_user_id_dim_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dim_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dim_users" ADD CONSTRAINT "dim_users_role_id_dim_roles_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."dim_roles"("role_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_posting_id_dim_postings_posting_id_fk" FOREIGN KEY ("posting_id") REFERENCES "public"."dim_postings"("posting_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_dim_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dim_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_career_skills" ADD CONSTRAINT "map_career_skills_career_id_dim_careers_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."dim_careers"("career_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_career_skills" ADD CONSTRAINT "map_career_skills_skill_id_dim_skills_skill_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."dim_skills"("skill_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_requests" ADD CONSTRAINT "mentorship_requests_mentor_id_dim_mentors_mentor_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."dim_mentors"("mentor_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_requests" ADD CONSTRAINT "mentorship_requests_mentee_id_dim_users_user_id_fk" FOREIGN KEY ("mentee_id") REFERENCES "public"."dim_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mock_interview_sessions" ADD CONSTRAINT "mock_interview_sessions_user_id_dim_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dim_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_user_id_dim_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dim_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career_interests" ADD CONSTRAINT "user_career_interests_user_id_dim_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dim_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career_interests" ADD CONSTRAINT "user_career_interests_career_id_dim_careers_career_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."dim_careers"("career_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_dim_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dim_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_module_id_dim_modules_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."dim_modules"("module_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_challenge_id_dim_challenges_challenge_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."dim_challenges"("challenge_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_date_id_dim_dates_date_id_fk" FOREIGN KEY ("date_id") REFERENCES "public"."dim_dates"("date_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_selected_option_id_challenge_options_option_id_fk" FOREIGN KEY ("user_selected_option_id") REFERENCES "public"."challenge_options"("option_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_progress_user" ON "user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_progress_module" ON "user_progress" USING btree ("module_id");