import { Router } from 'express';
import { getFreguesias } from '../controllers/freguesiasController.js';

const router = Router();

router.get('/', getFreguesias);

export default router;
