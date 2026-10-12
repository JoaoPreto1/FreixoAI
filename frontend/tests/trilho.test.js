/**
 * FREIXO AI — Testes Automatizados da Ficha Canónica de Trilhos (trilho.html)
 * Validação do servidor estático, resolução de slugs, integridade cartográfica GeoJSON,
 * avisos de segurança e resiliência a percursos sem geometria ou inexistentes.
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

import { poiService } from '../js/services/poiService.js';
import { ROUTES_DATA } from '../js/data/mockRoutes.js';
import { PR1_ALPAJARES_GEOJSON } from '../js/data/geodata/alpajaresGeojson.js';

let testServer;
let testPort;
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
    if (reqPath === '/') reqPath = '/trilho.html';

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
// 1. Disponibilidade e Estrutura da Página trilho.html
// ==============================================================================
test('GET /trilho.html — Servidor deve responder com 200 OK e carregar a ficha de percurso', async () => {
  const res = await fetch(`${baseUrl}/trilho.html`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);

  const html = await res.text();
  assert.ok(html.includes('id="page-title"'));
  assert.ok(html.includes('id="trail-content"'));
  assert.ok(html.includes('id="trail-detail-map"'));
  assert.ok(html.includes('id="carto-source"'));
  assert.ok(html.includes('id="carto-consulted"'));
  assert.ok(html.includes('id="safety-warnings-grid"'));
  assert.ok(html.includes('id="trail-pois-container"'));
  assert.ok(html.includes('id="btn-open-explorer-map"'));
  assert.ok(html.includes('id="error-state"'));
});

test('GET /trilho.html?slug=pr1-calcada-alpajares — Servidor resolve página com query string', async () => {
  const res = await fetch(`${baseUrl}/trilho.html?slug=pr1-calcada-alpajares`);
  assert.equal(res.status, 200);

  const html = await res.text();
  assert.ok(html.includes('trilho.html'));
  assert.ok(html.includes('leaflet.js'));
});

// ==============================================================================
// 2. Resolução de Percurso via PoiService (getTrailBySlug)
// ==============================================================================
test('PoiService.getTrailBySlug — Deve resolver "pr1-calcada-alpajares" com dados confirmados', async () => {
  const trail = await poiService.getTrailBySlug('pr1-calcada-alpajares');
  assert.ok(trail, 'Deve retornar o trilho PR1');
  assert.equal(trail.id, 'pr1-calcada-alpajares');
  assert.equal(trail.geometry_status, 'confirmado');
  assert.equal(trail.difficulty, 'Difícil');
  assert.equal(trail.duration, '3h30');
  assert.equal(trail.distance_km, 7.5);
  assert.ok(trail.geojson, 'Deve incluir o GeoJSON real');
  assert.ok(trail.geometry_source, 'Deve indicar fonte oficial');
  assert.equal(trail.geometry_consulted_at, '2026-10-12');
});

test('PoiService.getTrailBySlug — Deve resolver percurso sem geometria sem provocar erros', async () => {
  const trail = await poiService.getTrailBySlug('rota-douro-grifos');
  assert.ok(trail);
  assert.equal(trail.id, 'rota-douro-grifos');
  assert.equal(trail.geometry_status, 'indisponivel');
  assert.equal(trail.geojson, null, 'GeoJSON deve ser estritamente nulo e não interpolado');
  assert.ok(trail.geometry_limitations, 'Deve conter nota factual explicativa das limitações');
});

test('PoiService.getTrailBySlug — Deve devolver null para percurso inexistente', async () => {
  const trail = await poiService.getTrailBySlug('trilho-inexistente-12345');
  assert.equal(trail, null, 'Trilho desconhecido deve retornar null');
});

// ==============================================================================
// 3. Ordem e Integridade das Coordenadas WGS84
// ==============================================================================
test('trilho.html — Geometria associada respeita a convenção [lon, lat] do Leaflet/GeoJSON', () => {
  const geojson = PR1_ALPAJARES_GEOJSON;
  assert.equal(geojson.type, 'Feature');
  
  const coords = geojson.geometry.coordinates;
  assert.ok(Array.isArray(coords));
  assert.ok(coords.length > 0);

  // Verificar que os pontos estão no quadrante territorial do Douro Internacional
  const firstPoint = coords[0][0];
  assert.equal(firstPoint.length, 2);
  const [lon, lat] = firstPoint;

  assert.ok(lon < 0, 'Longitude de Freixo deve ser negativa (Oeste)');
  assert.ok(lat > 0, 'Latitude de Freixo deve ser positiva (Norte)');
  assert.ok(lon >= -7.2 && lon <= -6.6);
  assert.ok(lat >= 40.9 && lat <= 41.3);
});
