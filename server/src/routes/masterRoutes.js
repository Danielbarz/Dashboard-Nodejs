// server/src/routes/masterRoutes.js
import express from 'express'
import { authenticate } from '../middleware/auth.js' // Pastikan user login
import {
  getAccountOfficers,
  createAccountOfficer,
  deleteAccountOfficer,
  getPOMaster,
  createPOMaster,
  deletePOMaster,
  getUnmappedOrders,
  updateMapping,
  autoMapping
} from '../controllers/masterController.js'

const router = express.Router()

router.use(authenticate) // Kunci semua rute di bawah ini

// Account Officers
router.get('/account-officers', getAccountOfficers)
router.post('/account-officers', createAccountOfficer)
router.delete('/account-officers/:id', deleteAccountOfficer)

// PO Master
router.get('/po', getPOMaster)
router.post('/po', createPOMaster)
router.delete('/po/:id', deletePOMaster)

// Mapping / Unmapped Orders
router.get('/unmapped-orders', getUnmappedOrders)
router.put('/update-mapping/:id', updateMapping)
router.post('/auto-mapping', autoMapping)

export default router