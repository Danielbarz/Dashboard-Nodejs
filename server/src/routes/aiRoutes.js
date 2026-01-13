import express from 'express';
import { chat } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js'; 

const router = express.Router();

// Protect the route so only logged-in users can use the AI
router.post('/chat', authenticate, chat);

export default router;
