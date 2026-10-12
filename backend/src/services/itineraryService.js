import { tourismService } from './tourismService.js';
import { aiGatewayService } from './aiGatewayService.js';

class ItineraryService {
  async generateItinerary({ days = 2, pace = 'equilibrado', interest = 'cultura', mobility = 'carro' }) {
    const placesResult = await tourismService.getPlaces({ includeDemo: false });
    const availablePlaces = placesResult?.items || [];

    if (!Array.isArray(availablePlaces) || availablePlaces.length === 0) {
      const err = new Error('Não foi possível carregar os pontos turísticos confirmados para gerar o itinerário.');
      err.status = 503;
      err.code = 'NO_PLACES_AVAILABLE';
      throw err;
    }

    const placesMap = new Map();
    availablePlaces.forEach(p => {
      placesMap.set(p.slug, p);
      placesMap.set(p.id, p);
    });

    const trailsResult = await tourismService.getTrails({ includeDemo: false });
    const availableTrails = trailsResult?.items || [];

    const generatedDays = this.buildDaysPlan({
      days,
      pace,
      interest,
      mobility,
      placesMap,
      availableTrails
    });

    const totalStops = generatedDays.reduce((acc, d) => acc + d.stops.length, 0);

    let overviewText = this.buildDefaultOverview(days, interest, pace, mobility);
    let generationMethod = 'algoritmo_territorial';
    let isAiEnhanced = false;
    let aiModel = null;

    try {
      const allTitles = generatedDays.flatMap(d => d.stops.map(s => s.title));
      const aiPrompt = `És o assistente oficial Freixo AI. Personaliza um breve parágrafo introdutório (máximo 3 frases) para um roteiro de ${days} dias em Freixo de Espada à Cinta com perfil de interesse "${interest}", ritmo "${pace}" e mobilidade "${mobility}".
Os locais reais confirmados no itinerário são: ${allTitles.join(', ')}.
REGRAS OBRIGATÓRIAS:
- Baseia-te exclusivamente nos locais listados.
- Não inventes monumentos, restaurantes, rios ou localidades que não estejam na lista.
- Realça a autenticidade duriense e a tradição de Freixo de Espada à Cinta.`;

      // Timeout curto de 6s para não bloquear o utilizador se a IA estiver ocupada
      const aiResponse = await Promise.race([
        aiGatewayService.askChat({ question: aiPrompt, language: 'pt' }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('AI_TIMEOUT')), 6000))
      ]);

