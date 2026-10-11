/**
 * FREIXO AI — Serviço de Comunicação HTTP
 * Encapsula chamadas REST, gestão de timeouts e fallback transparente para Mock
 */

import { API_CONFIG } from '../config/apiConfig.js';

class ApiService {
  /**
   * Executa um fetch com controlo de tempo limite (timeout)
   */
  async request(url, options = {}, timeoutMs = 6000) {
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
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Verifica o estado de conectividade das APIs backend
   */
  async checkHealth() {
    const status = {
      nodeApi: false,
      fastApi: false,
      timestamp: new Date().toISOString()
    };

    // Testar Node.js Express
    try {
      const res = await this.request(`${API_CONFIG.NODE_API.BASE_URL}/health`, {}, 2500);
      status.nodeApi = Boolean(res?.status === 'ok' || res?.healthy);
    } catch {
      status.nodeApi = false;
    }

    // Testar FastAPI
    try {
      const res = await this.request(`${API_CONFIG.FASTAPI_AI.BASE_URL}${API_CONFIG.FASTAPI_AI.ENDPOINTS.HEALTH}`, {}, 2500);
      status.fastApi = Boolean(res?.status === 'ok' || res?.healthy);
    } catch {
      status.fastApi = false;
    }

    API_CONFIG.STATE.nodeConnected = status.nodeApi;
    API_CONFIG.STATE.fastApiConnected = status.fastApi;
    API_CONFIG.STATE.lastChecked = status.timestamp;

    return status;
  }
}

export const apiService = new ApiService();
