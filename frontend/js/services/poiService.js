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
    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.POIS}`;
      const res = await apiService.request(url, {}, 2500);
      const items = Array.isArray(res) ? res : (res?.data || []);
      if (Array.isArray(items) && items.length > 0) {
        return items.map(item => ({
          ...item,
          image: item.image || item.image_url || 'assets/images/penedo-durao.png',
          categoryLabel: item.categoryLabel || item.category_label || item.category,
          shortDescription: item.shortDescription || item.short_description || '',
          fullDescription: item.fullDescription || item.full_description || '',
          coordinates: item.coordinates || (item.latitude && item.longitude ? { lat: item.latitude, lng: item.longitude } : null),
          _provenance: item._provenance || 'api_node'
        }));
      }
    } catch {
      // Backend offline ou rota inexistente — recorrer a dados locais
    }

    return POIS_DATA.map(item => ({ ...item, _provenance: 'demonstracao_local' }));
  }

  /**
   * Obtém um ponto de interesse pelo seu ID
   */
  async getPoiById(id) {
    if (!id) return null;

    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.POI_DETAIL(id)}`;
      const res = await apiService.request(url, {}, 2500);
      const data = res?.data || res;
      if (data && data.id) {
        return {
          ...data,
          image: data.image || data.image_url || 'assets/images/penedo-durao.png',
          categoryLabel: data.categoryLabel || data.category_label || data.category,
          shortDescription: data.shortDescription || data.short_description || '',
          fullDescription: data.fullDescription || data.full_description || '',
          coordinates: data.coordinates || (data.latitude && data.longitude ? { lat: data.latitude, lng: data.longitude } : null),
          _provenance: data._provenance || 'api_node'
        };
      }
    } catch {
      // Fallback
    }

    const found = POIS_DATA.find(poi => poi.id === id);
    return found ? { ...found, _provenance: 'demonstracao_local' } : null;
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
      const res = await apiService.request(url, {}, 2500);
      const items = Array.isArray(res) ? res : (res?.data || []);
      if (Array.isArray(items) && items.length > 0) return items;
    } catch {
      // Fallback
    }
    return [...ROUTES_DATA];
  }

  /**
   * Obtém informações completas de gastronomia e vinhos
   */
  async getGastronomy() {
    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.GASTRONOMY}`;
      const data = await apiService.request(url, {}, 1500);
      if (data && data.dishes) return data;
    } catch {
      // Fallback
    }
    return { ...GASTRONOMY_DATA };
  }

  /**
   * Obtém informações completas de património e lendas
   */
  async getHeritage() {
    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.HERITAGE}`;
      const data = await apiService.request(url, {}, 1500);
      if (data && data.silkTradition) return data;
    } catch {
      // Fallback
    }
    return { ...HERITAGE_DATA };
  }
}

export const poiService = new PoiService();