      if (aiResponse && aiResponse.answer && aiResponse.answer.trim().length > 20) {
        overviewText = aiResponse.answer.trim();
        generationMethod = 'ia_personalizada';
        isAiEnhanced = true;
        aiModel = aiResponse.model || 'qwen3:4b';
      }
    } catch {
      generationMethod = 'algoritmo_territorial';
      isAiEnhanced = false;
      aiModel = null;
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
        isDemonstration: placesResult.source !== 'supabase_db'
      },
      days: generatedDays,
      meta: {
        generation_method: generationMethod,
        is_ai_enhanced: isAiEnhanced,
        model: aiModel,
        source: placesResult.source,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Constrói a sequência dos dias com rigor geográfico e respeito pelos horários
   */
  buildDaysPlan({ days, pace, interest, mobility, placesMap }) {
    const plans = [];

    // Helper para obter local seguro
    const getPlace = (slug) => placesMap.get(slug);

    // Identificação dos pontos âncora
    const museuSeda = getPlace('museu-da-seda');
    const igrejaMatriz = getPlace('igreja-matriz');
    const torreGalo = getPlace('torre-do-galo');
    const penedoDurao = getPlace('penedo-durao');
    const praiaCongida = getPlace('praia-congida');
    const alpajares = getPlace('calcada-alpajares');

    // =========================================================================
    // DIA 1: Centro Histórico, Seda & Manuelino OU Grandes Miradouros (se natureza)
    // =========================================================================
    if (interest === 'natureza' && mobility === 'carro') {
      const d1Stops = [];
      if (penedoDurao) {
        d1Stops.push(this.formatStop({
          order: 1,
          time: '09:30',
          place: penedoDurao,
          travelNote: 'Deslocação de carro a partir da vila (8 km pela N221, ~12 min)',
          reason: 'Melhor horário matinal para avistar os grifos a levantar voo sobre as arribas do Douro.',
          mobility
        }));
      }
      if (praiaCongida) {
        d1Stops.push(this.formatStop({
          order: 2,
          time: '12:30',
          place: praiaCongida,
          travelNote: 'Descida à margem do Douro (9 km a partir do Penedo Durão, ~15 min de carro)',
          reason: 'Espaço ribeirinho ideal para almoço e descanso junto à albufeira de Saucelle.',
          mobility
        }));
      }
      if (torreGalo && pace !== 'tranquilo') {
        d1Stops.push(this.formatStop({
          order: 3,
          time: '17:00',
          place: torreGalo,
          travelNote: 'Regresso ao centro histórico de Freixo (4 km, ~8 min de carro)',
          reason: 'Vista panorâmica de 360° ao pôr do sol a partir da torre heptagonal.',
          mobility
        }));
      }

      plans.push({
        day: 1,
        title: 'Dia 1: As Grandes Arribas do Douro & Margem Fluvial',
        theme: 'Natureza Selvagem do Parque Natural e Lazer Ribadouro',
        stops: d1Stops
      });
    } else {
      // Padrão Cultural / Geral / Família no Centro Histórico
      const d1Stops = [];
      if (museuSeda) {
        d1Stops.push(this.formatStop({
          order: 1,
          time: '10:00',
          place: museuSeda,
          travelNote: 'Ponto de encontro no centro histórico de Freixo (zona pedonal)',
          reason: 'O único ciclo vivo da seda na Península Ibérica com artesãs ao vivo nos teares de madeira.',
          mobility
        }));
      }
      if (igrejaMatriz) {
        d1Stops.push(this.formatStop({
          order: 2,
          time: '11:45',
          place: igrejaMatriz,
          travelNote: 'A 150 metros a pé pelo Largo do Município (~2 min)',
          reason: 'Monumento Nacional com pórtico manuelino quinhentista e pinturas renascentistas.',
          mobility
        }));
      }
      if (torreGalo) {
        d1Stops.push(this.formatStop({
          order: 3,
          time: pace === 'tranquilo' ? '16:00' : '17:00',
          place: torreGalo,
          travelNote: 'Subida pedonal pela calçada histórica até ao cimo da vila (~5 min a pé)',
          reason: 'Torre de 7 faces única na arquitetura militar portuguesa e freixo centenário lendário.',
          mobility
        }));
      }

      plans.push({
        day: 1,
        title: 'Dia 1: A Tradição Viva da Seda & O Manuelino Duriense',
        theme: 'Centro Histórico, Cantaria Quinhentista e Memória Raiana',
        stops: d1Stops
      });
    }

    // =========================================================================
    // DIA 2: Canhões do Douro, Miradouros e Águas Mansas
    // =========================================================================
    if (days >= 2) {
      const d2Stops = [];

      // Se o Dia 1 já foi Natureza, o Dia 2 é a herança cultural
      if (interest === 'natureza' && mobility === 'carro') {
        if (museuSeda) {
          d2Stops.push(this.formatStop({
            order: 1,
            time: '10:00',
            place: museuSeda,
            travelNote: 'Centro histórico de Freixo de Espada à Cinta',
            reason: 'Contacto com a criação do bicho-da-seda e artesanato tradicional.',
            mobility
          }));
        }
        if (igrejaMatriz) {
          d2Stops.push(this.formatStop({
            order: 2,
            time: '11:45',
            place: igrejaMatriz,
            travelNote: 'Caminhada suave no núcleo urbano (~2 min a pé)',
            reason: 'Apreciação dos detalhes escultóricos de cordame e esferas armilares.',
            mobility
          }));
        }
        if (alpajares && pace !== 'tranquilo') {
          d2Stops.push(this.formatStop({
            order: 3,
            time: '15:30',
            place: alpajares,
            travelNote: 'Deslocação de carro até ao início do percurso (5 km, ~10 min)',
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
        // Sequência natural: Dia 2 sai para os Miradouros e Rio Douro
        if (penedoDurao) {
          d2Stops.push(this.formatStop({
            order: 1,
            time: '09:30',
            place: penedoDurao,
            travelNote: mobility === 'a-pe' 
              ? 'A 8 km da vila. Requer táxi ou transporte local (não acessível a pé em tempo útil)'
              : 'Deslocação de carro (8 km pela N221, ~12 min de viagem)',
            reason: 'O miradouro mais imponente do Douro Internacional sobre o desfiladeiro de Saucelle.',
            mobility
          }));
        }
        if (praiaCongida) {
          d2Stops.push(this.formatStop({
            order: 2,
            time: '12:30',
            place: praiaCongida,
            travelNote: mobility === 'a-pe'
              ? 'A 4 km a sul da vila. Requer transporte para acesso além do centro'
              : 'Descida até à albufeira pela estrada municipal (~15 min de carro)',
            reason: 'Espaço refrescante nas margens do Douro com piscinas flutuantes e apoio de lazer.',
            mobility
          }));
        }
        if (alpajares && pace === 'dinamico') {
          d2Stops.push(this.formatStop({
            order: 3,
            time: '16:00',
            place: alpajares,
            travelNote: 'Ligação ao vale da Ribeira de Mosteiro (~10 min de carro)',
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
    // DIA 3: Arqueologia Proto-Histórica & Vales Térmicos
    // =========================================================================
    if (days >= 3) {
      const d3Stops = [];
      if (alpajares) {
        d3Stops.push(this.formatStop({
          order: 1,
          time: '09:00',
          place: alpajares,
          travelNote: 'Acesso pela estrada para Poia/Fornos (5 km a sul de Freixo)',
          reason: 'Caminhada matinal fresca pela calçada milenar antes das horas de calor.',
          mobility
        }));
      }
      if (praiaCongida && pace !== 'tranquilo') {
        d3Stops.push(this.formatStop({
          order: 2,
          time: '13:00',
          place: praiaCongida,
          travelNote: 'Ligação de regresso ao rio Douro (~12 min de carro)',
          reason: 'Almoço de gastronomia duriense com peixe do rio ou posta mirandesa.',
          mobility
        }));
      }
      if (penedoDurao) {
        d3Stops.push(this.formatStop({
          order: 3,
          time: '17:30',
          place: penedoDurao,
          travelNote: 'Subida ao Penedo Durão ao final da tarde (~15 min de carro)',
          reason: 'Observação do recolher dos abutres e grifos nas escarpas douradas ao crepúsculo.',
          mobility
        }));
      }

      plans.push({
        day: 3,
        title: 'Dia 3: Arqueologia dos Castros & Canhões Selvagens',
        theme: 'Idade do Ferro, Ribeira do Mosteiro e Falésias',
        stops: d3Stops
      });
    }

    // =========================================================================
    // DIA 4: O Douro Superior e as Freguesias Rurais
    // =========================================================================
    if (days >= 4) {
      const d4Stops = [];
      if (museuSeda) {
        d4Stops.push(this.formatStop({
          order: 1,
          time: '10:00',
          place: museuSeda,
          travelNote: 'Centro de Freixo de Espada à Cinta',
          reason: 'Aquisição de artesanato de seda certificado e despedida cultural das artesãs.',
          mobility
        }));
      }
      if (penedoDurao) {
        d4Stops.push(this.formatStop({
          order: 2,
          time: '12:00',
          place: penedoDurao,
          travelNote: 'Miradouro do Penedo Durão (8 km da vila)',
          reason: 'Piquenique ou contemplação panorâmica sobre o canhão internacional.',
          mobility
        }));
      }
      if (praiaCongida) {
        d4Stops.push(this.formatStop({
          order: 3,
          time: '15:30',
          place: praiaCongida,
          travelNote: 'Zona ribeirinha da Congida',
          reason: 'Passeio de barco ou momento de descompressão nas margens do Douro.',
          mobility
        }));
      }

      plans.push({
        day: 4,
        title: 'Dia 4: Vivências Durienses & Despedida da Raia',
        theme: 'Seda, Miradouros e Paisagem Transmontana',
        stops: d4Stops
      });
    }

    return plans;
  }

  /**
   * Formata cada paragem do itinerário com campos normalizados
   */
  formatStop({ order, time, place, travelNote, reason, mobility }) {
    const lat = place.latitude != null ? Number(place.latitude) : null;
    const lng = place.longitude != null ? Number(place.longitude) : null;

    let limitation = null;
    if (mobility === 'a-pe' && place.id !== 'museu-da-seda' && place.id !== 'igreja-matriz' && place.id !== 'torre-do-galo') {
      limitation = 'Local fora da vila sede (4 a 8 km). Requer viatura própria, táxi local ou transfer.';
    }

    return {
      order,
      time,
      poiId: place.id,
      poiSlug: place.slug || place.id,
      title: place.title,
      category: place.category,
      categoryLabel: place.category_label || place.category,
      location: place.location || 'Freixo de Espada à Cinta',
      coordinates: (lat != null && lng != null) ? { lat, lng } : null,
      estimatedVisitTime: place.estimated_time || '1h',
      travelNote: travelNote || 'Deslocação no concelho',
      openingHours: place.opening_hours || 'Acesso permanente',
      accessibility: place.accessibility || 'Acesso regular',
      description: place.short_description || '',
      tip: place.tips || '',
      reason: reason || 'Ponto de interesse oficial verificado.',
      limitation
    };
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
