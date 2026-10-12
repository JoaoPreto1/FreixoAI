import { Router } from 'express';
import { getEvents, getEventBySlug } from '../controllers/eventsController.js';
import { validateSlugParam } from '../middleware/validate.js';

const router = Router();

router.get('/', getEvents);
router.get('/:slug', validateSlugParam('slug'), getEventBySlug);

export default router;
