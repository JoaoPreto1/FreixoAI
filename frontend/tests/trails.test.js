/**
 * FREIXO AI — Testes Automatizados de Geometrias GeoJSON e Percursos Turísticos
 * Validação da integridade GeoJSON, ordem de coordenadas RFC 7946 [lon, lat],
 * resiliência a percursos sem geometria e coexistência no mapa interativo com Leaflet.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

import { PR1_ALPAJARES_GEOJSON } from '../js/data/geodata/alpajaresGeojson.js';
import { ROUTES_DATA } from '../js/data/mockRoutes.js';
import { poiService } from '../js/services/poiService.js';
import { POIS_DATA } from '../js/data/mockPois.js';

// ==============================================================================
// 1. Validação Estrutural da Geometria GeoJSON (RFC 7946)
// ==============================================================================
test('PR1_ALPAJARES_GEOJSON — Estrutura e formato GeoJSON válido', () => {
  assert.ok(PR1_ALPAJARES_GEOJSON, 'GeoJSON do PR1 Alpajares deve existir');
  assert.equal(PR1_ALPAJARES_GEOJSON.type, 'Feature');
  assert.equal(PR1_ALPAJARES_GEOJSON.id, 'pr1-calcada-alpajares');

  assert.ok(PR1_ALPAJARES_GEOJSON.properties);
  assert.equal(PR1_ALPAJARES_GEOJSON.properties.name, 'PR1 FEC — Vale da Ribeira do Mosteiro e Calçada de Alpajares');
  assert.equal(PR1_ALPAJARES_GEOJSON.properties.distance_km, 7.5);
  assert.equal(PR1_ALPAJARES_GEOJSON.properties.osm_relation_id, 2610592);
  assert.equal(PR1_ALPAJARES_GEOJSON.properties.verification_status, 'confirmado');

  assert.ok(PR1_ALPAJARES_GEOJSON.geometry);
  assert.equal(PR1_ALPAJARES_GEOJSON.geometry.type, 'MultiLineString');
  assert.ok(Array.isArray(PR1_ALPAJARES_GEOJSON.geometry.coordinates));
  assert.ok(PR1_ALPAJARES_GEOJSON.geometry.coordinates.length > 0, 'Deve conter segmentos contínuos');
});

// ==============================================================================
// 2. Confirmação Rigorosa da Ordem das Coordenadas [Longitude, Latitude]
// ==============================================================================
test('PR1_ALPAJARES_GEOJSON — Confirmação da ordem correta das coordenadas [longitude, latitude]', () => {
  const coords = PR1_ALPAJARES_GEOJSON.geometry.coordinates;
  let totalPoints = 0;

  for (const line of coords) {
    assert.ok(Array.isArray(line));
    for (const pt of line) {
      assert.ok(Array.isArray(pt));
      assert.equal(pt.length, 2, 'Cada ponto geográfico deve ter exatamente 2 elementos [lon, lat]');

      const [lon, lat] = pt;

      // Longitude: Freixo de Espada à Cinta está no Hemisfério Ocidental (W), logo longitude é NEGATIVA: aprox. -6.91
      assert.ok(lon >= -7.2 && lon <= -6.6, `Longitude deve estar entre -7.2 e -6.6, obtido: ${lon}`);

      // Latitude: Freixo situa-se na latitude Norte aprox. 41.04 a 41.15
      assert.ok(lat >= 40.9 && lat <= 41.3, `Latitude deve estar entre 40.9 e 41.3, obtido: ${lat}`);

      // Proteção explícita contra inversão acidental de coordenadas [lat, lon]
      assert.ok(lon < lat, 'Longitude [-6.9] deve ser inferior a latitude [+41.0] garantindo a convenção GeoJSON RFC 7946');

      totalPoints++;
    }
  }

  // Garantir que não são apenas 2 pontos numa linha reta fictícia
  assert.ok(totalPoints >= 300, `O traçado deve ter resolução cartográfica real com centenas de vértices. Encontrados: ${totalPoints}`);
});

// ==============================================================================
// 3. Verificação de Percursos Sem Geometria (Não Provocam Erros)
// ==============================================================================
test('Percursos sem geometria — Não provocam erros e reportam estado indisponível', async () => {
  const douroTrail = ROUTES_DATA.find(r => r.id === 'rota-douro-grifos');
  assert.ok(douroTrail, 'Rota dos Canhões do Douro deve constar na base de percursos');
  assert.equal(douroTrail.geometry_status, 'indisponivel', 'Percurso sem traçado homologado único deve ser explicitamente assinalado como indisponível');
  assert.equal(douroTrail.geojson, null, 'Percurso sem geometria confirmada deve ter geojson nulo e NÃO linhas inventadas');
  assert.ok(douroTrail.geometry_limitations, 'Deve conter nota descritiva das limitações');

  // Consulta através do serviço
  const fetched = await poiService.getTrailBySlug('rota-douro-grifos');
  assert.ok(fetched);
  assert.equal(fetched.geometry_status, 'indisponivel');
  assert.equal(fetched.geojson, null);
});

// ==============================================================================
// 4. PoiService — Resolução e Filtros de Trilhos com e sem Geometria
// ==============================================================================
test('PoiService — Consulta de trilhos preserva metadados de proveniência e integridade', async () => {
  const alpajares = await poiService.getTrailBySlug('pr1-calcada-alpajares');
  assert.ok(alpajares);
  assert.equal(alpajares.geometry_status, 'confirmado');
  assert.ok(alpajares.geojson);
  assert.equal(alpajares.geojson.properties?.ref, 'PR1FEC');

  const unknown = await poiService.getTrailBySlug('trilho-inexistente-xyz');
  assert.equal(unknown, null, 'Slug inexistente deve retornar null sem exceção');
});

// ==============================================================================
// 5. Simulação da Lógica do MapComponent com Geometrias e Marcadores
// ==============================================================================
test('MapComponent — Processamento de trilhos lida graciosamente com geometrias ausentes', () => {
  // Simular a rotina de validação do MapComponent.renderTrails
  const mockTrails = [
    { id: 't1', title: 'Com GeoJSON', geometry_status: 'confirmado', geojson: PR1_ALPAJARES_GEOJSON },
    { id: 't2', title: 'Sem GeoJSON', geometry_status: 'indisponivel', geojson: null },
    { id: 't3', title: 'Inválido', geometry_status: 'desconhecido', geojson: { type: 'Invalid' } }
  ];

  const processedValid = [];
  const processedSkipped = [];

  for (const trail of mockTrails) {
    if (!trail.geojson || !trail.geojson.type) {
      processedSkipped.push(trail.id);
      continue;
    }
    const hasCoordinates = (trail.geojson.geometry?.coordinates || trail.geojson.coordinates);
    if (!hasCoordinates) {
      processedSkipped.push(trail.id);
      continue;
    }
    processedValid.push(trail.id);
  }

  assert.deepEqual(processedValid, ['t1']);
  assert.deepEqual(processedSkipped, ['t2', 't3']);
});

// ==============================================================================
// 6. Integridade dos Ficheiros de Interface (explorar.html e detalhe.html)
// ==============================================================================
test('explorar.html — Contém elementos de interface para percursos e legenda cartográfica', () => {
  const html = fs.readFileSync(path.join(frontendDir, 'explorar.html'), 'utf-8');
  assert.ok(html.includes('trails-selector'), 'Deve incluir a barra de seleção de percursos');
  assert.ok(html.includes('trails-selector-bar'), 'Deve incluir o contentor de botões de percursos');
  assert.ok(html.includes('freixoMap.renderTrails'), 'Deve chamar a renderização de trilhos no mapa');
  assert.ok(html.includes('freixo:trailGeometryUnavailable'), 'Deve escutar eventos de geometria indisponível');
});

test('detalhe.html — Contém suporte para visualização de trilho associado e badge de validação', () => {
  const html = fs.readFileSync(path.join(frontendDir, 'detalhe.html'), 'utf-8');
  assert.ok(html.includes('associated-trails-container'), 'Deve conter o contentor de percursos associados');
  assert.ok(html.includes('loadAssociatedTrails'), 'Deve invocar o carregamento de trilhos associados');
  assert.ok(html.includes('detailTrailLayers'), 'Deve gerir camadas de percurso no mini-mapa de detalhe');
});
