import { POIS_DATA } from './mockPois.js';

export const AI_KNOWLEDGE_BASE = [
  {
    keywords: ["seda", "museu", "teares", "artesãs", "bicho", "lagarta", "casulo"],
    response: `🌿 **O Ciclo Vivo da Seda em Freixo de Espada à Cinta**

Freixo de Espada à Cinta é o **único lugar em toda a Península Ibérica** onde o ciclo completo da seda ainda é executado à mão, desde o bicho-da-seda ao produto final!

• **Onde ver:** No **Museu da Seda e do Território**, no Largo do Convento.
• **O que vai encontrar:** As mestras artesãs tecem ao vivo em teares de madeira seculares. Na primavera (maio/junho), é possível ver os bichos-da-seda a alimentarem-se com folhas de amoreira fresca!
• **Horário:** Terça a domingo, das 10h00 às 12h30 e das 14h00 às 17h30.
• **Dica Freixo AI:** Não perca a oportunidade de adquirir uma gravata ou lenço de seda pura tecida na vila — uma verdadeira peça de alta costura tradicional.`
  },
  {
    keywords: ["penedo", "durão", "durao", "miradouro", "grifos", "abutre", "arribas", "canhão"],
    response: `🦅 **Miradouro do Penedo Durão: O Santuário dos Céus do Douro**

Localizado a cerca de 8 km da vila, a mais de 550 metros de altitude, o Penedo Durão é considerado **o miradouro mais espetacular do Douro Internacional**.

• **Vida Selvagem:** É o melhor observatório de Portugal para aves de rapina rupícolas. Quase sempre é possível ver **grifos gigantescos e abutres-do-egito** a planar a poucos metros de si!
• **Acessibilidade:** Chega-se confortavelmente de carro e existem passadiços acessíveis e sombras de pinheiros com mesas de piquenique.
• **Melhor Hora:** Fim de tarde, quando a luz dourada ilumina as encostas rochosas espanholas e portuguesas.
• **Dica Freixo AI:** Leve agasalho leve mesmo no verão, pois o vento na arriba costuma soprar fresco.`
  },
  {
    keywords: ["congida", "praia", "fluvial", "barco", "banho", "piscina", "nadar"],
    response: `🏖️ **Praia Fluvial da Congida: O Paraíso Ribeirinho**

Apenas a 4 km da vila, a Congida é um refúgio idílico nas águas calmas da albufeira de Saucelle:

• **Infraestruturas:** Piscina infantil e adulta instalada na água do rio, parque de merendas, relvados com salgueiros e restaurante com esplanada panorâmica.
• **Passeios de Barco:** Partem do cais da Congida passeios fluviais ecológicos pelo canhão internacional do Douro.
• **Ideal para:** Relaxar em família, nadar com segurança e desfrutar do microclima ameno e ensolarado de Freixo.
• **Dica Freixo AI:** Prove o peixe do rio ou uma posta no restaurante da praia ao pôr do sol, acompanhado pelo vinho branco Montes Ermos!`
  },
  {
    keywords: ["comer", "restaurante", "posta", "tomate", "vinho", "montes ermos", "amêndoa", "gastronomia"],
    response: `🍷 **Sabores Imperdíveis de Freixo de Espada à Cinta**

A gastronomia local é pura generosidade transmontana:

1. **Sopas de Tomate com Ovos Escalfados:** Receita de conforto com pão regional denso e azeite perfumado.
2. **Posta Tradicional:** Grelhada com sal grosso e regada com molho virgem de alho e azeite da terra.
3. **Amêndoas Cobertas de Freixo:** Feitas artesanalmente em tachos de cobre com calda de açúcar e canela.
4. **Vinhos Montes Ermos (D.O.C. Douro):** Produzidos pela Adega Cooperativa local, com destaque para os tintos Reserva de Touriga Nacional.

• **Onde provar:** *Restaurante O Candedo*, *Restaurante da Congida* e *Tasca do Forno*.`
  },
  {
    keywords: ["manuelino", "portais", "portas", "arquitetura", "rei", "manuel"],
    response: `🏛️ **O Circuito dos Mais de 40 Portais Manuelinos**

Sabia que Freixo de Espada à Cinta é o concelho com maior concentração de portais manuelinos no interior de Portugal?

• **Porquê tanta riqueza?** No século XVI, a vila viveu uma era de grande prosperidade ligada ao comércio de fronteira e a uma comunidade judaica e cristã-nova abastada.
• **O que procurar:** Esculturas de cordas náuticas, nós marítimos, alcachofras, heráldica e arcos em quilha nas fachadas de pedra de granito da Rua do Ouro e Rua do Castelo.
• **Dica Freixo AI:** A Igreja Matriz de São Miguel possui o portal manuelino mais imponente e um retábulo quinhentista atribuído à escola do grande mestre Grão Vasco!`
  },
  {
    keywords: ["torre", "galo", "castelo", "espada", "lenda", "dinis", "nome"],
    response: `⚔️ **A Torre do Galo e a Lenda da Espada à Cinta**

A **Torre do Galo** é uma das torres militares mais curiosas de Portugal, construída com uma rara planta **heptagonal (7 faces)**!

• **A Lenda:** Diz-se que o rei D. Dinis (ou o fidalgo Feijão), após duros combates na fronteira, descansou encostado a um freixo e atou a sua espada ao tronco da árvore. Ao acordar revigorado e com a espada no lugar, batizou a povoação como *Freixo de Espada à Cinta*.
• **Visita:** Pode subir ao topo da torre para desfrutar de uma visão panorâmica fabulosa sobre os telhados e a paisagem duriense envolvente.`
  }
];

