import { Router } from 'express';
import { getTrails } from '../controllers/trailsController.js';

const router = Router();

router.get('/', getTrails);

export default router;
