
-- Mentor Availability & Details
ALTER TABLE "dim_mentors" ADD COLUMN IF NOT EXISTS "availability" TEXT; -- Storing JSON string or simple text description
ALTER TABLE "dim_mentors" ADD COLUMN IF NOT EXISTS "rating" DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE "dim_mentors" ADD COLUMN IF NOT EXISTS "review_count" INTEGER DEFAULT 0;

-- Notifications
CREATE TABLE IF NOT EXISTS "notifications" (
    "notification_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL REFERENCES "dim_users"("user_id"),
    "title" varchar(150) NOT NULL,
    "message" text NOT NULL,
    "type" varchar(50) NOT NULL, -- 'system', 'application', 'mentorship'
    "is_read" boolean DEFAULT false,
    "created_at" timestamp DEFAULT now()
);

-- Assessment Results (If not exists)
CREATE TABLE IF NOT EXISTS "user_assessment_results" (
    "result_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL REFERENCES "dim_users"("user_id"),
    "assessment_type" varchar(50) DEFAULT 'career_interest',
    "scores" text, -- JSON string of scores
    "recommended_careers" text, -- JSON string of career IDs
    "created_at" timestamp DEFAULT now()
);

-- Admin Logs (Optional but good for moderation)
CREATE TABLE IF NOT EXISTS "admin_logs" (
    "log_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "admin_id" uuid NOT NULL REFERENCES "dim_users"("user_id"),
    "action" varchar(100) NOT NULL,
    "target_id" uuid,
    "details" text,
    "created_at" timestamp DEFAULT now()
);
