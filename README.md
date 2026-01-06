#  Telkom Dashboard - Full Stack Application

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20PostgreSQL-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%2019-61dafb)
![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-336791)

Telkom Dashboard adalah aplikasi full-stack untuk mengelola dan menganalisis data HSI (High Speed Internet), DATIN, Tambahan, dan JT untuk Telkom Indonesia.

**Migrasi dari:** Laravel 11 → **Node.js + Express + PostgreSQL (Supabase) + React 19**

---

## 🎯 Project Context (For Gemini AI)

### 🔍 Quick Understanding
- **Purpose:** Data management & reporting system untuk Telkom regional data
- **Main Tables:** `hsi_data`, `datin_data`, `data_tambahan`, `spmk_mom`, `sos_data`, `users`
- **Key Feature:** File upload (Excel/CSV) dengan batch processing & validation
- **Frontend:** React SPA dengan real-time data updates
- **Backend:** Express.js REST API dengan JWT auth

### 📌 Current Issues & Context
1. **HSI Data Upload System** - Fully working with 8 type conversions for numeric→string
2. **Recent Fixes:**
   - Added `GET /api/hsi` endpoint untuk fetch semua HSI data
   - Fixed table update issue dengan proper endpoint & response handling
   - Fixed upload success notification dengan console logging
   - Added delete functionality dengan confirmation dialog

3. **Important Files:**
   - **Backend Core:**
     - `server/src/controllers/fileController.js` - Upload handler (711 lines)
     - `server/src/controllers/hsiController.js` - HSI operations
     - `server/src/controllers/dashboardController.js` - Report & dashboard data
   - **Frontend Core:**
     - `client/src/pages/HSI.js` - HSI dashboard page (491 lines)
     - `client/src/components/FileUploadForm.js` - Upload component (278 lines)
     - `client/src/pages/ReportsHSI.js` - Report page

### ⚡ Key Technical Decisions
- **Batch Processing:** 100 rows per batch untuk efficiency
- **Type System:** All HSI fields stored as STRING di database
- **Pagination:** Default 1000 rows, customizable via query params
- **Authentication:** JWT tokens dengan 24h expiry
- **File Upload:** Multer + ExcelJS untuk Excel parsing

---

## 📚 Database Schema

### Main Tables

#### 1. `hsi_data` - HSI Records (Primary Table)
```sql
Table: hsi_data
Columns (50+):
  - orderId (STRING, UNIQUE)
  - customerName, nomorLayanan, ncli (STRING)
  - typeLayanan, gpsLongitude, gpsLatitude (STRING)
  - regional, regionalOld, kelompok_status (STRING)
  - isiComment, pots, witel (STRING)
  - upload (DECIMAL)
  - orderDate (DATETIME)
  - [... 30+ more fields ...]

Usage:
  - Main table untuk HSI data
  - Queried by: witel, kelompok_status, orderId, orderDate
  - Indexes on: orderId (unique), witel, kelompok_status
  - Batch insert: 100 rows per batch
  - Delete: By orderId (deleteMany)
```

#### 2. `data_tambahan` - Additional Data
```sql
Similar to hsi_data dengan fields yang berbeda
Usage: Upload & reporting untuk data tambahan
```

#### 3. `datin_data` - Detailed Data
```sql
Detailed DATIN information
```

#### 4. `spmk_mom` - JT/SPMK Data
```sql
JT dan SPMK data management
```

#### 5. `users` - User Management
```sql
id, name, email, password (hashed), role, created_at
Roles: admin, user
```

#### 6. `sos_data` - SOS Data
```sql
Emergency/SOS related data
```

---

## 🔌 API Endpoints Reference

### File Upload
```
POST /api/files/upload?type=hsi
Content-Type: multipart/form-data
Params: type (hsi|datin|tambahan|jt|digital)
Response: { success, data: { successRows, totalRows, failedRows, batchId, progressLogs, errors } }
Handler: fileController.uploadFile()
```

### HSI Data Endpoints
```
GET /api/hsi
Query: page=1&limit=1000&witel=JABAR&kelompok_status=PS&start_date=&end_date=
Response: { success, data: { data: [...], pagination: { page, limit, total, totalPages } } }
Handler: hsiController.getAllHSIData()

DELETE /api/hsi/:orderId
Response: { success, data: { deletedCount, orderId }, message: "..." }
Handler: hsiController.deleteHSIRecord()
```

