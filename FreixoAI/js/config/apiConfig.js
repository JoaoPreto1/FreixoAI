/**
 * FREIXO AI — Configuração de Integração de APIs
 * Preparado para ligação futura com:
 * - API Node.js / Express (Backend principal e base de dados de POIs, rotas e favoritos)
 * - Serviço Python / FastAPI (Inteligência Artificial, RAG, embeddings e rotas dinâmicas)
 */

export const API_CONFIG = {
  // Ativa o fallback automático para dados de demonstração locais
  // quando as APIs externas não estão ativas ou devolvem erro
  USE_MOCK_FALLBACK: true,

  // Endpoints dos Serviços de Backend
  NODE_API: {
    BASE_URL: 'http://localhost:5000/api',
    TIMEOUT_MS: 5000,
    ENDPOINTS: {
      POIS: '/pois',
      POI_DETAIL: (id) => `/pois/${id}`,
      ROUTES: '/routes',
      GASTRONOMY: '/gastronomy',
      HERITAGE: '/heritage',
      FAVORITES: '/favorites'
    }
  },

  FASTAPI_AI: {
    BASE_URL: 'http://localhost:8000/api/ai',
    TIMEOUT_MS: 10000,
    ENDPOINTS: {
      CHAT: '/chat',
      GENERATE_ITINERARY: '/itinerary/generate',
      RECOMMENDATIONS: '/recommendations',
      HEALTH: '/health'
    }
  },

  // Estado atual da ligação para feedback visual ao utilizador
  STATE: {
    nodeConnected: false,
    fastApiConnected: false,
    lastChecked: null
  }
};
