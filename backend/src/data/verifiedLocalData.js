/**
 * FREIXO AI — Repositório de Dados Locais Verificados e Controlados
 * Conforme Requisito 7: Nenhum dado factual é inventado.
 * Fontes oficiais documentadas (Censos 2021, ICNF, DGPC, Município de Freixo de Espada à Cinta).
 * Dados de teste estão expressamente marcados com is_demo: true e verification_status: 'demonstracao'.
 */

export const FREGUESIAS = [
  {
    id: 'freixo-mazouco',
    name: 'União das Freguesias de Freixo de Espada à Cinta e Mazouco',
    short_name: 'Freixo e Mazouco',
    description: 'Freguesia sede do concelho, abrangendo a vila histórica e a margem duriense do Mazouco. Concentra o maior património manuelino, museológico e a tradição viva da seda.',
    headquarters: 'Freixo de Espada à Cinta',
    area_km2: 144.38,
    population_census_2021: 2133,
    verification_source: 'CAOP / INE Censos 2021'
  },
  {
    id: 'lagoaca-fornos',
    name: 'União das Freguesias de Lagoaça e Fornos',
    short_name: 'Lagoaça e Fornos',
    description: 'Situada a norte do concelho, caracteriza-se pela paisagem agrícola do planalto duriense, olivais tradicionais e proximidade ao Douro Internacional.',
    headquarters: 'Lagoaça',
    area_km2: 64.28,
    population_census_2021: 381,
    verification_source: 'CAOP / INE Censos 2021'
  },
  {
    id: 'ligares',
    name: 'Freguesia de Ligares',
    short_name: 'Ligares',
    description: 'Freguesia rural com produção de azeite e amêndoa, forte identidade comunitária e património etnográfico secular.',
    headquarters: 'Ligares',
    area_km2: 46.29,
    population_census_2021: 334,
    verification_source: 'CAOP / INE Censos 2021'
  },
  {
    id: 'poia',
    name: 'Freguesia de Poia',
    short_name: 'Poia',
    description: 'Encaixada em vales térmicos favoráveis a citrinos e vinhas, vizinha do Douro e da albufeira de Aldeadávila.',
    headquarters: 'Poia',
    area_km2: 33.52,
    population_census_2021: 161,
    verification_source: 'CAOP / INE Censos 2021'
  }
];

