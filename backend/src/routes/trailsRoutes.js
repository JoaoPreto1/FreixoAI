import { Router } from 'express';
import { getTrails, getTrailBySlug } from '../controllers/trailsController.js';
import { validateSlugParam } from '../middleware/validate.js';

const router = Router();

router.get('/', getTrails);
router.get('/:slug', validateSlugParam('slug'), getTrailBySlug);

export default router;

