import express from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  getReportTambahan,
  getReportDatin,
  getReportAnalysis,
  getReportHSI
} from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/tambahan', authenticate, getReportTambahan)
router.get('/datin', authenticate, getReportDatin)
router.get('/analysis', authenticate, getReportAnalysis)
router.get('/hsi', authenticate, getReportHSI)

export default router
