# 👨‍💼 Admin API Endpoints

Base URL: `http://localhost:3000/api/v1`

**Role:** `admin`

---

## 🔐 Authentication (Same as Student)

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "adminpass"
}
```

---

## 📚 Module Management (CRUD)

### Get All Modules
```http
GET /modules
Authorization: Bearer {token}
```

### Get Module Detail
```http
GET /modules/{moduleId}
Authorization: Bearer {token}
```

### Create Module
```http
POST /modules
Authorization: Bearer {token}
Content-Type: application/json

{
  "moduleId": "mod_custom_01",
  "moduleName": "Advanced Negotiation",
  "description": "...",
  "reviewMaterial": "Article content...",
  "hrPartnerName": "John Doe",
  "hrPartnerCompany": "Google",
  "moduleOrder": 4
}
```

### Update Module
```http
PUT /modules/{moduleId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "moduleName": "Updated Name",
  "description": "...",
  "reviewMaterial": "..."
}
```

### Delete Module (Soft Delete)
```http
DELETE /modules/{moduleId}
Authorization: Bearer {token}
```

---

## 🎯 Challenge Management (CRUD)

### Get Challenges by Module
```http
GET /challenges/module/{moduleId}
Authorization: Bearer {token}
```

### Get Challenge Detail
```http
GET /challenges/{challengeId}
Authorization: Bearer {token}
```

### Create Challenge
```http
POST /challenges
Authorization: Bearer {token}
Content-Type: application/json

{
  "moduleId": "mod_int_01",
  "challengeQuestion": "What is your weakness?",
  "hrBotDialog": "Be honest but strategic",
  "challengeType": "multiple_choice",
  "xpReward": 100,
  "options": [
    {
      "optionText": "I'm a perfectionist",
      "isCorrect": false,
      "feedbackText": "Too cliche",
      "xpReward": 0
    },
    {
      "optionText": "I sometimes struggle with delegation but I'm improving",
      "isCorrect": true,
      "feedbackText": "Good, shows self-awareness!",
      "xpReward": 100
    }
  ]
}
```

### Update Challenge
```http
PUT /challenges/{challengeId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "challengeQuestion": "Updated question",
  "options": [...]
}
```

### Delete Challenge (Soft Delete)
```http
DELETE /challenges/{challengeId}
Authorization: Bearer {token}
```

### Get Challenge Analytics
```http
GET /challenges/analytics/{moduleId}
Authorization: Bearer {token}

Response: Stats on challenge performance (correct/incorrect attempts)
```

---

## 👥 User Management

### Get All Users
```http
GET /admin/users
Authorization: Bearer {token}

Response: List of all users with stats
```

### Get User Detail
```http
GET /users/{userId}
Authorization: Bearer {token}
```
*(Note: Uses standard user endpoint)*

### Change User Role
```http
PUT /admin/users/{userId}/role
Authorization: Bearer {token}
Content-Type: application/json

{
  "roleId": "uuid-for-mentor-role"
}
```

### Toggle User Status (Ban/Unban)
```http
PUT /admin/users/{userId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "isActive": false
}
```

---

## 📊 Analytics & Reports

### Get Dashboard Analytics
```http
GET /admin/stats
Authorization: Bearer {token}

Response: Overall platform stats (total users, completions, etc.)
```

---

## 💼 Career Management

### Get All Careers
```http
GET /career
Authorization: Bearer {token}
```
*(Public/Shared Endpoint)*

### Create Career Path
```http
POST /admin/careers
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Data Scientist",
  "description": "...",
  "averageSalary": 20000000,
  "marketTrend": "growing"
}
```

### Update Career
```http
PUT /admin/careers/{careerId}
Authorization: Bearer {token}
```

### Delete Career
```http
DELETE /admin/careers/{careerId}
Authorization: Bearer {token}
```

---

## 🛡️ Mentor Moderation

### Get Pending Mentors
```http
GET /admin/mentors/pending
Authorization: Bearer {token}

Response: List of unverified mentors
```

### Verify Mentor
```http
PUT /admin/mentors/{mentorId}/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "approved": true
}
```

---

## 📝 Admin Capabilities Summary

**Admins CAN:**
- ✅ Full CRUD on Modules
- ✅ Full CRUD on Challenges
- ✅ Full CRUD on Users
- ✅ View all analytics
- ✅ Manage career paths
- ✅ Access all student data

**Admins CANNOT:**
- ❌ Take challenges (no student functions)
- ❌ Mentor-specific features

---

## 🔒 Security Notes

- All admin endpoints check `role === 'admin'` via `RoleMiddleware`
- Unauthorized access returns `403 Forbidden`
- Admin accounts should be created manually or via special registration

---

## 📊 Typical Admin Workflows

### 1. Create New Module
```
POST /modules → Create module
POST /challenges → Add 5-6 challenges with options
GET /challenges/analytics/{moduleId} → Monitor performance
```

### 2. Monitor Users
```
GET /users → See all users
GET /users/{userId} → Check individual progress
GET /progress/leaderboard → See top performers
```

### 3. Content Management
```
GET /modules → List modules
PUT /modules/{id} → Update content
DELETE /challenges/{id} → Remove bad questions
```