### Dashboard & Reports
```
GET /api/dashboard/data - Dashboard overview
GET /api/dashboard/revenue-by-witel - Revenue metrics
GET /api/dashboard/kpi-data - KPI information
GET /api/dashboard/report-hsi - HSI summary (grouped by witel)
GET /api/dashboard/report-datin - DATIN summary
GET /api/dashboard/report-tambahan - Tambahan summary
GET /api/dashboard/report-analysis - Analysis data

GET /api/dashboard/export/report-hsi - Export HSI to Excel
GET /api/dashboard/export/report-datin - Export DATIN to Excel
GET /api/dashboard/export/report-tambahan - Export Tambahan to Excel

Response format: { success: true|false, data: {...}, message: "..." }
Handler: dashboardController.*
```

### Authentication
```
POST /api/auth/register - Register user
POST /api/auth/login - Login & get JWT token
POST /api/auth/logout - Logout

Response: { success, data: { user, token } }
```

### JT Report
```
GET /api/dashboard/jt/dashboard - JT dashboard data
GET /api/dashboard/jt/filters - JT filter options
GET /api/dashboard/jt/report - JT report data
GET /api/dashboard/jt/export - Export JT to Excel
```

---

## 🏗️ Architecture & Data Flow

### Upload Data Flow (HSI Example)
```
1. User select file (Excel/CSV)
   ↓
2. FileUploadForm validates file
   ↓
3. POST /api/files/upload?type=hsi (multipart/form-data)
   ↓
4. fileController.uploadFile()
   - Multer saves temp file
   - ExcelJS parses Excel
   - Loops through rows
     * Extracts 50+ fields
     * Applies type conversions:
       orderId: String(value)
       nomor: String(value)
       ncli: String(value)
       gpsLongitude: String(value)
       gpsLatitude: String(value)
       regional: String(value)
       regionalOld: String(value)
       isiComment: String(value)
       pots: String(value)
       [... others ...]
     * Validates data
     * Pushes to hsiBuffer array
     * Every 100 rows → flushBuffer()
   ↓
5. flushBuffer() calls prisma.hsiData.createMany()
   ↓
6. Database insert (batch of 100 rows)
   ↓
7. Return response:
   {
     success: true,
     data: {
       successRows: 3000,
       totalRows: 3000,
       failedRows: 0,
       batchId: "batch-123",
       totalBatches: 30,
       progressLogs: [...],
       errors: []
     }
   }
   ↓
8. Frontend FileUploadForm receives response
   - Extracts: uploadData = response.data.data
   - Calls: onSuccess(uploadData) callback
   ↓
9. HSI.js handleUploadSuccess(uploadData)
   - Displays: "✅ Upload berhasil: 3000 baris"
   - Calls: fetchHSIData() to refresh
   ↓
10. fetchHSIData() → GET /api/hsi
    - hsiController.getAllHSIData()
    - Returns: { data: {...}, pagination: {...} }
    ↓
11. Frontend updates: setHsiData(data)
    ↓
12. Table re-renders dengan data baru ✅
```

### Delete Data Flow
```
User clicks "Hapus" button
   ↓
handleDeleteRow(orderId)
   ↓
Confirmation dialog
   ↓
DELETE /api/hsi/:orderId
   ↓
hsiController.deleteHSIRecord()
   ↓
prisma.hsiData.deleteMany({ where: { orderId } })
   ↓
Response: { deletedCount: 1 }
   ↓
handleDeleteRow catches response
   ↓
Shows success message
   ↓
Calls fetchHSIData() to refresh
   ↓
Table updates ✅
```

### Fetch & Display Data Flow
```
Component mounts (HSI.js)
   ↓
useEffect() → fetchHSIData()
   ↓
GET /api/hsi?page=1&limit=1000
   ↓
hsiController.getAllHSIData()
   ↓
prisma.hsiData.findMany({...})
   ↓
Response: 
{
  success: true,
  data: {
    data: [
      { orderId, customerName, witel, kelompok_status, ... },
      ...
    ],
    pagination: { page: 1, limit: 1000, total: 4523, totalPages: 5 }
  }
}
   ↓
Frontend: setHsiData(result.data.data)
   ↓
Table renders dengan real data ✅
```

---

## 🧭 File Locations & Purposes

