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
  getJTDashboard,
  getJTFilters,
  getJTReport,
  exportReportAnalysis,
  exportReportDatin,
  exportReportTambahan,
  exportReportHSI,
  exportJTReport,
  getHSIDashboard, 
  getHSIFlowStats,
  getHSIFlowDetail
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
router.get('/jt/dashboard', authenticate, getJTDashboard)
router.get('/jt/filters', authenticate, getJTFilters)
router.get('/jt/report', authenticate, getJTReport)
router.get('/export/report-analysis', authenticate, exportReportAnalysis)
router.get('/export/report-datin', authenticate, exportReportDatin)
router.get('/export/report-tambahan', authenticate, exportReportTambahan)
router.get('/export/report-hsi', authenticate, exportReportHSI)
router.get('/export/report-jt', authenticate, exportJTReport)
router.get('/hsi/dashboard', authenticate, getHSIDashboard)
router.get('/hsi/flow', authenticate, getHSIFlowStats)
router.get('/hsi/flow/detail', authenticate, getHSIFlowDetail)

export default router