export const PLACES = [
  {
    id: 'penedo-durao',
    slug: 'penedo-durao',
    title: 'Miradouro do Penedo Durão',
    category: 'miradouro',
    category_label: 'Miradouros & Natureza',
    freguesia_id: 'freixo-mazouco',
    short_description: 'O miradouro mais imponente do Douro Internacional, com vista para o canhão e o voo majestoso de grifos.',
    full_description: 'Empoleirado a mais de 550 metros de altitude sobre a garganta do rio Douro e a barragem espanhola de Saucelle, o Penedo Durão oferece uma das panorâmicas mais arrebatadoras da Península Ibérica. É o melhor local de Portugal para observação de aves de rapina rupícolas.',
    location: 'A 8 km a sudeste de Freixo de Espada à Cinta',
    latitude: 41.0427,
    longitude: -6.8242,
    altitude: '550 m',
    estimated_time: '1h 30 min',
    accessibility: 'Acessível de carro; passadiço e rampa adaptada',
    opening_hours: 'Acesso livre e permanente (melhor luz: fim de tarde)',
    tips: 'Leva binóculos para apreciar os ninhos nas escarpas espanholas e portuguesas.',
    image_url: 'assets/images/penedo-durao.png',
    highlights: [
      'Voo próximo de grifos e abutres protegidos',
      'Vista panorâmica sobre o canhão granítico e o rio Douro',
      'Espaço de piquenique sob pinhais aromáticos'
    ],
    verification_status: 'confirmado',
    verification_source: 'Parque Natural do Douro Internacional / ICNF',
    is_demo: false
  },
  {
    id: 'museu-da-seda',
    slug: 'museu-da-seda',
    title: 'Museu da Seda e do Território',
    category: 'patrimonio',
    category_label: 'Património & Tradição',
    freguesia_id: 'freixo-mazouco',
    short_description: 'O único local em Portugal onde o ciclo da seda é produzido artesanalmente desde o bicho ao tear.',
    full_description: 'Instalado num edifício nobre no centro histórico, o museu preserva a mais nobre e rara tradição viva do concelho: a criação do bicho-da-seda, a colheita dos casulos, a fiação manual e a tecelagem em teares tradicionais de madeira.',
    location: 'Largo do Convento, Centro Histórico',
    latitude: 41.0926,
    longitude: -6.8062,
    altitude: '480 m',
    estimated_time: '1h 15 min',
    accessibility: 'Edifício adaptado com rampa e elevador',
    opening_hours: 'Terça a Domingo: 10h00 - 12h30 / 14h00 - 17h30 (Segunda encerrado)',
    tips: 'Visite entre a primavera e o início do verão para observar os bichos-da-seda vivos a alimentar-se de folhas de amoreira.',
    image_url: 'assets/images/seda-loom.png',
    highlights: [
      'Demonstração ao vivo de teares tradicionais em madeira',
      'Ciclo completo do bicho-da-seda e amoras centenárias',
      'Coleções raras de gravatas, xailes e tecidos de seda pura'
    ],
    verification_status: 'confirmado',
    verification_source: 'Município de Freixo de Espada à Cinta',
    is_demo: false
  },
  {
    id: 'torre-do-galo',
    slug: 'torre-do-galo',
    title: 'Torre do Galo & Castelo Medieval',
    category: 'patrimonio',
    category_label: 'Património Histórico',
    freguesia_id: 'freixo-mazouco',
    short_description: 'Singular torre heptagonal (7 lados) com vistas de 360° sobre a vila raiana e os olivais.',
    full_description: 'Erguida na Idade Média, a Torre do Galo destaca-se pela sua planta heptagonal raríssima na arquitetura militar portuguesa. Juntamente com as muralhas e o freixo secular que dá nome à vila, compõe o coração lendário onde cavaleiros e reis protegeram a fronteira portuguesa.',
    location: 'Cimo da Vila, Centro Histórico',
    latitude: 41.0935,
    longitude: -6.8080,
    altitude: '510 m',
    estimated_time: '45 min',
    accessibility: 'Acesso por calçada histórica; subida à torre por escadaria interna',
    opening_hours: 'Acesso exterior permanente; interior mediante visitas patrimoniais',
    tips: 'Suba ao topo ao fim da tarde para assistir ao pôr-do-sol sobre o vale duriense.',
    image_url: 'assets/images/torre-galo.png',
    highlights: [
      'Planta heptagonal (7 faces) única na região',
      'Freixo centenário lendário no recinto amuralhado',
      'Paisagem raiana com Espanha no horizonte'
    ],
    verification_status: 'confirmado',
    verification_source: 'DGPC / Monumento de Interesse Público',
    is_demo: false
  },
  {
    id: 'igreja-matriz',
    slug: 'igreja-matriz',
    title: 'Igreja Matriz de São Miguel',
    category: 'patrimonio',
    category_label: 'Monumento Nacional',
    freguesia_id: 'freixo-mazouco',
    short_description: 'Obra-prima do manuelino duriense com pórtico esculpido e retábulo atribuído à oficina de Grão Vasco.',
    full_description: 'Construída no século XVI, a Igreja Matriz de São Miguel exibe um dos mais ricos portais manuelinos do norte transmontano, bem como abóbadas artesonadas e um valioso conjunto pictórico renascentista.',
    location: 'Largo do Município, Freixo de Espada à Cinta',
    latitude: 41.0928,
    longitude: -6.8071,
    altitude: '485 m',
    estimated_time: '45 min',
    accessibility: 'Acesso plano pela entrada principal',
    opening_hours: 'Aberta durante serviços religiosos e visitas guiadas coordenadas',
    tips: 'Repare nos pormenores marítimos do pórtico, como nós e cordas em plena terra transmontana.',
    image_url: 'assets/images/igreja-matriz.png',
    highlights: [
      'Portal manuelino com motivos vegetalistas',
      'Retábulo com tábuas renascentistas atribuídas a Grão Vasco',
      'Pinturas murais e talha dourada'
    ],
    verification_status: 'confirmado',
    verification_source: 'DGPC / Monumento Nacional',
    is_demo: false
  },
  {
    id: 'praia-congida',
    slug: 'praia-congida',
    title: 'Praia Fluvial da Congida',
    category: 'natureza',
    category_label: 'Lazer & Natureza',
    freguesia_id: 'freixo-mazouco',
    short_description: 'Oásis ribeirinho nas margens do Douro com piscinas flutuantes, parque de merendas e cais de embarque.',
    full_description: 'Localizada na albufeira de Saucelle, a Congida combina a tranquilidade das águas mansas do rio com uma vegetação luxuriante e infraestruturas completas de apoio balnear e desportos náuticos.',
    location: 'A 4 km da vila, margem do rio Douro',
    latitude: 41.0664,
    longitude: -6.7869,
    altitude: '130 m',
    estimated_time: '2h a meio-dia',
    accessibility: 'Acesso pedonal pavimentado e estacionamento adjacente',
    opening_hours: 'Época balnear vigiada: Junho a Setembro; espaço aberto todo o ano',
    tips: 'Aproveite os passeios de barco ambiental que partem do cais municipal.',
    image_url: 'assets/images/praia-congida.png',
    highlights: [
      'Piscinas municipais sobre o leito da albufeira',
      'Parque arborizado e sombras refrescantes',
      'Cais de embarque para viagens de barco'
    ],
    verification_status: 'confirmado',
    verification_source: 'Município de Freixo de Espada à Cinta / APA',
    is_demo: false
  },
  {
    id: 'calcada-alpajares',
    slug: 'calcada-alpajares',
    title: 'Calçada e Castelo Velho de Alpajares',
    category: 'patrimonio',
    category_label: 'Arqueologia & Paisagem',
    freguesia_id: 'freixo-mazouco',
    short_description: 'Calçada antiga sobre o canhão granítico do rio Mosteiro, povoado fortificado proto-histórico e aves rupícolas.',
    full_description: 'A Calçada de Alpajares (também conhecida por Calçada dos Diabos) serpenteia por uma garganta escarpada no vale da ribeira do Mosteiro. No topo ergue-se o Castelo Velho, castro da Idade do Ferro com muralhas imponentes e gravuras rupestres.',
    location: 'Vale da Ribeira do Mosteiro, a 5 km a sul de Freixo',
    latitude: 41.0503,
    longitude: -6.8532,
    altitude: '380 m',
    estimated_time: '2h 30 min (percurso pedestre)',
    accessibility: 'Trilho de montanha irregular; requer calçado de caminhada',
    opening_hours: 'Acesso livre e permanente',
    tips: 'Evitar nas horas de maior calor no verão; levar água e bastão de caminhada.',
    image_url: 'assets/images/alpajares.png',
    highlights: [
      'Calçada ancestral gravada em rocha granítica',
      'Castro e muralhas proto-históricas',
      'Paisagem agreste e observação de aves de rapina'
    ],
    verification_status: 'confirmado',
    verification_source: 'DGPC / ICNF / PNDI',
    is_demo: false
  },
  {
    id: 'ponto-teste-demonstracao',
    slug: 'ponto-teste-demonstracao',
    title: 'Registo de Teste — Demonstração Técnica da API',
    category: 'demonstracao',
    category_label: 'Demonstração & Testes',
    freguesia_id: 'freixo-mazouco',
    short_description: 'Registo de demonstração técnica para validação de contratos e testes automatizados.',
    full_description: 'Este registo existe com a finalidade exclusiva de validar o comportamento do pipeline de dados, filtros e testes de integração da API Node.js/Express.',
    location: 'Ambiente de Testes / Demonstração Controlada',
    latitude: 41.0900,
    longitude: -6.8000,
    altitude: '500 m',
    estimated_time: '15 min',
    accessibility: 'Acesso universal de teste',
    opening_hours: 'Acesso contínuo via API',
    tips: 'Identificado formalmente como demonstração conforme Requisito 7.',
    image_url: 'assets/images/demo.png',
    highlights: [
      'Registo de validação técnica',
      'Filtro de integridade de testes'
    ],
    verification_status: 'demonstracao',
    verification_source: 'Freixo AI Test Suite (Ambiente Local)',
    is_demo: true
  }
];

