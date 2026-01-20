import express from 'express'
import { authenticate } from '../middleware/auth.js'

// Import Modular Controllers
import * as reportJT from '../controllers/reportJTController.js'
import * as reportDatin from '../controllers/reportDatinController.js'
import * as reportAnalysis from '../controllers/reportAnalysisController.js'
import * as reportHSI from '../controllers/reportHSIController.js'

const router = express.Router()

// Jaringan Tambahan (JT)
router.get('/tambahan', authenticate, reportJT.getReportTambahan)

// SOS Datin
router.get('/datin-summary', authenticate, reportDatin.getReportDatinSummary)
router.get('/datin-details', authenticate, reportDatin.getReportDatinDetails)

// Digital Product Analysis
router.get('/analysis', authenticate, reportAnalysis.getReportAnalysis)
router.get('/details', authenticate, reportAnalysis.getReportDetails)
router.get('/kpi-po', authenticate, reportAnalysis.getKPIPOData)

// HSI
router.get('/hsi', authenticate, reportHSI.getReportHSI)
router.get('/hsi/date-range', authenticate, reportHSI.getHSIDateRange)

export default router