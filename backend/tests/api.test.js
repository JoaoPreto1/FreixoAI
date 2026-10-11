/**
 * FREIXO AI — Suite de Testes Automatizados da API Node.js/Express
 * Valida todos os endpoints obrigatórios, códigos HTTP, envelopes JSON e tratamento de erros.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import app from '../src/app.js';

let server;
let baseUrl;

test.before(async () => {
  process.env.NODE_ENV = 'test';
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

// ==============================================================================
// 1. GET /api/health
// ==============================================================================
test('GET /api/health — Deve responder com status 200 e estrutura de saúde', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.status, 'ok');
  assert.equal(json.healthy, true);
  assert.equal(json.service, 'freixo-ai-backend');
  assert.ok(json.timestamp);
  assert.ok(json.integrations);
  assert.ok('supabase' in json.integrations);
  assert.ok('fastapi' in json.integrations);
});

// ==============================================================================
// 2. GET /api/freguesias
// ==============================================================================
test('GET /api/freguesias — Deve listar as freguesias oficiais do concelho', async () => {
  const res = await fetch(`${baseUrl}/api/freguesias`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.equal(json.data.length, 4);

  const ids = json.data.map(f => f.id);
  assert.ok(ids.includes('freixo-mazouco'));
  assert.ok(ids.includes('lagoaca-fornos'));
  assert.ok(ids.includes('ligares'));
  assert.ok(ids.includes('poia'));

  assert.equal(json.meta.municipality, 'Freixo de Espada à Cinta');
  assert.ok(json.meta.source);
});

// ==============================================================================
// 3. GET /api/places
// ==============================================================================
test('GET /api/places — Deve retornar a lista de pontos turísticos', async () => {
  const res = await fetch(`${baseUrl}/api/places`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length >= 6);

  const penedo = json.data.find(p => p.id === 'penedo-durao');
  assert.ok(penedo);
  assert.equal(penedo.title, 'Miradouro do Penedo Durão');
  assert.equal(penedo.category, 'miradouro');
  assert.ok(penedo.latitude);
  assert.ok(penedo.longitude);
});

test('GET /api/places — Deve filtrar corretamente por categoria', async () => {
  const res = await fetch(`${baseUrl}/api/places?category=miradouro`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.every(p => p.category === 'miradouro'));
});

test('GET /api/places — Deve suportar pesquisa textual', async () => {
  const res = await fetch(`${baseUrl}/api/places?search=seda`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length > 0);
  assert.ok(json.data.some(p => p.id === 'museu-da-seda'));
});

// ==============================================================================
// 4. GET /api/places/:slug
// ==============================================================================
test('GET /api/places/:slug — Deve retornar detalhe do Penedo Durão com coordenadas verificadas', async () => {
  const res = await fetch(`${baseUrl}/api/places/penedo-durao`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.id, 'penedo-durao');
  assert.equal(json.data.title, 'Miradouro do Penedo Durão');
  assert.equal(json.data.latitude, 41.0427);
  assert.equal(json.data.longitude, -6.8242);
  assert.equal(json.data.verification_status, 'confirmado');
});

test('GET /api/places/:slug — Deve retornar 404 para local inexistente', async () => {
  const res = await fetch(`${baseUrl}/api/places/local-inexistente-xyz`);
  assert.equal(res.status, 404);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'PLACE_NOT_FOUND');
  assert.equal(json.error.status, 404);
});

test('GET /api/places/:slug — Deve retornar 400 para slug com carateres inválidos', async () => {
  const res = await fetch(`${baseUrl}/api/places/slug%20com%20espacos%21%21`);
  assert.equal(res.status, 400);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'MALFORMED_SLUG');
});

// ==============================================================================
// 5. GET /api/trails
// ==============================================================================
test('GET /api/trails — Deve retornar a lista de percursos', async () => {
  const res = await fetch(`${baseUrl}/api/trails`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.some(t => t.id === 'rota-seda-manuelino'));
  assert.ok(json.data.some(t => t.id === 'rota-douro-grifos'));
});

test('GET /api/trails — Deve filtrar por dificuldade', async () => {
  const res = await fetch(`${baseUrl}/api/trails?difficulty=Facil`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.every(t => t.difficulty.toLowerCase().includes('facil') || t.difficulty.toLowerCase().includes('fácil')));
});

// ==============================================================================
// 6. GET /api/events
// ==============================================================================
test('GET /api/events — Deve retornar eventos e festividades', async () => {
  const res = await fetch(`${baseUrl}/api/events`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.some(e => e.id === 'feira-da-terra-seda'));
  assert.ok(json.data.some(e => e.id === 'amendoeiras-em-flor'));
});

// ==============================================================================
// 7. Compatibilidade com rotas frontend (/api/pois e /api/routes)
// ==============================================================================
test('GET /api/pois — Deve responder pelo alias com sucesso', async () => {
  const res = await fetch(`${baseUrl}/api/pois`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
});

test('GET /api/pois/:id — Deve responder pelo alias para local específico', async () => {
  const res = await fetch(`${baseUrl}/api/pois/museu-da-seda`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.id, 'museu-da-seda');
});

// ==============================================================================
// 8. POST /api/chat — Validações e tratamento de indisponibilidade
// ==============================================================================
test('POST /api/chat — Deve rejeitar pedido com pergunta vazia (400)', async () => {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: '' })
  });
  assert.equal(res.status, 400);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'MISSING_QUESTION');
});

test('POST /api/chat — Deve rejeitar pedido com idioma inválido (400)', async () => {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'Onde fica a torre?', language: 'fr' })
  });
  assert.equal(res.status, 400);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'INVALID_LANGUAGE');
});

test('POST /api/chat — Se FastAPI não estiver ativo, deve devolver 503 controlado', async () => {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'O que visitar em Freixo?', language: 'pt' })
  });

  // O FastAPI pode estar ativo ou inativo no ambiente
  if (res.status === 503) {
    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.serviceAvailable, false);
    assert.equal(json.error.code, 'AI_SERVICE_UNAVAILABLE');
  } else if (res.status === 200) {
    const json = await res.json();
    assert.ok(json.answer);
  }
});

// ==============================================================================
// 9. Rota Não Encontrada (404)
// ==============================================================================
test('GET /api/rota-inexistente — Deve devolver erro 404 com envelope padronizado', async () => {
  const res = await fetch(`${baseUrl}/api/rota-inexistente`);
  assert.equal(res.status, 404);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'ROUTE_NOT_FOUND');
  assert.equal(json.error.status, 404);
});
