import express from 'express'
import authRoutes from './authRoutes.js'
import analysisRoutes from './analysisRoutes.js'
import dashboardRoutes from './dashboardRoutes.js'
import fileRoutes from './fileRoutes.js'
import roleRoutes from './roleRoutes.js'
import adminRoutes from './adminRoutes.js'
import reportRoutes from './reportRoutes.js'

const router = express.Router()

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Telkom Dashboard API is running',
    timestamp: new Date().toISOString()
  })
})

// Auth routes
router.use('/auth', authRoutes)

// Dashboard routes
router.use('/dashboard', dashboardRoutes)

// File routes
router.use('/files', fileRoutes)

// Role routes
router.use('/roles', roleRoutes)

// Admin routes
router.use('/admin', adminRoutes)

// Report routes
router.use('/report', reportRoutes)

// Analysis routes
router.use('/analysis', analysisRoutes)
// router.use('/dashboard', dashboardRoutes)
// router.use('/import', importRoutes)

export default router
