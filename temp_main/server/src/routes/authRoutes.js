import express from 'express'
import { register, login, refreshToken, getProfile } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'
import { validate, loginValidation, registerValidation } from '../middleware/validator.js'

const router = express.Router()

router.post('/register', validate(registerValidation), register)
router.post('/login', validate(loginValidation), login)
router.post('/refresh-token', refreshToken)
router.get('/profile', authenticate, getProfile)

export default router
