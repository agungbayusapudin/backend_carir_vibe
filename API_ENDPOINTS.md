# API Endpoints Documentation

Base URL: `http://localhost:8000/api/v1`

## Common Headers
Most endpoints require authentication.
- `Content-Type`: `application/json`
- `Authorization`: `Bearer <your_access_token>`

---

## 🔐 Auth (`/auth`)

### Register
**POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "fullName": "John Doe",
    "role": "student" // Optional: "student", "mentor", "employer", "admin"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "userId": "uuid",
        "email": "user@example.com",
        "fullName": "John Doe",
        "currentLevel": 1,
        "totalXp": 0,
        "role": "student"
      },
      "tokens": {
        "accessToken": "jwt_string",
        "refreshToken": "jwt_string"
      }
    }
  }
  ```

### Login
**POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response:** (Same as Register, includes `role`)

### Refresh Token
**POST** `/auth/token/refresh`
- **Body:**
  ```json
  {
    "refreshToken": "your_refresh_token"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "new_jwt_string",
      "refreshToken": "new_jwt_string"
    }
  }
  ```

### Google OAuth
**GET** `/auth/google`
- Initiates Google OAuth flow.

**GET** `/auth/google/callback`
- Callback URL for Google OAuth. Returns user data and tokens in JSON.

### Logout
**POST** `/auth/logout`
- **Headers:** `Authorization` required
- **Response:**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## 📚 Modules (`/modules`)

### Get All Modules
**GET** `/modules`
- **Headers:** `Authorization` required
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "moduleId": "uuid",
        "moduleName": "Module Name",
        "description": "Description",
        "hrPartnerName": "HR Name",
        "totalChallenges": 10,
        "isCompleted": false,
        "userProgress": 50 // Percentage
      }
    ]
  }
  ```

### Get Module Detail
**GET** `/modules/:moduleId`
- **Headers:** `Authorization` required
- **Params:** `moduleId`
- **Response:** Returns full module details.

### Create Module (Mentor/Admin Only)
**POST** `/modules`
- **Headers:** `Authorization` required
- **Body:**
  ```json
  {
    "moduleName": "New Module",
    "description": "Description",
    "hrPartnerName": "HR Name",
    "hrPartnerCompany": "Company Name",
    "moduleOrder": 1
  }
  ```
- **Response:** Created module object.

### Update Module (Mentor/Admin Only)
**PUT** `/modules/:moduleId`
- **Headers:** `Authorization` required
- **Body:** Fields from Create Module (optional)

### Delete Module (Mentor/Admin Only)
**DELETE** `/modules/:moduleId`
- **Headers:** `Authorization` required

---

## 🎯 Challenges (`/challenges`)

### Get Challenges by Module
**GET** `/challenges/module/:moduleId`
- **Headers:** `Authorization` required
- **Response:** List of challenges for the module.

### Get Challenge Detail
**GET** `/challenges/:challengeId`
- **Headers:** `Authorization` required
- **Response:** Challenge details including options.

### Create Challenge (Mentor/Admin Only)
**POST** `/challenges`
- **Headers:** `Authorization` required
- **Body:**
  ```json
  {
    "moduleId": "uuid",
    "challengeQuestion": "Question text",
    "hrBotDialog": "Bot dialog text",
    "challengeType": "multiple_choice",
    "options": [
      {
        "optionText": "Option A",
        "isCorrect": true,
        "feedbackText": "Correct!",
        "xpReward": 10
      }
    ]
  }
  ```

### Update Challenge (Mentor/Admin Only)
**PUT** `/challenges/:challengeId`
- **Headers:** `Authorization` required
- **Body:** Fields from Create Challenge (optional)

### Delete Challenge (Mentor/Admin Only)
**DELETE** `/challenges/:challengeId`
- **Headers:** `Authorization` required

### Get Analytics (Mentor/Admin Only)
**GET** `/challenges/analytics/:moduleId`
- **Headers:** `Authorization` required

---

## 🚀 User Progress (`/progress`)

### Start Session (Student Only)
**POST** `/progress/session/start`
- **Headers:** `Authorization` required
- **Body:**
  ```json
  {
    "moduleId": "uuid"
  }
  ```
- **Response:** Returns session ID used for submitting answers.

### Submit Answer (Student Only)
**POST** `/progress/session/submit`
- **Headers:** `Authorization` required
- **Body:**
  ```json
  {
    "sessionId": "uuid",
    "challengeId": "uuid",
    "selectedOptionId": "uuid"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "isCorrect": true,
      "feedbackText": "Feedback",
      "xpGained": 10,
      "nextChallenge": { ... } // Null if module finished
    }
  }
  ```

### Finish Session (Student Only)
**POST** `/progress/session/finish`
- **Headers:** `Authorization` required
- **Body:**
  ```json
  {
    "sessionId": "uuid"
  }
  ```

### Get User History
**GET** `/progress/history`
- **Headers:** `Authorization` required

### Get Dashboard
**GET** `/progress/dashboard`
- **Headers:** `Authorization` required
- **Response:** User stats, recent activity, level info.

### Get Leaderboard
**GET** `/progress/leaderboard`
- **Headers:** None required (Public)
- **Response:** List of top users.

