/**
 * FREIXO AI — Router Central da API (/api)
 */

import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import freguesiasRoutes from './freguesiasRoutes.js';
import placesRoutes from './placesRoutes.js';
import trailsRoutes from './trailsRoutes.js';
import eventsRoutes from './eventsRoutes.js';
import aiRoutes from './aiRoutes.js';

const apiRouter = Router();

// 1. Rotas Canónicas da Especificação
apiRouter.use('/health', healthRoutes);
apiRouter.use('/freguesias', freguesiasRoutes);
apiRouter.use('/places', placesRoutes);
apiRouter.use('/trails', trailsRoutes);
apiRouter.use('/events', eventsRoutes);
apiRouter.use('/chat', aiRoutes);

// 2. Aliases de retrocompatibilidade com o frontend atual
apiRouter.use('/pois', placesRoutes);
apiRouter.use('/routes', trailsRoutes);

export default apiRouter;
