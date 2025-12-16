# 👨‍🏫 Mentor API Endpoints

Base URL: `http://localhost:3000/api/v1`

**Role:** `mentor`

---

## 🔐 Authentication (Same as Student)

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "mentor@example.com",
  "password": "mentorpass"
}
```

---

## 👤 Mentor Profile Management

### Register as Mentor
```http
POST /mentorship/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "expertise": "Career Coaching",
  "bio": "...",
  "yearsOfExperience": 5,
  "linkedinUrl": "..."
}
```

---

## 📩 Mentorship Requests

### Get Incoming Requests
```http
GET /mentorship/requests
Authorization: Bearer {token}

Response: [
  {
    "requestId": "...",
    "menteeId": "...",
    "message": "...",
    "status": "pending"
  }
]
```

### Respond to Request
```http
PUT /mentorship/requests/{requestId}/respond
Authorization: Bearer {token}
Content-Type: application/json

{
  "action": "accept" 
}
// or "action": "reject"
```

---

## 📖 View Interview Academy Content (Read-Only)

### Get All Modules
```http
GET /modules
Authorization: Bearer {token}

Response: List of modules (read-only for mentors)
```

### Get Module Detail
```http
GET /modules/{moduleId}
Authorization: Bearer {token}
```

### Get Challenges (For Review Purposes)
```http
GET /challenges/module/{moduleId}
Authorization: Bearer {token}
```

---

## 📝 Mentor Capabilities Summary

**Mentors CAN:**
- ✅ View and manage mentorship requests
- ✅ Track mentee progress
- ✅ View mentee's interview answers
- ✅ Provide personalized feedback
- ✅ View all academy content (read-only)
- ✅ Suggest career paths

**Mentors CANNOT:**
- ❌ Create/Edit modules or challenges (admin only)
- ❌ Access other mentors' mentees
- ❌ Modify user XP/level directly
- ❌ Delete users

---

## 🔒 Security Notes

- Mentors can only access data of **their assigned mentees**
- Unauthorized access to other users returns `403 Forbidden`
- All mentor-specific endpoints require `role === 'mentor'`

---

## 📊 Typical Mentor Workflows

### 1. Accept New Mentee
```
GET /mentors/requests → View pending requests
POST /mentors/requests/{id}/accept → Accept
GET /mentors/mentees/{userId} → Review profile
```

### 2. Monitor Mentee Progress
```
GET /mentors/mentees → List my mentees
GET /mentors/mentees/{userId}/analytics → Check performance
GET /mentors/mentees/{userId}/sessions → Review recent attempts
```

### 3. Provide Feedback
```
GET /mentors/mentees/{userId}/sessions/{sessionId} → Review answers
POST /mentors/feedback → Add personalized feedback
```

### 4. Career Guidance
```
GET /mentors/mentees/{userId}/resume → Check skills
POST /mentors/mentees/{userId}/career/suggest → Suggest paths
```

---

## 💡 Integration with AI Review

Mentors can see **both**:
1. **AI-generated review** (automatic, instant)
2. **Add their own human feedback** (personalized, contextual)

This provides a **hybrid approach** for maximum learning value.
