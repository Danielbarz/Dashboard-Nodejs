# 🧪 Test Endpoints - Telkom Dashboard API

## 🔧 Tools untuk Testing

**Pilih salah satu:**
1. **VS Code REST Client** (Recommended) - Install extension "REST Client"
2. **Postman** - Download dari postman.com
3. **Thunder Client** - VS Code extension
4. **curl** - Via terminal/command prompt

---

## 📝 Using REST Client (VS Code Extension)

**Install extension:** REST Client by Huachao Mao

Kemudian buka file ini di VS Code, klik "Send Request" di atas setiap request.

### 1️⃣ Health Check
```http
GET http://localhost:5000/api/health
```

### 2️⃣ Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin Telkom",
  "email": "admin@telkom.com",
  "password": "admin123",
  "role": "admin"
}
```

### 3️⃣ Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@telkom.com",
  "password": "admin123"
}
```

**Response akan berisi `accessToken` - Copy token tersebut!**

### 4️⃣ Get Profile (Protected)
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**⚠️ Ganti token di atas dengan token dari login!**

### 5️⃣ Get Digital Products (Protected)
```http
GET http://localhost:5000/api/analysis/digital-product?page=1&limit=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6️⃣ Get Digital Products Stats (Protected)
```http
GET http://localhost:5000/api/analysis/digital-product/stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7️⃣ Filter Digital Products by Witel
```http
GET http://localhost:5000/api/analysis/digital-product?witel=WITEL_JABAR&page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 8️⃣ Search Digital Products
```http
GET http://localhost:5000/api/analysis/digital-product?search=fiber&page=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 9️⃣ Export to Excel (Protected)
```http
GET http://localhost:5000/api/analysis/digital-product/export
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**File Excel akan otomatis ter-download**

---

## 💻 Using curl (Command Line)

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Admin Telkom\",\"email\":\"admin@telkom.com\",\"password\":\"admin123\",\"role\":\"admin\"}"
```

### 3. Login (Save Token)
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@telkom.com\",\"password\":\"admin123\"}"
```

**Copy `accessToken` dari response JSON!**

### 4. Get Profile (Ganti YOUR_TOKEN)
```bash
curl http://localhost:5000/api/auth/profile ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Get Digital Products
```bash
curl "http://localhost:5000/api/analysis/digital-product?page=1&limit=20" ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Download Excel Export
```bash
curl "http://localhost:5000/api/analysis/digital-product/export" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -o digital_products.xlsx
```

---

## 🎯 Test Flow (Step by Step)

### Step 1: Start Backend
```bash
cd "Telkom Dashboard Nodejs\server"
npm run dev
```

Tunggu sampai muncul:
```
🚀 Telkom Dashboard API running on port 5000
```

### Step 2: Push Database Schema
```bash
npx prisma db push
```

### Step 3: Test Health Check
Buka browser: `http://localhost:5000/api/health`

Atau di terminal:
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

### Step 4: Create User (Postman/REST Client)
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin Telkom",
  "email": "admin@telkom.com",
  "password": "admin123",
  "role": "admin"
}
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Admin Telkom",
    "email": "admin@telkom.com",
    "role": "admin",
    "created_at": "..."
  }
}
```

### Step 5: Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@telkom.com",
  "password": "admin123"
}
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin Telkom",
      "email": "admin@telkom.com",
      "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**📋 COPY accessToken ini untuk request selanjutnya!**

### Step 6: Test Protected Endpoint
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <paste-your-token>
```

Expected response:
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "Admin Telkom",
    "email": "admin@telkom.com",
    "role": "admin"
  }
}
```

### Step 7: Test Analysis Endpoint
```http
GET http://localhost:5000/api/analysis/digital-product?page=1&limit=20
Authorization: Bearer <paste-your-token>
```

Expected response (kosong jika belum ada data):
```json
{
  "success": true,
  "message": "Digital products fetched",
  "data": []
}
```

---

## 🐛 Common Errors

### ❌ Error: "No token provided"
**Solution:** Tambahkan header `Authorization: Bearer <token>`

### ❌ Error: "Invalid token"
**Solution:** Login ulang, copy token yang baru

### ❌ Error: "Token expired"
**Solution:** Gunakan refresh token endpoint atau login ulang

### ❌ Error: "ECONNREFUSED"
**Solution:** Backend belum jalan, run `npm run dev` dulu

### ❌ Error: "Database connection failed"
**Solution:** Check DATABASE_URL di `.env`

---

## 📊 Insert Sample Data (Optional)

Jika mau test dengan data, run SQL ini di Prisma Studio atau Supabase:

```sql
INSERT INTO digital_products (order_number, product_name, witel, branch, revenue, amount, status, created_at, updated_at)
VALUES 
  ('ORD001', 'Indihome Fiber 100Mbps', 'WITEL_JABAR', 'Bandung', 500000, 450000, 'complete', NOW(), NOW()),
  ('ORD002', 'Indihome Fiber 50Mbps', 'WITEL_JATIM', 'Surabaya', 350000, 320000, 'in-progress', NOW(), NOW()),
  ('ORD003', 'Indihome Fiber 20Mbps', 'WITEL_JABAR', 'Jakarta', 250000, 220000, 'complete', NOW(), NOW()),
  ('ORD004', 'Indihome TV', 'WITEL_JATENG', 'Semarang', 150000, 130000, 'in-progress', NOW(), NOW()),
  ('ORD005', 'Astinet 10Mbps', 'WITEL_JABAR', 'Bandung', 1500000, 1400000, 'complete', NOW(), NOW());
```

Atau via Prisma Studio:
```bash
npm run prisma:studio
```

Buka http://localhost:5555, pilih tabel `digital_products`, klik "Add record".

---

## 🎉 Success Indicators

✅ Health check returns 200
✅ User registration returns 201
✅ Login returns accessToken
✅ Profile endpoint returns user data
✅ Analysis endpoint returns data (or empty array)
✅ No errors in terminal logs

---

**Need help?** Check `server/logs/combined.log` untuk error details.
