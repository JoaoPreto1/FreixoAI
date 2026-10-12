import app from './app.js';
import { ENV } from './config/env.js';

export const server = app.listen(ENV.PORT, () => {
  console.log(`[Freixo AI] Servidor Express ativo em: http://localhost:${ENV.PORT}`);
  console.log(`[Freixo AI] Gateway configurado para FastAPI em: ${ENV.FASTAPI_URL}`);
  console.log(`[Freixo AI] Ambiente: ${ENV.NODE_ENV}`);
});

process.on('SIGTERM', () => {
  console.log('[Freixo AI] Sinal SIGTERM recebido. A encerrar servidor HTTP...');
  server.close(() => {
    console.log('[Freixo AI] Servidor HTTP encerrado com sucesso.');
  });
});

export default server;
