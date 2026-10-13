/**
 * FREIXO AI — Testes de Integridade da Expansão da Base de Conhecimento Turística
 * Validação de integridade de dados, ausência de duplicados, validade de coordenadas,
 * cobertura das 4 freguesias, paridade com Supabase e proveniência factual.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import app from '../src/app.js';
import { PLACES, TRAILS, EVENTS, FREGUESIAS } from '../src/data/verifiedLocalData.js';
import { getSupabaseClient } from '../src/config/supabase.js';

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
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

// ==============================================================================
// 1. Integridade de Identificadores e Ausência de Duplicados
// ==============================================================================
test('Integridade de Dados — Sem duplicados em slugs e IDs de PLACES', () => {
  const ids = new Set();
  const slugs = new Set();

  for (const place of PLACES) {
    assert.ok(place.id, 'Cada local deve ter ID');
    assert.ok(place.slug, 'Cada local deve ter slug');
    assert.equal(ids.has(place.id), false, `ID duplicado detectado: ${place.id}`);
    assert.equal(slugs.has(place.slug), false, `Slug duplicado detectado: ${place.slug}`);
    ids.add(place.id);
    slugs.add(place.slug);
  }
});

test('Integridade de Dados — Sem duplicados em TRAILS e EVENTS', () => {
  const trailSlugs = new Set();
  for (const trail of TRAILS) {
    assert.equal(trailSlugs.has(trail.slug), false, `Slug de trilho duplicado: ${trail.slug}`);
    trailSlugs.add(trail.slug);
  }

  const eventSlugs = new Set();
  for (const event of EVENTS) {
    assert.equal(eventSlugs.has(event.slug), false, `Slug de evento duplicado: ${event.slug}`);
    eventSlugs.add(event.slug);
  }
});

// ==============================================================================
// 2. Validade Cartográfica e Bounding Box do Concelho
// ==============================================================================
test('Coordenadas — Todos os locais confirmados situam-se na bounding box oficial de Freixo', () => {
  // Limites aproximados do concelho de Freixo de Espada à Cinta:
  // Lat: [41.00, 41.25], Lng: [-7.02, -6.68]
  const confirmedPlaces = PLACES.filter(p => !p.is_demo);

  assert.ok(confirmedPlaces.length >= 17, `Esperados pelo menos 17 locais confirmados, encontrados: ${confirmedPlaces.length}`);

  for (const place of confirmedPlaces) {
    assert.ok(typeof place.latitude === 'number', `Latitude deve ser numérica em ${place.id}`);
    assert.ok(typeof place.longitude === 'number', `Longitude deve ser numérica em ${place.id}`);

    assert.ok(
      place.latitude >= 41.00 && place.latitude <= 41.25,
      `Latitude fora de limites em ${place.id}: ${place.latitude}`
    );
    assert.ok(
      place.longitude >= -7.02 && place.longitude <= -6.68,
      `Longitude fora de limites em ${place.id}: ${place.longitude}`
    );
  }
});

// ==============================================================================
// 3. Cobertura Abrangente das Quatro Freguesias
// ==============================================================================
test('Cobertura Concelhia — As 4 freguesias possuem locais confirmados no catálogo', () => {
  const expectedFreguesias = ['freixo-mazouco', 'lagoaca-fornos', 'ligares', 'poia'];

  for (const fregId of expectedFreguesias) {
    const placesInFreg = PLACES.filter(p => p.freguesia_id === fregId && !p.is_demo);
    assert.ok(
      placesInFreg.length >= 2,
      `A freguesia "${fregId}" deve ter pelo menos 2 locais confirmados. Encontrados: ${placesInFreg.length}`
    );
  }
});

// ==============================================================================
// 4. Proveniência e Rigor Factual dos Registos
// ==============================================================================
test('Proveniência Factual — Todos os locais confirmados identificam a fonte oficial', () => {
  for (const place of PLACES.filter(p => !p.is_demo)) {
    assert.equal(place.verification_status, 'confirmado');
    assert.ok(place.verification_source, `Fonte de verificação em falta em ${place.id}`);
    assert.ok(
      place.verification_source.length > 5,
      `Fonte deve ter descrição válida em ${place.id}: "${place.verification_source}"`
    );
  }
});

// ==============================================================================
// 5. Paridade entre Supabase e Catálogo Local
// ==============================================================================
test('Paridade Supabase vs Catálogo Local — Mesma contagem e correspondência de IDs', async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return; // Ambiente offline suportado

  const { data: dbPlaces } = await supabase.from('places').select('id, slug, freguesia_id');
  const { data: dbTrails } = await supabase.from('trails').select('id, slug, freguesia_id');
  const { data: dbEvents } = await supabase.from('events').select('id, slug, freguesia_id');

  assert.equal(dbPlaces.length, PLACES.length, `Contagem de places deve ser idêntica (DB: ${dbPlaces.length}, Local: ${PLACES.length})`);
  assert.equal(dbTrails.length, TRAILS.length, `Contagem de trails deve ser idêntica (DB: ${dbTrails.length}, Local: ${TRAILS.length})`);
  assert.equal(dbEvents.length, EVENTS.length, `Contagem de events deve ser idêntica (DB: ${dbEvents.length}, Local: ${EVENTS.length})`);

  // Verificar que todos os IDs locais existem na base de dados
  const dbPlaceIds = new Set(dbPlaces.map(p => p.id));
  for (const p of PLACES) {
    assert.ok(dbPlaceIds.has(p.id), `Local local "${p.id}" não encontrado na base de dados`);
  }
});

// ==============================================================================
// 6. Resposta dos Endpoints da API com Filtros por Freguesia
// ==============================================================================
test('API Endpoints — GET /api/places?freguesia=... retorna locais para cada uma das 4 freguesias', async () => {
  const freguesias = ['freixo-mazouco', 'lagoaca-fornos', 'ligares', 'poia'];

  for (const fregId of freguesias) {
    const res = await fetch(`${baseUrl}/api/places?freguesia=${fregId}`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 2, `Filtro por ${fregId} deve retornar pelo menos 2 locais`);

    for (const item of body.data) {
      assert.equal(item.freguesia_id, fregId);
    }
  }
});

test('API Endpoints — GET /api/trails e GET /api/events incluem novos percursos e eventos', async () => {
  const trailsRes = await fetch(`${baseUrl}/api/trails`);
  const trailsBody = await trailsRes.json();
  const trailSlugs = trailsBody.data.map(t => t.slug);
  assert.ok(trailSlugs.includes('pr2-rota-carrascalinho'), 'Deve conter PR2');
  assert.ok(trailSlugs.includes('pr5-rota-penedo-durao'), 'Deve conter PR5');

  const eventsRes = await fetch(`${baseUrl}/api/events`);
  const eventsBody = await eventsRes.json();
  const eventSlugs = eventsBody.data.map(e => e.slug);
  assert.ok(eventSlugs.includes('festa-sao-lourenco-ligares'), 'Deve conter festa de São Lourenço');
  assert.ok(eventSlugs.includes('festa-santo-antao-lagoaca'), 'Deve conter festa de Santo Antão');
});
