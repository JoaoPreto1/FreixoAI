import { ENV } from '../config/env.js';

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `A rota solicitada '${req.method} ${req.originalUrl}' não foi encontrada na API.`,
      status: 404
    },
    timestamp: new Date().toISOString()
  });
};

export const centralErrorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const isServerFault = status >= 500;

  if (isServerFault && !ENV.isTest) {
    console.error(`[ERRO INTERNO ${req.method} ${req.originalUrl}]:`, err);
  }

  const response = {
    success: false,
    error: {
      code: err.code || (isServerFault ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST'),
      message: err.message || 'Ocorreu um erro inesperado no servidor.',
      status
    },
    timestamp: new Date().toISOString()
  };

  if (!ENV.isProduction && isServerFault && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(status).json(response);
};
