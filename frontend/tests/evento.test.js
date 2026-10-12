/**
 * FREIXO AI — Testes Automatizados da Ficha Canónica de Eventos (evento.html)
 * Validação do servidor estático, resolução de slugs, rigor e distinção temporal
 * (periodicidade histórica vs datas correntes) e locais associados.
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
import { EVENTS_DATA } from '../js/data/mockEvents.js';

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
    if (reqPath === '/') reqPath = '/evento.html';

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
// 1. Disponibilidade e Estrutura da Página evento.html
// ==============================================================================
test('GET /evento.html — Servidor deve responder com 200 OK e carregar a ficha de evento', async () => {
  const res = await fetch(`${baseUrl}/evento.html`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);

  const html = await res.text();
  assert.ok(html.includes('id="page-title"'));
  assert.ok(html.includes('id="event-content"'));
  assert.ok(html.includes('id="event-detail-map"'));
  assert.ok(html.includes('id="fact-periodicity"'));
  assert.ok(html.includes('id="fact-edition-dates"'));
  assert.ok(html.includes('id="historical-context-text"'));
  assert.ok(html.includes('id="practical-pricing"'));
  assert.ok(html.includes('id="practical-schedule"'));
  assert.ok(html.includes('id="doc-source"'));
  assert.ok(html.includes('id="doc-consulted"'));
  assert.ok(html.includes('id="related-pois-container"'));
  assert.ok(html.includes('id="error-state"'));
});

test('GET /evento.html?slug=feira-da-terra-seda — Servidor resolve página com query string', async () => {
  const res = await fetch(`${baseUrl}/evento.html?slug=feira-da-terra-seda`);
  assert.equal(res.status, 200);

  const html = await res.text();
  assert.ok(html.includes('evento.html'));
  assert.ok(html.includes('leaflet.js'));
});

// ==============================================================================
// 2. Resolução de Eventos via PoiService (getEventBySlug)
// ==============================================================================
test('PoiService.getEventBySlug — Deve resolver "feira-da-terra-seda" com rigor temporal e histórico', async () => {
  const event = await poiService.getEventBySlug('feira-da-terra-seda');
  assert.ok(event, 'Deve encontrar o evento da Feira da Seda');
  assert.equal(event.id, 'feira-da-terra-seda');
  assert.equal(event.title, 'Feira da Terra e da Seda');
  assert.ok(event.periodicity, 'Deve informar periodicidade habitual');
  assert.ok(event.edition_dates, 'Deve conter datas da edição corrente');
  assert.ok(event.historical_context, 'Deve incluir enquadramento histórico secular da tradição da seda');
  assert.equal(event.verification_source, 'Município de Freixo de Espada à Cinta');
  assert.equal(event.consulted_at, '2026-10-12');

  // Locais turísticos relacionados documentados
  assert.ok(Array.isArray(event.related_pois));
  assert.ok(event.related_pois.includes('museu-da-seda'), 'Deve associar o Museu da Seda à Feira da Seda');
});

test('PoiService.getEventBySlug — Deve resolver "amendoeiras-em-flor" com distinção biológica/sazonal', async () => {
  const event = await poiService.getEventBySlug('amendoeiras-em-flor');
  assert.ok(event);
  assert.equal(event.id, 'amendoeiras-em-flor');
  assert.match(event.category, /Natureza/i);
  assert.ok(event.edition_status, 'Deve explicitar que a ocorrência depende do ciclo de floração biológico');
  assert.ok(event.related_pois.includes('miradouro-colado'), 'Deve associar o Miradouro do Colado');
});

test('PoiService.getEventBySlug — Deve devolver null para evento inexistente', async () => {
  const event = await poiService.getEventBySlug('evento-inexistente-12345');
  assert.equal(event, null, 'Slug desconhecido deve retornar null sem exceções');
});

// ==============================================================================
// 3. Salvaguardas Contra Invenção de Dados Fictícios
// ==============================================================================
test('evento.html — Fichas de evento mantêm integridade factual e identificam a proveniência', async () => {
  const allEvents = await poiService.getEvents();
  assert.ok(Array.isArray(allEvents));
  assert.ok(allEvents.length >= 3);

  for (const e of allEvents) {
    if (e.id === 'evento-teste-demonstracao') continue;
    assert.ok(e.verification_source, `Evento ${e.id} deve ter fonte documentada`);
    assert.ok(e.periodicity, `Evento ${e.id} deve ter periodicidade conhecida`);
    assert.ok(e.description, `Evento ${e.id} deve ter descrição factual`);
  }
});
