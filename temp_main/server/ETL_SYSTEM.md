# File Upload & ETL System

Sistem upload file dengan queue processing untuk ETL (Extract-Transform-Load) data.

## Arsitektur

```
Frontend (Upload) → Backend API → Queue (Bull/Redis) → Worker (ETL) → Database
                         ↓
                   Socket.io (Real-time Progress)
```

## Components

### 1. Queue System (`/src/queues/`)
- **Bull** queue untuk async job processing
- Redis sebagai backend storage
- Support multiple job types: SOS, HSI, JT, Datin

### 2. Jobs (`/src/jobs/`)
- `ProcessSOSImport.js` - ETL untuk Digital Product/SOS
- `ProcessHSIImport.js` - ETL untuk HSI data
- TODO: ProcessJTImport, ProcessDatinImport

### 3. Workers (`/src/workers/`)
- Background process untuk execute jobs
- Jalan terpisah dari API server
- Auto-retry failed jobs (3x attempts)

### 4. Controllers (`/src/controllers/fileControllerQueue.js`)
- `POST /api/files/upload` - Upload file & dispatch ke queue
- `GET /api/files/job/:jobId/progress` - Real-time progress
- `GET /api/files/job/:jobId/status` - Status job
- `GET /api/files/import-logs` - History import

## Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Redis
Edit `.env`:
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 3. Start Services

**Terminal 1 - API Server:**
```bash
npm run dev
```

**Terminal 2 - Worker:**
```bash
npm run worker:dev
```

**Terminal 3 - Redis (if not installed):**
```bash
# Windows: Download from https://github.com/microsoftarchive/redis/releases
# Or use Docker:
docker run -d -p 6379:6379 redis:alpine
```

## Usage Flow

### 1. Upload File (Frontend)
```javascript
const formData = new FormData()
formData.append('file', file)

const response = await fetch('/api/files/upload?type=digital_product', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
})

const { jobId, batchId } = response.data
```

### 2. Track Progress (Frontend)
```javascript
// Poll progress every 2 seconds
const interval = setInterval(async () => {
  const progress = await fetch(`/api/files/job/${jobId}/progress`)
  const { percent, message } = progress.data
  
  updateUI(percent, message)
  
  if (percent === 100 || percent === -1) {
    clearInterval(interval)
  }
}, 2000)
```

### 3. Get Final Result
```javascript
const status = await fetch(`/api/files/job/${jobId}/status`)
const { state, result } = status.data

if (state === 'completed') {
  console.log('Success:', result.successRows)
  console.log('Failed:', result.failedRows)
}
```

## Job Types & File Mapping

| File Type          | Query Param     | Job Type     | Processor          |
|--------------------|-----------------|--------------|---------------------|
| Digital Product    | `analysis`      | `sos-import` | ProcessSOSImport   |
| SOS Data           | `sos`           | `sos-import` | ProcessSOSImport   |
| HSI Data           | `hsi`           | `hsi-import` | ProcessHSIImport   |
| Jaringan Tambahan  | `jt`/`tambahan` | `jt-import`  | TODO               |
| Datin              | `datin`         | `datin-import`| TODO              |

## Progress Tracking

Progress disimpan di Redis dengan key: `import:progress:{jobId}`

Structure:
```json
{
  "percent": 45,
  "message": "Processed 5000/10000 rows",
  "updatedAt": "2026-01-02T10:30:00.000Z"
}
```

TTL: 1 hour (auto-delete setelah 1 jam)

## Error Handling

- **Job retry**: 3x attempts with exponential backoff (2s, 4s, 8s)
- **Failed jobs**: Disimpan di queue untuk review
- **Partial success**: Job tetap completed, errors di-return di result

## Monitoring

### Bull Board (Optional)
Install:
```bash
npm install @bull-board/express
```

Add to `src/index.js`:
```javascript
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { ExpressAdapter } from '@bull-board/express'

const serverAdapter = new ExpressAdapter()
createBullBoard({
  queues: [new BullAdapter(fileImportQueue)],
  serverAdapter
})

app.use('/admin/queues', serverAdapter.getRouter())
```

Access: `http://localhost:5000/admin/queues`

## Next Steps

1. ✅ Queue system setup
2. ✅ SOS/Digital Product import
3. ✅ HSI import
4. ⏳ JT/Tambahan import
5. ⏳ Datin import
6. ⏳ Socket.io real-time progress (replace polling)
7. ⏳ Frontend progress component
8. ⏳ Rollback batch feature
