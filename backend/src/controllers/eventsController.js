/**
 * FREIXO AI — Events Controller
 * Eventos, festas tradicionais e feiras de Freixo de Espada à Cinta.
 */

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
