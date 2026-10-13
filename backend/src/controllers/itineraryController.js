import { itineraryService } from '../services/itineraryService.js';

export const generateItinerary = async (req, res, next) => {
  try {
    const { days, pace, interest, mobility, seed } = req.body;

    const plan = await itineraryService.generateItinerary({
      days,
      pace,
      interest,
      mobility,
      seed
    });

    return res.status(200).json({
      success: true,
      data: plan,
      summary: plan.summary,
      days: plan.days,
      meta: plan.meta,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
