import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { authenticate } from '../middleware/auth.js'
import {
  uploadFile,
  getImportLogs,
  truncateData
} from '../controllers/fileController.js'

const router = express.Router()

// Configure multer for file uploads
// Ensure uploads directory exists
const uploadDir = 'uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir + '/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (['.xlsx', '.xls', '.csv'].includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Only Excel and CSV files are allowed'), false)
    }
  }
})

router.post('/upload', authenticate, upload.single('file'), uploadFile)
router.get('/import-logs', authenticate, getImportLogs)
router.delete('/data', authenticate, truncateData)

export default router
