const resolvePublicApiUrl = () => {
  if (typeof window !== 'undefined' && window.__ENV__?.PUBLIC_API_URL) {
    return window.__ENV__.PUBLIC_API_URL.replace(/\/$/, '');
  }

  if (typeof process !== 'undefined' && process.env?.PUBLIC_API_URL) {
    return process.env.PUBLIC_API_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem('FREIXO_API_URL');
      if (stored) return stored.replace(/\/$/, '');
    } catch {
      // Ignorar restrições de localStorage
    }
  }

  if (typeof window !== 'undefined' && window.location.port === '5000') {
    return `${window.location.origin}/api`;
  }

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
