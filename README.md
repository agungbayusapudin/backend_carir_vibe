# Gamifikasi Wawancara API

API untuk platform gamifikasi wawancara kerja dengan Google OAuth authentication.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Jalankan migration untuk menambahkan kolom Google OAuth:
```bash
psql -d your_database < database/migrations/001_add_google_oauth.sql
```

### 3. Environment Variables
Copy `.env.example` ke `.env` dan isi dengan kredensial Anda:
```
DATABASE_URL=your-postgresql-url
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback
JWT_SECRET=your-jwt-secret
```

### 4. Google OAuth Setup
1. Buka Google Cloud Console
2. Buat project baru atau pilih existing project
3. Enable Google+ API
4. Buat OAuth 2.0 credentials
5. Set authorized redirect URIs: `http://localhost:8000/api/auth/google/callback`
6. Copy Client ID dan Client Secret ke `.env`

### 5. Run Server
```bash
npm run dev
```

## API Endpoints

### Authentication

**GET** `/api/auth/google`
- Redirect ke Google OAuth login

**GET** `/api/auth/google/callback`
- Callback URL setelah Google authentication
- Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "uuid",
      "email": "user@example.com",
      "fullName": "User Name",
      "profilePicture": "url",
      "currentLevel": 1,
      "totalXp": 0
    },
    "tokens": {
      "accessToken": "jwt-token"
    }
  }
}
```

**POST** `/api/auth/logout`
- Logout user

**GET** `/api/protected`
- Protected route example
- Requires: `Authorization: Bearer <token>` header

## Architecture

Proyek ini menggunakan **Dependency Injection** pattern dengan struktur:

```
src/
├── interface/           # Interface definitions
│   ├── IAuthRepository.ts
│   └── IAuthService.ts
├── dtos/               # Data Transfer Objects
│   └── auth.dto.ts
├── repositories/       # Data access layer
│   └── auth.repositories.ts
├── services/          # Business logic layer
│   └── auth.services.ts
├── controllers/       # HTTP request handlers
│   └── auth.controllers.ts
├── routers/          # Route definitions
│   └── auth.routers.ts
├── types/            # TypeScript type definitions
│   └── express.d.ts
└── container.ts      # Dependency injection container

config/
└── passport.config.ts  # Passport.js configuration

middleware/
└── auth.middleware.ts  # Authentication middleware

database/
├── schema.ts          # Drizzle ORM schema
├── db.ts             # Database connection
└── migrations/       # SQL migrations
```

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Authentication:** Passport.js + Google OAuth 2.0
- **JWT:** jsonwebtoken
- **Dependency Injection:** Custom Container pattern
