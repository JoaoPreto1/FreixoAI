import { getSupabaseClient } from '../config/supabase.js';
import { FREGUESIAS, PLACES, TRAILS, EVENTS } from '../data/verifiedLocalData.js';

class TourismService {
  /**
   * Obtém a lista de freguesias do concelho
   */
  async getFreguesias() {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('freguesias')
          .select('*')
          .order('name', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          return {
            items: data,
            source: 'supabase_db'
          };
        }
      } catch (err) {
        // Tabela não criada ou Supabase inacessível — usar fallback local
      }
    }

    return {
      items: [...FREGUESIAS],
      source: 'demonstracao_local'
    };
  }

  /**
   * Obtém a lista de pontos de interesse / locais com suporte para filtros
   */
  async getPlaces(filters = {}) {
    const { category, freguesia, search, includeDemo = true } = filters;
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        let query = supabase.from('places').select('*');

        if (category && category !== 'all') {
          query = query.eq('category', category);
        }
        if (freguesia && freguesia !== 'all') {
          query = query.eq('freguesia_id', freguesia);
        }
        if (includeDemo === false || includeDemo === 'false') {
          query = query.eq('is_demo', false);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          let results = data;
          if (search && search.trim()) {
            const q = search.toLowerCase().trim();
            results = results.filter(p =>
              (p.title && p.title.toLowerCase().includes(q)) ||
              (p.short_description && p.short_description.toLowerCase().includes(q))
            );
          }
          return {
            items: results,
            source: 'supabase_db'
          };
        }
      } catch (err) {
        // Fallback para dados locais
      }
    }

    // Fallback local
    let results = [...PLACES];

    if (includeDemo === false || includeDemo === 'false') {
      results = results.filter(p => !p.is_demo);
    }
    if (category && category !== 'all') {
      results = results.filter(p => p.category === category);
    }
    if (freguesia && freguesia !== 'all') {
      results = results.filter(p => p.freguesia_id === freguesia);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.short_description && p.short_description.toLowerCase().includes(q)) ||
        (p.full_description && p.full_description.toLowerCase().includes(q))
      );
    }

    return {
      items: results,
      source: 'demonstracao_local'
    };
  }

  /**
   * Obtém um ponto de interesse por slug ou id
   */
  async getPlaceBySlug(slugOrId) {
    if (!slugOrId) return null;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('places')
          .select('*')
          .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
          .maybeSingle();

        if (!error && data) {
          return {
            item: data,
            source: 'supabase_db'
          };
        }
      } catch (err) {
        // Fallback local
      }
    }

    const found = PLACES.find(p => p.slug === slugOrId || p.id === slugOrId);
    if (!found) return null;

    return {
      item: { ...found },
      source: 'demonstracao_local'
    };
  }

  /**
   * Obtém percursos / rotas turísticas
   */
  async getTrails(filters = {}) {
    const { difficulty, includeDemo = true } = filters;
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        let query = supabase.from('trails').select('*');
        if (difficulty) {
          query = query.ilike('difficulty', `%${difficulty}%`);
        }
        if (includeDemo === false || includeDemo === 'false') {
          query = query.eq('is_demo', false);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          const enriched = data.map(item => {
            const local = TRAILS.find(t => t.slug === item.slug || t.id === item.id);
            return {
              ...item,
              geometry_status: item.geometry_status || local?.geometry_status || 'indisponivel',
              geometry_source: item.geometry_source || local?.geometry_source || null,
              geometry_consulted_at: item.geometry_consulted_at || local?.geometry_consulted_at || null,
              geometry_limitations: item.geometry_limitations || local?.geometry_limitations || null,
              geojson: (item.geojson !== undefined && item.geojson !== null) ? item.geojson : (local?.geojson || null)
            };
          });
          return {
            items: enriched,
            source: 'supabase_db'
          };
        }
      } catch (err) {
        // Fallback local
      }
    }

    let results = [...TRAILS];
    if (includeDemo === false || includeDemo === 'false') {
      results = results.filter(t => !t.is_demo);
    }
    if (difficulty) {
      results = results.filter(t => t.difficulty.toLowerCase().includes(difficulty.toLowerCase()));
    }

    return {
      items: results,
      source: 'demonstracao_local'
    };
  }

  /**
   * Obtém um percurso específico por slug ou id
   */
  async getTrailBySlug(slugOrId) {
    if (!slugOrId) return null;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('trails')
          .select('*')
          .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
          .maybeSingle();

        if (!error && data) {
          const local = TRAILS.find(t => t.slug === data.slug || t.id === data.id);
          const enriched = {
            ...data,
            geometry_status: data.geometry_status || local?.geometry_status || 'indisponivel',
            geometry_source: data.geometry_source || local?.geometry_source || null,
            geometry_consulted_at: data.geometry_consulted_at || local?.geometry_consulted_at || null,
            geometry_limitations: data.geometry_limitations || local?.geometry_limitations || null,
            geojson: (data.geojson !== undefined && data.geojson !== null) ? data.geojson : (local?.geojson || null)
          };
          return {
            item: enriched,
            source: 'supabase_db'
          };
        }
      } catch (err) {
        // Fallback local
      }
    }

    const found = TRAILS.find(t => t.slug === slugOrId || t.id === slugOrId);
    if (!found) return null;

    return {
      item: { ...found },
      source: 'demonstracao_local'
    };
  }

  /**
   * Obtém eventos e festividades
   */
  async getEvents(filters = {}) {
    const { category, includeDemo = true } = filters;
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        let query = supabase.from('events').select('*');
        if (category) {
          query = query.ilike('category', `%${category}%`);
        }
        if (includeDemo === false || includeDemo === 'false') {
          query = query.eq('is_demo', false);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          const enriched = data.map(item => {
            const local = EVENTS.find(e => e.slug === item.slug || e.id === item.id);
            return {
              ...item,
              coordinates: item.coordinates || local?.coordinates || null,
              edition_dates: item.edition_dates || local?.edition_dates || null,
              edition_status: item.edition_status || local?.edition_status || null,
              historical_context: item.historical_context || local?.historical_context || null,
              schedule_info: item.schedule_info || local?.schedule_info || null,
              pricing: item.pricing || local?.pricing || 'Acesso livre e gratuito',
              related_pois: item.related_pois || local?.related_pois || [],
              consulted_at: item.consulted_at || local?.consulted_at || '2026-10-12'
            };
          });
          return {
            items: enriched,
            source: 'supabase_db'
          };
        }
      } catch (err) {
        // Fallback local
      }
    }

    let results = [...EVENTS];
    if (includeDemo === false || includeDemo === 'false') {
      results = results.filter(e => !e.is_demo);
    }
    if (category) {
      results = results.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
    }

    return {
      items: results,
      source: 'demonstracao_local'
    };
  }

  /**
   * Obtém um evento específico por slug ou id
   */
  async getEventBySlug(slugOrId) {
    if (!slugOrId) return null;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
          .maybeSingle();

        if (!error && data) {
          const local = EVENTS.find(e => e.slug === data.slug || e.id === data.id);
          const enriched = {
            ...data,
            coordinates: data.coordinates || local?.coordinates || null,
            edition_dates: data.edition_dates || local?.edition_dates || null,
            edition_status: data.edition_status || local?.edition_status || null,
            historical_context: data.historical_context || local?.historical_context || null,
            schedule_info: data.schedule_info || local?.schedule_info || null,
            pricing: data.pricing || local?.pricing || 'Acesso livre e gratuito',
            related_pois: data.related_pois || local?.related_pois || [],
            consulted_at: data.consulted_at || local?.consulted_at || '2026-10-12'
          };
          return {
            item: enriched,
            source: 'supabase_db'
          };
        }
      } catch (err) {
        // Fallback local
      }
    }

    const found = EVENTS.find(e => e.slug === slugOrId || e.id === slugOrId);
    if (!found) return null;

    return {
      item: { ...found },
      source: 'demonstracao_local'
    };
  }
}

export const tourismService = new TourismService();
