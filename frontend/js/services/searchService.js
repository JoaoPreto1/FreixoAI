import { apiService } from './apiService.js';
import { API_CONFIG } from '../config/apiConfig.js';
import { POIS_DATA } from '../data/mockPois.js';
import { ROUTES_DATA } from '../data/mockRoutes.js';
import { EVENTS_DATA } from '../data/mockEvents.js';
import { FREGUESIAS_DATA } from '../data/mockFreguesias.js';

class SearchService {
  /**
   * Executa uma pesquisa global unificada por termo
   */
  async search(query = '') {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      return {
        query: '',
        total: 0,
        results: { places: [], trails: [], events: [], freguesias: [] },
        places: [],
        trails: [],
        events: [],
        freguesias: [],
        source: 'local'
      };
    }

    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.SEARCH}?q=${encodeURIComponent(q)}`;
      const res = await apiService.request(url, {}, 3000);

      if (res && res.data) {
        const places = res.data.places || [];
        const trails = res.data.trails || [];
        const events = res.data.events || [];
        const freguesias = res.data.freguesias || [];
        return {
          query: q,
          total: res.meta?.total || 0,
          results: { places, trails, events, freguesias },
          places,
          trails,
          events,
          freguesias,
          source: res.meta?.source || 'api_node'
        };
      }
    } catch (err) {
      console.warn('[SearchService] Gateway Node.js indisponível para pesquisa, a usar base local:', err.message);
    }

    return this.searchLocal(q);
  }

  /**
   * Pesquisa de contingência no catálogo local
   */
  searchLocal(q) {
    const places = POIS_DATA.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
      (p.fullDescription && p.fullDescription.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.highlights && p.highlights.some(h => h.toLowerCase().includes(q)))
    ).map(p => ({
      ...p,
      _provenance: 'demonstracao_local'
    }));

    const trails = ROUTES_DATA.filter(t =>
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.stops && t.stops.some(s => (s.title && s.title.toLowerCase().includes(q)) || (s.description && s.description.toLowerCase().includes(q))))
    );

    const events = EVENTS_DATA.filter(e =>
      (e.title && e.title.toLowerCase().includes(q)) ||
      (e.description && e.description.toLowerCase().includes(q)) ||
      (e.category && e.category.toLowerCase().includes(q)) ||
      (e.location && e.location.toLowerCase().includes(q)) ||
      (e.historical_context && e.historical_context.toLowerCase().includes(q))
    );

    const freguesias = FREGUESIAS_DATA.filter(f =>
      (f.name && f.name.toLowerCase().includes(q)) ||
      (f.description && f.description.toLowerCase().includes(q)) ||
      (f.id && f.id.toLowerCase().includes(q))
    );

    const total = places.length + trails.length + events.length + freguesias.length;

    return {
      query: q,
      total,
      results: {
        places,
        trails,
        events,
        freguesias
      },
      places,
      trails,
      events,
      freguesias,
      source: 'demonstracao_local'
    };
  }
}

export const searchService = new SearchService();
