# Telkom Dashboard API - Node.js Backend

Backend API untuk Telkom Dashboard HSI menggunakan Node.js, Express, PostgreSQL (Supabase), dan Prisma ORM.

## 🚀 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Database Client**: postgres (node-postgres alternative)
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Queue**: Bull + Redis (untuk background jobs)
- **File Processing**: ExcelJS + Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

## 📁 Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # PostgreSQL connection (postgres library)
│   │   ├── index.js      # Main config
│   │   └── logger.js     # Winston logger setup
│   ├── controllers/      # Route controllers
│   │   └── authController.js
│   ├── middleware/       # Express middlewares
│   │   ├── auth.js       # JWT authentication
│   │   ├── errorHandler.js
│   │   └── validator.js  # Request validation
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   └── index.js
│   ├── services/         # Business logic (TODO)
│   ├── utils/            # Utilities
│   │   └── response.js   # Standard API responses
│   └── index.js          # App entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── tests/                # Unit & integration tests
├── logs/                 # Application logs
├── uploads/              # Uploaded files
├── .env                  # Environment variables
├── .gitignore
└── package.json
```

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

File `.env` sudah ada dengan konfigurasi Supabase:

```env
DATABASE_URL="postgresql://postgres:Magangits@db.cdengzwpmqsehwacbboi.supabase.co:5432/postgres"
PORT=5000
JWT_SECRET=telkom-dashboard-secret-key-2025
```

### 3. Setup Database dengan Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema ke database (development)
npx prisma db push

# Atau buat migration (production recommended)
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Server akan berjalan di: `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <accessToken>
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

## 🔐 Authentication

API menggunakan JWT Bearer Token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires: 24 jam (configurable di .env)

## 🗄️ Database Connection

Menggunakan **postgres** library (bukan Prisma Client) untuk query langsung:

```javascript
import sql from './config/database.js'

// Query example
const users = await sql`
  SELECT * FROM users WHERE email = ${email}
`

// Insert
const newUser = await sql`
  INSERT INTO users (name, email, password)
  VALUES (${name}, ${email}, ${hashedPassword})
  RETURNING *
`
```

## 📝 Migration dari Laravel

### Week 1 Progress (✅ Completed)
- [x] Setup project structure
- [x] Database connection (PostgreSQL Supabase)
- [x] Authentication (JWT)
- [x] Middleware (auth, error handler, validator)
- [x] Basic routes & controllers
- [x] Prisma schema setup

### Next Steps (Week 1-2)
- [ ] Migrate database tables dari Laravel migrations
- [ ] Implement Analysis Digital Product API
- [ ] Implement Dashboard API
- [ ] Setup Queue (Bull + Redis)
- [ ] File upload & Excel processing
- [ ] Testing

## 🧪 Testing

```bash
npm test
```

## 📦 Dependencies Installed

**Production:**
- express, cors, helmet, morgan, compression
- @prisma/client, postgres
- jsonwebtoken, bcryptjs
- express-validator
- multer, exceljs
- bull, ioredis
- winston
- express-rate-limit

**Development:**
- nodemon, prisma, jest

## 🚀 Deployment

TODO: Setup deployment ke Vercel/Railway/Render

## 📞 Support

Untuk pertanyaan, hubungi team development.