### Frontend Structure
```
client/src/
├── pages/
│   ├── Dashboard.js              # Main dashboard
│   ├── HSI.js                    # HSI page (491 lines) [MAIN FOCUS]
│   │   ├── State: hsiData, loading, uploadMessage, uploadError
│   │   ├── Functions: fetchHSIData(), handleUploadSuccess(), handleDeleteRow()
│   │   ├── Features: Upload, Delete, Real-time table, Stats
│   │   └── Table: Shows orderId, customerName, witel, kelompok_status, etc.
│   │
│   ├── ReportsHSI.js             # HSI reporting page
│   ├── ReportsDATIN.js           # DATIN reporting page
│   ├── ReportsTambahan.js        # Tambahan reporting page
│   ├── ReportsJT.js              # JT reporting page
│   ├── Settings.js               # User settings
│   └── Login.js                  # Login page
│
├── components/
│   ├── FileUploadForm.js          # Upload component (278 lines) [MAIN FOCUS]
│   │   ├── Props: type, onSuccess
│   │   ├── States: file, loading, success, progress, logLines
│   │   ├── Functions: handleSubmit(), handleFileChange(), handleRemoveFile()
│   │   ├── Upload Steps: Select → Validate → Upload → Show logs → Success
│   │   └── Calls: fileService.uploadFile(file, type, onProgress)
│   │
│   ├── DataTable.js              # Generic data table display
│   ├── StatsCard.js              # Stats display cards
│   ├── Sidebar.js                # Sidebar navigation
│   ├── Header.js                 # Page header
│   ├── Charts/                   # Chart components
│   │   ├── BarChart.js
│   │   └── PieChart.js
│   └── LoadingSpinner.js         # Loading indicator
│
├── services/
│   ├── dashboardService.js       # Dashboard API calls
│   │   ├── fileService.uploadFile() - Upload file
│   │   └── Other dashboard API calls
│   └── (API communication via axios)
│
├── styles/
│   ├── App.css                   # Main styles
│   └── index.css
│
├── App.js                        # App routing & main component
└── index.js                      # React DOM render
```

### Backend Structure
```
server/src/
├── index.js                      # Express app setup & server start
│   ├── Middleware setup (CORS, helmet, morgan, compression)
│   ├── Routes registration
│   └── Error handler
│
├── middleware/
│   ├── auth.js                   # JWT verification middleware
│   ├── errorHandler.js           # Global error handling
│   ├── validation.js             # Input validation
│   └── upload.js                 # Multer configuration
│
├── controllers/
│   ├── fileController.js         # MAIN FILE (711 lines)
│   │   ├── uploadFile()          # Handle file upload for all types
│   │   │   - Parse Excel/CSV
│   │   │   - Type conversions (STRING, DATE)
│   │   │   - Batch insert (100 rows per batch)
│   │   │   - Error handling & logging
│   │   │   - Response with stats
│   │   │
│   │   └── getImportLogs()       # Get import history
│   │
│   ├── hsiController.js          # HSI-specific operations
│   │   ├── getAllHSIData()       # Fetch all HSI data with filters
│   │   │   - Pagination support
│   │   │   - Filter by: witel, kelompok_status, date range
│   │   │   - Returns: data + pagination info
│   │   │
│   │   └── deleteHSIRecord()     # Delete by orderId
│   │       - Delete all records matching orderId
│   │       - Return: deletedCount
│   │
│   ├── dashboardController.js    # Dashboard & reports
│   │   ├── getReportHSI()        # HSI summary (grouped by witel)
│   │   ├── getReportDATIN()
│   │   ├── getReportTambahan()
│   │   ├── getReportAnalysis()
│   │   ├── getDashboardData()    # Main dashboard stats
│   │   ├── getTotalOrderByRegional()
│   │   ├── getKPIData()
│   │   └── Export functions (Excel)
│   │
│   ├── reportController.js       # Report-specific operations
│   ├── authController.js         # Login/Register
│   └── roleController.js         # Role management
│
├── routes/
│   ├── index.js                  # Main router setup
│   ├── fileRoutes.js             # POST /api/files/upload
│   ├── hsiRoutes.js              # GET/DELETE /api/hsi/:id
│   ├── dashboardRoutes.js        # GET /api/dashboard/*
│   ├── reportRoutes.js           # GET /api/report/*
│   ├── authRoutes.js             # Auth endpoints
│   └── roleRoutes.js
│
├── utils/
│   ├── response.js               # successResponse(), errorResponse()
│   ├── validators.js             # Input validation helpers
│   ├── helpers.js                # Utility functions
│   └── logger.js                 # Winston logging
│
├── models/                       # Prisma models (in prisma/schema.prisma)
│   └── [Auto-generated from schema]
│
├── workers/
│   └── importWorker.js           # Bull queue worker for async imports
│
├── uploads/                      # Temporary file storage
└── logs/                         # Application logs

prisma/
├── schema.prisma                 # DATABASE SCHEMA (master file)
│   ├── model User
│   ├── model HsiData (50+ fields)
│   ├── model DataTambahan
│   ├── model DatainData
│   ├── model SpmkMom
│   ├── model SosData
│   ├── model DigitalProduct
│   └── [Other models]
│
└── migrations/                   # Database version control
```

