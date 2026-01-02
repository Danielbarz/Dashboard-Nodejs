import express from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  getRevenueByWitel,
  getAmountByWitel,
  getKPIData,
  getTotalOrderByRegional,
  getSebaranDataPS,
  getCancelByFCC,
  getFilterOptions,
  getDashboardData
} from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/revenue-by-witel', authenticate, getRevenueByWitel)
router.get('/amount-by-witel', authenticate, getAmountByWitel)
router.get('/kpi-data', authenticate, getKPIData)
router.get('/total-order-regional', authenticate, getTotalOrderByRegional)
router.get('/sebaran-data-ps', authenticate, getSebaranDataPS)
router.get('/cancel-by-fcc', authenticate, getCancelByFCC)
router.get('/filter-options', authenticate, getFilterOptions)
router.get('/data', authenticate, getDashboardData)

export default router
