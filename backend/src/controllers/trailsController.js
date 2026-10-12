import { tourismService } from '../services/tourismService.js';

export const getTrails = async (req, res, next) => {
  try {
    const { difficulty, includeDemo } = req.query;

    const { items, source } = await tourismService.getTrails({
      difficulty,
      includeDemo
    });

    res.status(200).json({
      success: true,
      data: items,
      meta: {
        total: items.length,
        difficulty: difficulty || 'all',
        source
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

export const getTrailBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await tourismService.getTrailBySlug(slug);

    if (!result || !result.item) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TRAIL_NOT_FOUND',
          message: `O percurso com o identificador '${slug}' não foi encontrado.`,
          status: 404
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: result.item,
      meta: {
        source: result.source
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

