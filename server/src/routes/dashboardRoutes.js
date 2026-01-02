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
  getDashboardData,
  getReportTambahan,
  getReportDatin,
  getReportAnalysis,
  getReportHSI,
  exportReportAnalysis,
  exportReportDatin,
  exportReportTambahan,
  exportReportHSI
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
router.get('/report-tambahan', authenticate, getReportTambahan)
router.get('/report-datin', authenticate, getReportDatin)
router.get('/report-analysis', authenticate, getReportAnalysis)
router.get('/report-hsi', authenticate, getReportHSI)

export default router
