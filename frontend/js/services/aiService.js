import { apiService } from './apiService.js';
import { API_CONFIG } from '../config/apiConfig.js';
import { AI_KNOWLEDGE_BASE, generateSmartItinerary } from '../data/mockAiData.js';

class AiService {
  /**
   * Envia uma pergunta ao Assistente Freixo AI
   */
  async sendMessage(prompt, conversationHistory = [], language = null) {
    if (!prompt || !prompt.trim()) {
      throw new Error("A pergunta não pode estar vazia.");
    }

    const cleanPrompt = prompt.trim();
    let targetLang = language;
    if (!targetLang) {
      const lower = cleanPrompt.toLowerCase();
      const esWords = ['¿', 'dónde', 'donde', 'qué', 'que tal', 'cuáles', 'cuales', 'miradores', 'buitres', 'sendero', 'playa', 'gracias', 'quiero', 'buenos'];
      const enWords = ['where', 'what', 'how', 'when', 'which', 'viewpoint', 'viewpoints', 'trail', 'trails', 'hiking', 'church', 'castle', 'silk', 'visit', 'best', 'tell me'];
      const esScore = esWords.filter(w => lower.includes(w)).length;
      const enScore = enWords.filter(w => new RegExp('\\b' + w + '\\b', 'i').test(lower)).length;
      if (enScore > esScore && enScore >= 1) targetLang = 'en';
      else if (esScore > enScore && esScore >= 1) targetLang = 'es';
      else targetLang = 'pt';
    }

    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.CHAT}`;
      const payload = {
        question: cleanPrompt,
        language: targetLang,
        history: conversationHistory
      };

      const result = await apiService.request(url, {
        method: 'POST',
        body: JSON.stringify(payload)
      }, 65000); // 65s para acomodar com margem a inferência RAG

      if (result && (result.answer || result.reply)) {
        return {
          reply: result.answer || result.reply,
          source: 'backend_node',
          isConfirmed: true,
          isDemo: false,
          grounded: Boolean(result.grounded),
          sources: result.sources || [],
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      if (err.status === 503) {
        const errorReply = targetLang === 'en'
          ? 'The AI microservice (FastAPI/Ollama) is temporarily unavailable. Please check that local AI services are running.'
          : targetLang === 'es'
          ? 'El microservicio de IA (FastAPI/Ollama) no está disponible temporalmente. Comprueba que los servicios de IA estén en ejecución.'
          : 'O microserviço de inteligência artificial (FastAPI/Ollama) encontra-se temporariamente indisponível. Por favor, verifica se os serviços de IA estão em execução ou tenta novamente dentro de momentos.';

        return {
          reply: errorReply,
          source: 'backend_node',
          isConfirmed: false,
          isDemo: false,
          isError: true,
          timestamp: new Date().toISOString()
        };
      }
      console.warn('[AiService] Gateway Node.js indisponível:', err.message);
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    const lower = cleanPrompt.toLowerCase();

    let matchedItem = null;
    let highestScore = 0;

    for (const item of AI_KNOWLEDGE_BASE) {
      const matchCount = item.keywords.filter(kw => lower.includes(kw)).length;
      if (matchCount > highestScore) {
        highestScore = matchCount;
        matchedItem = item;
      }
    }

    if (matchedItem && highestScore > 0) {
      const disclaimer = targetLang === 'en'
        ? 'Response in local demonstration mode. The AI service (FastAPI/Ollama) is currently offline.'
        : targetLang === 'es'
        ? 'Respuesta en modo de demostración local. El servicio de IA (FastAPI/Ollama) está actualmente desconectado.'
        : 'Resposta em modo de demonstração local. O serviço de IA (FastAPI/Ollama) encontra-se temporariamente offline.';

      return {
        reply: matchedItem.response,
        source: 'demonstracao_local',
        isConfirmed: false,
        isDemo: true,
        disclaimer,
        timestamp: new Date().toISOString()
      };
    }

    let defaultGreeting = '';
    let defaultDisclaimer = '';

    if (targetLang === 'en') {
      defaultGreeting = `Hello! I am **Freixo AI**, your intelligent guide to Freixo de Espada à Cinta.

*(Note: Operating in local demonstration mode while backend services are offline).*

I can provide verified information on:
• **Living Silk Heritage:** Traditional handloom weavers and the biological cycle at the Silk Museum;
• **Douro Viewpoints:** Penedo Durão, Colado and observing wild griffon vultures;
• **Manueline Portals:** Historic walking circuit with 40+ 16th-century stone carvings;
• **Congida River Beach:** Scenic swimming in the Douro basin and river boat trips;
• **Gastronomy & Wine:** Traditional dishes and Montes Ermos D.O.C. Douro wines.

How may I assist you today?`;
      defaultDisclaimer = 'Local demonstration mode active.';
    } else if (targetLang === 'es') {
      defaultGreeting = `¡Hola! Soy **Freixo AI**, tu guía inteligente para Freixo de Espada à Cinta.

*(Nota: Operando en modo de demostración local mientras los servicios backend están desconectados).*

Puedo informarte sobre:
• **El Ciclo Vivo de la Seda:** Tejedoras tradicionales y el ciclo biológico en el Museo de la Seda;
• **Miradores del Duero:** Penedo Durão, Colado y observación de buitres leonados;
• **Portales Manuelinos:** Circuito urbano histórico con más de 40 portales de cantería;
• **Playa Fluvial de Congida:** Baño en el embalse de Saucelle y paseos en barco;
• **Gastronomía y Vinos:** Platos tradicionales y vinos Montes Ermos D.O.C. Douro.

¿En qué te puedo ayudar hoy?`;
      defaultDisclaimer = 'Modo de demostración local activo.';
    } else {
      defaultGreeting = `Olá! Sou o **Freixo AI**, o teu guia inteligente para Freixo de Espada à Cinta.

*(Nota: O assistente está a funcionar em modo de demonstração local enquanto o backend estiver offline).*

Posso apresentar-te informações e sugestões sobre:
• **A Arte Viva da Seda:** Onde ver o ciclo secular e as tecedeiras no Museu da Seda;
• **Miradouros do Douro:** Penedo Durão, Colado e observação do voo dos grifos;
• **Os Mais de 40 Portais Manuelinos:** O circuito arquitetónico no centro histórico;
• **Praia Fluvial da Congida:** Banhar-te na albufeira de Saucelle ou fazer passeios fluviais;
• **Gastronomia & Vinhos:** Posta, sopas de tomate e vinhos Montes Ermos D.O.C. Douro.

Como te posso ajudar hoje?`;
      defaultDisclaimer = 'Modo de demonstração local ativo.';
    }

    return {
      reply: defaultGreeting,
      source: 'demonstracao_fallback',
      isConfirmed: false,
      isDemo: true,
      disclaimer: defaultDisclaimer,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Gera um itinerário inteligente com base em preferências
   */
  async generateItinerary(params = {}) {
    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.ITINERARY}`;
      const result = await apiService.request(url, {
        method: 'POST',
        body: JSON.stringify(params)
      }, 60000);

      const planData = result?.data || result;
      if (planData && planData.days) {
        return {
          ...planData,
          source: planData.meta?.source || 'backend_node',
          isDemo: Boolean(planData.summary?.isDemonstration)
        };
      }
    } catch (err) {
      console.warn('[AiService] Erro ao chamar /itinerary/generate:', err.message);
      if (err.status) {
        throw err;
      }
    }

    if (API_CONFIG.USE_MOCK_FALLBACK) {
      await new Promise(resolve => setTimeout(resolve, 450));
      const plan = generateSmartItinerary(params);
      return {
        ...plan,
        source: 'demonstracao_algoritmica_offline',
        isDemo: true
      };
    }

    throw new Error('Serviço de itinerários indisponível.');
  }

  /**
   * Sugestões de perguntas rápidas para interação fluida
   */
  getQuickPrompts() {
    return [
      "Onde posso ver as artesãs a tecer seda viva?",
      "Qual o melhor horário para visitar o Penedo Durão?",
      "O que devo provar da gastronomia local?",
      "Como fazer o circuito dos portais manuelinos?",
      "O que fazer na Praia Fluvial da Congida?",
      "Qual é a lenda do nome Freixo de Espada à Cinta?"
    ];
  }
}

export const aiService = new AiService();
