/**
 * FREIXO AI — Middleware de CORS configurado por CLIENT_ORIGIN
 */

import cors from 'cors';
import { ENV } from '../config/env.js';

const parseAllowedOrigins = () => {
  const origins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  if (ENV.CLIENT_ORIGIN) {
    ENV.CLIENT_ORIGIN.split(',').forEach(o => {
      const trimmed = o.trim();
      if (trimmed && !origins.includes(trimmed)) {
        origins.push(trimmed);
      }
    });
  }
  return origins;
};

const allowedOrigins = parseAllowedOrigins();

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Permitir requisições sem header Origin (Postman, curl, scripts de teste)
    if (!origin) return callback(null, true);

    // Em ambiente de desenvolvimento ou testes, permitir qualquer porta local
    if (!ENV.isProduction) {
      if (
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Acesso bloqueado por política CORS para a origem: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400
});
