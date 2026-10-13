import { FRONTEND_ENV } from './env.js';

export const API_CONFIG = {
  // Ativa o fallback automático para dados de demonstração locais quando as APIs não respondem
  USE_MOCK_FALLBACK: true,

  // Endpoints da API Node.js / Express (Gateway Principal)
  NODE_API: {
    BASE_URL: FRONTEND_ENV.PUBLIC_API_URL,
    TIMEOUT_MS: 4000,
    ENDPOINTS: {
      HEALTH: '/health',
      PLACES: '/places',
      POIS: '/places', // Rota canónica de locais
      PLACE_DETAIL: (slugOrId) => `/places/${slugOrId}`,
      POI_DETAIL: (id) => `/places/${id}`,
      FREGUESIAS: '/freguesias',
      TRAILS: '/trails',
      ROUTES: '/trails',
      TRAIL_DETAIL: (slugOrId) => `/trails/${slugOrId}`,
      EVENTS: '/events',
      EVENT_DETAIL: (slugOrId) => `/events/${slugOrId}`,
      GASTRONOMY: '/gastronomy',
      HERITAGE: '/heritage',
      FAVORITES: '/favorites',
      SEARCH: '/search',
      CHAT: '/chat', // Gateway Node.js que orquestra com o FastAPI
      ITINERARY: '/itinerary/generate'
    }
  },

  // Endpoints do Microserviço Python / FastAPI (Acesso de contingência ou direto)
  FASTAPI_AI: {
    BASE_URL: FRONTEND_ENV.PUBLIC_FASTAPI_URL,
    TIMEOUT_MS: 15000,
    ENDPOINTS: {
      HEALTH: '/health',
      CHAT: '/chat',
      SEARCH: '/knowledge/search'
    }
  },

  // Estado verificado em tempo real das ligações
  STATE: {
    nodeConnected: false,
    supabaseConnected: false,
    supabaseStatus: null,
    fastApiConnected: false,
    lastChecked: null,
    activeMode: 'demonstracao_local' // 'node_gateway' | 'demonstracao_local'
  }
};
