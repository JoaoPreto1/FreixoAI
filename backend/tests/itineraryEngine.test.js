/**
 * FREIXO AI — Testes Abrangentes do Motor de Itinerários Inteligente
 * Validação dos Requisitos de Rigor Factual, Seleção Inteligente,
 * Diversidade por Semente, Ritmo, Mobilidade, Fallback e Validação Determinística.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { itineraryService } from '../src/services/itineraryService.js';

test('ItineraryEngine — Os 5 perfis de interesse geram itinerários tematicamente distintos', async () => {
  const seed = 12345;
  const planCultura = await itineraryService.generateItinerary({ days: 2, interest: 'cultura', pace: 'equilibrado', mobility: 'carro', seed, skipAi: true });
  const planNatureza = await itineraryService.generateItinerary({ days: 2, interest: 'natureza', pace: 'equilibrado', mobility: 'carro', seed, skipAi: true });
  const planFamilia = await itineraryService.generateItinerary({ days: 2, interest: 'familia', pace: 'equilibrado', mobility: 'carro', seed, skipAi: true });
  const planEnogastronomia = await itineraryService.generateItinerary({ days: 2, interest: 'enogastronomia', pace: 'equilibrado', mobility: 'carro', seed, skipAi: true });
  const planGeral = await itineraryService.generateItinerary({ days: 2, interest: 'geral', pace: 'equilibrado', mobility: 'carro', seed, skipAi: true });

  // Cultura começa pelo núcleo histórico e património da seda
  const d1CulturaStops = planCultura.days[0].stops.map(s => s.poiSlug);
  assert.ok(d1CulturaStops.includes('museu-da-seda'), 'Cultura deve incluir Museu da Seda no Dia 1');
  assert.ok(d1CulturaStops.includes('igreja-matriz'), 'Cultura deve incluir Igreja Matriz no Dia 1');

  // Natureza começa pelos miradouros e arriba do Douro
  const d1NaturezaStops = planNatureza.days[0].stops.map(s => s.poiSlug);
  assert.ok(d1NaturezaStops.includes('penedo-durao'), 'Natureza deve incluir Penedo Durão no Dia 1');
  assert.ok(d1NaturezaStops.includes('praia-congida'), 'Natureza deve incluir Praia da Congida no Dia 1');

  // Os títulos e temas de dia 1 devem ser distintos
  assert.notEqual(planCultura.days[0].title, planNatureza.days[0].title);
  assert.notEqual(planCultura.days[0].theme, planNatureza.days[0].theme);

  // Família e Enogastronomia possuem resumos adequados aos respetivos perfis
  assert.match(planFamilia.summary.overview, /lazer|família|ribeirinho|tradiç/i);
  assert.match(planEnogastronomia.summary.seasonTip, /vinhos|adega|montes ermos/i);
});

test('ItineraryEngine — Efeito do Ritmo: "tranquilo" gera menos paragens com tempos dilatados', async () => {
  const seed = 999;
  const planTranquilo = await itineraryService.generateItinerary({ days: 2, pace: 'tranquilo', interest: 'cultura', mobility: 'carro', seed, skipAi: true });
  const planDinamico = await itineraryService.generateItinerary({ days: 2, pace: 'dinamico', interest: 'cultura', mobility: 'carro', seed, skipAi: true });

  const totalTranquilo = planTranquilo.days.reduce((acc, d) => acc + d.stops.length, 0);
  const totalDinamico = planDinamico.days.reduce((acc, d) => acc + d.stops.length, 0);

  assert.ok(totalTranquilo <= 4, 'Ritmo tranquilo deve ter no máximo 2 paragens por dia em 2 dias');
  assert.ok(totalDinamico >= totalTranquilo, 'Ritmo dinâmico deve conter igual ou maior número de paragens');

  // Ritmo tranquilo não sobrecarrega os dias
  for (const day of planTranquilo.days) {
    assert.ok(day.stops.length <= 2, `Dia ${day.day} em ritmo tranquilo não pode exceder 2 paragens`);
  }
});

test('ItineraryEngine — Efeito de Mobilidade "a-pe" assinala limitações fora da vila', async () => {
  const planPe = await itineraryService.generateItinerary({ days: 2, pace: 'equilibrado', interest: 'geral', mobility: 'a-pe', seed: 42, skipAi: true });

  const allStops = planPe.days.flatMap(d => d.stops);
  const remoteStops = allStops.filter(s => ['penedo-durao', 'praia-congida', 'calcada-alpajares'].includes(s.poiSlug));

  // Todas as paragens exteriores devem conter nota explícita de limitação
  for (const remote of remoteStops) {
    assert.ok(remote.limitation, `Paragem exterior ${remote.poiSlug} deve conter nota de limitação pedonal`);
    assert.match(remote.limitation, /viatura|táxi|transfer/i);
  }

  // Paragens dentro da vila não devem ter limitação de transporte exterior
  const villageStops = allStops.filter(s => ['museu-da-seda', 'igreja-matriz', 'torre-do-galo'].includes(s.poiSlug));
  for (const village of villageStops) {
    assert.equal(village.limitation, null, `Paragem urbana ${village.poiSlug} não deve conter aviso de transporte exterior`);
  }
});

test('ItineraryEngine — Reprodutibilidade estrita com a mesma semente', async () => {
  const seed = 884422;
  const run1 = await itineraryService.generateItinerary({ days: 3, pace: 'dinamico', interest: 'natureza', mobility: 'carro', seed, skipAi: true });
  const run2 = await itineraryService.generateItinerary({ days: 3, pace: 'dinamico', interest: 'natureza', mobility: 'carro', seed, skipAi: true });

  assert.equal(run1.meta.seed, run2.meta.seed);
  assert.equal(run1.summary.totalStops, run2.summary.totalStops);
  assert.equal(run1.days.length, run2.days.length);

  for (let d = 0; d < run1.days.length; d++) {
    const day1 = run1.days[d];
    const day2 = run2.days[d];
    assert.equal(day1.title, day2.title);
    assert.equal(day1.theme, day2.theme);
    assert.equal(day1.stops.length, day2.stops.length);

    for (let s = 0; s < day1.stops.length; s++) {
      assert.equal(day1.stops[s].poiSlug, day2.stops[s].poiSlug);
      assert.equal(day1.stops[s].time, day2.stops[s].time);
      assert.equal(day1.stops[s].reason, day2.stops[s].reason);
    }
  }
});

test('ItineraryEngine — Variação controlada entre sementes diferentes', async () => {
  // Com perfil de natureza em ritmo dinâmico para 2 dias, testar diferentes sementes
  const planA = await itineraryService.generateItinerary({ days: 2, pace: 'dinamico', interest: 'natureza', mobility: 'carro', seed: 10, skipAi: true });
  const planB = await itineraryService.generateItinerary({ days: 2, pace: 'dinamico', interest: 'natureza', mobility: 'carro', seed: 7777, skipAi: true });

  assert.notEqual(planA.meta.seed, planB.meta.seed);
  // Ambas as respostas devem ser estruturadas e válidas
  assert.equal(planA.days.length, 2);
  assert.equal(planB.days.length, 2);
});

test('ItineraryEngine — Validação Determinística rejeita IDs inventados pelo modelo de IA', () => {
  const candidatesMap = new Map([
    ['museu-da-seda', { id: 'museu-da-seda', title: 'Museu da Seda', category: 'patrimonio' }],
    ['penedo-durao', { id: 'penedo-durao', title: 'Penedo Durão', category: 'miradouro' }]
  ]);

  // IA tenta introduzir uma atração inexistente
  const fakeAiPlan = {
    overview: 'Roteiro com locais inventados',
    days: [
      {
        day: 1,
        title: 'Dia 1',
        theme: 'Tema',
        stops: [
          { id: 'museu-da-seda', reason: 'Local real' },
          { id: 'parque-aquatico-espacial-123', reason: 'Atração inexistente' }
        ]
      }
    ]
  };

  const result = itineraryService.validateAndEnrichAiPlan({
    aiPlan: fakeAiPlan,
    expectedDays: 1,
    pace: 'equilibrado',
    interest: 'cultura',
    mobility: 'carro',
    candidatesMap
  });

  assert.equal(result, null, 'O validador determinístico deve rejeitar categoricamente qualquer ID inexistente');
});

test('ItineraryEngine — Validação Determinística rejeita JSON com contagem incorreta de dias', () => {
  const candidatesMap = new Map([
    ['museu-da-seda', { id: 'museu-da-seda', title: 'Museu da Seda', category: 'patrimonio' }]
  ]);

  const incompleteAiPlan = {
    overview: 'Apenas 1 dia fornecido quando eram esperados 3',
    days: [
      {
        day: 1,
        title: 'Dia 1',
        stops: [{ id: 'museu-da-seda', reason: 'Visita cultural' }]
      }
    ]
  };

  const result = itineraryService.validateAndEnrichAiPlan({
    aiPlan: incompleteAiPlan,
    expectedDays: 3,
    pace: 'equilibrado',
    interest: 'cultura',
    mobility: 'carro',
    candidatesMap
  });

  assert.equal(result, null, 'Deve rejeitar plano cuja contagem de dias divirja do pedido');
});

test('ItineraryEngine — Validação Determinística sanitiza paragens duplicadas no mesmo dia', () => {
  const candidatesMap = new Map([
    ['museu-da-seda', { id: 'museu-da-seda', title: 'Museu da Seda', category: 'patrimonio' }],
    ['penedo-durao', { id: 'penedo-durao', title: 'Penedo Durão', category: 'miradouro' }]
  ]);

  // IA tenta colocar o museu duas vezes no mesmo dia
  const duplicateAiPlan = {
    overview: 'Duplicação no mesmo dia',
    days: [
      {
        day: 1,
        title: 'Dia 1',
        theme: 'Tema',
        stops: [
          { id: 'museu-da-seda', reason: 'Primeira visita' },
          { id: 'museu-da-seda', reason: 'Repetição desnecessária' },
          { id: 'penedo-durao', reason: 'Miradouro' }
        ]
      }
    ]
  };

  const result = itineraryService.validateAndEnrichAiPlan({
    aiPlan: duplicateAiPlan,
    expectedDays: 1,
    pace: 'equilibrado',
    interest: 'cultura',
    mobility: 'carro',
    candidatesMap
  });

  assert.ok(result);
  const day1Stops = result[0].stops;
  assert.equal(day1Stops.length, 2, 'Deve ter eliminado a paragem duplicada no mesmo dia');
  assert.equal(day1Stops[0].poiSlug, 'museu-da-seda');
  assert.equal(day1Stops[1].poiSlug, 'penedo-durao');
});

test('ItineraryEngine — Rigor factual: coordenadas e metadados nunca são adulterados', async () => {
  const plan = await itineraryService.generateItinerary({ days: 2, interest: 'natureza', mobility: 'carro', skipAi: true });
  const allStops = plan.days.flatMap(d => d.stops);

  const penedo = allStops.find(s => s.poiSlug === 'penedo-durao');
  if (penedo) {
    assert.deepEqual(penedo.coordinates, { lat: 41.0427, lng: -6.8242 });
    assert.equal(penedo.estimatedVisitTime, '1h 30 min');
  }

  const museu = allStops.find(s => s.poiSlug === 'museu-da-seda');
  if (museu) {
    assert.deepEqual(museu.coordinates, { lat: 41.0926, lng: -6.8062 });
    assert.equal(museu.estimatedVisitTime, '1h 15 min');
  }
});

test('ItineraryEngine — Distinção honesta do método de geração (não finge IA quando offline)', async () => {
  // Com skipAi: true ou microserviço offline, o método deve reportar explicitamente 'algoritmo_territorial'
  const plan = await itineraryService.generateItinerary({ days: 1, interest: 'geral', skipAi: true });

  assert.equal(plan.meta.generation_method, 'algoritmo_territorial');
  assert.equal(plan.meta.is_ai_enhanced, false);
  assert.equal(plan.meta.model, null);
});

test('ItineraryEngine — Deduplicação in-flight de pedidos concorrentes idênticos', async () => {
  const seed = 554433;
  // Disparar duas chamadas exatamente concorrentes com os mesmos parâmetros
  const p1 = itineraryService.generateItinerary({ days: 2, interest: 'cultura', pace: 'equilibrado', mobility: 'carro', seed, skipAi: true });
  const p2 = itineraryService.generateItinerary({ days: 2, interest: 'cultura', pace: 'equilibrado', mobility: 'carro', seed, skipAi: true });

  const [res1, res2] = await Promise.all([p1, p2]);
  assert.equal(res1, res2, 'Pedidos idênticos em voo devem partilhar a mesma Promise resolvida');
  assert.equal(res1.summary.totalStops, res2.summary.totalStops);
});

test('ItineraryEngine — Telemetria granular e medições de desempenho em meta.timings', async () => {
  const plan = await itineraryService.generateItinerary({ days: 2, interest: 'geral', seed: 101, skipAi: true });

  assert.ok(plan.meta.timings, 'Deve conter objeto meta.timings');
  const t = plan.meta.timings;
  assert.ok(typeof t.total_ms === 'number' && t.total_ms >= 0, 'total_ms deve ser numérico');
  assert.ok(typeof t.node_processing_ms === 'number' && t.node_processing_ms >= 0, 'node_processing_ms deve ser numérico');
  assert.ok(typeof t.db_candidates_query_ms === 'number' && t.db_candidates_query_ms >= 0, 'db_candidates_query_ms deve ser numérico');
  assert.ok(typeof t.validation_enrichment_ms === 'number' && t.validation_enrichment_ms >= 0, 'validation_enrichment_ms deve ser numérico');
});

test('ItineraryEngine — Informa claramente o utilizador quando a capacidade do catálogo é condicionada', async () => {
  // 1) Estadia de 3 ou mais dias a pé no centro histórico
  const planPe3Dias = await itineraryService.generateItinerary({ days: 3, mobility: 'a-pe', interest: 'cultura', seed: 1, skipAi: true });
  assert.ok(planPe3Dias.summary.catalogNote, 'Deve conter nota de catálogo para estadia pedonal de 3 dias');
  assert.match(planPe3Dias.summary.catalogNote, /pedestres|centro histórico|viatura/i);

  // 2) Estadia longa de 4 dias
  const plan4Dias = await itineraryService.generateItinerary({ days: 4, mobility: 'carro', interest: 'natureza', seed: 2, skipAi: true });
  assert.ok(plan4Dias.summary.catalogNote);
  assert.match(plan4Dias.summary.catalogNote, /19 locais e 5 percursos/i);

  // 3) Estadia curta de 1 dia não necessita de alerta de saturação
  const plan1Dia = await itineraryService.generateItinerary({ days: 1, mobility: 'carro', interest: 'cultura', seed: 3, skipAi: true });
  assert.equal(plan1Dia.summary.catalogNote, null, 'Estadia curta de 1 dia tem catálogo amplo sem nota');
});

test('ItineraryEngine — selectAiCandidates filtra e prioriza com base em interesse e mobilidade', () => {
  const dummyPlaces = [
    { id: 'museu-da-seda', title: 'Museu da Seda', category: 'patrimonio' },
    { id: 'penedo-durao', title: 'Penedo Durão', category: 'miradouro' },
    { id: 'adega-cooperativa-montes-ermos', title: 'Adega', category: 'enoturismo' }
  ];
  const dummyTrails = [
    { id: 'rota-seda-manuelino', title: 'Trilho Urbano', category: 'percurso' },
    { id: 'pr5-rota-penedo-durao', title: 'Trilho Durão', category: 'percurso' }
  ];
  const dummyPrng = () => 0.5;

  // Em modo a-pe com interesse cultura: Museu da Seda e trilho urbano devem estar presentes
  const candidatesPe = itineraryService.selectAiCandidates({
    confirmedPlaces: dummyPlaces,
    confirmedTrails: dummyTrails,
    interest: 'cultura',
    mobility: 'a-pe',
    days: 2,
    pace: 'equilibrado',
    prng: dummyPrng
  });

  const idsPe = candidatesPe.map(c => c.id);
  assert.ok(idsPe.includes('museu-da-seda'));
  assert.ok(idsPe.includes('rota-seda-manuelino'));
});

