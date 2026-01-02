import express from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  getReportTambahan,
  getReportDatin,
  getReportAnalysis,
  getReportHSI,
  getReportDetails,
  getKPIPOData
} from '../controllers/reportController.js'

const router = express.Router()

router.get('/tambahan', authenticate, getReportTambahan)
router.get('/datin', authenticate, getReportDatin)
router.get('/analysis', authenticate, getReportAnalysis)
router.get('/hsi', authenticate, getReportHSI)
router.get('/details', authenticate, getReportDetails)
router.get('/kpi-po', authenticate, getKPIPOData)

export default router
