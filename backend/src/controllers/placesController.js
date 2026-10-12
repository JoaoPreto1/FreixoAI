import { tourismService } from '../services/tourismService.js';

export const getPlaces = async (req, res, next) => {
  try {
    const { category, freguesia, search, includeDemo, raw } = req.query;

    const { items, source } = await tourismService.getPlaces({
      category,
      freguesia,
      search,
      includeDemo
    });

    if (raw === 'true') {
      return res.status(200).json(items);
    }

    res.status(200).json({
      success: true,
      data: items,
      meta: {
        total: items.length,
        filters: {
          category: category || 'all',
          freguesia: freguesia || 'all',
          search: search || null
        },
        source
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

export const getPlaceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await tourismService.getPlaceBySlug(slug);

    if (!result || !result.item) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PLACE_NOT_FOUND',
          message: `O local com o identificador '${slug}' não foi encontrado.`,
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
