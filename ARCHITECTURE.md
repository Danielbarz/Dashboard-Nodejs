# Telkom Dashboard - Detailed Architecture Guide for AI/Gemini

## 🎯 Executive Summary

**Telkom Dashboard** adalah sistem manajemen data berbasis cloud untuk Telkom Indonesia yang memungkinkan upload, tracking, dan reporting data HSI, DATIN, Data Tambahan, dan JT.

- **Tech Stack:** React 19 + Node.js/Express + PostgreSQL (Supabase)
- **Main Problem Solved:** Centralized data management dengan real-time updates
- **Current Status:** Production-ready dengan ongoing development
- **Last Major Update:** January 6, 2026

---

## 📊 System Components

### 1. Frontend (React 19)
```
client/src/
├── pages/HSI.js                    ← MAIN: HSI Dashboard
│   ├── State: hsiData, loading, uploadMessage, uploadError
│   ├── useEffect: Load data on mount
│   ├── Functions: fetchHSIData(), handleUploadSuccess(), handleDeleteRow()
│   └── UI: Stats cards, FileUploadForm, Data table, Delete actions
│
├── components/FileUploadForm.js    ← MAIN: File upload
│   ├── Handles: Excel/CSV parsing (client-side validation)
│   ├── POST: /api/files/upload?type=hsi
│   ├── Props: type (string), onSuccess (callback)
│   └── States: file, loading, success, progress, logLines
│
└── services/dashboardService.js
    └── fileService.uploadFile(file, type, progressCallback)
```

**Key Flow:**
1. User selects file in FileUploadForm
2. File validated (size, type)
3. POST to /api/files/upload with FormData
4. Progress tracked with upload progress event
5. Response parsed: uploadData = response.data.data
6. onSuccess(uploadData) callback triggered
7. HSI.js handleUploadSuccess() shows message & refreshes table

---

### 2. Backend (Express.js)
```
server/src/
├── controllers/
│   ├── fileController.js           ← MAIN: Upload processor (711 lines)
│   │   └── uploadFile()
│   │       ├── Multer saves file to disk
│   │       ├── ExcelJS parses file
│   │       ├── Loop: Extract fields + Type conversions
│   │       ├── Buffer: 100 rows at a time
│   │       ├── Flush: prisma.hsiData.createMany()
│   │       └── Response: success stats
│   │
│   ├── hsiController.js            ← NEW: HSI operations
│   │   ├── getAllHSIData()
│   │   │   ├── Query: page, limit, filters
│   │   │   ├── prisma.hsiData.findMany()
│   │   │   └── Response: { data: [...], pagination: {...} }
│   │   │
│   │   └── deleteHSIRecord()
│   │       ├── Param: orderId
│   │       ├── prisma.hsiData.deleteMany()
│   │       └── Response: { deletedCount }
│   │
│   └── dashboardController.js
│       ├── getReportHSI() - Grouped by witel
│       ├── getDashboardData() - Overall stats
│       └── Export functions
│
├── routes/
│   ├── index.js                    ← Router setup
│   ├── fileRoutes.js               → POST /api/files/upload
│   ├── hsiRoutes.js                → GET/DELETE /api/hsi/*
│   └── dashboardRoutes.js          → GET /api/dashboard/*
│
├── middleware/
│   ├── auth.js                     → JWT verification
│   └── errorHandler.js             → Global error handling
│
└── index.js                        ← Express server entry
```

**Upload Process Flow:**
```
POST /api/files/upload?type=hsi
    ↓
Multer middleware saves to /uploads/
    ↓
fileController.uploadFile()
    ↓
ExcelJS reads file
    ↓
For each row:
  - Extract 50+ fields (depends on type)
  - Apply type conversions (e.g., String(numeric))
  - Validate data
  - Push to buffer array
    ↓
Buffer.length >= 100 or EOF:
  - prisma.hsiData.createMany(buffer)
  - Clear buffer
  - successCount += inserted count
    ↓
After all rows processed:
  - Delete temp file
  - Return response with stats
```

---

### 3. Database Schema (Supabase PostgreSQL)
```
PostgreSQL Tables:
├── hsi_data (50+ columns)
│   ├── PK: id (SERIAL)
│   ├── orderId (STRING, UNIQUE)
│   ├── customerName (STRING)
│   ├── nomorLayanan (STRING)
│   ├── typeLayanan (STRING)
│   ├── kelompok_status (STRING)
│   ├── witel (STRING)
│   ├── gpsLongitude (STRING)
│   ├── gpsLatitude (STRING)
│   └── [...30+ more fields...]
│
├── data_tambahan
│   └── Similar structure
│
├── datin_data
│   └── Similar structure
│
├── spmk_mom (JT data)
│   └── Similar structure
│
├── sos_data
│   └── Similar structure
│
└── users
    ├── id (SERIAL PRIMARY KEY)
    ├── email (STRING UNIQUE)
    ├── password (STRING - bcrypt hashed)
    ├── role (ENUM: admin, user)
    └── created_at (TIMESTAMP)
```

