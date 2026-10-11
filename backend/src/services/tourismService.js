/**
 * FREIXO AI — Serviço Turístico e Territorial
 * Integração resiliente com Supabase (servidor) e fallback automático para dados verificados locais.
 * Preserva o rigor: identifica sempre a proveniência dos dados (supabase_db vs demonstracao_local).
 */

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
          return {
            items: data,
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
          return {
            items: data,
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
}

export const tourismService = new TourismService();
