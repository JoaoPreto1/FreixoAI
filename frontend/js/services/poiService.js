/**
 * FREIXO AI — Serviço de Pontos de Interesse (POIs), Freguesias, Percursos e Eventos
 * Integração robusta com a API Node.js/Express, normalização de dados e tratamento explícito de fallback.
 */

import { apiService } from './apiService.js';
import { API_CONFIG } from '../config/apiConfig.js';
import { POIS_DATA, CATEGORIES } from '../data/mockPois.js';
import { ROUTES_DATA } from '../data/mockRoutes.js';
import { GASTRONOMY_DATA } from '../data/mockGastronomy.js';
import { HERITAGE_DATA } from '../data/mockHeritage.js';
import { FREGUESIAS_DATA } from '../data/mockFreguesias.js';
import { EVENTS_DATA } from '../data/mockEvents.js';

class PoiService {
  constructor() {
    this.lastStatus = {
      pois: { success: null, source: null, isFallback: false, error: null },
      freguesias: { success: null, source: null, isFallback: false, error: null },
      trails: { success: null, source: null, isFallback: false, error: null },
      events: { success: null, source: null, isFallback: false, error: null }
    };
  }

  /**
   * Normaliza os campos de um local/POI para garantir compatibilidade entre backend e componentes
   */
  normalizePoi(item, defaultProvenance = 'api_node') {
    if (!item) return null;
    return {
      ...item,
      id: item.id || item.slug,
      slug: item.slug || item.id,
      title: item.title || '',
      category: item.category || 'patrimonio',
      categoryLabel: item.categoryLabel || item.category_label || item.category,
      shortDescription: item.shortDescription || item.short_description || '',
      fullDescription: item.fullDescription || item.full_description || item.shortDescription || '',
      location: item.location || 'Freixo de Espada à Cinta',
      coordinates: item.coordinates || (item.latitude && item.longitude ? { lat: item.latitude, lng: item.longitude } : null),
      image: item.image || item.image_url || 'assets/images/penedo-durao.png',
      highlights: item.highlights || [],
      verification: item.verification || {
        status: item.verification_status || 'confirmado',
        source: item.verification_source || 'Oficial',
        isAudioDemo: true,
        notes: item.notes || ''
      },
      is_demo: Boolean(item.is_demo),
      _provenance: item._provenance || defaultProvenance
    };
  }

