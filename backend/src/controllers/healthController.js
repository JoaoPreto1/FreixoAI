/**
 * FREIXO AI — Health Controller
 * Monitorização de integridade da API, base de dados Supabase e serviço FastAPI.
 */

import { ENV } from '../config/env.js';
import { getSupabaseClient } from '../config/supabase.js';
import { aiGatewayService } from '../services/aiGatewayService.js';

export const getHealth = async (req, res, next) => {
  try {
    const supabase = getSupabaseClient();
    const isSupabaseConfigured = Boolean(ENV.SUPABASE_URL && ENV.SUPABASE_SECRET_KEY);
    
    let supabaseStatus = isSupabaseConfigured ? 'configured' : 'not_configured';

    // Teste leve ao Supabase se configurado
    if (supabase) {
      try {
        const { error } = await supabase.from('sources').select('id').limit(1);
        if (!error) {
          supabaseStatus = 'connected';
        }
      } catch {
        supabaseStatus = 'unreachable';
      }
    }

    // Testar serviço FastAPI
    const fastApiHealth = await aiGatewayService.checkHealth();

    res.status(200).json({
      status: 'ok',
      healthy: true,
      service: 'freixo-ai-backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: ENV.NODE_ENV,
      integrations: {
        supabase: {
          status: supabaseStatus,
          url: ENV.SUPABASE_URL ? ENV.SUPABASE_URL.replace(/https?:\/\//, '').split('.')[0] + '...' : null
        },
        fastapi: {
          online: fastApiHealth.online,
          status: fastApiHealth.status,
          url: ENV.FASTAPI_URL
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
