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
    let isSupabaseConnected = false;
    let hasRagTables = false;
    let hasTouristTables = false;

    // Testar conectividade real ao Supabase e existência de tabelas
    if (supabase) {
      try {
        const ragRes = await supabase.from('sources').select('id').limit(1);
        if (!ragRes.error) {
          isSupabaseConnected = true;
          hasRagTables = true;
          supabaseStatus = 'connected';
        }

        const touristRes = await supabase.from('places').select('id').limit(1);
        if (!touristRes.error) {
          hasTouristTables = true;
        }
      } catch (err) {
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
          connected: isSupabaseConnected,
          rag_tables: hasRagTables ? 'present' : 'missing',
          tourist_tables: hasTouristTables ? 'ready' : 'pending_migration',
          active_source: hasTouristTables ? 'supabase_db' : 'demonstracao_local',
          details: hasTouristTables 
            ? 'Tabelas turísticas ativas e sincronizadas no Supabase'
            : 'Conexão ativa ao Supabase com tabelas RAG; tabelas turísticas pendentes de migração (fallback local ativo)',
          url: ENV.SUPABASE_URL ? ENV.SUPABASE_URL.replace(/https?:\/\//, '').split('.')[0] + '...' : null
        },
        fastapi: {
          status: fastApiHealth.status,
          online: Boolean(fastApiHealth.online),
          ollama: fastApiHealth.ollama || (fastApiHealth.online ? 'connected' : 'disconnected'),
          models: fastApiHealth.models || [],
          url: ENV.FASTAPI_URL
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
