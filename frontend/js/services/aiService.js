/**
 * FREIXO AI — Serviço de Inteligência Artificial
 * Comunica com o microserviço Python / FastAPI e fornece fallback inteligente
 */

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

    // 1. Tentar comunicar com o serviço Python / FastAPI
    try {
      const url = `${API_CONFIG.FASTAPI_AI.BASE_URL}${API_CONFIG.FASTAPI_AI.ENDPOINTS.CHAT}`;
      const payload = {
        message: cleanPrompt,
        history: conversationHistory,
        context: {
          location: "Freixo de Espada à Cinta",
          region: "Douro Internacional / Trás-os-Montes"
        }
      };

      const result = await apiService.request(url, {
        method: 'POST',
        body: JSON.stringify(payload)
      }, 2500);

      if (result && result.reply) {
        return {
          reply: result.reply,
          source: 'fastapi',
          timestamp: new Date().toISOString()
        };
      }
    } catch {
      // Falhou a chamada à FastAPI, continua para o motor local
    }

    // 2. Fallback Inteligente baseado na Base de Conhecimento Local
    // Simular uma breve latência natural de raciocínio da IA (450ms)
    await new Promise(resolve => setTimeout(resolve, 450));

    const lower = cleanPrompt.toLowerCase();

    // Procurar correspondência na base de conhecimento
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
        source: 'local-knowledge',
        timestamp: new Date().toISOString()
      };
    }

    // Resposta contextual genérica amigável com recomendações de tópicos
    return {
      reply: `Olá! Sou o **Freixo AI**, o teu guia inteligente para Freixo de Espada à Cinta.

Posso ajudar-te a planear a tua visita ou esclarecer curiosidades sobre a vila raiana! 

Podes perguntar-me sobre:
• **A Arte Viva da Seda:** Onde ver as artesãs a fiar nos teares ancestrais;
• **Miradouro do Penedo Durão:** Onde avistar grifos e o canhão do Douro;
• **Os Mais de 40 Portais Manuelinos:** O circuito histórico no coração da vila;
• **Praia Fluvial da Congida:** Banhar-te no Douro ou fazer passeios de barco;
• **Gastronomia & Vinhos:** Onde comer a autêntica Posta e saborear os vinhos Montes Ermos.

Como posso enriquecer a tua estadia hoje?`,
      source: 'local-fallback',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Gera um itinerário inteligente com base em preferências
   */
  async generateItinerary(params = {}) {
    // 1. Tentar API FastAPI se disponível
    try {
      const url = `${API_CONFIG.FASTAPI_AI.BASE_URL}${API_CONFIG.FASTAPI_AI.ENDPOINTS.GENERATE_ITINERARY}`;
      const result = await apiService.request(url, {
        method: 'POST',
        body: JSON.stringify(params)
      }, 3500);

      if (result && result.days) {
        return {
          ...result,
          source: 'fastapi'
        };
      }
    } catch {
      // Fallback para gerador algorítmico local
    }

    // Simular processamento da IA
    await new Promise(resolve => setTimeout(resolve, 600));

    const plan = generateSmartItinerary(params);
    return {
      ...plan,
      source: 'local-engine'
    };
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