**Important Notes:**
- All HSI fields stored as STRING (no type mismatches)
- orderId is UNIQUE (natural identifier)
- Indexes on: orderId, witel, kelompok_status for query performance
- Batch inserts optimized: 100 rows per batch

---

## 🔄 Data Flow Diagrams

### Upload & Display Flow
```
┌─────────────┐
│   Browser   │
│   React     │
└──────┬──────┘
       │
       │ 1. User selects file
       │
       ├─→ FileUploadForm
       │   validates & shows logs
       │
       │ 2. POST /api/files/upload?type=hsi
       │   (multipart/form-data)
       │
       ├─→ Express Server
       │   fileController.uploadFile()
       │   - Multer saves file
       │   - ExcelJS parses
       │   - Type conversions
       │   - Batch inserts (100 rows)
       │   - prisma.hsiData.createMany()
       │
       ├─→ PostgreSQL (Supabase)
       │   INSERT INTO hsi_data (...)
       │   VALUES (...)
       │
       │ 3. Response:
       │   {
       │     success: true,
       │     data: {
       │       successRows: 3000,
       │       totalRows: 3000,
       │       errors: []
       │     }
       │   }
       │
       ├─→ HSI.js
       │   handleUploadSuccess()
       │   - Show "✅ Upload berhasil"
       │   - Call fetchHSIData()
       │
       │ 4. GET /api/hsi
       │
       ├─→ hsiController.getAllHSIData()
       │   prisma.hsiData.findMany()
       │
       ├─→ PostgreSQL
       │   SELECT * FROM hsi_data ORDER BY ...
       │
       │ 5. Response:
       │   {
       │     data: [
       │       { orderId, customerName, ... },
       │       ...
       │     ],
       │     pagination: { page, total, ... }
       │   }
       │
       └─→ Table renders with real data ✅
```

### Delete Flow
```
┌──────────┐
│  Button  │ "Hapus"
└────┬─────┘
     │
     │ handleDeleteRow(orderId)
     │
     ├─→ Confirm dialog
     │
     │ DELETE /api/hsi/:orderId
     │
     ├─→ hsiController.deleteHSIRecord()
     │   prisma.hsiData.deleteMany({ orderId })
     │
     ├─→ PostgreSQL
     │   DELETE FROM hsi_data WHERE orderId = ?
     │
     │ Response: { deletedCount: 1 }
     │
     ├─→ Show success message
     │
     │ fetchHSIData()
     │
     └─→ Table updates ✅
```

---

## 🔐 Authentication & Security

### JWT Authentication Flow
```
1. User submits login form (email + password)
   ↓
2. POST /api/auth/login
   ↓
3. authController checks credentials
   - bcryptjs.compare(password, hashed_password)
   - If valid: generate JWT token
   ↓
4. Return { token: "eyJhbGc..." }
   ↓
5. Frontend stores token in localStorage
   ↓
6. Every subsequent request includes:
   Authorization: Bearer eyJhbGc...
   ↓
7. Server middleware verifies token
   - jwt.verify(token, JWT_SECRET)
   - If valid: req.user = decoded payload
   - If invalid: return 401 Unauthorized
```

### Protected Endpoints
```javascript
// Example pattern
router.get('/api/hsi', 
  authenticate,              // Verify JWT token
  getAllHSIData              // If auth passes, execute handler
)

// Auth middleware checks:
const token = req.headers.authorization?.split(' ')[1]
if (!token) return 401
const decoded = jwt.verify(token, JWT_SECRET)
req.user = decoded
next()
```

---

## 📁 File Mapping & Responsibilities

### Critical Files (High Priority)

#### 1. `fileController.js` (711 lines) - Upload Processor
**Responsibility:** Parse & insert uploaded files into database

**Key Function:** `uploadFile(req, res, next)`
```
Input: req.file (from multer), req.query.type
Process:
  1. Validate file size & MIME type
  2. Parse Excel/CSV based on type
  3. Extract 50+ fields per row
  4. Apply type conversions (STRING conversions CRITICAL)
  5. Batch inserts every 100 rows
  6. Error handling & logging
Output: { success, data: { successRows, failedRows, errors }, message }
```

**Type Conversions** (MUST be applied for HSI):
```javascript
orderId: String(value)
nomor: String(value)
ncli: String(value)
gpsLongitude: String(value)
gpsLatitude: String(value)
regional: String(value)
regionalOld: String(value)
isiComment: String(value)
pots: String(value)
```

---

#### 2. `HSI.js` (491 lines) - HSI Dashboard Page
**Responsibility:** Display, upload, delete HSI data

