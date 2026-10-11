/**
 * FREIXO AI — Serviço de Inteligência Artificial
 * Comunica preferencialmente com o gateway Node.js (que encaminha para o FastAPI)
 * Fornece fallback transparente e rigoroso para conhecimento local demonstrativo
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

    // 1. TENTATIVA PRIMÁRIA: Gateway Node.js Express (conforme Requisito 7)
    // O backend Node.js é o intermediário que faz proxy e orquestra com o FastAPI
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
      }, 3000);

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
    } catch {
      // Backend Node.js offline ou rota não implementada
    }

    // 2. TENTATIVA SECUNDÁRIA: Chamada direta ao microserviço Python FastAPI
    try {
      const url = `${API_CONFIG.FASTAPI_AI.BASE_URL}${API_CONFIG.FASTAPI_AI.ENDPOINTS.CHAT}`;
      const payload = {
        question: cleanPrompt,
        language: "pt"
      };

      const result = await apiService.request(url, {
        method: 'POST',
        body: JSON.stringify(payload)
      }, 4000);

      if (result && result.answer) {
        return {
          reply: result.answer,
          source: 'fastapi_direto',
          isConfirmed: true,
          isDemo: false,
          grounded: Boolean(result.grounded),
          sources: result.sources || [],
          timestamp: new Date().toISOString()
        };
      }
    } catch {
      // FastAPI offline ou Ollama/Supabase não configurado
    }

    // 3. FALLBACK DE DEMONSTRAÇÃO LOCAL RIGOROSO (Requisito 8)
    // Simula uma breve latência natural de raciocínio (350ms)
    await new Promise(resolve => setTimeout(resolve, 350));

    const lower = cleanPrompt.toLowerCase();

    // Procurar correspondência de tópicos na base documental local
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

    // Resposta de acolhimento e sugestão temática
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
    // 1. Tentar gateway Node.js
    try {
      const url = `${API_CONFIG.NODE_API.BASE_URL}${API_CONFIG.NODE_API.ENDPOINTS.ITINERARY}`;
      const result = await apiService.request(url, {
        method: 'POST',
        body: JSON.stringify(params)
      }, 3500);

      if (result && result.days) {
        return {
          ...result,
          source: 'backend_node',
          isDemo: false
        };
      }
    } catch {
      // Fallback para gerador algorítmico local
    }

    // Simulação do cálculo
    await new Promise(resolve => setTimeout(resolve, 450));

    const plan = generateSmartItinerary(params);
    return {
      ...plan,
      source: 'demonstracao_algoritmica',
      isDemo: true
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
