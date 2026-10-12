import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

let supabaseClient = null;

export const getSupabaseClient = () => {
  if (supabaseClient) {
    return supabaseClient;
  }

  if (!ENV.SUPABASE_URL || !ENV.SUPABASE_SECRET_KEY) {
    if (!ENV.isTest) {
      console.warn('[Supabase Config] Credenciais de Supabase incompletas. A API operará em modo de dados locais verificados.');
    }
    return null;
  }

  try {
    supabaseClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SECRET_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    return supabaseClient;
  } catch (error) {
    console.error('[Supabase Config] Falha ao instanciar cliente Supabase:', error.message);
    return null;
  }
};
