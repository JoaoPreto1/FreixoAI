/**
 * FREIXO AI — Configuração de Integração de APIs
 * Arquitetura de microserviços:
 * - Backend Node.js / Express (porta 5000): Gateway de aplicação, rotas de POIs, favoritos e proxy de IA
 * - Serviço Python / FastAPI (porta 8000): RAG, embeddings locais e LLM
 *
 * RIGOR ARQUITETURAL:
 * O estado de cada serviço é aferido dinamicamente por verificações de integridade (health checks).
 * Sem rotas ativas no backend, a aplicação opera em modo de demonstração local estritamente identificado.
 */

export const API_CONFIG = {
  // Ativa o fallback automático para dados de demonstração locais quando as APIs não respondem
  USE_MOCK_FALLBACK: true,

  // Endpoints da API Node.js / Express (Gateway Principal)
  NODE_API: {
    BASE_URL: 'http://localhost:5000/api',
    TIMEOUT_MS: 3500,
    ENDPOINTS: {
      HEALTH: '/health',
      POIS: '/pois',
      POI_DETAIL: (id) => `/pois/${id}`,
      ROUTES: '/routes',
      GASTRONOMY: '/gastronomy',
      HERITAGE: '/heritage',
      FAVORITES: '/favorites',
      CHAT: '/chat', // Gateway Node.js que encaminha para o FastAPI
      ITINERARY: '/itinerary/generate'
    }
  },

  // Endpoints Diretos do Serviço Python / FastAPI (Recuperação e IA)
  FASTAPI_AI: {
    BASE_URL: 'http://localhost:8000',
    TIMEOUT_MS: 8000,
    ENDPOINTS: {
      HEALTH: '/health',
      CHAT: '/chat',
      SEARCH: '/knowledge/search'
    }
  },

  // Estado verificado em tempo real das ligações
  STATE: {
    nodeConnected: false,
    fastApiConnected: false,
    lastChecked: null,
    activeMode: 'demonstracao_local' // 'node_gateway' | 'fastapi_direto' | 'demonstracao_local'
  }
};
