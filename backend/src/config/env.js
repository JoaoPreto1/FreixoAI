
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o .env localizado na raiz da pasta backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  FASTAPI_URL: (process.env.FASTAPI_URL || 'http://127.0.0.1:8000').replace(/\/$/, ''),
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test'
};

// Verificação de segurança: garantir que as chaves não estão vazias em produção
if (ENV.isProduction && (!ENV.SUPABASE_URL || !ENV.SUPABASE_SECRET_KEY)) {
  console.warn('[AVISO DE CONFIGURAÇÃO] SUPABASE_URL ou SUPABASE_SECRET_KEY não estão definidas no ambiente de produção.');
}
