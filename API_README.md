# 📚 API Documentation - Quick Reference

## 🗂️ Documentation Files by Role

### For Frontend Developers:

1. **`API_STUDENT.md`** - Student/User Endpoints
   - Interview Academy (modules, challenges, quiz)
   - Progress tracking & AI Review
   - Profile & Resume management
   - Job recommendations

2. **`API_ADMIN.md`** - Admin Endpoints
   - Content management (modules, challenges)
   - User management
   - Analytics & reports
   - Platform configuration

3. **`API_MENTOR.md`** - Mentor Endpoints
   - Mentorship requests
   - Mentee management
   - Progress monitoring
   - Personalized feedback

4. **`API_ENDPOINTS.md`** - Complete Reference
   - All endpoints consolidated
   - Technical details
   - Request/response examples

---

## 🔑 Role-Based Access Control

| Feature | Student | Mentor | Admin |
|---------|---------|--------|-------|
| Take Quiz | ✅ | ❌ | ❌ |
| Upload Resume | ✅ | ❌ | ❌ |
| Get Job Recommendations | ✅ | ❌ | ❌ |
| View AI Review | ✅ | ✅* | ✅ |
| Manage Mentees | ❌ | ✅ | ✅ |
| Provide Feedback | ❌ | ✅ | ✅ |
| Create Modules | ❌ | ❌ | ✅ |
| Create Challenges | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| View Analytics | Own only | Mentees only | All |

*Mentors can view their mentees' AI reviews

---

## 🚀 Quick Start Guide

### 1. **Student** wants to practice interviews:
```
Read: API_STUDENT.md
Flow: Login → Get modules → Start session → Submit answers → View AI review
```

### 2. **Mentor** wants to help students:
```
Read: API_MENTOR.md
Flow: Login → View requests → Accept mentee → Monitor progress → Provide feedback
```

### 3. **Admin** wants to manage platform:
```
Read: API_ADMIN.md
Flow: Login → Create modules → Add challenges → Monitor analytics → Manage users
```

---

## 📡 Base URLs

- **Local:** `http://localhost:3000/api/v1`
- **Production:** TBD

---

## 🔐 Authentication

All roles use the same authentication endpoints:

```http
POST /auth/login
POST /auth/register
POST /auth/logout
GET /auth/google
```

**Token Usage:**
```http
Authorization: Bearer {accessToken}
```

---

## 🎯 Key Features by Role

### Student
- ✅ AI-powered interview practice
- ✅ Real-time feedback
- ✅ XP & leveling system
- ✅ Job recommendations (LinkedIn)
- ✅ Resume parsing & storage

### Mentor
- ✅ Mentee management
- ✅ Progress tracking
- ✅ Session review
- ✅ Personalized feedback
- ✅ Career guidance

### Admin
- ✅ Content management
- ✅ User management
- ✅ Platform analytics
- ✅ Challenge creation
- ✅ Configuration

---

## 📞 Support

For questions about specific endpoints, refer to the role-specific documentation:
- Students → `API_STUDENT.md`
- Mentors → `API_MENTOR.md`
- Admins → `API_ADMIN.md`
- Complete reference → `API_ENDPOINTS.md`
