import express from 'express'
import { authenticate } from '../middleware/auth.js'
import { getAllHSIData, deleteHSIRecord } from '../controllers/hsiController.js'

const router = express.Router()

// Get all HSI data
router.get('/', authenticate, getAllHSIData)

// Delete HSI record by orderId
router.delete('/:orderId', authenticate, deleteHSIRecord)

export default router
