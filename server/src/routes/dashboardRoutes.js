import express from 'express'
import { authenticate } from '../middleware/auth.js'

import {
  getJTDashboard,
  getJTFilters,
  getJTReport,
  getReportTambahan,
  exportReportTambahan,
  exportJTReport
} from '../controllers/dashboardJTController.js'

import {
  getReportDatin,
  getSOSDatinFilters,
  getSOSDatinDashboard,
  exportReportDatin
} from '../controllers/dashboardDatinController.js'

import {
  getDigitalProductDashboard,
  getDigitalProductFilters,
  getKPIData,
  getRevenueByWitel,
  getAmountByWitel,
  getReportAnalysis,
  exportReportAnalysis,
  getTotalOrderByRegional,
  getSebaranDataPS,
  getCancelByFCC,
  getFilterOptions,
  getDashboardData
} from '../controllers/dashboardDigitalController.js'

import {
  getHSIDashboard,
  getHSIFlowStats,
  getHSIFlowDetail
} from '../controllers/dashboardHSIController.js'

const router = express.Router()

// Dashboard Main Data
router.get('/', authenticate, getDashboardData)

// SOS Dashboard Charts (Digital/General)
router.get('/revenue-by-witel', authenticate, getRevenueByWitel)
router.get('/amount-by-witel', authenticate, getAmountByWitel)
router.get('/kpi', authenticate, getKPIData)
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
router.get('/hsi/dashboard', authenticate, getHSIDashboard)
router.get('/hsi/flow', authenticate, getHSIFlowStats)
router.get('/hsi/flow/detail', authenticate, getHSIFlowDetail)

// JT (Jaringan Tambahan) Dashboard
router.get('/jt/stats', authenticate, getJTDashboard)
router.get('/jt/filters', authenticate, getJTFilters)
router.get('/jt/report', authenticate, getJTReport)

// Reports (Data Table View)
router.get('/report-tambahan', authenticate, getReportTambahan)
router.get('/report-datin', authenticate, getReportDatin)
router.get('/report-analysis', authenticate, getReportAnalysis)

// Exports
router.get('/export/report-analysis', exportReportAnalysis)
router.get('/export/report-datin', exportReportDatin)
router.get('/export/report-tambahan', exportReportTambahan)

export default router