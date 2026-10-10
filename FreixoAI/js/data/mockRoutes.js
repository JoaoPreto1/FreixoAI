/**
 * FREIXO AI — Roteiros Temáticos Recomendados
 */

export const ROUTES_DATA = [
  {
    id: "rota-seda-manuelino",
    title: "A Rota da Seda e dos Portais Manuelinos",
    category: "Cultura & Património",
    duration: "1 Dia (A pé no centro)",
    distance: "3.5 km",
    difficulty: "Fácil",
    heroImage: "assets/images/manueline-portal.png",
    description: "Uma imersão no coração histórico de Freixo. Descobre tecedeiras de seda viva, a torre heptagonal do Castelo e dezenas de portais esculpidos em cantaria quinhentista.",
    stops: [
      {
        order: 1,
        time: "09:30",
        poiId: "museu-da-seda",
        title: "Museu da Seda e do Território",
        description: "Assiste à fiação manual em teares de madeira e compreende o ciclo milenar do bicho-da-seda.",
        duration: "1h30"
      },
      {
        order: 2,
        time: "11:15",
        poiId: "portais-manuelinos",
        title: "Circuito Pedestre dos Portais Manuelinos",
        description: "Passeio guiado pelas ruas estreitas descobrindo cordas, esferas e heráldica em granito duriense.",
        duration: "1h15"
      },
      {
        order: 3,
        time: "12:45",
        poiId: "gastronomia-almoco",
        title: "Almoço Típico Transmontano",
        description: "Sopas de tomate com ovos escalfados e Posta Mirandesa regadas com Montes Ermos Tinto Reserva.",
        duration: "1h45"
      },
      {
        order: 4,
        time: "14:45",
        poiId: "igreja-matriz",
        title: "Igreja Matriz de São Miguel",
        description: "Admira o portal quinhentista e os magníficos painéis do retábulo atribuídos a Grão Vasco.",
        duration: "45 min"
      },
      {
        order: 5,
        time: "15:45",
        poiId: "torre-do-galo",
        title: "Torre do Galo & Freixo Lendário",
        description: "Sobe à torre de 7 faces para uma vista de 360° sobre o vale e toca no freixo histórico.",
        duration: "1h00"
      }
    ]
  },
  {
    id: "rota-douro-grifos",
    title: "Canhões do Douro e o Voo dos Grifos",
    category: "Natureza & Miradouros",
    duration: "1 Dia (Carro + Pequenos percursos)",
    distance: "28 km",
    difficulty: "Moderado",
    heroImage: "assets/images/penedo-durao.png",
    description: "Um dia inesquecível pelo Parque Natural do Douro Internacional. Miradouros vertiginosos sobre arribas imensas e praias fluviais serenas.",
    stops: [
      {
        order: 1,
        time: "09:00",
        poiId: "miradouro-colado",
        title: "Miradouro do Colado & Montes Ermos",
        description: "Vista panorâmica matinal sobre a vila encaixada no vale e os socalcos de amendoeiras.",
        duration: "45 min"
      },
      {
        order: 2,
        time: "10:30",
        poiId: "penedo-durao",
        title: "Miradouro do Penedo Durão",
        description: "Observação dos grandes grifos e abutres em pleno voo sobre o canhão do Douro Internacional.",
        duration: "2h00"
      },
      {
        order: 3,
        time: "13:00",
        poiId: "praia-congida",
        title: "Almoço e Lazer na Praia da Congida",
        description: "Peixe do rio ou posta no restaurante ribeirinho e passeio nas margens calmas da albufeira.",
        duration: "2h30"
      },
      {
        order: 4,
        time: "16:00",
        poiId: "barco-douro",
        title: "Passeio Fluvial Ecológico",
        description: "Navegação silenciosa pelas arribas internacionais para apreciar a geologia e a fauna rupícola.",
        duration: "1h30"
      }
    ]
  },
  {
    id: "rota-3-dias-completa",
    title: "Freixo Completo: Três Dias Inesquecíveis",
    category: "Grande Experiência",
    duration: "3 Dias",
    distance: "55 km",
    difficulty: "Completo",
    heroImage: "assets/images/hero-douro.png",
    description: "O itinerário definitivo para conhecer toda a riqueza de Freixo: história medieval, seda viva, gastronomia generosa, arribas do Douro e trilhos sagrados.",
    stops: [
      {
        order: 1,
        time: "Dia 1",
        poiId: "centro-historico",
        title: "Dia 1: A Alma Histórica & O Fio da Seda",
        description: "Museu da Seda, Igreja Matriz, Torre do Galo e prova de doces conventuais de amêndoa.",
        duration: "Dia inteiro"
      },
      {
        order: 2,
        time: "Dia 2",
        poiId: "arribas-e-rio",
        title: "Dia 2: As Grandes Arribas & O Douro Plácido",
        description: "Penedo Durão, voo dos grifos, passeio de barco na Congida e prova de vinhos na Adega Cooperativa.",
        duration: "Dia inteiro"
      },
      {
        order: 3,
        time: "Dia 3",
        poiId: "trilhos-e-sabores",
        title: "Dia 3: A Calçada Milenar & Os Sabores Ocultos",
        description: "Caminhada na Calçada de Alpajares, visita aos lagares de azeite e jantar com concerto de música tradicional.",
        duration: "Dia inteiro"
      }
    ]
  }
];
