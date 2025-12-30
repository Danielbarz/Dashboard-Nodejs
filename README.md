# Telkom Dashboard - Node.js Migration Project

![Status](https://img.shields.io/badge/Week%201-Completed-success)
![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20PostgreSQL-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%2019-61dafb)

Migrasi Dashboard Telkom HSI dari **Laravel 11** ke **Node.js + Express + PostgreSQL (Supabase)** + **React 19**.

## 📊 Project Overview

### Tech Stack

**Backend:**
- Node.js 20+ + Express.js
- PostgreSQL (Supabase)
- Prisma ORM + postgres library
- JWT Authentication
- Bull + Redis (Queue)
- ExcelJS (Import/Export)
- Winston (Logging)

**Frontend:**
- React 19
- React Router DOM v7
- Axios (HTTP Client)
- Tailwind CSS (styling)
- Recharts (charts/graphs)

## 🚀 Quick Start

**Lihat [QUICKSTART.md](./QUICKSTART.md) untuk panduan lengkap!**

Singkatnya:

```bash
# Backend
cd server
npm install
npm run prisma:generate
npx prisma db push
npm run dev

# Frontend (terminal baru)
cd client
npm install
npm start
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Prisma Studio: http://localhost:5555

## 📁 Project Structure

```
Telkom Dashboard Nodejs/
├── server/              # Backend API (Node.js + Express)
│   ├── src/
│   ├── prisma/
│   ├── .env
│   └── package.json
├── client/              # Frontend (React)
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
├── docker-compose.yml   # Redis untuk queue
├── QUICKSTART.md        # 📖 Setup guide
└── README.md            # 👈 You are here
```

## 📅 Migration Timeline (4 Weeks)

### ✅ Week 1: Foundation (COMPLETED - Dec 24)
- [x] Setup project structure
- [x] PostgreSQL Supabase connection
- [x] Prisma schema
- [x] JWT authentication
- [x] React routing & auth context
- [x] Protected routes

### 🔄 Week 2: Core Modules (In Progress)
- [ ] Migrate Laravel database tables
- [ ] Analysis Digital Product API
- [ ] Dashboard statistics
- [ ] Filters (witel, branch)
- [ ] React UI components

### 📦 Week 3: Advanced Features
- [ ] Excel import/export
- [ ] Queue processing (Bull + Redis)
- [ ] Document upload
- [ ] Job status tracking
- [ ] Error handling & validation

### 🚀 Week 4: Testing & Deployment
- [ ] Unit & integration tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Production deployment
- [ ] Documentation

## 🔐 Authentication

Backend menggunakan **JWT Bearer Token**:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Auto refresh token jika expired (handled di axios interceptor).

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
GET  /api/auth/profile (protected)
```

### TODO: Business Modules
```
GET  /api/analysis/digital-product
POST /api/analysis/digital-product/upload
GET  /api/dashboard/revenue
POST /api/import/document
...
```

## 🗄️ Database (Supabase PostgreSQL)

Connection string (di `.env`):
```env
DATABASE_URL="postgresql://postgres:Magangits@db.cdengzwpmqsehwacbboi.supabase.co:5432/postgres"
```

### Prisma Commands

```bash
npx prisma studio              # GUI database viewer
npx prisma db push             # Push schema changes
npx prisma db pull             # Pull schema from DB
npx prisma migrate dev         # Create migration
npx prisma generate            # Generate client
```

## 👥 Development Team

**Person A (Backend Lead):**
- Node.js architecture
- Database design (Prisma)
- API development
- Queue jobs
- DevOps

**Person B (Full Stack):**
- React components
- API integration
- UI/UX implementation
- Testing
- Frontend optimization

## 📝 Daily Standup (Recommended)

**9:00 AM (15 min):**
- Yesterday: Apa yang selesai?
- Today: Target apa?
- Blocker: Ada masalah?

**3:00 PM (Optional):**
- Demo progress
- Code review
- Adjust plan

## 🔧 Development Commands

### Backend
```bash
npm run dev              # Development server (nodemon)
npm start                # Production server
npm run prisma:studio    # Database GUI
npm test                 # Run tests
```

### Frontend
```bash
npm start                # Development server
npm run build            # Production build
npm test                 # Run tests
```

### Docker (Redis)
```bash
docker-compose up -d     # Start Redis
docker-compose down      # Stop Redis
```

## 🐛 Troubleshooting

Lihat [QUICKSTART.md](./QUICKSTART.md#-troubleshooting) untuk solusi umum.

Common issues:
- Database connection error → Check DATABASE_URL
- CORS error → Check CORS_ORIGIN in .env
- Token expired → Frontend auto-refresh via interceptor
- Module not found → npm install di folder yang benar

## 📚 Documentation

- [Backend README](./server/README.md)
- [Client README](./client/README.md)
- [Quick Start Guide](./QUICKSTART.md)

## 🎯 Next Steps

**Hari ini (Week 1 Complete):**
1. Test backend: `curl http://localhost:5000/api/health`
2. Test frontend: Open http://localhost:3000
3. Create user via Postman
4. Login via React app

**Besok (Week 2 Start):**
1. Analyze Laravel migrations
2. Design database schema untuk modules
3. Implement Analysis API
4. Build React table components

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check terminal output untuk errors
2. Check browser console (F12)
3. Review documentation di README files
4. Check logs: `server/logs/`

---

**Current Status**: ✅ Week 1 Foundation Complete

**Last Updated**: December 24, 2025

**Team**: 2 developers | **Timeline**: 4 weeks | **Progress**: 25% ✅
