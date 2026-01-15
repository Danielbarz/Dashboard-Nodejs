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
  getHSIFlowDetail,
  getSOSDatinFilters,
  getSOSDatinDashboard,
  getDigitalProductDashboard,
  getDigitalProductFilters
} from '../controllers/dashboardController.js'

const router = express.Router()
// ... existing routes ...
// Digital Product Dashboard Charts
router.get('/digital-product/filters', authenticate, getDigitalProductFilters)
router.get('/digital-product/stats', authenticate, getDigitalProductDashboard)

export default router
