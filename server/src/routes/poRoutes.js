import express from 'express'
import {
  getMasterData,
  getUnmappedOrders,
  getPoOptions,
  mapOrder,
  manualStoreMaster,
  getAccountOfficers,
  addAccountOfficer,
  deleteAccountOfficer
} from '../controllers/poController.js'
import { validate, paginationValidation } from '../middleware/validator.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.use(protect) // All routes protected

// Master Data
router.get('/master', validate(paginationValidation), getMasterData)
router.post('/master', manualStoreMaster)

// Unmapped Orders
router.get('/unmapped', validate(paginationValidation), getUnmappedOrders)
router.post('/map', mapOrder)

// Account Officers
router.get('/ao', getAccountOfficers)
router.post('/ao', addAccountOfficer)
router.delete('/ao/:id', deleteAccountOfficer)

// Options
router.get('/options', getPoOptions)

export default router
