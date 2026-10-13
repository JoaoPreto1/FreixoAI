/**
 * FREIXO AI — Testes de Pesquisa Global, Favoritos e Gestão de Itinerários
 * Valida pesquisa unificada, favoritos locais, persistência de itinerários,
 * partilha reprodutível, páginas pesquisa.html e favoritos.html, e vista de impressão.
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

import { searchService } from '../js/services/searchService.js';
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
// 1. Pesquisa Global (searchService)
// ==============================================================================
test('searchService.search — Consulta vazia devolve total zero com agrupamento estruturado', async () => {
  const res1 = await searchService.search('');
  assert.equal(res1.query, '');
  assert.equal(res1.total, 0);
  assert.deepEqual(res1.places, []);
  assert.deepEqual(res1.trails, []);
  assert.deepEqual(res1.events, []);
  assert.deepEqual(res1.freguesias, []);

  const res2 = await searchService.search('   ');
  assert.equal(res2.total, 0);
});

test('searchService.search — Encontra locais históricos e miradouros com fallback resiliente', async () => {
  const result = await searchService.search('Penedo');
  assert.ok(result);
  assert.ok(result.total > 0, 'Deve encontrar pelo menos um resultado para Penedo');
  assert.ok(Array.isArray(result.places));
  const found = result.places.some(p => p.id === 'penedo-durao' || p.title.toLowerCase().includes('penedo'));
  assert.ok(found, 'Penedo Durão deve estar presente nos locais encontrados');
});

test('searchService.search — Encontra percursos pedestres e trilhos', async () => {
  const result = await searchService.search('Alpajares');
  assert.ok(result);
  assert.ok(result.total > 0);
  const foundTrail = result.trails.some(t => t.id?.includes('alpajares') || t.title?.toLowerCase().includes('alpajares'));
  const foundPlace = result.places.some(p => p.id?.includes('alpajares') || p.title?.toLowerCase().includes('alpajares'));
  assert.ok(foundTrail || foundPlace, 'Deve encontrar a Calçada de Alpajares em trilhos ou locais');
});

test('searchService.search — Encontra eventos e tradições locais', async () => {
  const result = await searchService.search('seda');
  assert.ok(result);
  assert.ok(result.total > 0);
  assert.ok(Array.isArray(result.events));
  const foundEvent = result.events.some(e => e.title.toLowerCase().includes('seda') || e.id?.includes('seda'));
  assert.ok(foundEvent, 'Deve encontrar a Feira da Terra e da Seda nos eventos');
});

test('searchService.search — Encontra freguesias do concelho', async () => {
  const result = await searchService.search('Mazouco');
  assert.ok(result);
  assert.ok(result.total > 0);
  assert.ok(Array.isArray(result.freguesias));
  const foundFreg = result.freguesias.some(f => f.name.toLowerCase().includes('mazouco'));
  assert.ok(foundFreg, 'Deve encontrar a freguesia de Mazouco');
});

test('searchService.search — Termo inexistente retorna total 0 graciosamente sem erros', async () => {
  const result = await searchService.search('termo-totalmente-inexistente-xyz-987');
  assert.ok(result);
  assert.equal(result.total, 0);
  assert.equal(result.places.length, 0);
  assert.equal(result.trails.length, 0);
  assert.equal(result.events.length, 0);
  assert.equal(result.freguesias.length, 0);
});

// ==============================================================================
// 2. Favoritos & Persistência Local (storageService)
// ==============================================================================
test('storageService — Adição, deduplicação e verificação de favoritos de locais, trilhos e eventos', () => {
  storageService.clearFavorites();
  assert.equal(storageService.getFavorites().length, 0);

  // Adicionar local
  const ok1 = storageService.addFavorite('penedo-durao', {
    type: 'place',
    title: 'Miradouro do Penedo Durão',
    category: 'miradouro'
  });
  assert.equal(ok1, true);
  assert.equal(storageService.isFavorite('penedo-durao'), true);
  assert.equal(storageService.isFavorite('local-inexistente'), false);

  // Prevenção de duplicados
  storageService.addFavorite('penedo-durao', { title: 'Miradouro do Penedo Durão Atualizado' });
  const favIds = storageService.getFavorites();
  assert.equal(favIds.length, 1);
  assert.equal(favIds[0], 'penedo-durao');

  // Adicionar trilho
  storageService.addFavorite('pr1-calcada-alpajares', {
    type: 'trail',
    title: 'PR1 - Calçada de Alpajares',
    category: 'trilho'
  });

  // Adicionar evento
  storageService.addFavorite('feira-da-terra-seda', {
    type: 'event',
    title: 'Feira da Terra e da Seda',
    category: 'evento'
  });

  const records = storageService.getFavoriteRecords();
  assert.equal(records.length, 3);
  assert.ok(records.some(r => r.type === 'place' && r.id === 'penedo-durao'));
  assert.ok(records.some(r => r.type === 'trail' && r.id === 'pr1-calcada-alpajares'));
  assert.ok(records.some(r => r.type === 'event' && r.id === 'feira-da-terra-seda'));
});

test('storageService — Alternar (toggle) e remover favoritos', () => {
  storageService.clearFavorites();

  // Alternar para ON
  const state1 = storageService.toggleFavorite('igreja-matriz', { type: 'place', title: 'Igreja Matriz' });
  assert.equal(state1, true);
  assert.equal(storageService.isFavorite('igreja-matriz'), true);

  // Alternar para OFF
  const state2 = storageService.toggleFavorite('igreja-matriz');
  assert.equal(state2, false);
  assert.equal(storageService.isFavorite('igreja-matriz'), false);

  // Remoção direta
  storageService.addFavorite('castelo-freixo', { type: 'place', title: 'Castelo' });
  assert.equal(storageService.isFavorite('castelo-freixo'), true);
  const removed = storageService.removeFavorite('castelo-freixo');
  assert.equal(removed, true);
  assert.equal(storageService.isFavorite('castelo-freixo'), false);

  // Remoção de item inexistente
  const removedNonExistent = storageService.removeFavorite('nao-existe');
  assert.equal(removedNonExistent, false);
});

// ==============================================================================
// 3. Gestão e Recuperação de Múltiplos Itinerários (storageService)
// ==============================================================================
test('storageService — Guardar múltiplos itinerários com integridade de metadados e semente', () => {
  storageService.clearSavedItineraries();
  assert.equal(storageService.getSavedItineraries().length, 0);

  const plan1 = {
    id: 'itin-cultural-2d',
    title: 'Roteiro Manuelino e Seda',
    summary: {
      days: 2,
      interest: 'cultura',
      pace: 'equilibrado',
      mobility: 'carro',
      totalStops: 4,
      overview: 'Visita cultural'
    },
    meta: {
      seed: 554433,
      generation_method: 'algoritmo_territorial'
    },
    days: [
      {
        day: 1,
        title: 'Dia 1',
        theme: 'Manuelino',
        stops: [{ poiId: 'igreja-matriz', title: 'Igreja Matriz', time: '09:30' }]
      },
      {
        day: 2,
        title: 'Dia 2',
        theme: 'Seda e Artesanato',
        stops: [{ poiId: 'museu-da-seda', title: 'Museu da Seda', time: '10:00' }]
      }
    ]
  };

  const plan2 = {
    id: 'itin-natureza-1d',
    title: 'Roteiro Douro e Arribas',
    summary: {
      days: 1,
      interest: 'natureza',
      pace: 'dinamico',
      mobility: 'carro',
      totalStops: 3,
      overview: 'Paisagens sobre o Douro'
    },
    meta: {
      seed: 998877
    },
    days: [
      {
        day: 1,
        title: 'Dia 1',
        theme: 'Arribas',
        stops: [{ poiId: 'penedo-durao', title: 'Miradouro Penedo Durão', time: '09:00' }]
      }
    ]
  };

  storageService.saveItinerary(plan1);
  storageService.saveItinerary(plan2);

  const all = storageService.getSavedItineraries();
  assert.equal(all.length, 2);

  // Recuperação por ID
  const retrieved1 = storageService.getSavedItineraryById('itin-cultural-2d');
  assert.ok(retrieved1);
  assert.equal(retrieved1.summary.interest, 'cultura');
  assert.equal(retrieved1.meta.seed, 554433);
  assert.equal(retrieved1.days.length, 2);

  const retrieved2 = storageService.getSavedItineraryById('itin-natureza-1d');
  assert.ok(retrieved2);
  assert.equal(retrieved2.summary.interest, 'natureza');
  assert.equal(retrieved2.meta.seed, 998877);

  // Remoção de um itinerário
  const deleted = storageService.deleteSavedItinerary('itin-cultural-2d');
  assert.equal(deleted, true);
  assert.equal(storageService.getSavedItineraries().length, 1);
  assert.equal(storageService.getSavedItineraryById('itin-cultural-2d'), null);

  // Limpeza total
  storageService.clearSavedItineraries();
  assert.equal(storageService.getSavedItineraries().length, 0);
});

// ==============================================================================
// 4. Páginas HTML e Recursos da Nova Fase
// ==============================================================================
test('GET /pesquisa.html — Deve responder com 200 OK e carregar a interface da pesquisa global', async () => {
  const res = await fetch(`${baseUrl}/pesquisa.html`);
  assert.equal(res.status, 200);

  const html = await res.text();
  assert.ok(html.includes('id="page-search-input"'), 'Deve conter input de pesquisa global');
  assert.ok(html.includes('id="search-results-container"'), 'Deve conter contentor de resultados');
  assert.ok(html.includes('data-type="all"'), 'Deve conter filtro de todos');
  assert.ok(html.includes('data-type="places"'), 'Deve conter filtro de locais');
  assert.ok(html.includes('data-type="trails"'), 'Deve conter filtro de trilhos');
  assert.ok(html.includes('data-type="events"'), 'Deve conter filtro de eventos');
  assert.ok(html.includes('data-type="freguesias"'), 'Deve conter filtro de freguesias');
});

test('GET /favoritos.html — Deve responder com 200 OK e carregar a interface de gestão de favoritos', async () => {
  const res = await fetch(`${baseUrl}/favoritos.html`);
  assert.equal(res.status, 200);

  const html = await res.text();
  assert.ok(html.includes('id="favs-grid"'), 'Deve conter grelha de favoritos');
  assert.ok(html.includes('id="favs-empty"'), 'Deve conter estado vazio');
  assert.ok(html.includes('id="clear-all-favs-btn"'), 'Deve conter botão de limpar favoritos');
});

test('editorial.css — Contém regras @media print para impressão A4 sem elementos parasitas', () => {
  const cssPath = path.join(frontendDir, 'assets', 'css', 'editorial.css');
  assert.ok(fs.existsSync(cssPath), 'editorial.css deve existir');

  const css = fs.readFileSync(cssPath, 'utf8');
  assert.ok(css.includes('@media print'), 'Deve conter regras para @media print');
  assert.ok(css.includes('#itinerary-form-col') && css.includes('display: none !important'), 'Deve ocultar coluna do formulário em impressão');
  assert.ok(css.includes('#ai-chat-btn') && css.includes('display: none !important'), 'Deve ocultar widget de chat em impressão');
  assert.ok(css.includes('.editorial-header') && css.includes('display: none !important'), 'Deve ocultar cabeçalho em impressão');
});
