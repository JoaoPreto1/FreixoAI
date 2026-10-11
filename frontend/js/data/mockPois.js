/**
 * FREIXO AI — Pontos de Interesse (POIs) de Freixo de Espada à Cinta
 * Dados autênticos com coordenadas, categorias, descrições editoriais e multimédia
 */

export const POIS_DATA = [
  {
    id: "penedo-durao",
    title: "Miradouro do Penedo Durão",
    category: "miradouro",
    categoryLabel: "Miradouros & Natureza",
    shortDescription: "O miradouro mais imponente do Douro Internacional, com vista para o canhão e o voo majestoso de grifos.",
    fullDescription: "Empoleirado a mais de 550 metros de altitude sobre a garganta do rio Douro e a barragem espanhola de Saucelle, o Penedo Durão oferece uma das panorâmicas mais arrebatadoras da Península Ibérica. É o melhor local de Portugal para observação de aves de rapina rupícolas, especialmente o grifo, o abutre-do-egito e a águia-real.",
    location: "A 8 km a sudeste de Freixo de Espada à Cinta",
    coordinates: { lat: 41.0427, lng: -6.8242 },
    altitude: "550 m",
    estimatedTime: "1h30 min",
    accessibility: "Acessível de carro; passadiço e rampa adaptada",
    highlights: [
      "Voo próximo de grifos e abutres protegidos",
      "Vista panorâmica sobre o canhão granítico e o rio Douro",
      "Espaço de piquenique sob pinhais aromáticos",
      "Plataforma suspensa com segurança"
    ],
    image: "assets/images/penedo-durao.png",
    audioGuide: {
      duration: "02:45",
      title: "O Penedo Durão e os Senhores dos Céus",
      transcript: "Bem-vindo ao Penedo Durão. À sua frente, o Douro corre em gargantas cavadas ao longo de milhões de anos. Olhe para o céu: os grandes pássaros que planam sem bater asas são grifos, cujos ninhos repousam nas escarpas verticais..."
    },
    openingHours: "Acesso livre e permanente (melhor luz: fim de tarde)",
    tips: "Leva binóculos para apreciar os ninhos nas escarpas espanholas e portuguesas."
  },
  {
    id: "museu-da-seda",
    title: "Museu da Seda e do Território",
    category: "patrimonio",
    categoryLabel: "Património & Tradição",
    shortDescription: "O único local em Portugal onde o ciclo da seda é produzido artesanalmente desde o bicho ao tear.",
    fullDescription: "Instalado num edifício nobre no centro histórico, o museu preserva a mais nobre e rara tradição viva do concelho: a criação do bicho-da-seda, a colheita dos casulos, a fiação manual e a tecelagem em teares tradicionais de madeira. Pode assistir ao vivo ao trabalho minucioso das mestras tecedeiras que mantêm a arte secular intacta.",
    location: "Largo do Convento, Centro Histórico",
    coordinates: { lat: 41.0926, lng: -6.8062 },
    altitude: "480 m",
    estimatedTime: "1h 15 min",
    accessibility: "Edifício adaptado com rampa e elevador",
    highlights: [
      "Demonstração ao vivo de teares tradicionais em madeira",
      "Ciclo completo do bicho-da-seda e amoras centenárias",
      "Coleções raras de gravatas, xailes e tecidos de seda pura",
      "Espaço arqueológico e história da vila"
    ],
    image: "assets/images/seda-loom.png",
    audioGuide: {
      duration: "03:10",
      title: "O Fio Dourado que Tece a Alma de Freixo",
      transcript: "Está a entrar num templo de paciência e elegância. Freixo de Espada à Cinta é o último bastião da fiação de seda artesanal na Península Ibérica. Cada centímetro de tecido resulta de milhares de horas de dedicação..."
    },
    openingHours: "Terça a Domingo: 10h00 - 12h30 / 14h00 - 17h30 (Segunda encerrado)",
    tips: "Visite entre a primavera e o início do verão para observar os bichos-da-seda vivos a alimentar-se de folhas de amoreira."
  },
  {
    id: "torre-do-galo",
    title: "Torre do Galo & Castelo Medieval",
    category: "patrimonio",
    categoryLabel: "Património Histórico",
    shortDescription: "Singular torre heptagonal (7 lados) com vistas de 360° sobre a vila raiana e os olivais.",
    fullDescription: "Erguida na Idade Média, a Torre do Galo destaca-se pela sua planta heptagonal raríssima na arquitetura militar portuguesa. Juntamente com as muralhas e o freixo secular que dá nome à vila, compõe o coração lendário onde cavaleiros e reis como D. Afonso Henriques e D. Dinis protegeram a fronteira portuguesa.",
    location: "Cimo da Vila, Centro Histórico",
    coordinates: { lat: 41.0935, lng: -6.8080 },
    altitude: "510 m",
    estimatedTime: "45 min",
    accessibility: "Acesso por calçada histórica; subida à torre por escadaria interna",
    highlights: [
      "Planta heptagonal (7 faces) única na região",
      "Miradouro de 360 graus sobre todo o vale transmontano",
      "O histórico freixo secular onde a lenda diz ter sido cingida a espada",
      "Cisterna medieval e troços de muralhas do foral de 1152"
    ],
    image: "assets/images/torre-galo.png",
    audioGuide: {
      duration: "02:20",
      title: "Sentinela Heptagonal da Fronteira",
      transcript: "Esta torre resistiu a cercos e intempéries durante séculos. Ao subir os seus degraus de granito, compreende-se por que razão este ponto foi a chave de defesa entre os reinos de Leão e Portugal..."
    },
    openingHours: "Todos os dias: 09h30 - 18h00 (Entrada gratuita)",
    tips: "Suba ao topo ao entardecer para ver os telhados de terracota da vila a brilhar ao pôr do sol."
  },
  {
    id: "portais-manuelinos",
    title: "Circuito dos Portais Manuelinos",
    category: "patrimonio",
    categoryLabel: "Arquitetura Manuelina",
    shortDescription: "A maior concentração de portais manuelinos dos séculos XV e XVI de todo o Portugal interior.",
    fullDescription: "Caminhar pelas ruelas estreitas de Freixo é viajar até à era dos Descobrimentos. A vila guarda mais de 40 portais, janelas de chanfro e arquitraves esculpidas com cordas náuticas, motivos vegetalistas, esferas armilares e escudos heráldicos, testemunho de uma época em que nobres e abastados mercadores judaicos e cristãos investiram em residências de prestígio.",
    location: "Rua do Ouro, Rua do Castelo e envolvente",
    coordinates: { lat: 41.0921, lng: -6.8073 },
    altitude: "490 m",
    estimatedTime: "1h 30 min",
    accessibility: "Percurso pedestre em calçada tradicional",
    highlights: [
      "Mais de 40 portais catalogados e identificados com placas discretas",
      "Detalhes de escultura Manuelina requintada em granito duriense",
      "Casario de traça tradicional com varandas floridas",
      "Ligação íntima à herança sefardita e mercantil"
    ],
    image: "assets/images/manueline-portal.png",
    audioGuide: {
      duration: "03:00",
      title: "O Manuelino Esculpido na Pedra Duriense",
      transcript: "Em pleno interior transmontano, tão distante do mar, as pedras de Freixo falam da epopeia marítima através de cordas entrançadas, rosetas e nós esculpidos com rara perfeição..."
    },
    openingHours: "Circuito aberto ao ar livre permanente",
    tips: "Use o guia interativo de Freixo AI para fazer o rastreio pedonal geolocalizado de cada portal."
  },
  {
    id: "praia-congida",
    title: "Praia Fluvial da Congida",
    category: "natureza",
    categoryLabel: "Rios & Lazer",
    shortDescription: "Um oásis verdejante nas margens mansas do Douro, com piscinas flutuantes e cais de embarque.",
    fullDescription: "Localizada a poucos minutos da vila, na albufeira da Barragem de Saucelle, a Congida é um refúgio de águas plácidas e vegetação luxuriante. Dispõe de excelentes infraestruturas balneares, relvados sombreados por salgueiros, piscina infantil, bungalows de turismo de natureza e cais de onde partem passeios de barco pelas arribas internacionais.",
    location: "Albufeira de Saucelle, a 4 km da vila",
    coordinates: { lat: 41.0745, lng: -6.7885 },
    altitude: "140 m",
    estimatedTime: "2h a meio-dia",
    accessibility: "Excelente acessibilidade, passadiços de madeira e parque de estacionamento",
    highlights: [
      "Piscina flutuante segura instalada nas águas calmas do rio Douro",
      "Cais de embarque para passeios ecológicos de barco",
      "Bar de praia e esplanada com vista sobre a margem espanhola",
      "Zona de sombra arborizada e parque de merendas"
    ],
    image: "assets/images/congida-beach.png",
    audioGuide: {
      duration: "02:15",
      title: "Congida: Onde o Douro Descansa em Paz",
      transcript: "Ao contrário dos rápidos revoltos de outros tempos, aqui o rio alarga-se num espelho límpido de água. O ar mediterrânico traz o perfume da esteva e do tomilho..."
    },
    openingHours: "Acesso permanente; vigilância balnear na época balnear de verão",
    tips: "Não perca o pôr do sol na esplanada ribeirinha com um copo de vinho branco fresco Montes Ermos."
  },
  {
    id: "calcada-alpajares",
    title: "Calçada de Alpajares & Canhão do Mosteiro",
    category: "trilhos",
    categoryLabel: "Trilhos & Arqueologia",
    shortDescription: "Caminho milenar em ziguezague cavado nas escarpas, com gravuras rupestres e paisagem selvagem.",
    fullDescription: "Conhecida localmente como 'Calçada do Diabo', é um traçado de calçada ancestral empoleirado na garganta profunda da ribeira de Mosteiro. Pelo caminho encontram-se vestígios de arte rupestre esquemática, moinhos de água ancestrais e flora mediterrânica única como zimbros e laranjeiras bravas.",
    location: "Junto à aldeia de Fornos / Ribeira de Mosteiro",
    coordinates: { lat: 41.0315, lng: -6.8520 },
    altitude: "320 m",
    estimatedTime: "3h 00 min",
    accessibility: "Trilho de montanha; requer calçado de caminhada",
    highlights: [
      "Calçada histórica em curvas apertadas esculpidas no penhasco",
      "Pinturas e gravuras rupestres no abrigo da Fraga do Gato",
      "Paisagem intocada do Parque Natural do Douro Internacional",
      "Avifauna rupícola e silêncio monumental"
    ],
    image: "assets/images/hero-douro.png",
    audioGuide: {
      duration: "03:30",
      title: "A Rota Ancestral dos Alpajares",
      transcript: "Durante milénios, pastores, soldados e contrabandistas desceram esta calçada vertiginosa. O barulho da água no fundo do desfiladeiro acompanha cada passo do caminhante..."
    },
    openingHours: "Recomendado durante o dia com tempo seco",
    tips: "Evite as horas centrais de calor no pico do verão e leve água em abundância."
  },
  {
    id: "igreja-matriz",
    title: "Igreja Matriz de São Miguel",
    category: "patrimonio",
    categoryLabel: "Património Religioso",
    shortDescription: "Templo gótico-manuelino com portal triunfal e um retábulo quinhentista de valor nacional.",
    fullDescription: "Construída no século XVI por ordem do rei D. Manuel I, a Matriz de Freixo é uma jóia do património nacional. O seu pórtico principal ostenta esculturas com colunas torsas e pináculos. No interior, os painéis do retábulo da capela-mor foram pintados no século XVI e são atribuídos à famosa oficina de Grão Vasco.",
    location: "Largo do Município",
    coordinates: { lat: 41.0924, lng: -6.8071 },
    altitude: "485 m",
    estimatedTime: "40 min",
    accessibility: "Acessível com degrau suave na entrada",
    highlights: [
      "Portal principal com decoração de cordame e medalhões manuelinos",
      "Pinturas quinhentistas de São Miguel e Paixão de Cristo",
      "Tetos em madeira e altares barrocos em talha dourada",
      "Pia baptismal manuelina lavrada"
    ],
    image: "assets/images/manueline-portal.png",
    audioGuide: {
      duration: "02:50",
      title: "A Fé Dourada de São Miguel",
      transcript: "Ao entrar na Igreja Matriz, admire a harmonia entre o rigor do granito e a delicadeza dos mestres que esculpiram o portal. As figuras contam histórias de fé e poder do Portugal de quinhentos..."
    },
    openingHours: "Quarta a Domingo: 10h00 - 12h30 / 14h30 - 18h00",
    tips: "Repare no retábulo iluminado durante a manhã para apreciar as cores originais da pintura quinhentista."
  },
  {
    id: "miradouro-colado",
    title: "Miradouro do Colado & Capela de N.ª Sr.ª dos Montes Ermos",
    category: "miradouro",
    categoryLabel: "Miradouros & Paisagem",
    shortDescription: "Vista aérea serena sobre os olivais, amendoeiras e os telhados históricos de Freixo.",
    fullDescription: "Situado no alto da serra com a capela e ermida de Nossa Senhora dos Montes Ermos, este miradouro revela a relação profunda de Freixo com a terra fértil: pomares de amendoeiras em flor na primavera, olivais antigos e vinhedos em encosta.",
    location: "Serra dos Montes Ermos, a 3 km da vila",
    coordinates: { lat: 41.1012, lng: -6.8290 },
    altitude: "630 m",
    estimatedTime: "45 min",
    accessibility: "Estrada alcatroada até ao miradouro; estacionamento amplo",
    highlights: [
      "Perspetiva panorâmica completa sobre o núcleo urbano de Freixo",
      "Local sagrado e poético com santuário popular",
      "Espetáculo de flores brancas e rosas nas Amendoeiras em Flor (fevereiro/março)",
      "Vistas que alcançam as montanhas de Zamora em Espanha"
    ],
    image: "assets/images/penedo-durao.png",
    audioGuide: {
      duration: "02:10",
      title: "A Senhora dos Montes Ermos",
      transcript: "Lá em baixo estende-se a vila e os socalcos agrícolas. O silêncio deste cume deu nome ao famoso vinho de Freixo: Montes Ermos..."
    },
    openingHours: "Acesso livre permanente",
    tips: "Visite em fevereiro ou março para presenciar o manto branco das amendoeiras floridas."
  }
];

export const CATEGORIES = [
  { id: "all", label: "Todos os Lugares", count: 8 },
  { id: "miradouro", label: "Miradouros & Natureza", count: 3 },
  { id: "patrimonio", label: "Património & Tradição", count: 3 },
  { id: "natureza", label: "Rios & Praias Fluviais", count: 1 },
  { id: "trilhos", label: "Trilhos & Arqueologia", count: 1 }
];