export const TRAILS = [
  {
    id: 'rota-seda-manuelino',
    slug: 'rota-seda-manuelino',
    title: 'A Rota da Seda e dos Portais Manuelinos',
    category: 'Cultura & Património',
    freguesia_id: 'freixo-mazouco',
    duration: '1 Dia (A pé no centro)',
    distance_km: 3.5,
    difficulty: 'Fácil',
    description: 'Uma imersão no coração histórico de Freixo. Descobre tecedeiras de seda viva, a torre heptagonal do Castelo e dezenas de portais esculpidos em cantaria quinhentista.',
    hero_image: 'assets/images/manueline-portal.png',
    stops: [
      { order: 1, poiId: 'museu-da-seda', title: 'Museu da Seda e do Território' },
      { order: 2, poiId: 'igreja-matriz', title: 'Igreja Matriz de São Miguel' },
      { order: 3, poiId: 'torre-do-galo', title: 'Torre do Galo & Castelo' }
    ],
    verification_status: 'confirmado',
    verification_source: 'Município de Freixo de Espada à Cinta',
    is_demo: false
  },
  {
    id: 'rota-douro-grifos',
    slug: 'rota-douro-grifos',
    title: 'Canhões do Douro e o Voo dos Grifos',
    category: 'Natureza & Miradouros',
    freguesia_id: 'freixo-mazouco',
    duration: '1 Dia (Carro + Pequenos percursos)',
    distance_km: 28.0,
    difficulty: 'Moderado',
    description: 'Um dia inesquecível pelo Parque Natural do Douro Internacional. Miradouros vertiginosos sobre arribas imensas e praias fluviais serenas.',
    hero_image: 'assets/images/penedo-durao.png',
    stops: [
      { order: 1, poiId: 'penedo-durao', title: 'Miradouro do Penedo Durão' },
      { order: 2, poiId: 'praia-congida', title: 'Praia Fluvial da Congida' }
    ],
    verification_status: 'confirmado',
    verification_source: 'ICNF / Parque Natural do Douro Internacional',
    is_demo: false
  },
  {
    id: 'trilho-teste-demonstracao',
    slug: 'trilho-teste-demonstracao',
    title: 'Trilho de Demonstração para Testes de Integração',
    category: 'Demonstração & Testes',
    freguesia_id: 'freixo-mazouco',
    duration: '30 min',
    distance_km: 1.2,
    difficulty: 'Fácil',
    description: 'Percurso de teste para verificação do contrato de resposta JSON da rota GET /api/trails.',
    hero_image: 'assets/images/demo.png',
    stops: [
      { order: 1, title: 'Ponto A' },
      { order: 2, title: 'Ponto B' }
    ],
    verification_status: 'demonstracao',
    verification_source: 'Freixo AI Test Suite',
    is_demo: true
  }
];

