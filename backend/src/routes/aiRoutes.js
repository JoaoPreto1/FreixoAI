import { Router } from 'express';
import { handleChat } from '../controllers/aiController.js';
import { validateChatBody } from '../middleware/validate.js';

const router = Router();

router.post('/', validateChatBody, handleChat);

export default router;