**Key States:**
```javascript
const [hsiData, setHsiData] = useState([])      // Table data
const [loading, setLoading] = useState(false)   // Loading indicator
const [uploadMessage, setUploadMessage] = useState('') // Success msg
const [uploadError, setUploadError] = useState('')     // Error msg
```

**Key Functions:**
```javascript
1. fetchHSIData() 
   - GET /api/hsi?page=1&limit=1000
   - Updates hsiData state
   - Called on mount & after operations

2. handleUploadSuccess(uploadData)
   - Receives uploadData from FileUploadForm.onSuccess
   - Sets uploadMessage with successRows count
   - Calls fetchHSIData() to refresh

3. handleDeleteRow(orderId)
   - DELETE /api/hsi/:orderId
   - Shows confirmation
   - Calls fetchHSIData() to refresh
```

**Table Structure:**
```javascript
Table renders hsiData array with columns:
- orderId (unique ID)
- customerName
- witel (region)
- kelompok_status (status)
- typeLayanan (service type)
- Actions: "Hapus" button

Stats calculated:
- total: hsiData.length
- completed: filter by kelompok_status === 'PS'
- open: filter by not 'PS' and not 'CANCEL'
```

---

#### 3. `FileUploadForm.js` (278 lines) - Upload Component
**Responsibility:** Handle file selection, validation, upload, progress display

**Key Props:**
```javascript
type: string               // 'hsi', 'datin', 'tambahan', 'jt', 'digital'
onSuccess: function       // Callback after successful upload
```

**Key States:**
```javascript
file: selected file object or null
loading: boolean
success: boolean
uploadProgress: 0-100 or null
logLines: array of log messages
```

**Upload Process:**
```
1. User selects file → setFile()
2. Form submitted → handleSubmit()
3. Validation: file size, type
4. Create FormData with file
5. POST /api/files/upload?type=hsi
   - Track progress with onUploadProgress
   - Update progress bar & log lines
6. Response received
   - Extract uploadData = response.data.data
   - Call onSuccess(uploadData)
   - Show success message
```

---

#### 4. `hsiController.js` (NEW) - HSI Operations
**Responsibility:** CRUD operations for HSI data

**Key Function 1:** `getAllHSIData(req, res)`
```
Query params:
  page (default: 1)
  limit (default: 1000)
  witel (optional)
  kelompok_status (optional)
  start_date, end_date (optional)

Process:
  1. Build where clause with filters
  2. prisma.hsiData.findMany({
       where: { ...filters },
       skip: (page-1)*limit,
       take: limit,
       orderBy: { orderDate: 'desc' }
     })
  3. Get total count
  4. Return { data: { data, pagination } }

Response:
  {
    success: true,
    data: {
      data: [
        { orderId, customerName, witel, ... },
        ...
      ],
      pagination: {
        page: 1,
        limit: 1000,
        total: 4523,
        totalPages: 5
      }
    }
  }
```

**Key Function 2:** `deleteHSIRecord(req, res)`
```
Params:
  orderId (from URL param)

Process:
  1. prisma.hsiData.deleteMany({
       where: { orderId }
     })
  2. Return { deletedCount, message }

Response:
  {
    success: true,
    data: { deletedCount: 1, orderId },
    message: "1 record deleted"
  }
```

---

#### 5. `dashboardController.js` - Dashboard & Reports
**Responsibility:** Dashboard metrics, reports, exports

**Key Functions:**
```javascript
getReportHSI(req, res)
  - Grouped by witel
  - Returns summary stats
  - Used for report pages

getDashboardData(req, res)
  - Overall dashboard statistics
  - Revenue metrics
  - KPI data

exportReportHSI(req, res)
  - Export to Excel file
  - Uses ExcelJS
```

---

### Supporting Files

#### `routes/hsiRoutes.js`
```javascript
import { getAllHSIData, deleteHSIRecord } from 'hsiController'

router.get('/', authenticate, getAllHSIData)      // GET /api/hsi
router.delete('/:orderId', authenticate, deleteHSIRecord)
```

#### `routes/fileRoutes.js`
```javascript
import { uploadFile } from 'fileController'

router.post('/upload', authenticate, upload.single('file'), uploadFile)
// POST /api/files/upload?type=hsi
```

#### `middleware/auth.js`
```javascript
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

#### `services/dashboardService.js`
```javascript
export const fileService = {
  uploadFile: (file, type, onUploadProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/files/upload', formData, {
      params: { type },
      onUploadProgress
    })
  }
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: HSI Table Not Updating After Upload

**Symptoms:**
- Upload shows success
- Data in database
- Table doesn't update

**Root Causes:**
- `fetchHSIData()` not called in `handleUploadSuccess`
- `GET /api/hsi` returns wrong structure
- Frontend not receiving data correctly

