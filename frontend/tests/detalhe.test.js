/**
 * FREIXO AI — Testes da Página Canónica de Detalhe de Locais e Exploração Geoespacial
 * Validação do servidor estático, contrato de rotas por slug e integridade dos dados verificados.
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

// Importar serviços e dados para testar diretamente a lógica em Node
import { poiService } from '../js/services/poiService.js';
import { POIS_DATA } from '../js/data/mockPois.js';
import { ROUTES_DATA } from '../js/data/mockRoutes.js';

let testServer;
let testPort;
let baseUrl;

before(async () => {
  // Criar servidor de teste espelhando o server.js
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
  };

  testServer = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';

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
      testPort = testServer.address().port;
      baseUrl = `http://localhost:${testPort}`;
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
// 1. Servidor Frontend & Disponibilidade da Página de Detalhe
// ==============================================================================
test('GET /detalhe.html — Deve responder com 200 OK e carregar a estrutura editorial', async () => {
  const res = await fetch(`${baseUrl}/detalhe.html`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);

  const html = await res.text();
  assert.ok(html.includes('id="page-title"'));
  assert.ok(html.includes('id="poi-detail-map"'));
  assert.ok(html.includes('id="btn-directions-gps"'));
  assert.ok(html.includes('id="btn-toggle-favorite"'));
  assert.ok(html.includes('id="associated-trails-container"'));
  assert.ok(html.includes('id="highlights-container"'));
});

test('GET /detalhe.html?slug=penedo-durao — Servidor deve resolver a página com query string', async () => {
  const res = await fetch(`${baseUrl}/detalhe.html?slug=penedo-durao`);
  assert.equal(res.status, 200);

  const html = await res.text();
  assert.ok(html.includes('detalhe.html'));
  assert.ok(html.includes('leaflet.js'));
});

// ==============================================================================
// 2. Resolução de POIs Confirmados via PoiService (getPoiBySlug / getPoiById)
// ==============================================================================
test('PoiService.getPoiBySlug — Deve resolver "penedo-durao" com metadados e coordenadas verificadas', async () => {
  const poi = await poiService.getPoiBySlug('penedo-durao');
  assert.ok(poi, 'O Penedo Durão deve existir');
  assert.equal(poi.slug, 'penedo-durao');
  assert.equal(poi.title, 'Miradouro do Penedo Durão');
  assert.equal(poi.category, 'miradouro');
  assert.ok(poi.coordinates, 'Deve conter coordenadas');
  assert.equal(poi.coordinates.lat, 41.0427);
  assert.equal(poi.coordinates.lng, -6.8242);
  assert.equal(poi.altitude, '550 m');
  assert.equal(poi.estimatedTime, '1h 30 min');
  assert.equal(poi.verification.status, 'confirmado');
  assert.ok(poi.verification.source.includes('ICNF') || poi.verification.source.includes('Parque Natural'));
  assert.ok(Array.isArray(poi.highlights) && poi.highlights.length > 0);
});

test('PoiService.getPoiBySlug — Deve resolver "museu-da-seda" com tradição e horários', async () => {
  const poi = await poiService.getPoiBySlug('museu-da-seda');
  assert.ok(poi, 'O Museu da Seda deve existir');
  assert.equal(poi.slug, 'museu-da-seda');
  assert.equal(poi.title, 'Museu da Seda e do Território');
  assert.equal(poi.category, 'patrimonio');
  assert.ok(poi.coordinates.lat);
  assert.ok(poi.coordinates.lng);
  assert.ok(poi.fullDescription.includes('seda'));
});

test('PoiService.getPoiBySlug — Deve resolver "calcada-alpajares" adicionada ao acervo', async () => {
  const poi = await poiService.getPoiBySlug('calcada-alpajares');
  assert.ok(poi, 'A Calçada de Alpajares deve existir no catálogo');
  assert.equal(poi.slug, 'calcada-alpajares');
  assert.ok(poi.title.includes('Alpajares'));
  assert.equal(poi.coordinates.lat, 41.0503);
  assert.equal(poi.coordinates.lng, -6.8532);
});

test('PoiService.getPoiBySlug — Deve devolver null para slug inexistente', async () => {
  const poi = await poiService.getPoiBySlug('monumento-desconhecido-123');
  assert.equal(poi, null);
});

// ==============================================================================
// 3. Associação Georreferenciada de Percursos a Locais (getTrailsForPoi)
// ==============================================================================
test('PoiService.getTrailsForPoi — "museu-da-seda" deve estar associado à Rota da Seda e Manuelino', async () => {
  const trails = await poiService.getTrailsForPoi('museu-da-seda');
  assert.ok(Array.isArray(trails));
  assert.ok(trails.length > 0, 'Deve encontrar pelo menos 1 trilho associado');
  
  const silkTrail = trails.find(t => t.id === 'rota-seda-manuelino' || t.slug === 'rota-seda-manuelino');
  assert.ok(silkTrail, 'Deve incluir a Rota da Seda e dos Portais Manuelinos');
});

test('PoiService.getTrailsForPoi — "penedo-durao" deve estar associado à Rota dos Canhões do Douro', async () => {
  const trails = await poiService.getTrailsForPoi('penedo-durao');
  assert.ok(Array.isArray(trails));
  assert.ok(trails.length > 0, 'Deve encontrar pelo menos 1 trilho para o Penedo Durão');

  const douroTrail = trails.find(t => t.id === 'rota-douro-grifos' || t.slug === 'rota-douro-grifos');
  assert.ok(douroTrail, 'Deve incluir a Rota dos Canhões do Douro e o Voo dos Grifos');
});

test('PoiService.getTrailsForPoi — Para ponto nulo ou sem percursos deve devolver array vazio', async () => {
  const trailsNull = await poiService.getTrailsForPoi(null);
  assert.deepEqual(trailsNull, []);

  const trailsEmpty = await poiService.getTrailsForPoi('ponto-isolado-sem-trilho');
  assert.deepEqual(trailsEmpty, []);
});
