import express from 'express'
import { authenticate, adminOnly } from '../middleware/auth.js'
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  truncateJT
} from '../controllers/adminController.js'

const router = express.Router()

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

export default router
