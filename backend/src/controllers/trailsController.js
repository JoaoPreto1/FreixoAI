/**
 * FREIXO AI — Trails Controller
 * Percursos pedestres e rotas turísticas do concelho de Freixo de Espada à Cinta.
 */

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