---

## 🔑 Key Functions & Important Code

### 1. fileController.uploadFile() (711 lines)
```javascript
// Location: server/src/controllers/fileController.js
// Purpose: Main upload handler for all file types

Main Steps:
1. Validate file (type, size)
2. Parse Excel with ExcelJS
3. Loop through rows:
   - Extract fields based on type
   - Apply TYPE CONVERSIONS
   - Validate data
   - Collect in buffer array
4. Batch flush (every 100 rows):
   - prisma.hsiData.createMany()
   - prisma.dataTambahan.createMany()
   - etc.
5. Return response with stats

Key Variables:
- type: hsi | datin | tambahan | jt | digital | sos
- hsiBuffer: Array of HSI records to insert
- flushInterval: 100 rows
- successCount: Total rows inserted successfully
- failedCount: Rows with errors

Type Conversions (CRITICAL):
- orderId: String(value)
- nomor: String(value)
- ncli: String(value)
- gpsLongitude: String(value)
- gpsLatitude: String(value)
- regional: String(value)
- regionalOld: String(value)
- isiComment: String(value)
- pots: String(value)
```

### 2. hsiController.getAllHSIData() (NEW)
```javascript
// Location: server/src/controllers/hsiController.js
// Purpose: Fetch HSI data dengan filter & pagination

Query Parameters:
- page (default: 1)
- limit (default: 1000)
- witel (optional)
- kelompok_status (optional)
- start_date, end_date (optional)

Response:
{
  success: true,
  data: {
    data: [...rows],
    pagination: { page, limit, total, totalPages }
  }
}

Database Call:
prisma.hsiData.findMany({
  where: { ...filters },
  skip: (page-1)*limit,
  take: limit,
  orderBy: { orderDate: 'desc' }
})
```

### 3. HSI.js - React Component
```javascript
// Location: client/src/pages/HSI.js (491 lines)
// Purpose: HSI Dashboard page

Key State:
- hsiData: Array of HSI records
- loading: Boolean for loading state
- uploadMessage: Success message
- uploadError: Error message

Key Functions:
1. fetchHSIData()
   - GET /api/hsi
   - Updates hsiData state
   - Called on mount & after operations

2. handleUploadSuccess(uploadData)
   - Called by FileUploadForm after successful upload
   - Shows success message
   - Calls fetchHSIData() to refresh

3. handleDeleteRow(orderId)
   - DELETE /api/hsi/:orderId
   - Shows confirmation dialog
   - Calls fetchHSIData() to refresh

4. Stats Calculation
   - total: hsiData.length
   - completed: filter kelompok_status === 'PS'
   - open: filter kelompok_status !== 'PS' && !== 'CANCEL'

Table Display:
- Shows real data from hsiData state
- Columns: orderId, customerName, witel, typeLayanan, kelompok_status, actions
- Loading state shows "Loading data..."
- Empty state shows "Tidak ada data ditemukan"
```

### 4. FileUploadForm.js - Upload Component
```javascript
// Location: client/src/components/FileUploadForm.js (278 lines)
// Purpose: Reusable file upload component

Props:
- type: 'hsi' | 'datin' | 'tambahan' | 'jt' | 'digital'
- onSuccess: Callback function after successful upload

Steps:
1. User select file
2. Click upload
3. POST /api/files/upload?type=hsi
4. Show progress with logs
5. Response received:
   - Extract uploadData = response.data.data
   - Call onSuccess(uploadData)
   - Show success message

Response Structure (CRITICAL):
Backend returns:
{
  success: true,
  message: "File uploaded successfully",
  data: {
    fileName: "...",
    type: "hsi",
    successRows: 3000,
    totalRows: 3000,
    failedRows: 0,
    batchId: "xyz",
    totalBatches: 30,
    progressLogs: [...],
    errors: [...]
  }
}

Frontend processes:
const uploadData = response?.data?.data
// uploadData contains: { fileName, type, successRows, totalRows, ... }
onSuccess(uploadData) // Pass to parent component
```

