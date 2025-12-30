# 🚀 QUICK START GUIDE - Telkom Dashboard Node.js

## 📋 Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- PostgreSQL database (Supabase sudah configured)
- Redis (optional, untuk queue jobs)
- Git

## 🛠️ Installation Steps

### 1. Clone & Navigate

```bash
cd "Telkom Dashboard Nodejs"
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Push database schema ke Supabase
npx prisma db push

# Test connection
npm run dev
```

Backend will run on: **http://localhost:5000**

Test health check:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Telkom Dashboard API is running",
  "timestamp": "2025-12-24T..."
}
```

### 3. Frontend Setup

Open **NEW TERMINAL**, then:

```bash
cd client

# Install dependencies
npm install

# Run development server
npm start
```

Frontend will run on: **http://localhost:3000**

## ✅ Testing Authentication

### Option 1: Manual Test with Postman/Thunder Client

1. **Create User (Register)**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@telkom.com",
  "password": "password123",
  "role": "admin"
}
```

2. **Login**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@telkom.com",
  "password": "password123"
}
```

Copy the `accessToken` from response.

3. **Get Profile (Protected)**
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <paste-your-token-here>
```

### Option 2: Test via React App

1. Open browser: http://localhost:3000
2. You'll see login page
3. First create a user via Postman (Step 1 above)
4. Then login in the React app

## 📊 Database Management

### View Database in Prisma Studio

```bash
cd server
npm run prisma:studio
```

Opens GUI at: **http://localhost:5555**

### Create Migration (Production)

```bash
npm run prisma:migrate
# Enter migration name: e.g., "init"
```

### Pull Existing Schema from DB

```bash
npm run prisma:pull
```

## 🐛 Troubleshooting

### Backend won't start

1. Check if .env file exists in `server/` folder
2. Verify DATABASE_URL is correct
3. Test database connection:
```bash
cd server
npx prisma db pull
```

### Frontend won't start

1. Delete node_modules and reinstall:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

2. Check if backend is running first

### CORS Error

Make sure backend `.env` has:
```env
CORS_ORIGIN=http://localhost:3000
```

### Database Connection Error

Test Supabase connection:
```bash
psql "postgresql://postgres:Magangits@db.cdengzwpmqsehwacbboi.supabase.co:5432/postgres"
```

## 📁 Project Structure Overview

```
Telkom Dashboard Nodejs/
├── server/                    # Backend (Express + PostgreSQL)
│   ├── src/
│   │   ├── config/           # Database, logger, config
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth, validation, errors
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Helpers
│   │   └── index.js          # App entry
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   ├── .env                  # Environment variables
│   └── package.json
│
└── client/                    # Frontend (React)
    ├── src/
    │   ├── components/       # Reusable components
    │   ├── context/          # Auth context
    │   ├── pages/            # Login, Dashboard
    │   ├── services/         # API calls
    │   └── App.js
    ├── .env
    └── package.json
```

## 🔐 Default Credentials (After Creating User)

Create via Postman first, then:
- Email: test@telkom.com
- Password: password123

## 📝 Next Development Steps

Week 1 ✅ COMPLETED:
- [x] Backend structure with Express
- [x] PostgreSQL (Supabase) connection
- [x] Prisma ORM setup
- [x] JWT Authentication
- [x] React frontend with routing
- [x] Auth context & protected routes

Week 2 TODO:
- [ ] Migrate database tables from Laravel
- [ ] Analysis Digital Product API
- [ ] Dashboard statistics API
- [ ] Data import/export
- [ ] Queue jobs setup
- [ ] Excel processing

## 🚀 Development Commands

### Backend (Terminal 1)
```bash
cd server
npm run dev        # Development with nodemon
npm start          # Production
npm test           # Run tests
```

### Frontend (Terminal 2)
```bash
cd client
npm start          # Development
npm run build      # Production build
npm test           # Run tests
```

## 📞 Support

Jika ada masalah:
1. Check terminal untuk error messages
2. Check browser console (F12)
3. Check logs di `server/logs/`
4. Review README.md di folder server/ dan client/

---

**Status**: ✅ Week 1 Foundation Complete (Mon, Dec 24)

**Team**: 2 developers
- Person A: Backend (Node.js, PostgreSQL)
- Person B: Frontend (React)

**Next Meeting**: Setup Week 2 modules (Analysis & Dashboard)
