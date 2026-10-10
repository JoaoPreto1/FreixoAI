/**
 * FREIXO AI — Serviço de Pontos de Interesse (POIs) e Conteúdos
 * Gere os dados com arquitetura pronta para API Node.js/Express e fallback resiliente
 */

import { apiService } from './apiService.js';
import { API_CONFIG } from '../config/apiConfig.js';
import { POIS_DATA, CATEGORIES } from '../data/mockPois.js';
import { ROUTES_DATA } from '../data/mockRoutes.js';
import { GASTRONOMY_DATA } from '../data/mockGastronomy.js';
import { HERITAGE_DATA } from '../data/mockHeritage.js';

class PoiService {
  /**
   * Obtém todos os pontos de interesse
   */
  async getAllPois() {
    if (!API_CONFIG.USE_MOCK_FALLBACK) {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.POIS}`;
      return await apiService.request(url, {}, API_CONFIG.NODE_API.TIMEOUT_MS);
    }

    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.POIS}`;
      const data = await apiService.request(url, {}, 1500);
      return data;
    } catch {
      // Fallback transparente e instantâneo para dados locais de demonstração
      return [...POIS_DATA];
    }
  }

  /**
   * Obtém um ponto de interesse pelo seu ID
   */
  async getPoiById(id) {
    if (!id) return null;

    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.POI_DETAIL(id)}`;
      const data = await apiService.request(url, {}, 1500);
      return data;
    } catch {
      return POIS_DATA.find(poi => poi.id === id) || null;
    }
  }

  /**
   * Filtra pontos por categoria
   */
  async getPoisByCategory(category) {
    const all = await this.getAllPois();
    if (!category || category === 'all') return all;
    return all.filter(poi => poi.category === category);
  }

  /**
   * Pesquisa textual de pontos de interesse
   */
  async searchPois(query) {
    const all = await this.getAllPois();
    if (!query || query.trim() === '') return all;

    const q = query.toLowerCase().trim();
    return all.filter(poi => {
      const inTitle = poi.title.toLowerCase().includes(q);
      const inShort = poi.shortDescription.toLowerCase().includes(q);
      const inFull = poi.fullDescription?.toLowerCase().includes(q);
      const inLocation = poi.location?.toLowerCase().includes(q);
      const inHighlights = poi.highlights?.some(h => h.toLowerCase().includes(q));
      return inTitle || inShort || inFull || inLocation || inHighlights;
    });
  }

  /**
   * Retorna as categorias disponíveis
   */
  getCategories() {
    return [...CATEGORIES];
  }

  /**
   * Obtém todos os roteiros pré-configurados
   */
  async getAllRoutes() {
    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.ROUTES}`;
      const data = await apiService.request(url, {}, 1500);
      return data;
    } catch {
      return [...ROUTES_DATA];
    }
  }

  /**
   * Obtém informações completas de gastronomia e vinhos
   */
  async getGastronomy() {
    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.GASTRONOMY}`;
      const data = await apiService.request(url, {}, 1500);
      return data;
    } catch {
      return { ...GASTRONOMY_DATA };
    }
  }

  /**
   * Obtém informações completas de património e lendas
   */
  async getHeritage() {
    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.HERITAGE}`;
      const data = await apiService.request(url, {}, 1500);
      return data;
    } catch {
      return { ...HERITAGE_DATA };
    }
  }
}

export const poiService = new PoiService();
