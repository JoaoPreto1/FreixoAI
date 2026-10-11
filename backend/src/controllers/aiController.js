/**
 * FREIXO AI — AI Controller (Proxy Gateway para FastAPI)
 * Responsável por receber pedidos de chat do utilizador e delegar para o microserviço FastAPI.
 */

import { aiGatewayService } from '../services/aiGatewayService.js';

export const handleChat = async (req, res, next) => {
  try {
    const { question, message, language = 'pt' } = req.body;
    const promptText = question || message;

    try {
      const aiResponse = await aiGatewayService.askChat({
        question: promptText,
        language
      });

      return res.status(200).json({
        answer: aiResponse.answer,
        reply: aiResponse.answer, // compatibilidade com frontend
        language: aiResponse.language,
        model: aiResponse.model,
        sources: aiResponse.sources,
        grounded: aiResponse.grounded,
        forwardedFrom: 'fastapi'
      });
    } catch (fastApiErr) {
      // Quando o microserviço FastAPI está offline ou não responde
      return res.status(503).json({
        success: false,
        error: {
          code: 'AI_SERVICE_UNAVAILABLE',
          message: 'O microserviço de IA (FastAPI/Ollama) encontra-se temporariamente indisponível.',
          status: 503,
          detail: fastApiErr.message
        },
        serviceAvailable: false,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    next(error);
  }
};
