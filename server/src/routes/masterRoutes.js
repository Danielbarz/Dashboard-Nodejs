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
    deleteTarget
} from '../controllers/masterController.js'

const router = express.Router()

router.use(authenticate) // Pastikan user login

router.get('/po', getPOMaster)
router.get('/account-officers', getAccountOfficers)
router.get('/unmapped-orders', getUnmappedOrders)

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