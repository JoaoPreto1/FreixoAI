import { tourismService } from './tourismService.js';
import { aiGatewayService } from './aiGatewayService.js';

/**
 * Função de hash determinística para qualquer semente (string ou número)
 */
function hashSeed(seed) {
  if (typeof seed === 'number' && Number.isFinite(seed)) return seed >>> 0;
  const str = String(seed || 'freixo-seed');
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/**
 * Gerador de números pseudoaleatórios determinístico (Mulberry32)
 */
function createPrng(seed) {
  let s = hashSeed(seed);
  return function() {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Afinidade factual e temático-territorial dos locais por perfil de interesse
 */
const INTEREST_AFFINITIES = {
  cultura: {
    'museu-da-seda': 95,
    'museu-casa-junqueiro': 94,
    'igreja-matriz': 92,
    'cavalo-do-mazouco': 92,
    'portais-manuelinos': 91,
    'torre-do-galo': 88,
    'rota-seda-manuelino': 86,
    'castelo-de-alva': 84,
    'igreja-lagoaca': 76,
    'igreja-matriz-ligares': 76,
    'igreja-poiares': 74,
    'ponte-ligares-mosteiro': 74,
    'calcada-alpajares': 72,
    'penedo-durao': 55,
    'praia-congida': 45,
    'rota-douro-grifos': 52,
    'pr1-calcada-alpajares': 60
  },
  natureza: {
    'penedo-durao': 96,
    'miradouro-carrascalinho': 95,
    'pr2-rota-carrascalinho': 93,
    'praia-congida': 92,
    'miradouro-colado': 92,
    'miradouro-assumadouro': 91,
    'miradouro-cruzinha': 90,
    'pr5-rota-penedo-durao': 90,
    'pr1-calcada-alpajares': 90,
    'rota-douro-grifos': 88,
    'calcada-alpajares': 82,
    'castelo-de-alva': 80,
    'torre-do-galo': 66,
    'museu-da-seda': 48,
    'igreja-matriz': 38,
    'rota-seda-manuelino': 54
  },
  enogastronomia: {
    'adega-cooperativa-montes-ermos': 98,
    'praia-congida': 92,
    'miradouro-colado': 88,
    'torre-do-galo': 86,
    'museu-da-seda': 82,
    'penedo-durao': 76,
    'igreja-matriz-ligares': 75,
    'rota-seda-manuelino': 72,
    'museu-casa-junqueiro': 70,
    'igreja-matriz': 68,
    'rota-douro-grifos': 68,
    'calcada-alpajares': 55,
    'pr1-calcada-alpajares': 52
  },
  familia: {
    'praia-congida': 96,
    'museu-da-seda': 92,
    'miradouro-colado': 90,
    'adega-cooperativa-montes-ermos': 88,
    'torre-do-galo': 88,
    'museu-casa-junqueiro': 86,
    'penedo-durao': 82,
    'rota-seda-manuelino': 76,
    'igreja-lagoaca': 72,
    'igreja-matriz': 68,
    'rota-douro-grifos': 66,
    'calcada-alpajares': 42,
    'pr1-calcada-alpajares': 36
  },
  geral: {
    'penedo-durao': 92,
    'museu-da-seda': 90,
    'torre-do-galo': 88,
    'miradouro-colado': 88,
    'praia-congida': 86,
    'adega-cooperativa-montes-ermos': 86,
    'cavalo-do-mazouco': 85,
    'museu-casa-junqueiro': 85,
    'miradouro-carrascalinho': 84,
    'igreja-matriz': 82,
    'castelo-de-alva': 80,
    'pr2-rota-carrascalinho': 78,
    'pr5-rota-penedo-durao': 78,
    'rota-seda-manuelino': 78,
    'calcada-alpajares': 76,
    'rota-douro-grifos': 72,
    'pr1-calcada-alpajares': 68
  }
};

class ItineraryService {
  constructor() {
    this._inflightRequests = new Map();
  }

  /**
   * Ponto de entrada com deduplicação de pedidos concorrentes idênticos em voo
   */
  async generateItinerary(params = {}) {
    const {
      days = 2,
      pace = 'equilibrado',
      interest = 'cultura',
      mobility = 'carro',
      seed = null,
      skipAi = false
    } = params || {};

    const inflightKey = `${days}_${pace}_${interest}_${mobility}_${seed ?? 'auto'}_${Boolean(skipAi)}`;
    if (this._inflightRequests.has(inflightKey)) {
      return this._inflightRequests.get(inflightKey);
    }

    const promise = this._executeGenerateItinerary({
      days,
      pace,
      interest,
      mobility,
      seed,
      skipAi
    });

    this._inflightRequests.set(inflightKey, promise);

    try {
      return await promise;
    } finally {
      this._inflightRequests.delete(inflightKey);
    }
  }

  /**
   * Execução principal da geração de itinerário com telemetria detalhada de tempos
   */
  async _executeGenerateItinerary({
    days = 2,
    pace = 'equilibrado',
    interest = 'cultura',
    mobility = 'carro',
    seed = null,
    skipAi = false
  }) {
    const t0 = performance.now();
    const activeSeed = seed != null ? seed : Math.floor(Math.random() * 1000000);
    const prng = createPrng(activeSeed);

    // 1. Obter locais e trilhos confirmados (medindo tempo de pesquisa/cache)
    const tDbStart = performance.now();
    const placesResult = await tourismService.getPlaces({ includeDemo: false });
    const rawPlaces = placesResult?.items || [];
    const confirmedPlaces = rawPlaces.filter(
      p => !p.is_demo && p.verification_status !== 'demonstracao'
    );

    if (confirmedPlaces.length === 0) {
      const err = new Error('Não foi possível carregar os pontos turísticos confirmados para gerar o itinerário.');
      err.status = 503;
      err.code = 'NO_PLACES_AVAILABLE';
      throw err;
    }

    const trailsResult = await tourismService.getTrails({ includeDemo: false });
    const rawTrails = trailsResult?.items || [];
    const confirmedTrails = rawTrails.filter(
      t => !t.is_demo && t.verification_status !== 'demonstracao'
    );
    const tDbEnd = performance.now();
    const dbCandidatesQueryMs = tDbEnd - tDbStart;

    // Indexação por id e slug
    const candidatesMap = new Map();
    confirmedPlaces.forEach(p => {
      candidatesMap.set(p.id, { ...p, is_trail: false });
      if (p.slug) candidatesMap.set(p.slug, { ...p, is_trail: false });
    });
    confirmedTrails.forEach(t => {
      candidatesMap.set(t.id, { ...t, is_trail: true });
      if (t.slug) candidatesMap.set(t.slug, { ...t, is_trail: true });
    });

    // 2. Construir plano determinístico com o algoritmo territorial (base sólida e fallback)
    const tTerritorialStart = performance.now();
    const territorialPlan = this.buildTerritorialPlan({
      days,
      pace,
      interest,
      mobility,
      confirmedPlaces,
      confirmedTrails,
      candidatesMap,
      prng
    });
    const tTerritorialEnd = performance.now();
    let validationEnrichmentMs = tTerritorialEnd - tTerritorialStart;

    // 3. Tentar participação ativa da IA local (Ollama / qwen3:4b via FastAPI)
    let finalDays = territorialPlan.days;
    let overviewText = territorialPlan.overview;
    let generationMethod = 'algoritmo_territorial';
    let isAiEnhanced = false;
    let aiModel = null;
    let fastapiResponseMs = 0;
    let ollamaInferenceMs = 0;
    let ollamaEvalMs = 0;
    let ollamaPromptTokens = 0;
    let ollamaEvalTokens = 0;

    if (!skipAi) {
      const tAiStart = performance.now();
      try {
        const candidateListForAi = this.selectAiCandidates({
          confirmedPlaces,
          confirmedTrails,
          interest,
          mobility,
          days,
          pace,
          seed: activeSeed
        });

        // Solicitar ao microserviço FastAPI a seleção inteligente por IA
        const aiResponse = await aiGatewayService.planItinerary({
          days,
          pace,
          interest,
          mobility,
          candidates: candidateListForAi,
          seed: activeSeed,
          language: 'pt'
        });

        const tAiEnd = performance.now();
        fastapiResponseMs = tAiEnd - tAiStart;

        if (aiResponse?.metrics) {
          ollamaInferenceMs = aiResponse.metrics.ollama_total_ms || 0;
          ollamaEvalMs = aiResponse.metrics.ollama_eval_ms || 0;
          ollamaPromptTokens = aiResponse.metrics.prompt_tokens || 0;
          ollamaEvalTokens = aiResponse.metrics.eval_tokens || 0;
        }

        if (aiResponse && aiResponse.success && aiResponse.plan) {
          const tValStart = performance.now();
          const enrichedAiDays = this.validateAndEnrichAiPlan({
            aiPlan: aiResponse.plan,
            expectedDays: days,
            pace,
            interest,
            mobility,
            candidatesMap
          });
          const tValEnd = performance.now();
          validationEnrichmentMs = tValEnd - tValStart;

          if (enrichedAiDays && enrichedAiDays.length === days) {
            finalDays = enrichedAiDays;
            if (aiResponse.plan.overview && typeof aiResponse.plan.overview === 'string' && aiResponse.plan.overview.trim().length > 25) {
              overviewText = aiResponse.plan.overview.trim();
            }
            generationMethod = 'ia_personalizada';
            isAiEnhanced = true;
            aiModel = aiResponse.model || 'qwen3:4b';
          }
        }
      } catch {
        fastapiResponseMs = performance.now() - tAiStart;
        generationMethod = 'algoritmo_territorial';
        isAiEnhanced = false;
        aiModel = null;
      }
    }

    const tEnd = performance.now();
    const totalMs = tEnd - t0;
    const nodeProcessingMs = Math.max(0, totalMs - fastapiResponseMs);

    // Logs estruturados de diagnóstico em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[ItineraryEngine] Total: ${totalMs.toFixed(1)}ms | ` +
        `Node: ${nodeProcessingMs.toFixed(1)}ms | ` +
        `FastAPI: ${fastapiResponseMs.toFixed(1)}ms | ` +
        `Ollama: ${ollamaInferenceMs.toFixed(1)}ms | ` +
        `DB: ${dbCandidatesQueryMs.toFixed(1)}ms | ` +
        `Validação: ${validationEnrichmentMs.toFixed(1)}ms | ` +
        `Método: ${generationMethod}`
      );
    }

    const totalStops = finalDays.reduce((acc, d) => acc + (d.stops ? d.stops.length : 0), 0);

    let catalogNote = null;
    if (mobility === 'a-pe' && days >= 3) {
      catalogNote = 'Para estadias pedestres de 3 ou mais dias, o património pedonal no centro histórico é concentrado. Recomenda-se transporte ou viatura própria para alcançar as arribas do Douro e as aldeias históricas.';
    } else if (days >= 4) {
      catalogNote = 'O concelho dispõe de 19 locais e 5 percursos oficiais verificados distribuídos pelas 4 freguesias do concelho. O roteiro de 4 dias abrange a quase totalidade do património oficial existente.';
    } else if (days === 3) {
      catalogNote = 'O concelho dispõe de 19 locais e 5 percursos oficiais verificados distribuídos pelas 4 freguesias do concelho.';
    }

    return {
      summary: {
        days,
        interest,
        pace,
        mobility,
        totalStops,
        overview: overviewText,
        seasonTip: this.getSeasonTip(interest),
        disclaimer: 'Os tempos de visita e horários baseiam-se em dados oficiais confirmados pelo Município, ICNF e DGPC. Recomenda-se confirmação sazonal no Posto de Turismo.',
        catalogNote,
        isDemonstration: placesResult.source !== 'supabase_db'
      },
      days: finalDays,
      meta: {
        generation_method: generationMethod,
        is_ai_enhanced: isAiEnhanced,
        model: aiModel,
        source: placesResult.source,
        seed: activeSeed,
        timings: {
          total_ms: Math.round(totalMs * 10) / 10,
          node_processing_ms: Math.round(nodeProcessingMs * 10) / 10,
          fastapi_response_ms: Math.round(fastapiResponseMs * 10) / 10,
          ollama_inference_ms: Math.round(ollamaInferenceMs * 10) / 10,
          ollama_eval_ms: Math.round(ollamaEvalMs * 10) / 10,
          db_candidates_query_ms: Math.round(dbCandidatesQueryMs * 10) / 10,
          validation_enrichment_ms: Math.round(validationEnrichmentMs * 10) / 10,
          prompt_tokens: ollamaPromptTokens,
          eval_tokens: ollamaEvalTokens
        },
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Pré-filtra candidatos relevantes para a IA com base no perfil, mobilidade, dias e semente
   */
  selectAiCandidates({ confirmedPlaces, confirmedTrails, interest, mobility, days, pace, seed }) {
    const affinities = INTEREST_AFFINITIES[interest] || INTEREST_AFFINITIES.geral;
    const candidatePrng = createPrng((hashSeed(seed != null ? seed : 'candidates-seed') ^ 0x9e3779b9) >>> 0);

    const scoredPlaces = confirmedPlaces.map(p => {
      let score = affinities[p.id] || 60;
      const isVillage = ['museu-da-seda', 'igreja-matriz', 'torre-do-galo', 'museu-casa-junqueiro'].includes(p.id);
      if (mobility === 'a-pe') {
        score = isVillage ? score + 35 : score - 30;
      }
      score += (candidatePrng() * 10) - 5;
      return { item: p, score, is_trail: false };
    });

    const scoredTrails = confirmedTrails.map(t => {
      let score = affinities[t.id] || (interest === 'natureza' ? 85 : 50);
      if (mobility === 'a-pe') {
        score = t.id === 'rota-seda-manuelino' ? score + 25 : score - 35;
      }
      score += (candidatePrng() * 10) - 5;
      return { item: t, score, is_trail: true };
    });

    scoredPlaces.sort((a, b) => (b.score - a.score) || a.item.id.localeCompare(b.item.id));
    scoredTrails.sort((a, b) => (b.score - a.score) || a.item.id.localeCompare(b.item.id));

    // Número ideal de candidatos para qwen3:4b (10 a 14 itens)
    const maxPlaces = Math.min(scoredPlaces.length, Math.max(8, days * 3));
    const maxTrails = Math.min(scoredTrails.length, days >= 2 ? 3 : 1);

    const selectedPlaces = scoredPlaces.slice(0, maxPlaces).map(s => s.item);
    const selectedTrails = scoredTrails.slice(0, maxTrails).map(s => s.item);

    return [
      ...selectedPlaces.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category || 'patrimonio',
        estimated_time: p.estimated_time || '1h',
        location: p.location || 'Freixo de Espada à Cinta',
        short_description: p.short_description || '',
        accessibility: p.accessibility || '',
        is_trail: false
      })),
      ...selectedTrails.map(t => ({
        id: t.id,
        title: t.title,
        category: t.category || 'percurso',
        location: 'Freixo de Espada à Cinta',
        short_description: t.description || '',
        duration: t.duration || '2h',
        difficulty: t.difficulty || 'Moderada',
        is_trail: true
      }))
    ];
  }

  /**
   * Constrói plano territorial determinístico baseado em dados oficiais,
   * afinidades temáticas, ritmo, mobilidade e diversidade controlada por semente.
   */
  buildTerritorialPlan({
    days,
    pace,
    interest,
    mobility,
    confirmedPlaces,
    confirmedTrails,
    candidatesMap,
    prng
  }) {
    const getCandidate = (idOrSlug) => candidatesMap.get(idOrSlug);

    // Pontos centrais e exteriores verificados
    const museuSeda = getCandidate('museu-da-seda');
    const igrejaMatriz = getCandidate('igreja-matriz');
    const torreGalo = getCandidate('torre-do-galo');
    const penedoDurao = getCandidate('penedo-durao');
    const praiaCongida = getCandidate('praia-congida');
    const alpajares = getCandidate('calcada-alpajares');

    // Novos locais verificados em todas as freguesias
    const colado = getCandidate('miradouro-colado');
    const carrascalinho = getCandidate('miradouro-carrascalinho');
    const adega = getCandidate('adega-cooperativa-montes-ermos');
    const mazouco = getCandidate('cavalo-do-mazouco');
    const junqueiro = getCandidate('museu-casa-junqueiro');
    const assumadouro = getCandidate('miradouro-assumadouro');
    const casteloAlva = getCandidate('castelo-de-alva');
    const ponteLigares = getCandidate('ponte-ligares-mosteiro');
    const igrejaLigares = getCandidate('igreja-matriz-ligares');
    const igrejaPoiares = getCandidate('igreja-poiares');
    const cruzinha = getCandidate('miradouro-cruzinha');

    // Percursos verificados
    const trilhoSeda = getCandidate('rota-seda-manuelino');
    const trilhoGrifos = getCandidate('rota-douro-grifos');
    const trilhoPR1 = getCandidate('pr1-calcada-alpajares');
    const trilhoPR2 = getCandidate('pr2-rota-carrascalinho');
    const trilhoPR5 = getCandidate('pr5-rota-penedo-durao');

    // Decisão da estratégia temática do Dia 1
    const isNatureFirst = interest === 'natureza' && mobility === 'carro';
    const isFamily = interest === 'familia';
    const plans = [];

    // =========================================================================
    // DIA 1
    // =========================================================================
    if (isNatureFirst) {
      const d1Stops = [];
      let order = 1;

      // Variação controlada de semente na sequência matinal
      const startAtPenedo = prng() < 0.5;

      if (startAtPenedo) {
        if (penedoDurao) {
          d1Stops.push(this.formatStop({
            order: order++,
            time: '09:30',
            item: penedoDurao,
            prevItem: null,
            reason: 'Melhor horário matinal para avistar os grifos a levantar voo sobre as arribas do Douro.',
            mobility
          }));
        }
        if (praiaCongida) {
          d1Stops.push(this.formatStop({
            order: order++,
            time: '12:30',
            item: praiaCongida,
            prevItem: penedoDurao,
            reason: 'Espaço ribeirinho ideal para almoço e descanso junto à albufeira de Saucelle.',
            mobility
          }));
        }
      } else {
        if (praiaCongida) {
          d1Stops.push(this.formatStop({
            order: order++,
            time: '10:00',
            item: praiaCongida,
            prevItem: null,
            reason: 'Manhã serena junto ao rio Douro antes das horas de maior movimento.',
            mobility
          }));
        }
        if (penedoDurao) {
          d1Stops.push(this.formatStop({
            order: order++,
            time: '13:00',
            item: penedoDurao,
            prevItem: praiaCongida,
            reason: 'Panorâmica imponente sobre o canhão granítico do Douro Internacional.',
            mobility
          }));
        }
      }

      if (pace !== 'tranquilo') {
        const thirdPlace = (pace === 'dinamico' && alpajares) ? alpajares : torreGalo;
        if (thirdPlace) {
          d1Stops.push(this.formatStop({
            order: order++,
            time: '17:00',
            item: thirdPlace,
            prevItem: d1Stops[d1Stops.length - 1]?.rawItem || penedoDurao,
            reason: thirdPlace === torreGalo
              ? 'Vista panorâmica de 360° ao pôr do sol a partir da torre heptagonal medieval.'
              : 'Garganta escarpada e arqueologia proto-histórica da Ribeira do Mosteiro.',
            mobility
          }));
        }
      }

      plans.push({
        day: 1,
        title: 'Dia 1: As Grandes Arribas do Douro & Margem Fluvial',
        theme: 'Natureza Selvagem do Parque Natural e Lazer Ribadouro',
        stops: d1Stops
      });
    } else {
      // Dia 1 no Centro Histórico (Cultura, Geral, Família, Enogastronomia ou a pé)
      const d1Stops = [];
      let order = 1;

      if (pace === 'tranquilo') {
        if (museuSeda) {
          d1Stops.push(this.formatStop({
            order: order++,
            time: '10:00',
            item: museuSeda,
            prevItem: null,
            reason: 'O único ciclo vivo da seda na Península Ibérica com artesãs ao vivo nos teares de madeira.',
            mobility
          }));
        }
        if (torreGalo) {
          d1Stops.push(this.formatStop({
            order: order++,
            time: '15:30',
            item: torreGalo,
            prevItem: museuSeda,
            reason: 'Tarde contemplativa na torre de 7 faces com vistas de 360° sobre a vila raiana.',
            mobility
          }));
        }
      } else {
        if (museuSeda) {
          d1Stops.push(this.formatStop({
            order: order++,
            time: '10:00',
            item: museuSeda,
            prevItem: null,
            reason: 'O único ciclo vivo da seda na Península Ibérica com artesãs ao vivo nos teares de madeira.',
            mobility
          }));
        }

        if (igrejaMatriz) {
          d1Stops.push(this.formatStop({
            order: order++,
            time: '11:45',
            item: igrejaMatriz,
            prevItem: museuSeda,
            reason: 'Monumento Nacional com pórtico manuelino quinhentista e pinturas renascentistas.',
            mobility
          }));
        }

        if (torreGalo) {
          d1Stops.push(this.formatStop({
            order: order++,
            time: '17:00',
            item: torreGalo,
            prevItem: igrejaMatriz,
            reason: 'Torre de 7 faces única na arquitetura militar portuguesa e freixo centenário lendário.',
            mobility
          }));
        }
      }

      plans.push({
        day: 1,
        title: 'Dia 1: A Tradição Viva da Seda & O Manuelino Duriense',
        theme: 'Centro Histórico, Cantaria Quinhentista e Memória Raiana',
        stops: d1Stops
      });
    }

    // =========================================================================
    // DIA 2
    // =========================================================================
    if (days >= 2) {
      const d2Stops = [];
      let order = 1;

      if (isNatureFirst) {
        // Se Dia 1 foi Natureza, Dia 2 descobre a herança cultural
        if (museuSeda) {
          d2Stops.push(this.formatStop({
            order: order++,
            time: '10:00',
            item: museuSeda,
            prevItem: null,
            reason: 'Contacto com a criação do bicho-da-seda e artesanato tradicional.',
            mobility
          }));
        }
        if (igrejaMatriz) {
          d2Stops.push(this.formatStop({
            order: order++,
            time: '11:45',
            item: igrejaMatriz,
            prevItem: museuSeda,
            reason: 'Apreciação dos detalhes escultóricos de cordame e esferas armilares.',
            mobility
          }));
        }
        if (alpajares && pace !== 'tranquilo') {
          d2Stops.push(this.formatStop({
            order: order++,
            time: '15:30',
            item: alpajares,
            prevItem: igrejaMatriz,
            reason: 'Garganta escarpada e povoado proto-histórico da Idade do Ferro.',
            mobility
          }));
        }

        plans.push({
          day: 2,
          title: 'Dia 2: Monumentos Históricos e Arqueologia Rupestre',
          theme: 'Património Edificado e Canhões do Rio Mosteiro',
          stops: d2Stops
        });
      } else {
        // Sequência para o Dia 2: Arribas e Rio Douro
        if (penedoDurao) {
          d2Stops.push(this.formatStop({
            order: order++,
            time: '09:30',
            item: penedoDurao,
            prevItem: null,
            reason: 'O miradouro mais imponente do Douro Internacional sobre o desfiladeiro de Saucelle.',
            mobility
          }));
        }
        if (praiaCongida) {
          d2Stops.push(this.formatStop({
            order: order++,
            time: '12:30',
            item: praiaCongida,
            prevItem: penedoDurao,
            reason: 'Espaço refrescante nas margens do Douro com piscinas flutuantes e apoio de lazer.',
            mobility
          }));
        }
        if (alpajares && pace === 'dinamico') {
          d2Stops.push(this.formatStop({
            order: order++,
            time: '16:00',
            item: alpajares,
            prevItem: praiaCongida,
            reason: 'Percurso de montanha milenar na garganta granítica da Calçada dos Diabos.',
            mobility
          }));
        }

        plans.push({
          day: 2,
          title: 'Dia 2: As Escarpas do Douro & Oásis Fluvial da Congida',
          theme: 'Vistas Vertiginosas, Parque Natural e Rio Douro',
          stops: d2Stops
        });
      }
    }

    // =========================================================================
    // DIA 3
    // =========================================================================
    if (days >= 3) {
      const d3Stops = [];
      let order = 1;

      if (mobility === 'carro') {
        const d3Morning = carrascalinho || alpajares;
        if (d3Morning) {
          d3Stops.push(this.formatStop({
            order: order++,
            time: '09:30',
            item: d3Morning,
            prevItem: null,
            reason: d3Morning === carrascalinho
              ? 'Miradouro vertiginoso sobre a garganta do Douro e a maior mancha florestal de lodões da Europa (Lagoaça e Fornos).'
              : 'Caminhada matinal pela calçada milenar antes das horas de maior calor.',
            mobility
          }));
        }

        if (adega) {
          d3Stops.push(this.formatStop({
            order: order++,
            time: '12:30',
            item: adega,
            prevItem: d3Morning,
            reason: 'Visita e degustação de vinhos DOC Douro Superior e azeite virgem extra na Adega Cooperativa Montes Ermos.',
            mobility
          }));
        }

        const d3Afternoon = mazouco || junqueiro || colado;
        if (d3Afternoon) {
          d3Stops.push(this.formatStop({
            order: order++,
            time: '16:00',
            item: d3Afternoon,
            prevItem: adega,
            reason: d3Afternoon === mazouco
              ? 'Primeira estação rupestre paleolítica ao ar livre identificada em Portugal, sobre o vale duriense.'
              : 'Visita cultural e literária à casa da família do poeta republicano Guerra Junqueiro.',
            mobility
          }));
        }

        plans.push({
          day: 3,
          title: 'Dia 3: O Douro Setentrional, Lodões & Arte Paleolítica',
          theme: 'Lagoaça, Fornos, Enoturismo e Gravuras do Mazouco',
          stops: d3Stops
        });
      } else {
        // A pé
        if (junqueiro) {
          d3Stops.push(this.formatStop({
            order: order++,
            time: '10:00',
            item: junqueiro,
            prevItem: null,
            reason: 'Visita cultural ao acervo e casa senhorial do poeta Guerra Junqueiro.',
            mobility
          }));
        }
        if (adega) {
          d3Stops.push(this.formatStop({
            order: order++,
            time: '12:30',
            item: adega,
            prevItem: junqueiro,
            reason: 'Provas de vinhos durienses e loja oficial de produtores na vila.',
            mobility
          }));
        }
        if (torreGalo && pace !== 'tranquilo') {
          d3Stops.push(this.formatStop({
            order: order++,
            time: '16:00',
            item: torreGalo,
            prevItem: adega,
            reason: 'Panorâmica vespertina a partir do recinto amuralhado do castelo.',
            mobility
          }));
        }

        plans.push({
          day: 3,
          title: 'Dia 3: Letras, Memória Senhorial & Sabores da Terra',
          theme: 'Poesia Transmontana e Tradição Vinícola na Vila Sede',
          stops: d3Stops
        });
      }
    }

    // =========================================================================
    // DIA 4
    // =========================================================================
    if (days >= 4) {
      const d4Stops = [];
      let order = 1;

      if (mobility === 'carro') {
        const d4Morning = assumadouro || casteloAlva || alpajares;
        if (d4Morning) {
          d4Stops.push(this.formatStop({
            order: order++,
            time: '09:30',
            item: d4Morning,
            prevItem: null,
            reason: d4Morning === assumadouro
              ? 'Varanda panorâmica ampla orientada a sul com vista sobre a veiga de Barca d’Alva e o Douro.'
              : 'Fortaleza medieval e miradouro histórico dionisino sobre a travessia fluvial do Douro.',
            mobility
          }));
        }

        const d4Midday = ponteLigares || igrejaLigares || adega;
        if (d4Midday) {
          d4Stops.push(this.formatStop({
            order: order++,
            time: '12:30',
            item: d4Midday,
            prevItem: d4Morning,
            reason: d4Midday === ponteLigares
              ? 'Ponte secular de xisto na Ribeira do Mosteiro, ponto de encontro de antigas rotas rurais e monásticas.'
              : 'Igreja matriz e adro histórico com sepulturas rupestres medievais escavadas na rocha.',
            mobility
          }));
        }

        const d4Sunset = colado || penedoDurao;
        if (d4Sunset) {
          d4Stops.push(this.formatStop({
            order: order++,
            time: '16:30',
            item: d4Sunset,
            prevItem: d4Midday,
            reason: d4Sunset === colado
              ? 'Despedida com vista de 360° sobre o mar de amendoais e montanhas raianas a partir da Serra dos Montes Ermos.'
              : 'Último voo dos grifos no grande canhão do Douro Internacional ao entardecer.',
            mobility
          }));
        }

        plans.push({
          day: 4,
          title: 'Dia 4: Rotas da Raia, Ribeira do Mosteiro & Miradouros',
          theme: 'Freguesias de Poia e Ligares com Pôr do Sol nos Montes Ermos',
          stops: d4Stops
        });
      } else {
        // A pé
        if (colado) {
          d4Stops.push(this.formatStop({
            order: order++,
            time: '10:00',
            item: colado,
            prevItem: null,
            reason: 'Subida matinal ao santuário mariano dos Montes Ermos com vista aberta sobre a vila.',
            mobility
          }));
        }
        if (museuSeda) {
          d4Stops.push(this.formatStop({
            order: order++,
            time: '14:30',
            item: museuSeda,
            prevItem: colado,
            reason: 'Aquisição de artesanato de seda certificado e despedida cultural das artesãs.',
            mobility
          }));
        }

        plans.push({
          day: 4,
          title: 'Dia 4: Miradouros da Serra & Despedida da Seda',
          theme: 'Montes Ermos, Tradição e Memória Raiana',
          stops: d4Stops
        });
      }
    }

    const defaultOverview = this.buildDefaultOverview(days, interest, pace, mobility);

    return {
      days: plans,
      overview: defaultOverview
    };
  }

  /**
   * Valida deterministicamente a resposta da IA e reconstrói as paragens
   * garantindo factualidade total e fidelidade aos dados oficiais.
   */
  validateAndEnrichAiPlan({
    aiPlan,
    expectedDays,
    pace,
    interest,
    mobility,
    candidatesMap
  }) {
    if (!aiPlan || typeof aiPlan !== 'object') {
      return null;
    }

    let targetPlan = aiPlan;
    for (const wrapperKey of ['plan', 'itinerary', 'roteiro']) {
      if (targetPlan[wrapperKey] && typeof targetPlan[wrapperKey] === 'object' && Array.isArray(targetPlan[wrapperKey].days)) {
        targetPlan = targetPlan[wrapperKey];
        break;
      }
    }

    if (!Array.isArray(targetPlan.days)) {
      const extractedDays = [];
      for (let dayIdx = 1; dayIdx <= expectedDays; dayIdx++) {
        const keysToTry = [`day${dayIdx}`, `day_${dayIdx}`, `dia${dayIdx}`, `dia_${dayIdx}`, String(dayIdx)];
        const foundKey = keysToTry.find(k => k in targetPlan);
        if (foundKey) {
          const val = targetPlan[foundKey];
          if (Array.isArray(val)) {
            extractedDays.push({ day: dayIdx, stops: val });
          } else if (val && typeof val === 'object') {
            extractedDays.push({
              day: dayIdx,
              title: val.title || `Dia ${dayIdx}`,
              theme: val.theme || 'Exploração territorial',
              stops: val.stops || []
            });
          }
        }
      }
      if (extractedDays.length === expectedDays) {
        targetPlan = { ...targetPlan, days: extractedDays };
      }
    }

    if (!Array.isArray(targetPlan.days) || targetPlan.days.length !== expectedDays) {
      return null;
    }

    const enrichedDays = [];
    const usedIdsOverall = new Set();

    for (let dayIdx = 0; dayIdx < expectedDays; dayIdx++) {
      const aiDay = targetPlan.days[dayIdx];
      if (!aiDay || !Array.isArray(aiDay.stops) || aiDay.stops.length === 0) {
        return null;
      }

      // Limitar paragens de acordo com o ritmo (tranquilo: máx 2; equilibrado: máx 3; dinâmico: máx 4)
      const maxStopsPerDay = pace === 'tranquilo' ? 2 : (pace === 'dinamico' ? 4 : 3);
      const dayStopsCandidate = aiDay.stops.slice(0, maxStopsPerDay);
      const enrichedStops = [];
      const dayUsedIds = new Set();
      let prevStopItem = null;

      const scheduleHours = pace === 'tranquilo'
        ? ['10:00', '15:30']
        : (pace === 'dinamico'
          ? ['09:00', '11:30', '14:30', '17:00']
          : ['09:30', '12:30', '16:30']);

      for (let sIdx = 0; sIdx < dayStopsCandidate.length; sIdx++) {
        const stopEntry = dayStopsCandidate[sIdx];
        const stopId = typeof stopEntry === 'string' ? stopEntry.trim() : (stopEntry?.id || stopEntry?.poiId);

        // VALIDAÇÃO RÍGIDA: Rejeitar identificadores inexistentes nos candidatos
        if (!stopId || !candidatesMap.has(stopId)) {
          return null;
        }

        // VALIDAÇÃO: Rejeitar duplicação dentro do mesmo dia
        if (dayUsedIds.has(stopId)) {
          continue;
        }
        dayUsedIds.add(stopId);
        usedIdsOverall.add(stopId);

        const officialItem = candidatesMap.get(stopId);
        const assignedTime = scheduleHours[sIdx] || '17:00';

        const customReason = (typeof stopEntry === 'object' && stopEntry?.reason && typeof stopEntry.reason === 'string' && stopEntry.reason.trim().length > 10)
          ? stopEntry.reason.trim()
          : null;

        const formatted = this.formatStop({
          order: sIdx + 1,
          time: assignedTime,
          item: officialItem,
          prevItem: prevStopItem,
          reason: customReason,
          mobility
        });

        enrichedStops.push(formatted);
        prevStopItem = officialItem;
      }

      if (enrichedStops.length === 0) {
        return null;
      }

      enrichedDays.push({
        day: dayIdx + 1,
        title: (aiDay.title && typeof aiDay.title === 'string' && aiDay.title.trim().length > 3)
          ? aiDay.title.trim()
          : `Dia ${dayIdx + 1}: Exploração Territorial de Freixo`,
        theme: (aiDay.theme && typeof aiDay.theme === 'string' && aiDay.theme.trim().length > 3)
          ? aiDay.theme.trim()
          : 'Património e Paisagem Duriense',
        stops: enrichedStops
      });
    }

    return enrichedDays;
  }

  /**
   * Formata cada paragem do itinerário com base estrita nos dados oficiais
   */
  formatStop({ order, time, item, prevItem, reason, mobility }) {
    const lat = item.latitude != null ? Number(item.latitude) : null;
    const lng = item.longitude != null ? Number(item.longitude) : null;

    const isVillage = ['museu-da-seda', 'igreja-matriz', 'torre-do-galo', 'rota-seda-manuelino'].includes(item.id);

    let limitation = null;
    if (mobility === 'a-pe' && !isVillage) {
      limitation = 'Local fora da vila sede (4 a 8 km). Requer viatura própria, táxi local ou transfer.';
    }

    const travelNote = this.calculateTravelNote(prevItem, item, mobility);

    const defaultReason = item.is_trail
      ? `Percurso pedestre homologado: ${item.description || 'Traçado imersivo na paisagem duriense.'}`
      : (item.highlights && Array.isArray(item.highlights) && item.highlights[0]
        ? item.highlights[0]
        : 'Ponto de interesse oficial verificado.');

    return {
      order,
      time,
      poiId: item.id,
      poiSlug: item.slug || item.id,
      title: item.title,
      category: item.category || (item.is_trail ? 'trilho' : 'patrimonio'),
      categoryLabel: item.category_label || (item.is_trail ? 'Percurso & Natureza' : item.category),
      location: item.location || 'Freixo de Espada à Cinta',
      coordinates: (lat != null && lng != null) ? { lat, lng } : null,
      estimatedVisitTime: item.estimated_time || (item.duration ? item.duration : '1h'),
      travelNote,
      openingHours: item.opening_hours || (item.is_trail ? 'Acesso livre e permanente' : 'Acesso regular'),
      accessibility: item.accessibility || 'Acesso regular',
      description: item.short_description || item.description || '',
      tip: item.tips || '',
      reason: reason || defaultReason,
      limitation,
      rawItem: item
    };
  }

  /**
   * Calcula notas factuais de deslocação e tempos reais entre paragens consecutivas
   */
  calculateTravelNote(prevItem, currentItem, mobility) {
    if (!prevItem) {
      if (['museu-da-seda', 'igreja-matriz', 'torre-do-galo'].includes(currentItem.id)) {
        return 'Ponto de encontro no centro histórico de Freixo (zona pedonal)';
      }
      if (currentItem.id === 'penedo-durao') {
        return mobility === 'a-pe'
          ? 'A 8 km da vila. Requer táxi ou transporte local (não acessível a pé em tempo útil)'
          : 'Deslocação de carro a partir da vila (8 km pela N221, ~12 min)';
      }
      if (currentItem.id === 'praia-congida') {
        return mobility === 'a-pe'
          ? 'A 4 km da vila. Requer transporte local'
          : 'Deslocação de carro a partir da vila (4 km pela estrada municipal, ~8 min)';
      }
      return 'Início do percurso no concelho de Freixo de Espada à Cinta';
    }

    const prevId = prevItem.id;
    const currId = currentItem.id;

    const isPrevVillage = ['museu-da-seda', 'igreja-matriz', 'torre-do-galo', 'rota-seda-manuelino'].includes(prevId);
    const isCurrVillage = ['museu-da-seda', 'igreja-matriz', 'torre-do-galo', 'rota-seda-manuelino'].includes(currId);

    if (isPrevVillage && isCurrVillage) {
      return 'Caminhada suave a pé pelo núcleo urbano quinhentista (~2 a 5 min)';
    }

    if (prevId === 'penedo-durao' && currId === 'praia-congida') {
      return mobility === 'a-pe'
        ? 'A 9 km entre o miradouro e a praia fluvial. Requer transporte local'
        : 'Descida à margem do Douro (9 km a partir do Penedo Durão, ~15 min de carro)';
    }

    if (prevId === 'praia-congida' && currId === 'penedo-durao') {
      return mobility === 'a-pe'
        ? 'A 9 km da praia ao miradouro. Requer transporte local'
        : 'Subida ao Penedo Durão (9 km a partir da Congida, ~15 min de carro)';
    }

    if (currId === 'calcada-alpajares' || currId === 'pr1-calcada-alpajares') {
      return mobility === 'a-pe'
        ? 'A 5 km a sul da vila. Início do percurso requer viatura ou táxi'
        : 'Deslocação de carro até ao início do percurso (5 km pela estrada de Poia, ~10 min)';
    }

    if (isCurrVillage) {
      return mobility === 'a-pe'
        ? 'Regresso à vila sede (requer transporte a partir do exterior)'
        : 'Regresso ao centro histórico de Freixo de Espada à Cinta (~8 a 12 min de carro)';
    }

    return mobility === 'a-pe'
      ? 'Deslocação fora da vila (requer transporte local)'
      : 'Ligação rodoviária municipal (~10 a 15 min de carro)';
  }

  /**
   * Constrói resumo padrão determinístico baseado em dados territoriais reais
   */
  buildDefaultOverview(days, interest, pace, mobility) {
    const interestNames = {
      cultura: 'Património Histórico e a Seda Tradicional',
      natureza: 'Arribas Monumentais do Douro e Miradouros',
      enogastronomia: 'Sabores do Douro Superior e Montes Ermos',
      familia: 'Lazer Ribeirinho e Tradições Vivas',
      geral: 'Destaques Autênticos de Freixo de Espada à Cinta'
    };

    const paceNames = {
      tranquilo: 'um ritmo sereno e contemplativo',
      equilibrado: 'um ritmo equilibrado entre visitas e descanso',
      dinamico: 'um ritmo dinâmico para aproveitar ao máximo cada recanto'
    };

    const interestLabel = interestNames[interest] || interestNames.geral;
    const paceLabel = paceNames[pace] || paceNames.equilibrado;

    return `Itinerário oficial de ${days} ${days === 1 ? 'dia' : 'dias'} concebido com base nos locais verificados de Freixo de Espada à Cinta. Focado em ${interestLabel.toLowerCase()} com ${paceLabel}, articulando o centro histórico quinhentista e as escarpas do Parque Natural do Douro Internacional.`;
  }

  /**
   * Devolve dica sazonal útil e factual
   */
  getSeasonTip(interest) {
    if (interest === 'natureza') {
      return 'Na primavera e no outono, a atividade das aves de rapina rupícolas no Penedo Durão atinge o pico matinal entre as 09h30 e as 11h30.';
    }
    if (interest === 'enogastronomia') {
      return 'Não deixe de acompanhar a sua refeição com os vinhos D.O.C. Douro da Adega Cooperativa de Freixo de Espada à Cinta (Montes Ermos).';
    }
    return 'Entre a primavera e o início do verão, o Museu da Seda tem os bichos-da-seda vivos em plena alimentação com folhas de amoreira.';
  }
}

export const itineraryService = new ItineraryService();
