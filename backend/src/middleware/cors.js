/**
 * FREIXO AI — Middleware de CORS
 */

import cors from 'cors';
import { ENV } from '../config/env.js';

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ENV.CLIENT_ORIGIN
].filter(Boolean);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Permitir pedidos sem origin (Postman, scripts curl, mobile apps locais)
    if (!origin) return callback(null, true);
    
    // No modo dev, permitir qualquer localhost ou 127.0.0.1
    if (!ENV.isProduction) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Acesso não permitido por política CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400
});
