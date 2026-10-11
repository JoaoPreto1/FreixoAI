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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Avalia a conectividade real dos serviços de backend (Node.js e FastAPI)
   * Sem falsos positivos: se o serviço não responder com 200 OK, é marcado como offline
   */
  async checkHealth() {
    const status = {
      nodeApi: false,
      fastApi: false,
      timestamp: new Date().toISOString()
    };

    // 1. Testar se o Gateway Node.js está operacional
    try {
      const res = await this.request(
        `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.HEALTH}`,
        { method: 'GET' },
        2000
      );
      status.nodeApi = Boolean(res && (res.status === 'ok' || res.healthy === true));
    } catch {
      status.nodeApi = false;
    }

    // 2. Testar se o serviço Python / FastAPI está operacional
    try {
      const res = await this.request(
        `${API_CONFIG.FASTAPI_AI.BASE_URL}${API_CONFIG.FASTAPI_AI.ENDPOINTS.HEALTH}`,
        { method: 'GET' },
        2000
      );
      status.fastApi = Boolean(res && (res.status === 'ok' || res.status === 'healthy'));
    } catch {
      status.fastApi = false;
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

    // Disparar evento para que a interface reflita o estado real
    window.dispatchEvent(
      new CustomEvent('freixo:apiStateChanged', { detail: { ...API_CONFIG.STATE } })
    );

    return status;
  }
}

export const apiService = new ApiService();
