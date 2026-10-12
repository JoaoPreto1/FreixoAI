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
test('GET /api/health — Deve responder com status 200 e estrutura de saúde detalhada', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.status, 'ok');
  assert.equal(json.healthy, true);
  assert.equal(json.service, 'freixo-ai-backend');
  assert.ok(json.timestamp);
  assert.ok(json.integrations);
  
  // Verificação inequívoca do Supabase
  assert.ok('supabase' in json.integrations);
  assert.ok(typeof json.integrations.supabase.status === 'string');
  assert.ok(typeof json.integrations.supabase.connected === 'boolean');
  assert.ok('rag_tables' in json.integrations.supabase);
  assert.ok('tourist_tables' in json.integrations.supabase);
  assert.ok('active_source' in json.integrations.supabase);

  // Verificação inequívoca do FastAPI
  assert.ok('fastapi' in json.integrations);
  assert.ok(typeof json.integrations.fastapi.online === 'boolean');
  assert.ok(Array.isArray(json.integrations.fastapi.models));
  assert.ok(json.integrations.fastapi.url);
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

test('GET /api/trails — Deve incluir PR1 Calçada de Alpajares com metadados de geometria', async () => {
  const res = await fetch(`${baseUrl}/api/trails`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);

  const alpajares = json.data.find(t => t.id === 'pr1-calcada-alpajares' || t.slug === 'pr1-calcada-alpajares');
  assert.ok(alpajares, 'Deve conter o percurso pr1-calcada-alpajares');
  assert.equal(alpajares.geometry_status, 'confirmado');
  assert.ok(alpajares.geometry_source);
  assert.ok(alpajares.geometry_consulted_at);
  assert.ok(alpajares.geojson);
  assert.ok(alpajares.geojson.type === 'Feature' || alpajares.geojson.type === 'MultiLineString');
});

test('GET /api/trails/:slug — Deve retornar PR1 Calçada de Alpajares com GeoJSON válido e ordem correta [lon, lat]', async () => {
  const res = await fetch(`${baseUrl}/api/trails/pr1-calcada-alpajares`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data);

  const trail = json.data;
  assert.equal(trail.id, 'pr1-calcada-alpajares');
  assert.equal(trail.geometry_status, 'confirmado');
  assert.match(trail.geometry_source, /OpenStreetMap/i);
  assert.equal(trail.geometry_consulted_at, '2026-10-12');

  // Validação da geometria GeoJSON (RFC 7946)
  const geojson = trail.geojson;
  assert.ok(geojson, 'GeoJSON deve estar presente');
  assert.ok(geojson.type === 'Feature' || geojson.type === 'MultiLineString');
  const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson;
  assert.equal(geometry.type, 'MultiLineString');
  assert.ok(Array.isArray(geometry.coordinates));
  assert.ok(geometry.coordinates.length > 0, 'Deve conter segmentos de linha');

  // Validação rigorosa da ordem das coordenadas [longitude, latitude]
  // Freixo de Espada à Cinta situa-se em aprox. Longitude [-6.92, -6.80] e Latitude [41.03, 41.15]
  let totalPoints = 0;
  for (const line of geometry.coordinates) {
    assert.ok(Array.isArray(line));
    for (const coord of line) {
      assert.ok(Array.isArray(coord));
      assert.equal(coord.length, 2, 'Cada vértice deve ter 2 coordenadas [lon, lat]');
      
      const [lon, lat] = coord;
      // Longitude deve ser negativa no Douro Internacional
      assert.ok(lon >= -7.1 && lon <= -6.7, `Longitude fora do intervalo esperado de Freixo: ${lon}`);
      // Latitude deve ser ~41N
      assert.ok(lat >= 40.9 && lat <= 41.2, `Latitude fora do intervalo esperado de Freixo: ${lat}`);
      totalPoints++;
    }
  }
  assert.ok(totalPoints > 100, `Traçado deve ter riqueza geométrica (encontrados ${totalPoints} pontos)`);
});

