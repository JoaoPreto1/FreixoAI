/**
 * FREIXO AI — Serviço Gateway para o Microserviço de IA (Python / FastAPI)
 * Responsabilidade única: Encaminhar chamadas e orquestrar comunicação com o FastAPI (porta 8000).
 * CONFORME REQUISITO 8: Não duplica nem altera a lógica de RAG, embeddings ou Ollama.
 */

import { ENV } from '../config/env.js';

class AiGatewayService {
  /**
   * Verifica a disponibilidade do serviço FastAPI
   */
  async checkHealth() {
    try {
      const response = await fetch(`${ENV.FASTAPI_URL}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          online: true,
          status: data.status || 'ok',
          ollama: data.ollama || 'connected',
          models: data.models || []
        };
      }

      return {
        online: false,
        status: `HTTP ${response.status}`,
        detail: 'FastAPI respondeu com estado não-200'
      };
    } catch (err) {
      return {
        online: false,
        status: 'unreachable',
        detail: err.message
      };
    }
  }

  /**
   * Encaminha uma pergunta para o endpoint /chat do microserviço FastAPI
   */
  async askChat({ question, language = 'pt' }) {
    if (!question || !question.trim()) {
      throw new Error('A pergunta não pode estar vazia.');
    }

    try {
      const response = await fetch(`${ENV.FASTAPI_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          question: question.trim(),
          language
        }),
        signal: AbortSignal.timeout(60000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`O serviço FastAPI rejeitou o pedido (HTTP ${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return {
        success: true,
        answer: data.answer || data.reply,
        language: data.language || language,
        model: data.model,
        sources: data.sources || [],
        grounded: Boolean(data.grounded),
        gateway: 'node_express_proxy'
      };
    } catch (err) {
      if (err.name === 'TimeoutError') {
        throw new Error(`Tempo limite excedido na resposta do serviço de IA (${ENV.FASTAPI_URL})`);
      }
      throw err;
    }
  }
}

export const aiGatewayService = new AiGatewayService();