### Get Session AI Review (NEW)
**GET** `/progress/session/:sessionId/review`
- **Headers:** `Authorization` required
- **Description:** Get AI-generated feedback and tips for interview answers in a session.
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "sessionId": "session_xxx",
      "totalAnswered": 3,
      "reviews": [
        {
          "question": "Kenapa kami harus memilihmu?",
          "userAnswer": "Saya butuh pekerjaan",
          "isCorrect": false,
          "review": {
            "yangHarusDilakukan": [
              "Riset job description dengan detail",
              "Match skill-mu dengan kebutuhan mereka",
              "Berikan bukti konkret (project, achievement)"
            ],
            "yangHarusDihindari": [
              "Jawaban generik tanpa bukti",
              "Terkesan arogan atau merendahkan kandidat lain",
              "Fokus pada apa yang kamu dapat, bukan yang kamu beri"
            ],
            "contohJawabanBagus": "Berdasarkan job desc, kalian butuh seseorang yang kuat di React dan punya pengalaman e-commerce. Saya punya keduanya..."
          }
        }
      ]
    }
  }
  ```

---

## 👥 Users (`/users`)

### Get All Users (Admin Only)
**GET** `/users`
- **Headers:** `Authorization` required

### Get User Profile
**GET** `/users/:userId`
- **Headers:** `Authorization` required
- **Response:** User profile details.

### Update User (Admin Only)
**PUT** `/users/:userId`
- **Headers:** `Authorization` required
- **Body:**
  ```json
  {
    "fullName": "New Name",
    "email": "new@email.com"
  }
  ```

### Deactivate User (Admin Only)
**DELETE** `/users/:userId`
- **Headers:** `Authorization` required

### System Health
**GET** `/users/system/health`
- **Headers:** None required

### Reset XP (Admin Only)
**POST** `/users/system/reset-xp`
- **Headers:** `Authorization` required
- **Body:**
  ```json
  {
    "userIds": ["uuid1", "uuid2"], // Optional
    "resetAll": true // Optional
  }
  ```

---

## 👤 Profile (`/profile`)

### Get Resume
**GET** `/profile/resume`
- **Headers:** `Authorization` required
- **Response:**
  ```json
  {
    "summary": "User summary",
    "skills": ["JavaScript", "React"],
    "experience": "...",
    "education": "..."
  }
  ```

### Upload Resume / Extract from CV
**POST** `/profile/resume/upload`
- **Headers:** `Authorization` required, `Content-Type: multipart/form-data`
- **Body:** Form-data with key `resume` (File: .pdf, .docx)
- **Response:** Extracted data from CV (same structure as Get Resume).

### Update Resume
**PUT** `/profile/resume`
- **Headers:** `Authorization` required
- **Body:**
  ```json
  {
    "summary": "Updated summary",
    "skills": ["Skill1", "Skill2"],
    "experience": "...",
    "education": "..."
  }
  ```

### Get Portfolios
**GET** `/profile/portfolio`
- **Headers:** `Authorization` required
- **Response:** List of user portfolios.

### Add Portfolio
**POST** `/profile/portfolio`
- **Headers:** `Authorization` required
- **Body:**
  ```json
  {
    "title": "Project Title",
    "description": "Project Description",
    "link": "http://example.com"
  }
  ```

### Delete Portfolio
**DELETE** `/profile/portfolio/:portfolioId`
- **Headers:** `Authorization` required

---

## 💼 Career (`/career`)

### Get All Careers
**GET** `/career`
- **Headers:** `Authorization` required
- **Response:** List of available career paths.

### Get Career Detail
**GET** `/career/:careerId`
- **Headers:** `Authorization` required

### Submit Assessment
**POST** `/career/assessment`
- **Headers:** `Authorization` required
- **Body:**
  ```json
  {
    "answers": [
      { "questionId": "q1", "answerValue": 5 },
      { "questionId": "q2", "answerValue": 4 }
    ]
  }
  ```

### Get AI Recommendations
**GET** `/career/recommendations/ai`
- **Headers:** `Authorization` required
- **Response:** Returns list of real-world job listings (LinkedIn) based on user profile skills.
  ```json
  [
    {
      "position": "Software Engineer",
      "company": "Tech Corp",
      "companyLogo": "https://example.com/logo.png",
      "location": "Jakarta, Indonesia",
      "date": "2024-12-16",
      "agoTime": "2 days ago",
      "salary": "IDR 15,000,000",
      "jobUrl": "https://linkedin.com/jobs/view/...",
      "matchedKeyword": "Software Engineer"
    }
  ]
  ```

### Get Skill Gap Analysis
**GET** `/career/:careerId/skill-gap`
- **Headers:** `Authorization` required
- **Response:**
  ```json
  {
    "careerTitle": "Frontend Developer",
    "missingSkills": ["Vue.js"],
    "acquiredSkills": ["React", "CSS"],
    "matchPercentage": 80
  }
  ```

### Get Market Insights
**GET** `/career/:careerId/market-insights`
- **Headers:** `Authorization` required
- **Response:**
  ```json
  {
    "careerTitle": "Frontend Developer",
    "averageSalary": 8000,
    "salaryRange": { "min": 5000, "max": 12000 },
    "trend": "High Demand"
  }
  ```
