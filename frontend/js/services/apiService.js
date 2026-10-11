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

    // 1. Testar se o Gateway Node.js está operacional
    try {
      const res = await this.request(
        `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.HEALTH}`,
        { method: 'GET' },
        2500
      );
      status.nodeApi = Boolean(res && (res.status === 'ok' || res.healthy === true));
      status.details.node = res;
      // Se o Node.js já reporta que o FastAPI está online internamente
      if (res?.integrations?.fastapi?.online) {
        status.fastApi = true;
      }
    } catch (err) {
      status.nodeApi = false;
      status.details.nodeError = err.message;
    }

    // 2. Se o FastAPI ainda não foi confirmado pelo gateway, testar endpoint direto
    if (!status.fastApi) {
      try {
        const res = await this.request(
          `${API_CONFIG.FASTAPI_AI.BASE_URL}${API_CONFIG.FASTAPI_AI.ENDPOINTS.HEALTH}`,
          { method: 'GET' },
          2500
        );
        status.fastApi = Boolean(res && (res.status === 'ok' || res.status === 'healthy'));
        status.details.fastApi = res;
      } catch (err) {
        status.fastApi = false;
        status.details.fastApiError = err.message;
      }
    }

    // Determinar modo ativo com base nas respostas reais
    if (status.nodeApi) {
      API_CONFIG.STATE.activeMode = 'node_gateway';
    } else if (status.fastApi) {
      API_CONFIG.STATE.activeMode = 'fastapi_direto';
    } else {
      API_CONFIG.STATE.activeMode = 'demonstracao_local';
    }

    API_CONFIG.STATE.nodeConnected = status.nodeApi;
    API_CONFIG.STATE.fastApiConnected = status.fastApi;
    API_CONFIG.STATE.lastChecked = status.timestamp;

    // Disparar evento para que todos os componentes da interface atualizem o seu estado
    window.dispatchEvent(
      new CustomEvent('freixo:apiStateChanged', { detail: { ...API_CONFIG.STATE } })
    );

    return status;
  }
}

export const apiService = new ApiService();
