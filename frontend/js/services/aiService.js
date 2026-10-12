import { apiService } from './apiService.js';
import { API_CONFIG } from '../config/apiConfig.js';
import { AI_KNOWLEDGE_BASE, generateSmartItinerary } from '../data/mockAiData.js';

class AiService {
  /**
   * Envia uma pergunta ao Assistente Freixo AI
   */
  async sendMessage(prompt, conversationHistory = []) {
    if (!prompt || !prompt.trim()) {
      throw new Error("A pergunta não pode estar vazia.");
    }

    const cleanPrompt = prompt.trim();

    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.CHAT}`;
      const payload = {
        question: cleanPrompt,
        language: "pt",
        history: conversationHistory
      };

      const result = await apiService.request(url, {
        method: 'POST',
        body: JSON.stringify(payload)
      }, 25000); // 25s para acomodar o tempo de inferência do modelo Ollama (qwen3:4b + bge-m3)

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
        return {
          reply: 'O microserviço de inteligência artificial (FastAPI/Ollama) encontra-se temporariamente indisponível. Por favor, verifica se os serviços de IA estão em execução ou tenta novamente dentro de momentos.',
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
      return {
        reply: matchedItem.response,
        source: 'demonstracao_local',
        isConfirmed: false,
        isDemo: true,
        disclaimer: "Resposta em modo de demonstração local. O serviço de IA (FastAPI/Ollama) encontra-se temporariamente offline.",
        timestamp: new Date().toISOString()
      };
    }

    return {
      reply: `Olá! Sou o **Freixo AI**, o teu guia inteligente para Freixo de Espada à Cinta.

*(Nota: O assistente está a funcionar em modo de demonstração local enquanto o backend estiver offline).*

Posso apresentar-te informações e sugestões sobre:
• **A Arte Viva da Seda:** Onde ver o ciclo secular e as tecedeiras no Museu da Seda;
• **Miradouros do Douro:** Penedo Durão, Colado e observação do voo dos grifos;
• **Os Mais de 40 Portais Manuelinos:** O circuito arquitetónico no centro histórico;
• **Praia Fluvial da Congida:** Banhar-te na albufeira de Saucelle ou fazer passeios fluviais;
• **Gastronomia & Vinhos:** Posta, sopas de tomate e vinhos Montes Ermos D.O.C. Douro.

Como te posso ajudar hoje?`,
      source: 'demonstracao_fallback',
      isConfirmed: false,
      isDemo: true,
      disclaimer: "Modo de demonstração local ativo.",
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
      }, 12000);

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
