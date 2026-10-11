/**
 * FREIXO AI — Serviço de Comunicação HTTP
 * Encapsula chamadas REST, controlo de tempos limites e deteção de conectividade real
 */

import { API_CONFIG } from '../config/apiConfig.js';

class ApiService {
  /**
   * Executa um pedido HTTP com timeout e cancelamento seguro
   */
  async request(url, options = {}, timeoutMs = 4000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {})
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetail = '';
        try {
          const errJson = await response.json();
          errorDetail = errJson.error?.message || errJson.message || errJson.detail || '';
        } catch {
          // Resposta não-JSON
        }
        const message = errorDetail 
          ? `HTTP ${response.status}: ${errorDetail}` 
          : `HTTP ${response.status}: ${response.statusText}`;
        const err = new Error(message);
        err.status = response.status;
        throw err;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Avalia a conectividade real dos serviços de backend (Node.js e FastAPI)
   * Sem falsos positivos: reflete fielmente o estado real da infraestrutura
   */
  async checkHealth() {
    const status = {
      nodeApi: false,
      fastApi: false,
      details: {},
      timestamp: new Date().toISOString()
    };

    // 1. Testar se o Gateway Node.js está operacional e recolher integridade dos serviços
    try {
      const res = await this.request(
        `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.HEALTH}`,
        { method: 'GET' },
        3000
      );
      status.nodeApi = Boolean(res && (res.status === 'ok' || res.healthy === true));
      status.details.node = res;
      status.fastApi = Boolean(res?.integrations?.fastapi?.online);
      status.supabase = res?.integrations?.supabase || null;

      API_CONFIG.STATE.supabaseConnected = Boolean(res?.integrations?.supabase?.connected);
      API_CONFIG.STATE.supabaseStatus = res?.integrations?.supabase?.status || null;
    } catch (err) {
      status.nodeApi = false;
      status.details.nodeError = err.message;
    }

    // Determinar modo ativo com base nas respostas reais do Gateway
    if (status.nodeApi) {
      API_CONFIG.STATE.activeMode = 'node_gateway';
    } else {
      API_CONFIG.STATE.activeMode = 'demonstracao_local';
    }

    API_CONFIG.STATE.nodeConnected = status.nodeApi;
    API_CONFIG.STATE.fastApiConnected = status.fastApi;
    API_CONFIG.STATE.lastChecked = status.timestamp;

    // Disparar evento para que todos os componentes da interface atualizem o seu estado
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('freixo:apiStateChanged', { detail: { ...API_CONFIG.STATE, integrations: status.details.node?.integrations } })
      );
    }

    return status;
  }
}

export const apiService = new ApiService();
