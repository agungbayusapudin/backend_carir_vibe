# 🎓 Student API Endpoints

Base URL: `http://localhost:3000/api/v1`

**Role:** `student` (default user)

---

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}

Response: { tokens: { accessToken, refreshToken } }
```

### Google OAuth
```http
GET /auth/google
GET /auth/google/callback
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

---

## 📚 Interview Academy

### Get All Modules
```http
GET /modules
Authorization: Bearer {token}

Response: List of available modules with progress
```

### Get Module Detail
```http
GET /modules/{moduleId}
Authorization: Bearer {token}

Response: Module details with reviewMaterial
```

---

## 🎯 Challenges (Quiz)

### Get Challenges by Module
```http
GET /challenges/module/{moduleId}
Authorization: Bearer {token}

Response: List of challenges for the module
```

### Get Challenge Detail
```http
GET /challenges/{challengeId}
Authorization: Bearer {token}

Response: { challengeQuestion, hrBotDialog, options[...] }
```

---

## 🚀 Progress & Sessions

### Start Quiz Session
```http
POST /progress/session/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "moduleId": "mod_int_01"
}

Response: { sessionId, currentChallenge }
```

### Submit Answer
```http
POST /progress/session/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "sessionId": "session_xxx",
  "challengeId": "ch_xxx",
  "selectedOptionId": "opt_xxx"
}

Response: { isCorrect, feedbackText, xpGained, starsGained, nextChallenge }
```

### Finish Session
```http
POST /progress/session/finish
Authorization: Bearer {token}
Content-Type: application/json

{
  "sessionId": "session_xxx"
}

Response: { totalXp, totalStars, correctAnswers, totalQuestions, newLevel, leveledUp }
```

### Get AI Review (NEW)
```http
GET /progress/session/{sessionId}/review
Authorization: Bearer {token}

Response: {
  sessionId,
  totalAnswered,
  reviews: [{
    question,
    userAnswer,
    isCorrect,
    review: {
      yangHarusDilakukan: [...],
      yangHarusDihindari: [...],
      contohJawabanBagus: "..."
    }
  }]
}
```

### Get User History
```http
GET /progress/history
Authorization: Bearer {token}

Response: List of user's challenge attempts
```

### Get Dashboard
```http
GET /progress/dashboard
Authorization: Bearer {token}

Response: Stats, level, XP, recent activity
```

### Get Leaderboard
```http
GET /progress/leaderboard

Response: Top users by XP (Public endpoint)
```

---

## 👤 Profile & Resume

### Get Resume
```http
GET /profile/resume
Authorization: Bearer {token}

Response: { summary, skills[], experience, education }
```

### Upload Resume (AI Extract)
```http
POST /profile/resume/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body: resume = file.pdf/docx

Response: Extracted data (AI-powered)
```

### Update Resume
```http
PUT /profile/resume
Authorization: Bearer {token}
Content-Type: application/json

{
  "summary": "...",
  "skills": ["JavaScript", "React"],
  "experience": "...",
  "education": "..."
}
```

### Get Portfolios
```http
GET /profile/portfolio
Authorization: Bearer {token}

Response: List of portfolios
```

### Add Portfolio
```http
POST /profile/portfolio
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Project Name",
  "description": "...",
  "projectUrl": "https://..."
}
```

### Update Portfolio
```http
PUT /profile/portfolio/{portfolioId}
Authorization: Bearer {token}
```

### Delete Portfolio
```http
DELETE /profile/portfolio/{portfolioId}
Authorization: Bearer {token}
```

---

## 💼 Career & Job Recommendations

### Get Career Paths
```http
GET /career
Authorization: Bearer {token}

Response: List of career options
```

### Get Career Detail
```http
GET /career/{careerId}
Authorization: Bearer {token}
```

### Submit Career Assessment
```http
POST /career/assessment
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": [
    { "questionId": "q1", "answerValue": 5 }
  ]
}
```

### Get AI Job Recommendations (LinkedIn)
```http
GET /career/recommendations/ai
Authorization: Bearer {token}

Response: [
  {
    "position": "Software Engineer",
    "company": "Gojek",
    "location": "Jakarta, Indonesia",
    "salary": "IDR 15,000,000",
    "jobUrl": "https://linkedin.com/...",
    "matchedKeyword": "React Developer"
  }
]
```

---

## 🤝 Mentorship (Student)

### List Mentors (Directory)
```http
GET /mentorship/directory
Authorization: Bearer {token}
Query Params: ?industry=IT&expertise=Backend

Response: List of available mentors
```

### Get Mentor Profile
```http
GET /mentorship/profile/{mentorId}
Authorization: Bearer {token}

Response: Mentor details
```

### Request Mentorship
```http
POST /mentorship/request
Authorization: Bearer {token}
Content-Type: application/json

{
  "mentorId": "uuid-mentor-id",
  "message": "I would like to..."
}
```

### Get My Mentors
```http
GET /mentorship/my-mentors
Authorization: Bearer {token}

Response: List of accepted mentors
```

---

## 👥 User Profile

### Get Own Profile
```http
GET /users/{userId}
Authorization: Bearer {token}

Response: User details (own profile only)
```

### Update Own Profile
```http
PUT /users/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "New Name",
  "profilePicture": "url"
}
```

---

## 📝 Notes for Frontend:

- **All endpoints require `Authorization: Bearer {token}`** except:
  - Auth endpoints (login, register, google)
  - Leaderboard (public)

- **Student CANNOT access:**
  - Module/Challenge creation/editing
  - User management (other users)
  - Admin analytics
  - Mentor-specific features

- **Flow Example:**
  1. Login → Get modules → Select module
  2. Start session → Get challenges → Submit answers
  3. Finish session → View AI Review
  4. Upload resume → Get job recommendations
