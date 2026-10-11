/**
 * FREIXO AI — Freguesias Controller
 * Fornece a informação territorial oficial do concelho de Freixo de Espada à Cinta.
 */

import { tourismService } from '../services/tourismService.js';

export const getFreguesias = async (req, res, next) => {
  try {
    const { items, source } = await tourismService.getFreguesias();

    res.status(200).json({
      success: true,
      data: items,
      meta: {
        total: items.length,
        municipality: 'Freixo de Espada à Cinta',
        district: 'Bragança',
        source
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
