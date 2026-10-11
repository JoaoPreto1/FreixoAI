/**
 * FREIXO AI — Backend API Gateway (Node.js)
 * Servidor leve em Node.js vanilla sem dependências externas obrigatórias.
 * Responsável pela orquestração de rotas, API REST e proxy para o serviço FastAPI de IA.
 */

import http from 'http';

const PORT = process.env.PORT || 5000;
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
};

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Tratamento de preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // 1. Health check do Gateway
  if (req.method === 'GET' && pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      status: 'ok',
      healthy: true,
      service: 'freixo-backend-gateway',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }));
  }

  // 2. Gateway Proxy para o Chat do Serviço de IA (FastAPI)
  if (req.method === 'POST' && pathname === '/api/chat') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const question = parsed.question || parsed.message || '';
        const language = parsed.language || 'pt';

        // Encaminhar para o microserviço FastAPI (/chat)
        try {
          const fastApiResponse = await fetch(`${FASTAPI_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, language }),
            signal: AbortSignal.timeout(10000)
          });

          if (fastApiResponse.ok) {
            const data = await fastApiResponse.json();
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({
              answer: data.answer || data.reply,
              sources: data.sources || [],
              grounded: Boolean(data.grounded),
              model: data.model,
              forwardedFrom: 'fastapi'
            }));
          }
        } catch (fastApiErr) {
          console.warn('[Backend Gateway] FastAPI não acessível em ' + FASTAPI_URL + ':', fastApiErr.message);
        }

        // Se o FastAPI não responder, devolver resposta informativa
        res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
          error: 'Serviço de IA (FastAPI) temporariamente indisponível no endpoint ' + FASTAPI_URL,
          serviceAvailable: false
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: 'Pedido JSON inválido', detail: err.message }));
      }
    });
    return;
  }

  // Rota não encontrada
  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: `Rota não encontrada: ${pathname}` }));
});

server.listen(PORT, () => {
  console.log(`Freixo AI Backend Gateway ativo em: http://localhost:${PORT}`);
  console.log(`Proxy configurado para o serviço FastAPI em: ${FASTAPI_URL}`);
});
