
-- Career Discovery & Assessment
CREATE TABLE IF NOT EXISTS dim_careers (
    career_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    average_salary DECIMAL(12, 2),
    market_trend VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dim_skills (
    skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS map_career_skills (
    career_id UUID NOT NULL REFERENCES dim_careers(career_id),
    skill_id UUID NOT NULL REFERENCES dim_skills(skill_id),
    importance_level INTEGER,
    PRIMARY KEY (career_id, skill_id)
);

CREATE TABLE IF NOT EXISTS user_career_interests (
    user_id UUID NOT NULL REFERENCES dim_users(user_id),
    career_id UUID NOT NULL REFERENCES dim_careers(career_id),
    interest_level INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, career_id)
);

-- Internship & Job Market
CREATE TABLE IF NOT EXISTS dim_companies (
    company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_user_id UUID REFERENCES dim_users(user_id),
    company_name VARCHAR(150) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dim_postings (
    posting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES dim_companies(company_id),
    title VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location VARCHAR(100),
    work_mode VARCHAR(50),
    stipend VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_applications (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    posting_id UUID NOT NULL REFERENCES dim_postings(posting_id),
    user_id UUID NOT NULL REFERENCES dim_users(user_id),
    resume_url TEXT,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'submitted',
    applied_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Mentorship
CREATE TABLE IF NOT EXISTS dim_mentors (
    mentor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES dim_users(user_id),
    expertise TEXT,
    bio TEXT,
    years_of_experience INTEGER,
    linkedin_url VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentorship_requests (
    request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES dim_mentors(mentor_id),
    mentee_id UUID NOT NULL REFERENCES dim_users(user_id),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Resume & Portfolio
CREATE TABLE IF NOT EXISTS dim_resumes (
    resume_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES dim_users(user_id),
    summary TEXT,
    education TEXT,
    experience TEXT,
    skills TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dim_portfolios (
    portfolio_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES dim_users(user_id),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    project_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Mock Interview
CREATE TABLE IF NOT EXISTS mock_interview_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES dim_users(user_id),
    interview_type VARCHAR(50),
    score INTEGER,
    feedback TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS user_bookmarks (
    bookmark_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES dim_users(user_id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