  /**
   * Obtém todos os pontos de interesse a partir da rota GET /api/places
   */
  async getAllPois(filters = {}) {
    const { category, freguesia, search } = filters;
    const queryParams = new URLSearchParams();

    if (category && category !== 'all') queryParams.set('category', category);
    if (freguesia && freguesia !== 'all') queryParams.set('freguesia', freguesia);
    if (search && search.trim()) queryParams.set('search', search.trim());

    const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.PLACES}${qs}`;

    try {
      const res = await apiService.request(url, {}, 3000);
      const items = Array.isArray(res) ? res : (res?.data || []);
      const source = res?.meta?.source || 'api_node';

      if (Array.isArray(items)) {
        this.lastStatus.pois = {
          success: true,
          source,
          isFallback: false,
          error: null,
          total: items.length
        };

        const normalized = items.map(p => this.normalizePoi(p, 'api_node'));
        window.dispatchEvent(new CustomEvent('freixo:poisLoaded', { detail: { ...this.lastStatus.pois } }));
        return normalized;
      }
    } catch (err) {
      console.warn('[PoiService] Falha na comunicação com a rota /places:', err.message);
      this.lastStatus.pois = {
        success: false,
        source: 'demonstracao_local',
        isFallback: true,
        error: err.message
      };
      window.dispatchEvent(new CustomEvent('freixo:poisLoaded', { detail: { ...this.lastStatus.pois } }));
    }

    // Fallback de demonstração local estritamente identificado
    let fallback = POIS_DATA.map(item => this.normalizePoi(item, 'demonstracao_local'));
    if (category && category !== 'all') {
      fallback = fallback.filter(p => p.category === category);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      fallback = fallback.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }

    return fallback;
  }

  /**
   * Obtém um ponto de interesse por ID ou Slug (GET /api/places/:slug)
   */
  async getPoiById(idOrSlug) {
    if (!idOrSlug) return null;

    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.PLACE_DETAIL(idOrSlug)}`;
      const res = await apiService.request(url, {}, 3000);
      const item = res?.data || res;
      if (item && (item.id || item.slug)) {
        return this.normalizePoi(item, 'api_node');
      }
    } catch (err) {
      // Se for 404, não existe
      if (err.status === 404) return null;
      console.warn(`[PoiService] Erro ao obter local '${idOrSlug}':`, err.message);
    }

    // Fallback local
    const found = POIS_DATA.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    return found ? this.normalizePoi(found, 'demonstracao_local') : null;
  }

  /**
   * Obtém as freguesias oficiais (GET /api/freguesias)
   */
  async getFreguesias() {
    const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.FREGUESIAS}`;
    try {
      const res = await apiService.request(url, {}, 3000);
      const items = Array.isArray(res) ? res : (res?.data || []);
      const source = res?.meta?.source || 'api_node';

      if (Array.isArray(items) && items.length > 0) {
        this.lastStatus.freguesias = {
          success: true,
          source,
          isFallback: false,
          error: null
        };
        return items.map(f => ({ ...f, _provenance: 'api_node' }));
      }
    } catch (err) {
      console.warn('[PoiService] Falha na comunicação com a rota /freguesias:', err.message);
      this.lastStatus.freguesias = {
        success: false,
        source: 'demonstracao_local',
        isFallback: true,
        error: err.message
      };
    }

    return FREGUESIAS_DATA.map(f => ({ ...f, _provenance: 'demonstracao_local' }));
  }

  /**
   * Obtém percursos e trilhos (GET /api/trails)
   */
  async getTrails(filters = {}) {
    const { difficulty } = filters;
    const qs = difficulty && difficulty !== 'all' ? `?difficulty=${encodeURIComponent(difficulty)}` : '';
    const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.TRAILS}${qs}`;

    try {
      const res = await apiService.request(url, {}, 3000);
      const items = Array.isArray(res) ? res : (res?.data || []);
      const source = res?.meta?.source || 'api_node';

      if (Array.isArray(items) && items.length > 0) {
        this.lastStatus.trails = {
          success: true,
          source,
          isFallback: false,
          error: null
        };
        return items.map(t => ({
          ...t,
          heroImage: t.heroImage || t.hero_image || 'assets/images/penedo-durao.png',
          distance: t.distance || (t.distance_km ? `${t.distance_km} km` : 'Vários km'),
          _provenance: 'api_node'
        }));
      }
    } catch (err) {
      console.warn('[PoiService] Falha na comunicação com a rota /trails:', err.message);
      this.lastStatus.trails = {
        success: false,
        source: 'demonstracao_local',
        isFallback: true,
        error: err.message
      };
    }

    return ROUTES_DATA.map(r => ({ ...r, _provenance: 'demonstracao_local' }));
  }

  /**
   * Alias de compatibilidade para getAllRoutes()
   */
  async getAllRoutes() {
    return this.getTrails();
  }

  /**
   * Obtém eventos e festividades (GET /api/events)
   */
  async getEvents(filters = {}) {
    const { category } = filters;
    const qs = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.EVENTS}${qs}`;

    try {
      const res = await apiService.request(url, {}, 3000);
      const items = Array.isArray(res) ? res : (res?.data || []);
      const source = res?.meta?.source || 'api_node';

      if (Array.isArray(items) && items.length > 0) {
        this.lastStatus.events = {
          success: true,
          source,
          isFallback: false,
          error: null
        };
        return items.map(e => ({
          ...e,
          image: e.image || e.image_url || 'assets/images/seda-loom.png',
          _provenance: 'api_node'
        }));
      }
    } catch (err) {
      console.warn('[PoiService] Falha na comunicação com a rota /events:', err.message);
      this.lastStatus.events = {
        success: false,
        source: 'demonstracao_local',
        isFallback: true,
        error: err.message
      };
    }

    return EVENTS_DATA.map(e => ({
      ...e,
      image: e.image || e.image_url || 'assets/images/seda-loom.png',
      _provenance: 'demonstracao_local'
    }));
  }

  /**
   * Retorna as categorias de filtros disponíveis
   */
  getCategories() {
    return [...CATEGORIES];
  }

  /**
   * Informações gastronómicas
   */
  async getGastronomy() {
    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.GASTRONOMY}`;
      const res = await apiService.request(url, {}, 2000);
      if (res && res.dishes) return res;
    } catch {
      // Fallback
    }
    return { ...GASTRONOMY_DATA };
  }

  /**
   * Informações de património
   */
  async getHeritage() {
    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.HERITAGE}`;
      const res = await apiService.request(url, {}, 2000);
      if (res && res.silkTradition) return res;
    } catch {
      // Fallback
    }
    return { ...HERITAGE_DATA };
  }

  /**
   * Estado de conectividade da última chamada
   */
  getLastStatus(type = 'pois') {
    return this.lastStatus[type] || this.lastStatus.pois;
  }
}

export const poiService = new PoiService();
