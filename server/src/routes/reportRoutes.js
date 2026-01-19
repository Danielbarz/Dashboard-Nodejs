import express from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  getReportTambahan,
  getReportDatin,
  getReportHSI,
  getHSIDateRange,
  getReportDetails,
  getKPIPOData,
  getReportDatinDetails,
  getReportDatinSummary
} from '../controllers/reportController.js'

const router = express.Router()

router.get('/tambahan', authenticate, getReportTambahan)
router.get('/datin', authenticate, getReportDatin)
router.get('/datin-details', authenticate, getReportDatinDetails)
router.get('/datin-summary', authenticate, getReportDatinSummary)
router.get('/hsi', authenticate, getReportHSI)
router.get('/hsi/date-range', authenticate, getHSIDateRange)
router.get('/details', authenticate, getReportDetails)
router.get('/kpi-po', authenticate, getKPIPOData)

export default router
