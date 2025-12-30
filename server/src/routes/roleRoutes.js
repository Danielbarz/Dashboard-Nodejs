import express from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  switchRole,
  getCurrentRole
} from '../controllers/roleController.js'

const router = express.Router()

router.post('/switch-role', authenticate, switchRole)
router.get('/current-role', authenticate, getCurrentRole)

export default router
