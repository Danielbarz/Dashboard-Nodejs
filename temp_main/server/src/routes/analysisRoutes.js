import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { paginationValidation, validate } from '../middleware/validator.js'
import { getDigitalProducts, getDigitalProductStatsHandler, exportDigitalProducts } from '../controllers/analysisController.js'

const router = express.Router()

// List digital products with filters
router.get('/digital-product', authenticate, validate(paginationValidation), getDigitalProducts)

// Aggregated stats (revenue/amount by witel/branch, status counts)
router.get('/digital-product/stats', authenticate, getDigitalProductStatsHandler)

// Export to Excel
router.get('/digital-product/export', authenticate, exportDigitalProducts)

export default router