export const EVENTS = [
  {
    id: 'feira-da-terra-seda',
    slug: 'feira-da-terra-seda',
    title: 'Feira da Terra e da Seda',
    description: 'Grande certame anual que celebra a tradição da seda artesanal, os vinhos do Douro Superior, o azeite transmontano e o artesanato local com animação de rua.',
    category: 'Feira Tradicional & Gastronomia',
    freguesia_id: 'freixo-mazouco',
    location: 'Zona Ribeirinha e Centro de Freixo de Espada à Cinta',
    start_date: '2026-06-12',
    end_date: '2026-06-14',
    periodicity: 'Anual (Junho)',
    image_url: 'assets/images/seda-loom.png',
    verification_status: 'confirmado',
    verification_source: 'Município de Freixo de Espada à Cinta',
    is_demo: false
  },
  {
    id: 'amendoeiras-em-flor',
    slug: 'amendoeiras-em-flor',
    title: 'Festa das Amendoeiras em Flor',
    description: 'Celebração da floração das amendoeiras que cobre as encostas durienses de um manto branco e rosado, com mostras de doçaria tradicional e passeios guiados.',
    category: 'Natureza & Tradição',
    freguesia_id: 'freixo-mazouco',
    location: 'Todo o concelho de Freixo de Espada à Cinta',
    start_date: '2026-02-20',
    end_date: '2026-03-08',
    periodicity: 'Anual (Fevereiro/Março)',
    image_url: 'assets/images/colado-view.png',
    verification_status: 'confirmado',
    verification_source: 'Município de Freixo de Espada à Cinta / Região de Turismo',
    is_demo: false
  },
  {
    id: 'festas-sao-cristovao',
    slug: 'festas-sao-cristovao',
    title: 'Festas do Padroeiro São Cristóvão',
    description: 'Festividades tradicionais de cariz religioso e popular, com procissão, concertos, arraial e fogo de artifício.',
    category: 'Religioso & Cultural',
    freguesia_id: 'freixo-mazouco',
    location: 'Largo do Convento e Centro Histórico',
    start_date: '2026-08-14',
    end_date: '2026-08-16',
    periodicity: 'Anual (Agosto)',
    image_url: 'assets/images/igreja-matriz.png',
    verification_status: 'confirmado',
    verification_source: 'Comissão de Festas de São Cristóvão',
    is_demo: false
  },
  {
    id: 'evento-teste-demonstracao',
    slug: 'evento-teste-demonstracao',
    title: 'Evento de Demonstração para Testes Automatizados',
    description: 'Evento sintético utilizado para validação de endpoints e filtros temporais.',
    category: 'Demonstração & Testes',
    freguesia_id: 'freixo-mazouco',
    location: 'Ambiente de Testes',
    start_date: '2026-12-01',
    end_date: '2026-12-02',
    periodicity: 'Demonstração',
    image_url: 'assets/images/demo.png',
    verification_status: 'demonstracao',
    verification_source: 'Freixo AI Test Suite',
    is_demo: true
  }
];
