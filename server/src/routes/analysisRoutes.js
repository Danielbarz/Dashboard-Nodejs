import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { paginationValidation, validate } from '../middleware/validator.js'
import {
  getDigitalProducts,
  getDigitalProductStatsHandler,
  exportDigitalProducts,
  getJtProgressStats
} from '../controllers/analysisController.js'

const router = express.Router()

// List digital products with filters
router.get('/digital-product', authenticate, validate(paginationValidation), getDigitalProducts)

// Aggregated stats (revenue/amount by witel/branch, status counts)
router.get('/digital-product/stats', authenticate, getDigitalProductStatsHandler)

// Export to Excel
router.get('/digital-product/export', authenticate, exportDigitalProducts)

// Endpoint sesuai request: '/api/jt/progress-stats' (prefix /jt added in index.js)
router.get('/progress-stats', authenticate, getJtProgressStats)

export default router
