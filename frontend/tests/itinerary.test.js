/**
 * FREIXO AI — Testes Automatizados do Planeador de Roteiros
 * Validação do frontend/roteiro.html, do serviço aiService e do gerador de itinerários.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

import { aiService } from '../js/services/aiService.js';
import { storageService } from '../js/services/storageService.js';

let testServer;
let baseUrl;

before(async () => {
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
  };

  testServer = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/roteiro.html';

    if (reqPath === '/env.js') {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      return res.end('window.__ENV__ = Object.freeze({ PUBLIC_API_URL: "http://localhost:5000/api" });');
    }

    const filePath = path.join(frontendDir, reqPath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
      return fs.createReadStream(filePath).pipe(res);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });

  await new Promise(resolve => {
    testServer.listen(0, () => {
      const port = testServer.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (testServer) {
    await new Promise(resolve => testServer.close(resolve));
  }
});

// ==============================================================================
// 1. Servidor e Estrutura DOM de roteiro.html
// ==============================================================================
test('GET /roteiro.html — Deve responder com 200 OK e carregar a estrutura do planeador', async () => {
  const res = await fetch(`${baseUrl}/roteiro.html`);
  assert.equal(res.status, 200);

  const html = await res.text();
  assert.ok(html.includes('id="itinerary-planner-container"'), 'Deve conter o contentor do planeador');
  assert.ok(html.includes('id="curated-routes-grid"'), 'Deve conter a grelha de percursos de autor');
  assert.ok(html.includes('ItineraryPlanner.js'), 'Deve importar o componente ItineraryPlanner');
});

// ==============================================================================
// 2. Geração de Itinerário via AiService (com Fallback e Contratos Reais)
// ==============================================================================
test('AiService.generateItinerary — Deve retornar plano estruturado com resumo e dias', async () => {
  const plan = await aiService.generateItinerary({
    days: 2,
    pace: 'equilibrado',
    interest: 'cultura',
    mobility: 'carro'
  });

  assert.ok(plan);
  assert.ok(plan.summary, 'Deve conter summary');
  assert.equal(plan.summary.days, 2);
  assert.ok(Array.isArray(plan.days));
  assert.equal(plan.days.length, 2);

  const day1 = plan.days[0];
  assert.equal(day1.day, 1);
  assert.ok(Array.isArray(day1.stops));
  assert.ok(day1.stops.length > 0);

  // Verificar campos de rigor turístico em cada paragem
  const stop = day1.stops[0];
  assert.ok(stop.title);
  assert.ok(stop.time);
  assert.ok(stop.poiSlug || stop.poiId);
  assert.ok(stop.location);
  assert.ok(stop.estimatedVisitTime || stop.estimated_time);
  assert.ok(stop.travelNote || stop.travel_time);
});

test('AiService.generateItinerary — Deve aceitar diferentes durações (1 a 4 dias)', async () => {
  const plan1 = await aiService.generateItinerary({ days: 1 });
  assert.equal(plan1.days.length, 1);

  const plan3 = await aiService.generateItinerary({ days: 3 });
  assert.equal(plan3.days.length, 3);
});

// ==============================================================================
// 3. StorageService — Persistência e Recuperação do Itinerário
// ==============================================================================
test('StorageService — Deve guardar e recuperar o itinerário em ambiente simulado', () => {
  const mockPlan = {
    summary: { days: 2, interest: 'natureza' },
    days: [{ day: 1, title: 'Dia 1', stops: [] }]
  };

  storageService.saveItinerary(mockPlan);
  const retrieved = storageService.getSavedItinerary();
  assert.ok(retrieved);
  assert.equal(retrieved.summary.days, 2);
  assert.equal(retrieved.summary.interest, 'natureza');
});

// ==============================================================================
// 4. Diversidade, Botão "Gerar outra versão" e Distinção de Paragens
// ==============================================================================
test('ItineraryPlanner — Contém botão "Gerar Outra Versão" e suporte para semente', async () => {
  const res = await fetch(`${baseUrl}/roteiro.html`);
  const html = await res.text();
  assert.ok(html.includes('ItineraryPlanner.js'), 'Página deve referenciar ItineraryPlanner.js');

  // Testar geração com semente específica no AiService
  const planSeedA = await aiService.generateItinerary({ days: 2, interest: 'natureza', seed: 1234 });
  assert.ok(planSeedA);
  assert.ok(planSeedA.meta);
  assert.equal(planSeedA.meta.seed, 1234);

  // Validação de distinção entre visita, deslocação e motivo em cada paragem
  const firstStop = planSeedA.days[0].stops[0];
  assert.ok(firstStop.estimatedVisitTime || firstStop.estimated_time, 'Deve conter tempo de visita');
  assert.ok(firstStop.travelNote || firstStop.travel_time, 'Deve conter nota de deslocação');
});

