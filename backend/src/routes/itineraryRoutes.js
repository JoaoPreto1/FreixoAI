import { Router } from 'express';
import { generateItinerary } from '../controllers/itineraryController.js';
import { validateItineraryBody } from '../middleware/validate.js';

const router = Router();

router.post('/generate', validateItineraryBody, generateItinerary);
router.post('/', validateItineraryBody, generateItinerary);

export default router;
