import express from 'express';
import { ENV } from './config/env.js';
import { corsMiddleware } from './middleware/cors.js';
import { notFoundHandler, centralErrorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

export const createApp = () => {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.get('/', (req, res) => {
    res.status(200).json({
      name: 'Freixo AI — Backend API',
      version: '1.0.0',
      description: 'API Node.js/Express para o ecossistema turístico e territorial de Freixo de Espada à Cinta',
      documentation: '/api/health',
      endpoints: [
        'GET /api/health',
        'GET /api/freguesias',
        'GET /api/places',
        'GET /api/places/:slug',
        'GET /api/trails',
        'GET /api/trails/:slug',
        'GET /api/events',
        'GET /api/events/:slug',
        'GET /api/search',
        'POST /api/chat',
        'POST /api/itinerary/generate'
      ],
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api', apiRouter);
  app.use(notFoundHandler);
  app.use(centralErrorHandler);

  return app;
};

const app = createApp();

// Se executado diretamente (ex: node src/app.js)
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('app.js') ||
  process.argv[1].endsWith('app')
);

if (isDirectRun && process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, () => {
    console.log(`[Freixo AI] Servidor Express ativo em: http://localhost:${ENV.PORT}`);
    console.log(`[Freixo AI] Gateway configurado para FastAPI em: ${ENV.FASTAPI_URL}`);
    console.log(`[Freixo AI] Modo de execução: ${ENV.NODE_ENV}`);
  });
}

export default app;
