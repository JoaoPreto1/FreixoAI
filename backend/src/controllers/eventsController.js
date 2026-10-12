import { tourismService } from '../services/tourismService.js';

export const getEvents = async (req, res, next) => {
  try {
    const { category, includeDemo } = req.query;

    const { items, source } = await tourismService.getEvents({
      category,
      includeDemo
    });

    res.status(200).json({
      success: true,
      data: items,
      meta: {
        total: items.length,
        category: category || 'all',
        source
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

export const getEventBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await tourismService.getEventBySlug(slug);

    if (!result || !result.item) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EVENT_NOT_FOUND',
          message: `Evento com identificador '${slug}' não encontrado.`,
          status: 404
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: result.item,
      meta: {
        source: result.source,
        id: result.item.id,
        slug: result.item.slug
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
