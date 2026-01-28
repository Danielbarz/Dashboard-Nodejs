import express from 'express'
import multer from 'multer'
import { authenticate, adminOnly } from '../middleware/auth.js'
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  truncateJT,
  truncateDigital
} from '../controllers/adminController.js'
import {
  mergeFiles,
  downloadMergedFile
} from '../controllers/mergeController.js'
import {
  getBatchHistory,
  rollbackBatch
} from '../controllers/rollbackController.js'

const router = express.Router()

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/temp',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    files: 10
  }
})

// All admin routes require authentication and admin role
router.use(authenticate)
router.use(adminOnly)

// User management endpoints
router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

// Maintenance: truncate JT data (spmk_mom)
router.post('/truncate/jt', truncateJT)
// Maintenance: truncate Digital Product data (Raw & Production)
router.post('/truncate/digital', truncateDigital)

// File merge endpoints
router.post('/merge-files', upload.array('files', 10), mergeFiles)
router.get('/merge-files/download', downloadMergedFile)

// Rollback endpoints
router.get('/batches', getBatchHistory)
router.post('/rollback', rollbackBatch)

export default router
