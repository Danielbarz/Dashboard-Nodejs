import express from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  getRevenueByWitel,
  getAmountByWitel,
  getTotalOrderByRegional,
  getSebaranDataPS,
  getCancelByFCC,
  getFilterOptions,
  getDashboardData,
  getReportTambahan,
  getReportHSI,
  getJTDashboard,
  getJTFilters,
  getJTReport,
  exportReportTambahan,
  exportReportHSI,
  exportJTReport,
  getHSIDashboard,
  getHSIFlowStats,
  getHSIFlowDetail,
  getSOSDatinFilters,
  getSOSDatinDashboard,
  getDigitalProductDashboard,
  getDigitalProductFilters
} from '../controllers/dashboardController.js'
import { exportReportAnalysis } from '../controllers/reportController.js'

const router = express.Router()

// Dashboard Main Data
router.get('/', authenticate, getDashboardData)

// SOS Dashboard Charts
router.get('/revenue-by-witel', authenticate, getRevenueByWitel)
router.get('/amount-by-witel', authenticate, getAmountByWitel)
router.get('/total-order-by-regional', authenticate, getTotalOrderByRegional)
router.get('/sebaran-data-ps', authenticate, getSebaranDataPS)
router.get('/cancel-by-fcc', authenticate, getCancelByFCC)
router.get('/filter-options', authenticate, getFilterOptions)

// SOS Datin Dashboard
router.get('/sos-datin/filters', authenticate, getSOSDatinFilters)
router.get('/sos-datin/stats', authenticate, getSOSDatinDashboard)

// Digital Product Dashboard Charts
router.get('/digital-product/filters', authenticate, getDigitalProductFilters)
router.get('/digital-product/stats', authenticate, getDigitalProductDashboard)

// HSI Dashboard
router.get('/hsi', authenticate, getHSIDashboard)
router.get('/hsi/flow-stats', authenticate, getHSIFlowStats)
router.get('/hsi/flow-detail', authenticate, getHSIFlowDetail)

// JT (Jaringan Tambahan) Dashboard
router.get('/jt/stats', authenticate, getJTDashboard)
router.get('/jt/filters', authenticate, getJTFilters)
router.get('/jt/report', authenticate, getJTReport)

// Reports (Data Table View)
router.get('/report-tambahan', authenticate, getReportTambahan)
router.get('/report-hsi', authenticate, getReportHSI)

// Exports
router.get('/export/report-analysis', exportReportAnalysis)

router.get('/export/report-hsi', exportReportHSI)
router.get('/export/jt-report', exportJTReport)

export default router