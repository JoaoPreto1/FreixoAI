import { Router } from 'express';
import { getPlaces, getPlaceBySlug } from '../controllers/placesController.js';
import { validateSlugParam } from '../middleware/validate.js';

const router = Router();

router.get('/', getPlaces);
router.get('/:slug', validateSlugParam('slug'), getPlaceBySlug);

export default router;
