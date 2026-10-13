import { tourismService } from '../services/tourismService.js';

export const globalSearch = async (req, res, next) => {
  try {
    const rawQuery = Array.isArray(req.query.q)
      ? req.query.q[0]
      : (req.query.q || req.query.query || req.query.search || '');
    const query = typeof rawQuery === 'string' ? rawQuery.trim().slice(0, 100) : '';
    const includeDemo = req.query.includeDemo !== 'false';

    const result = await tourismService.search({ query, includeDemo });

    res.status(200).json({
      success: true,
      data: result.results,
      meta: {
        query: result.query,
        total: result.total,
        counts: {
          places: result.results.places.length,
          trails: result.results.trails.length,
          events: result.results.events.length,
          freguesias: result.results.freguesias.length
        },
        source: result.source
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