/**
 * Gerador Dinâmico de Roteiros Inteligentes
 * Cria um plano dia-a-dia detalhado baseado nas escolhas do utilizador
 */
export function generateSmartItinerary({ days = 2, interest = "cultura", pace = "equilibrado", mobility = "carro", seed = null } = {}) {
  const daysCount = Math.max(1, Math.min(4, parseInt(days) || 2));
  
  const itineraries = [];

  for (let d = 1; d <= daysCount; d++) {
    const dayPlan = {
      day: d,
      title: "",
      theme: "",
      stops: []
    };

    if (d === 1) {
      dayPlan.title = "Dia 1: A Alma Histórica & Os Segredos da Seda";
      dayPlan.theme = "Património, Tradição Viva e Gastronomia da Terra";
      dayPlan.stops = [
        {
          time: "09:30",
          poiId: "museu-da-seda",
          poiSlug: "museu-da-seda",
          title: "Boas-vindas e Museu da Seda e do Território",
          location: "Centro Histórico",
          estimatedVisitTime: "1h30",
          travelNote: "Ponto de encontro no centro histórico",
          description: "Descubra o ciclo vivo da seda e observe as mestras tecedeiras a trabalhar em teares de madeira seculares.",
          icon: "feather",
          tip: "Reserve 1h30 para uma conversa com as artesãs."
        },
        {
          time: "11:15",
          poiId: "igreja-matriz",
          poiSlug: "igreja-matriz",
          title: "Passeio pelo Bairro Histórico e Portais Manuelinos",
          location: "Rua do Ouro e envolvente",
          estimatedVisitTime: "45 min",
          travelNote: "Percurso pedonal pelo centro",
          description: "Procure as mais de 40 portas e janelas manuelinas esculpidas em granito no coração da vila.",
          icon: "compass",
          tip: "Fotografe as cordas e nós esculpidos na pedra."
        },
        {
          time: "13:00",
          poiId: "restaurante-candedo",
          poiSlug: "restaurante-candedo",
          title: "Almoço Regional Transmontano",
          location: "Restaurante O Candedo ou Tasca do Forno",
          estimatedVisitTime: "1h30",
          travelNote: "No centro da vila",
          description: "Saboreie as autênticas Sopas de Tomate com ovos escalfados ou a Posta Mirandesa.",
          icon: "utensils",
          tip: "Peça uma garrafa de Montes Ermos Tinto Reserva."
        },
        {
          time: "15:00",
          poiId: "igreja-matriz",
          poiSlug: "igreja-matriz",
          title: "Igreja Matriz de São Miguel e Retábulo Quinhentista",
          location: "Largo do Município",
          estimatedVisitTime: "45 min",
          travelNote: "Largo do Município",
          description: "Aprecie o portal triunfal e as pinturas atribuídas à oficina do mestre Grão Vasco.",
          icon: "landmark",
          tip: "Admire a pia batismal manuelina lavrada."
        },
        {
          time: "16:30",
          poiId: "torre-do-galo",
          poiSlug: "torre-do-galo",
          title: "Torre do Galo & Pôr do Sol no Freixo Secular",
          location: "Cimo da Vila",
          estimatedVisitTime: "45 min",
          travelNote: "Subida pedonal pela calçada histórica",
          description: "Suba à torre heptagonal de 7 lados e veja o sol dourado a tocar as colinas da raia.",
          icon: "eye",
          tip: "A entrada é livre e o visual ao crepúsculo é inesquecível."
        }
      ];
    } else if (d === 2) {
      dayPlan.title = "Dia 2: As Grandes Arribas do Douro & Oásis da Congida";
      dayPlan.theme = "Natureza Monumental, Voo de Rapinas e Águas Mansas";
      dayPlan.stops = [
        {
          time: "09:30",
          poiId: "penedo-durao",
          poiSlug: "penedo-durao",
          title: "Miradouro do Penedo Durão",
          location: "Parque Natural do Douro Internacional",
          estimatedVisitTime: "1h30",
          travelNote: "12 min de carro pela N221 a partir da vila",
          description: "Aviste o canhão colossal de mais de 500 metros e veja de perto o voo silencioso dos grifos e abutres.",
          icon: "mountain",
          tip: "Leve binóculos e máquina fotográfica."
        },
        {
          time: "12:00",
          poiId: "praia-congida",
          poiSlug: "praia-congida",
          title: "Descida à Praia Fluvial da Congida",
          location: "Margens da Albufeira de Saucelle",
          estimatedVisitTime: "1h",
          travelNote: "15 min de carro a descer para a margem do Douro",
          description: "Chegada a um vale verdejante e sereno, com piscinas na água do rio e esplanadas relaxantes.",
          icon: "sun",
          tip: "Mergulhe nas águas calmas se o tempo estiver quente."
        },
        {
          time: "13:15",
          poiId: "praia-congida",
          poiSlug: "praia-congida",
          title: "Almoço Ribadouro com Peixe do Rio ou Grelhados",
          location: "Restaurante da Praia da Congida",
          estimatedVisitTime: "1h30",
          travelNote: "Junto à margem do rio",
          description: "Almoço com vista direta sobre o espelho de água e as encostas espanholas fronteiriças.",
          icon: "coffee",
          tip: "Acompanhe com vinho branco fresco da região."
        },
        {
          time: "15:30",
          poiId: "praia-congida",
          poiSlug: "praia-congida",
          title: "Passeio de Barco Ecológico pelas Arribas",
          location: "Cais Fluvial da Congida",
          estimatedVisitTime: "1h",
          travelNote: "Cais de embarque da Congida",
          description: "Navegação silenciosa por trechos do rio onde apenas a água e as aves quebram a tranquilidade.",
          icon: "navigation",
          tip: "Confirme a partida com o operador turístico local."
        },
        {
          time: "18:00",
          poiId: "adega-cooperativa",
          poiSlug: "adega-cooperativa",
          title: "Prova de Vinhos e Azeites na Adega Cooperativa",
          location: "Freixo de Espada à Cinta",
          estimatedVisitTime: "1h",
          travelNote: "Regresso a Freixo de Espada à Cinta (~8 min de carro)",
          description: "Degustação comentada de vinhos Montes Ermos e azeites virgens extra prensados a frio.",
          icon: "wine",
          tip: "Compre as tradicionais amêndoas cobertas artesanais para levar."
        }
      ];
    } else if (d === 3) {
      dayPlan.title = "Dia 3: A Calçada Ancestral & Eremitas dos Montes Ermos";
      dayPlan.theme = "Arqueologia Sagrada, Trilhos e Espiritualidade";
      dayPlan.stops = [
        {
          time: "09:00",
          title: "Trilho da Calçada de Alpajares (Calçada do Diabo)",
          location: "Ribeira de Mosteiro / Fornos",
          description: "Caminhada lendária por um dos canhões mais dramáticos da região com gravuras rupestres.",
          icon: "footprints",
          tip: "Use calçado aderente e leve água em abundância."
        },
        {
          time: "13:00",
          title: "Piquenique ou Almoço Típico em Aldeia Raiana",
          location: "Fornos ou Poia",
          description: "Pão de forno, queijo de ovelha curado, chouriça transmontana e azeitonas britadas.",
          icon: "apple",
          tip: "Partilhe conversas com os habitantes locais das aldeias."
        },
        {
          time: "15:30",
          title: "Miradouro do Colado & Capela de N.ª Sr.ª dos Montes Ermos",
          location: "Serra dos Montes Ermos",
          description: "Ponto mais alto com vista de 360° sobre o mar de colinas, olivais e amendoais.",
          icon: "cloud-sun",
          tip: "O silêncio aqui é inspirador; foi refúgio poético de Guerra Junqueiro."
        },
        {
          time: "17:30",
          title: "Solar e Memória de Guerra Junqueiro",
          location: "Centro de Freixo",
          description: "Homenagem ao grande poeta lírico e republicano que imortalizou esta terra nas suas estrofes.",
          icon: "book-open",
          tip: "Leia um poema de 'Os Simples' junto ao monumento."
        }
      ];
    } else {
      dayPlan.title = "Dia 4: Aldeias Ribadouras & Convivência com Artesãos";
      dayPlan.theme = "Tradições Rurais, Lagares e Hospitalidade Transmontana";
      dayPlan.stops = [
        {
          time: "10:00",
          title: "Visita a Lagar Tradicional de Azeite Transmontano",
          location: "Arredores de Freixo",
          description: "Descubra como as azeitonas de variedades autóctones (Madural, Verdeal, Cobrançosa) dão origem a um dos melhores azeites do mundo.",
          icon: "droplet",
          tip: "Faça a prova de azeite em pão quente."
        },
        {
          time: "12:30",
          title: "Almoço Festivo com Cabrito Assado em Forno de Lenha",
          location: "Restaurante Típico",
          description: "Prato nobre assado lentamente em assadeira de barro com arroz de forno aromático.",
          icon: "utensils",
          tip: "Reserve com antecedência para garantir o assado no ponto."
        },
        {
          time: "15:00",
          title: "Oficina Prática de Amêndoas Cobertas e Confeitaria",
          location: "Doceira Tradicional",
          description: "Veja o processo manual de calda de açúcar e canela em tacho de cobre ardente.",
          icon: "heart",
          tip: "Uma lembrança inesquecível de sabor doce."
        }
      ];
    }

    itineraries.push(dayPlan);
  }

  return {
    summary: {
      days: daysCount,
      pace,
      interest,
      mobility,
      totalStops: itineraries.reduce((acc, d) => acc + d.stops.length, 0),
      estimatedKm: daysCount * 18,
      isDemonstration: true,
      disclaimer: "Itinerário sugerido por algoritmo demonstrativo. Paragens, distâncias e horários são indicativos e devem ser validados junto do Posto de Turismo.",
      seasonTip: "Freixo goza de microclima mediterrânico: primaveras floridas e verões solarengos ideais para o rio."
    },
    days: itineraries,
    meta: {
      generation_method: 'algoritmo_territorial',
      is_ai_enhanced: false,
      seed: seed || 1,
      source: 'demonstracao_algoritmica_offline',
      timestamp: new Date().toISOString()
    }
  };
}