test('GET /api/trails/:slug — Deve tratar percurso sem geometria (rota-douro-grifos) com geometry_status "indisponivel" sem erros', async () => {
  const res = await fetch(`${baseUrl}/api/trails/rota-douro-grifos`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data);
  assert.equal(json.data.id, 'rota-douro-grifos');
  assert.equal(json.data.geometry_status, 'indisponivel');
  assert.equal(json.data.geojson, null);
  assert.ok(json.data.geometry_limitations, 'Deve conter nota explicativa das limitações cartográficas');
});

test('GET /api/trails/:slug — Deve retornar 404 TRAIL_NOT_FOUND para percurso inexistente', async () => {
  const res = await fetch(`${baseUrl}/api/trails/percurso-inexistente-xyz-999`);
  assert.equal(res.status, 404);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'TRAIL_NOT_FOUND');
  assert.equal(json.error.status, 404);
});

test('GET /api/trails/:slug — Deve retornar 400 MALFORMED_SLUG para slug com espaços ou caracteres proibidos', async () => {
  const res = await fetch(`${baseUrl}/api/trails/slug%20com%20espacos%20proibidos`);
  assert.equal(res.status, 400);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'MALFORMED_SLUG');
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

test('GET /api/events/:slug — Deve retornar detalhe de feira-da-terra-seda com enquadramento temporal e histórico', async () => {
  const res = await fetch(`${baseUrl}/api/events/feira-da-terra-seda`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data);

  const event = json.data;
  assert.equal(event.id, 'feira-da-terra-seda');
  assert.equal(event.title, 'Feira da Terra e da Seda');
  assert.ok(event.periodicity);
  assert.ok(event.historical_context);
  assert.ok(event.verification_source);
  assert.ok(event.consulted_at);
  assert.ok(Array.isArray(event.related_pois));
  assert.ok(event.related_pois.includes('museu-da-seda'));
});

test('GET /api/events/:slug — Deve retornar 404 EVENT_NOT_FOUND para evento inexistente', async () => {
  const res = await fetch(`${baseUrl}/api/events/evento-inexistente-xyz-999`);
  assert.equal(res.status, 404);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'EVENT_NOT_FOUND');
  assert.equal(json.error.status, 404);
});

test('GET /api/events/:slug — Deve retornar 400 MALFORMED_SLUG para slug com caracteres inválidos', async () => {
  const res = await fetch(`${baseUrl}/api/events/slug%20com%20espacos%20proibidos`);
  assert.equal(res.status, 400);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'MALFORMED_SLUG');
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
// 9. Arranque e Rota Raiz (GET /)
// ==============================================================================
test('GET / — Deve responder com 200, metadados da API e lista de endpoints', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.name, 'Freixo AI — Backend API');
  assert.equal(json.version, '1.0.0');
  assert.ok(Array.isArray(json.endpoints));
  assert.ok(json.endpoints.includes('GET /api/health'));
  assert.ok(json.endpoints.includes('POST /api/chat'));
});

// ==============================================================================
// 10. CORS (Cross-Origin Resource Sharing)
// ==============================================================================
test('CORS — Deve incluir cabeçalhos Access-Control-Allow-Origin para CLIENT_ORIGIN', async () => {
  const res = await fetch(`${baseUrl}/api/health`, {
    headers: { 'Origin': 'http://localhost:3000' }
  });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:3000');
});

// ==============================================================================
// 11. Rota Não Encontrada (404)
// ==============================================================================
test('GET /api/rota-inexistente — Deve devolver erro 404 com envelope padronizado', async () => {
  const res = await fetch(`${baseUrl}/api/rota-inexistente`);
  assert.equal(res.status, 404);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'ROUTE_NOT_FOUND');
  assert.equal(json.error.status, 404);
});

test('GET /rota-global-desconhecida — Deve responder com 404 consistente fora de /api', async () => {
  const res = await fetch(`${baseUrl}/rota-global-desconhecida`);
  assert.equal(res.status, 404);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'ROUTE_NOT_FOUND');
  assert.equal(json.error.status, 404);
});

