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

test('GET /api/search — Consulta vazia deve responder 200 com total zero e agrupamento estruturado', async () => {
  const res = await fetch(`${baseUrl}/api/search`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.meta.total, 0);
  assert.deepEqual(json.data.places, []);
  assert.deepEqual(json.data.trails, []);
  assert.deepEqual(json.data.events, []);
  assert.deepEqual(json.data.freguesias, []);
});

test('GET /api/search?q=penedo — Encontra locais associados ao Penedo Durão', async () => {
  const res = await fetch(`${baseUrl}/api/search?q=penedo`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.meta.total >= 1);
  assert.ok(json.data.places.some(p => p.slug === 'penedo-durao' || p.title.includes('Penedo')));
});

test('GET /api/search?q=alpajares — Encontra percursos e locais da Calçada de Alpajares', async () => {
  const res = await fetch(`${baseUrl}/api/search?q=alpajares`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.meta.total >= 1);
  assert.ok(json.data.trails.some(t => t.slug === 'pr1-calcada-alpajares'));
});

test('GET /api/search?q=seda — Encontra resultados transversais em locais, trilhos e eventos', async () => {
  const res = await fetch(`${baseUrl}/api/search?q=seda`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.places.length > 0, 'Deve conter locais com seda');
  assert.ok(json.data.trails.length > 0, 'Deve conter trilhos da seda');
  assert.ok(json.data.events.length > 0, 'Deve conter a Feira da Seda');
  assert.equal(json.meta.total, json.data.places.length + json.data.trails.length + json.data.events.length + json.data.freguesias.length);
});

test('GET /api/search?q=mazouco — Encontra freguesia e património rupestre', async () => {
  const res = await fetch(`${baseUrl}/api/search?q=mazouco`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.freguesias.some(f => f.id === 'freixo-mazouco'));
  assert.ok(json.data.places.some(p => p.slug === 'cavalo-do-mazouco'));
});

test('GET /api/search?q=termo-inexistente-xyz999 — Retorna total zero sem erros', async () => {
  const res = await fetch(`${baseUrl}/api/search?q=termo-inexistente-xyz999`);
  assert.equal(res.status, 200);

  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.meta.total, 0);
  assert.equal(json.data.places.length, 0);
  assert.equal(json.data.trails.length, 0);
  assert.equal(json.data.events.length, 0);
  assert.equal(json.data.freguesias.length, 0);
});
