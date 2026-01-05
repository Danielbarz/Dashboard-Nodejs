import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  getAccountOfficers,
  createAccountOfficer,
  deleteAccountOfficer,
  getPOMaster,
  createPO,
  deletePO,
  getUnmappedOrders,
  updateOrderMapping,
  autoMapOrders
} from '../controllers/masterController.js'

const router = express.Router()

// Apply authentication and admin check to all routes
router.use(authenticate)
router.use(authorize('admin', 'superadmin'))

// Account Officer routes
router.get('/account-officers', getAccountOfficers)
router.post('/account-officers', createAccountOfficer)
router.delete('/account-officers/:id', deleteAccountOfficer)

// PO Master routes
router.get('/po', getPOMaster)
router.post('/po', createPO)
router.delete('/po/:id', deletePO)

// Unmapped Orders routes
router.get('/unmapped-orders', getUnmappedOrders)
router.put('/update-mapping/:id', updateOrderMapping)
router.post('/auto-mapping', autoMapOrders)

export default router