---

## 🐛 Debugging Guide

### Issue: HSI Table Not Updating After Upload
```
Check:
1. POST /api/files/upload?type=hsi returns 200 & success=true
2. Response.data.data has successRows, totalRows
3. handleUploadSuccess() is called with correct data
4. fetchHSIData() is called
5. GET /api/hsi returns data
6. Frontend receives data & updates state

Debug Steps:
- Open DevTools (F12) → Console
- Look for: "Fetched HSI data: {...}"
- Check if data array is empty or populated
- Check Network tab for API responses
- Check React DevTools for state updates
```

### Issue: Upload Success Message Not Showing
```
Debug:
1. Check browser console for logs
2. Verify FileUploadForm receives onSuccess callback
3. Verify response structure matches expectations
4. Check if setUploadMessage() is working
5. Check if timeout is clearing message before display

Console Logs Added:
- "Upload response: {...}" - Response from upload
- "Upload data extracted: {...}" - Parsed uploadData
- "Setting upload message: ..." - Message being set
- "handleUploadSuccess received: {...}" - Data in callback
```

### Issue: Delete Not Working
```
Debug:
1. Click "Hapus" button
2. Confirm dialog
3. Check Network tab: DELETE /api/hsi/:orderId
4. Verify response: { deletedCount: 1 }
5. Check if fetchHSIData() called
6. Check if table refreshed

Common Issues:
- orderId might be different format than expected
- Not passing orderId correctly to delete function
- Table not re-fetching after delete
```

### Issue: File Upload Fails
```
Check:
1. File size < 50MB
2. File format is Excel/CSV
3. type parameter is correct (hsi, datin, etc.)
4. Network request is POST /api/files/upload?type=...
5. Server logs for detailed error

Server Logs Location:
- /logs/app.log
- /logs/error.log
- /logs/import.log

Check for:
- "Upload failed" error messages
- File parsing errors
- Database insert errors
- Type conversion failures
```

---

## 🔒 Security & Authentication

### JWT Flow
```
1. POST /api/auth/login with email & password
2. Server returns: { token: "eyJhb..." }
3. Frontend stores token in localStorage
4. Every request includes: Authorization: Bearer <token>
5. Server middleware checks token validity
6. Token expires after 24 hours
```

### Protected Routes
```javascript
// Example: Protect endpoint dengan authentication
router.get('/api/hsi', authenticate, getAllHSIData)

// authenticate middleware:
// 1. Extract token from Authorization header
// 2. Verify with JWT_SECRET
// 3. Attach user info to req.user
// 4. If invalid → return 401 Unauthorized
```

---

## 📈 Performance Notes

### Current Optimizations
- ✅ Batch insert 100 rows per batch (faster than 1 by 1)
- ✅ Pagination with limit parameter
- ✅ Connection pooling via Prisma
- ✅ Response compression middleware

### Database Queries
- Indexes on: orderId (unique), witel, kelompok_status
- Large queries use limit & offset (pagination)
- Date range filtering supported

---

## 🚀 Deployment Checklist

- [ ] Setup `.env` dengan DATABASE_URL, REDIS_URL, JWT_SECRET
- [ ] Run `npm run prisma:generate`
- [ ] Run `npm run prisma:migrate`
- [ ] Test: `npm run dev` (server) & `npm start` (client)
- [ ] Verify all endpoints respond
- [ ] Test file upload dengan sample data
- [ ] Check table updates after upload
- [ ] Test delete functionality
- [ ] Verify authentication works
- [ ] Check error handling & logs
- [ ] Test with production data volume

---

## 📞 Support & References

### Environment Variables Template
```bash
# server/.env
DATABASE_URL=postgresql://user:password@host:5432/telkom_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=24h
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=50000000
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:3000
```

### Common Commands
```bash
# Development
npm run dev              # Start backend
npm start              # Start frontend
npm run worker:dev     # Start background worker

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio (GUI)

# Production
npm run build          # Build frontend
npm start             # Start backend (production)
```

---

## 👥 Team & Timeline

- **Project Type:** Full-stack data management system
- **Timeline:** Week 1+ (ongoing)
- **Status:** Production ready dengan active development

---

**Last Updated:** January 6, 2026
- Prisma Studio: http://localhost:5555

## 📁 Project Structure

```
 Dashboard Nodejs/
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
