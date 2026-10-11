/**
 * FREIXO AI — Variáveis de Ambiente Públicas do Frontend
 * Centraliza a resolução da URL da API através de variáveis públicas de runtime,
 * permitindo configuração flexível em desenvolvimento, testes e produção.
 */

const resolvePublicApiUrl = () => {
  // 1. Variável global pública injetada via window.__ENV__ (ex: por server.js ou script de build)
  if (typeof window !== 'undefined' && window.__ENV__?.PUBLIC_API_URL) {
    return window.__ENV__.PUBLIC_API_URL.replace(/\/$/, '');
  }

  // 2. Variável de processo (bundlers como Vite/Webpack/Node)
  if (typeof process !== 'undefined' && process.env?.PUBLIC_API_URL) {
    return process.env.PUBLIC_API_URL.replace(/\/$/, '');
  }

  // 3. Sobrescrita manual guardada em localStorage (útil para testes em browser)
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem('FREIXO_API_URL');
      if (stored) return stored.replace(/\/$/, '');
    } catch {
      // Ignorar restrições de localStorage em ambientes restritos
    }
  }

  // 4. Se servido na porta 5000 pelo próprio Express, usar rota relativa
  if (typeof window !== 'undefined' && window.location.port === '5000') {
    return `${window.location.origin}/api`;
  }

  // 5. Padrão de desenvolvimento para arquitetura de microserviços
  return 'http://localhost:5000/api';
};

const resolvePublicFastApiUrl = () => {
  if (typeof window !== 'undefined' && window.__ENV__?.PUBLIC_FASTAPI_URL) {
    return window.__ENV__.PUBLIC_FASTAPI_URL.replace(/\/$/, '');
  }
  if (typeof process !== 'undefined' && process.env?.PUBLIC_FASTAPI_URL) {
    return process.env.PUBLIC_FASTAPI_URL.replace(/\/$/, '');
  }
  return 'http://localhost:8000';
};

export const FRONTEND_ENV = {
  PUBLIC_API_URL: resolvePublicApiUrl(),
  PUBLIC_FASTAPI_URL: resolvePublicFastApiUrl(),
  IS_LOCAL: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
};
