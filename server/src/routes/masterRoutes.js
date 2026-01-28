import express from 'express'
import { authenticate } from '../middleware/auth.js'
import {
    getPOMaster,
    getAccountOfficers,
    getUnmappedOrders,
    getTargets,
    getTargetById,
    createTarget,
    updateTarget,
    deleteTarget,
    updateMapping,
    autoMapping,
    createAccountOfficer,
    deleteAccountOfficer,
    createPOMaster,
    deletePOMaster
} from '../controllers/masterController.js'
import {
    getDigitalRawData,
    deleteDigitalRawData,
    processDigitalRawData
} from '../controllers/digitalRawController.js'

const router = express.Router()

router.use(authenticate) // Pastikan user login

// --- DIGITAL RAW DATA PROCESSING ---
router.get('/digital-raw', getDigitalRawData)
router.delete('/digital-raw/:id', deleteDigitalRawData)
router.post('/digital-raw/process', processDigitalRawData)

router.get('/po', getPOMaster)
router.post('/po', createPOMaster)
router.delete('/po/:id', deletePOMaster)

router.get('/account-officers', getAccountOfficers)
router.post('/account-officers', createAccountOfficer)
router.delete('/account-officers/:id', deleteAccountOfficer)

router.get('/unmapped-orders', getUnmappedOrders)
router.put('/update-mapping/:id', updateMapping)
router.post('/auto-mapping', autoMapping)

// Target Routes
router.get('/targets', getTargets)
router.get('/targets/:id', getTargetById)
router.post('/targets', createTarget)
router.put('/targets/:id', updateTarget)
router.delete('/targets/:id', deleteTarget)

// Tambahkan route POST/DELETE jika perlu
// router.post('/po', createPO)
// router.delete('/po/:id', deletePO)

export default router