**Solution:**
1. Verify `handleUploadSuccess` calls `fetchHSIData()`
2. Check API response: `GET /api/hsi` should return `{ data: { data: [...], pagination: {...} } }`
3. Verify frontend parses: `result.data.data` correctly
4. Check browser console for errors

---

### Issue 2: Upload Success Message Not Showing

**Symptoms:**
- Upload succeeds (data in DB)
- No success message displayed
- No error either

**Root Causes:**
- Response structure mismatch (e.g., `response.data.data` is undefined)
- `onSuccess` callback not passed from parent
- `setUploadMessage` state not updating
- Message cleared too quickly (timeout issue)

**Solution:**
1. Add console logs in FileUploadForm:
   ```javascript
   console.log('Response:', response)
   console.log('uploadData:', uploadData)
   console.log('Calling onSuccess with:', uploadData)
   ```

2. Add console logs in HSI.js:
   ```javascript
   console.log('handleUploadSuccess received:', response)
   console.log('Setting message:', message)
   ```

3. Verify response structure:
   Backend must return: `{ success, data: { successRows, totalRows, ... }, message }`

---

### Issue 3: Delete Not Working

**Symptoms:**
- Delete button clicked
- No confirmation or error
- Data not deleted

**Root Causes:**
- `orderId` format mismatch
- DELETE endpoint not registered
- Authentication failing

**Solution:**
1. Check `handleDeleteRow` receives correct `orderId`
2. Verify DELETE route: `router.delete('/:orderId', authenticate, deleteHSIRecord)`
3. Check Network tab for DELETE request
4. Verify response: `{ deletedCount: 1 }`

---

### Issue 4: File Upload Fails with Error

**Symptoms:**
- Upload error message
- File not inserted

**Root Causes:**
- Type conversion failure
- Invalid data format
- File size too large

**Solution:**
1. Check server logs: `/logs/error.log`
2. Verify type conversions in `fileController.js`
3. Check file format (must be Excel/CSV)
4. Ensure file size < 50MB

---

## 🚀 Development Workflow

### When Adding a New Feature

1. **Backend:**
   - Add controller function
   - Add route(s)
   - Test with Postman/Insomnia

2. **Frontend:**
   - Call API using service
   - Handle response/error
   - Update component state
   - Display in UI

3. **Testing:**
   - Test happy path
   - Test error scenarios
   - Check browser console
   - Check server logs

### Example: Add Filter by Department

```javascript
// 1. Backend Controller
export const getAllHSIData = async (req, res) => {
  const { department } = req.query  // Add this
  let where = {}
  if (department) where.department = department  // Add filter
  const data = await prisma.hsiData.findMany({ where })
  // ... rest
}

// 2. Frontend Component
const handleFilterChange = (dept) => {
  // URL: GET /api/hsi?department=IT
  // fetchHSIData will be called with new filter
}

// 3. Test
// GET /api/hsi?department=IT
// Verify returns only IT department records
```

---

## 📈 Performance Considerations

### Current Optimizations
- ✅ Batch insert 100 rows per batch
- ✅ Pagination (default 1000 rows)
- ✅ Database indexes on key columns
- ✅ Compression middleware

### Areas for Improvement
- Consider redis caching for frequently accessed reports
- Add database query caching
- Implement lazy loading for large tables
- Monitor slow queries with Prisma logging

---

## 🔍 Debugging Checklist

When something doesn't work, check in this order:

1. **Browser Console** (F12)
   - Any JavaScript errors?
   - Console.log messages showing?

2. **Network Tab** (F12 → Network)
   - Request successful (200 status)?
   - Response body has correct structure?

3. **Server Logs**
   - `/logs/app.log`
   - `/logs/error.log`
   - Look for error messages

4. **Database** (Prisma Studio)
   - `npm run prisma:studio`
   - Verify data was actually inserted
   - Check for data type issues

5. **Code Review**
   - Check response structure matches expectations
   - Verify parameter names match
   - Check for typos in field names

---

## 📞 Quick Reference

### API Response Format
```javascript
// Success
{
  success: true,
  message: "Operation successful",
  data: { ... actual data ... }
}

// Error
{
  success: false,
  message: "Error description",
  errors: [ ... validation errors ... ]
}
```

### Important Endpoints
```
GET    /api/hsi                    → Fetch HSI data
POST   /api/files/upload?type=hsi  → Upload HSI file
DELETE /api/hsi/:orderId           → Delete HSI record
GET    /api/dashboard/report-hsi   → HSI summary
```

### Key Database Tables
```
hsi_data              → Main HSI records
data_tambahan         → Additional data
datin_data            → Detailed data
spmk_mom              → JT data
users                 → User accounts
```

---

**Created for Gemini AI to understand the Telkom Dashboard architecture and make informed decisions about code changes and feature additions.**

Last Updated: January 6, 2026