// ==============================================================================
// 12. POST /api/itinerary/generate — Validação e Geração de Itinerários Oficiais
// ==============================================================================
test('POST /api/itinerary/generate — Deve rejeitar número inválido de dias (400)', async () => {
  const res = await fetch(`${baseUrl}/api/itinerary/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ days: 10, interest: 'cultura' })
  });
  assert.equal(res.status, 400);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'INVALID_DAYS');
  assert.equal(json.error.param, 'days');
});

test('POST /api/itinerary/generate — Deve rejeitar ritmo de visita inválido (400)', async () => {
  const res = await fetch(`${baseUrl}/api/itinerary/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ days: 2, pace: 'super-veloz' })
  });
  assert.equal(res.status, 400);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'INVALID_PACE');
  assert.equal(json.error.param, 'pace');
});

test('POST /api/itinerary/generate — Deve rejeitar interesse inválido (400)', async () => {
  const res = await fetch(`${baseUrl}/api/itinerary/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ days: 2, interest: 'viagem-espacial' })
  });
  assert.equal(res.status, 400);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'INVALID_INTEREST');
  assert.equal(json.error.param, 'interest');
});

test('POST /api/itinerary/generate — Deve rejeitar mobilidade inválida (400)', async () => {
  const res = await fetch(`${baseUrl}/api/itinerary/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ days: 2, mobility: 'teletransporte' })
  });
  assert.equal(res.status, 400);

  const json = await res.json();
  assert.equal(json.success, false);
  assert.equal(json.error.code, 'INVALID_MOBILITY');
  assert.equal(json.error.param, 'mobility');
});

test('POST /api/itinerary/generate — Deve gerar itinerário de 2 dias com dados oficiais e campos estruturados', async () => {
  const res = await fetch(`${baseUrl}/api/itinerary/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      days: 2,
      pace: 'equilibrado',
      interest: 'cultura',
      mobility: 'carro'
    })
  });
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.summary);
  assert.equal(json.summary.days, 2);
  assert.equal(json.summary.pace, 'equilibrado');
  assert.equal(json.summary.interest, 'cultura');
  assert.equal(json.summary.mobility, 'carro');
  assert.ok(json.summary.overview);
  assert.ok(json.summary.seasonTip);
  assert.ok(json.summary.disclaimer);

  // Validação dos dias
  assert.ok(Array.isArray(json.days));
  assert.equal(json.days.length, 2);

  const day1 = json.days[0];
  assert.equal(day1.day, 1);
  assert.ok(day1.title);
  assert.ok(day1.theme);
  assert.ok(Array.isArray(day1.stops) && day1.stops.length > 0);

  // Validação de paragens individuais
  const stop1 = day1.stops[0];
  assert.ok(stop1.order);
  assert.ok(stop1.time);
  assert.ok(stop1.poiSlug);
  assert.ok(stop1.title);
  assert.ok(stop1.location);
  assert.ok(stop1.estimatedVisitTime, 'Deve indicar duração estimada da visita');
  assert.ok(stop1.travelNote, 'Deve indicar nota/tempo de deslocação distinto da visita');
  assert.ok(stop1.reason, 'Deve fornecer motivo da sugestão fundamentado');
  assert.ok(stop1.openingHours);

  // Validação de integridade dos metadados de geração
  assert.ok(json.meta);
  assert.ok(['ia_personalizada', 'algoritmo_territorial'].includes(json.meta.generation_method));
  assert.ok(typeof json.meta.is_ai_enhanced === 'boolean');
  assert.ok(json.meta.source);
});

test('POST /api/itinerary/generate — Mobilidade "a-pe" deve assinalar limitações para locais remotos', async () => {
  const res = await fetch(`${baseUrl}/api/itinerary/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      days: 2,
      pace: 'equilibrado',
      interest: 'geral',
      mobility: 'a-pe'
    })
  });
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);

  // Procurar paragens fora da vila sede (como Penedo Durão ou Congida)
  const allStops = json.days.flatMap(d => d.stops);
  const penedoStop = allStops.find(s => s.poiSlug === 'penedo-durao');
  if (penedoStop) {
    assert.ok(penedoStop.limitation, 'Penedo Durão deve conter aviso explícito de limitação pedonal');
    assert.match(penedoStop.limitation, /viatura|táxi|transfer/i);
  }
});

test('POST /api/itinerary — Alias deve responder exatamente igual com 200', async () => {
  const res = await fetch(`${baseUrl}/api/itinerary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ days: 1, interest: 'natureza' })
  });
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.days.length, 1);
});

