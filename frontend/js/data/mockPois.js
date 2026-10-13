export const POIS_DATA = [
  {
    id: "penedo-durao",
    title: "Miradouro do Penedo Durão",
    category: "miradouro",
    categoryLabel: "Miradouros & Natureza",
    verification: {
      status: "confirmado",
      source: "Parque Natural do Douro Internacional / ICNF",
      sourceType: "oficial",
      isAudioDemo: true,
      pendingValidation: false,
      notes: "Local e coordenadas confirmadas. Observatório de avifauna rupícola."
    },
    shortDescription: "O miradouro mais imponente do Douro Internacional, com vista para o canhão e o voo majestoso de grifos.",
    fullDescription: "Empoleirado a mais de 550 metros de altitude sobre a garganta do rio Douro e a barragem espanhola de Saucelle, o Penedo Durão oferece uma das panorâmicas mais arrebatadoras da Península Ibérica. É o melhor local de Portugal para observação de aves de rapina rupícolas, especialmente o grifo, o abutre-do-egito e a águia-real.",
    location: "A 8 km a sudeste de Freixo de Espada à Cinta",
    coordinates: { lat: 41.0427, lng: -6.8242 },
    altitude: "550 m",
    estimatedTime: "1h 30 min",
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
      isDemo: true,
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
    verification: {
      status: "confirmado",
      source: "Município de Freixo de Espada à Cinta",
      sourceType: "oficial",
      isAudioDemo: true,
      pendingValidation: false,
      notes: "Instituição municipal ativa. Ciclo da seda documentado historicamente."
    },
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
      isDemo: true,
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
    verification: {
      status: "confirmado",
      source: "DGPC / Monumento de Interesse Público",
      sourceType: "oficial",
      isAudioDemo: true,
      pendingValidation: false,
      notes: "Planta heptagonal raríssima catalogada nos anais militares de Portugal."
    },
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
      isDemo: true,
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
    verification: {
      status: "confirmado",
      source: "DGPC / Inventário do Património Arquitetónico",
      sourceType: "oficial",
      isAudioDemo: true,
      pendingValidation: false,
      notes: "Mais de 40 vãos manuelinos catalogados no centro histórico de Freixo."
    },
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
      isDemo: true,
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
    verification: {
      status: "confirmado",
      source: "Agência Portuguesa do Ambiente (APA) / Município",
      sourceType: "oficial",
      isAudioDemo: true,
      pendingValidation: false,
      notes: "Zona balnear fluvial classificada na albufeira de Saucelle."
    },
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
      isDemo: true,
      title: "Congida: Onde o Douro Descansa em Paz",
      transcript: "Ao contrário dos rápidos revoltos de outros tempos, aqui o rio alarga-se num espelho límpido de água. O ar mediterrânico traz o perfume da esteva e do tomilho..."
    },
    openingHours: "Acesso permanente; vigilância balnear na época balnear de verão",
    tips: "Não perca o pôr do sol na esplanada ribeirinha com um copo de vinho branco fresco Montes Ermos."
  },
  {
    id: "calcada-alpajares",
    slug: "calcada-alpajares",
    title: "Calçada e Castelo Velho de Alpajares",
    category: "patrimonio",
    categoryLabel: "Arqueologia & Paisagem",
    verification: {
      status: "confirmado",
      source: "DGPC / ICNF / PNDI",
      sourceType: "oficial",
      isAudioDemo: true,
      pendingValidation: false,
      notes: "Monumento e paisagem protegida no Parque Natural do Douro Internacional."
    },
    shortDescription: "Calçada antiga sobre o canhão granítico do rio Mosteiro, povoado fortificado proto-histórico e aves rupícolas.",
    fullDescription: "A Calçada de Alpajares (também conhecida por Calçada dos Diabos) serpenteia por uma garganta escarpada no vale da ribeira do Mosteiro. No topo ergue-se o Castelo Velho, castro da Idade do Ferro com muralhas imponentes e gravuras rupestres.",
    location: "Vale da Ribeira do Mosteiro, a 5 km a sul de Freixo",
    coordinates: { lat: 41.0503, lng: -6.8532 },
    altitude: "380 m",
    estimatedTime: "2h 30 min",
    accessibility: "Trilho de montanha irregular; requer calçado de caminhada",
    highlights: [
      "Calçada ancestral gravada em rocha granítica",
      "Castro e muralhas proto-históricas",
      "Paisagem agreste e observação de aves de rapina"
    ],
    image: "assets/images/alpajares.png",
    audioGuide: {
      duration: "03:30",
      isDemo: true,
      title: "A Rota Ancestral dos Alpajares",
      transcript: "Durante milénios, pastores, soldados e contrabandistas desceram esta calçada vertiginosa. O barulho da água no fundo do desfiladeiro acompanha cada passo do caminhante..."
    },
    openingHours: "Acesso livre e permanente",
    tips: "Evitar nas horas de maior calor no verão; levar água e bastão de caminhada."
  },
  {
    id: "igreja-matriz",
    title: "Igreja Matriz de São Miguel",
    category: "patrimonio",
    categoryLabel: "Património Religioso",
    verification: {
      status: "confirmado",
      source: "Monumento Nacional (Decreto de 1910) / DGPC",
      sourceType: "oficial",
      isAudioDemo: true,
      pendingValidation: false,
      notes: "Classificação nacional oficial. Retábulo quinhentista atribuído à oficina de Grão Vasco."
    },
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
      isDemo: true,
      title: "A Fé Dourada de São Miguel",
      transcript: "Ao entrar na Igreja Matriz, admire a harmonia entre o rigor do granito e a delicadeza dos mestres que esculpiram o portal. As figuras contam histórias de fé e poder do Portugal de quinhentos..."
    },
    openingHours: "Quarta a Domingo: 10h00 - 12h30 / 14h30 - 18h00 (Pendente de confirmação sazonal)",
    tips: "Repare no retábulo iluminado durante a manhã para apreciar as cores originais da pintura quinhentista."
  },
  {
    id: "miradouro-colado",
    title: "Miradouro do Colado & Capela de N.ª Sr.ª dos Montes Ermos",
    category: "miradouro",
    categoryLabel: "Miradouros & Paisagem",
    verification: {
      status: "confirmado",
      source: "Município de Freixo de Espada à Cinta",
      sourceType: "oficial",
      isAudioDemo: true,
      pendingValidation: false,
      notes: "Santuário e miradouro públicos de Freixo de Espada à Cinta."
    },
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
      isDemo: true,
      title: "A Senhora dos Montes Ermos",
      transcript: "Lá em baixo estende-se a vila e os socalcos agrícolas. O silêncio deste cume deu nome ao famoso vinho de Freixo: Montes Ermos..."
    },
    openingHours: "Acesso livre permanente",
    tips: "Visite em fevereiro ou março para presenciar o manto branco das amendoeiras floridas."
  },
  {
    id: "cavalo-do-mazouco",
    slug: "cavalo-do-mazouco",
    title: "Estação Arqueológica do Mazouco & Cavalo do Mazouco",
    category: "patrimonio",
    categoryLabel: "Arqueologia & Paleolítico",
    freguesiaId: "freixo-mazouco",
    verification: {
      status: "confirmado",
      source: "Património Cultural, I.P. (SIPA n.º 438) / Decreto n.º 31/83",
      sourceType: "oficial",
      isAudioDemo: false,
      pendingValidation: false,
      notes: "Monumento de Interesse Público. Primeira estação paleolítica ao ar livre de Portugal."
    },
    shortDescription: "Primeira gravura rupestre paleolítica ao ar livre identificada em Portugal, esculpida em xisto vertical.",
    fullDescription: "Classificada como Imóvel de Interesse Público desde 1983 (Decreto n.º 31/83), a estação arqueológica do Mazouco situa-se no sítio do Carneiro, Cabeço da Vigia, sobranceira à ribeira de Albagueira e ao rio Douro. A gravura principal representa um cavalo finamente picotado e raspado em estilo magdalenense com cerca de 65 cm de comprimento, constituindo um marco na arte rupestre europeia.",
    location: "Lugar do Carneiro, aldeia de Mazouco, a 12 km a norte de Freixo",
    coordinates: { lat: 41.1402, lng: -6.7629 },
    altitude: "280 m",
    estimatedTime: "1h 00 min",
    accessibility: "Acesso pedestre por caminho de terra a partir da aldeia de Mazouco; requer calçado confortável",
    highlights: [
      "Primeira estação paleolítica ao ar livre de Portugal",
      "Gravura de cavalo com estilo magdalenense milenar",
      "Enquadramento paisagístico no vale do Douro Internacional"
    ],
    image: "assets/images/alpajares.png",
    openingHours: "Acesso livre e permanente (melhor visibilidade com luz rasante)",
    tips: "A iluminação solar rasante matinal ou ao fim da tarde permite apreciar os contornos raspados da cabeça e crina do cavalo."
  },
  {
    id: "museu-casa-junqueiro",
    slug: "museu-casa-junqueiro",
    title: "Museu Regional Casa Junqueiro",
    category: "patrimonio",
    categoryLabel: "Património & Literatura",
    freguesiaId: "freixo-mazouco",
    verification: {
      status: "confirmado",
      source: "Município de Freixo de Espada à Cinta / Rede Portuguesa de Museus",
      sourceType: "oficial",
      isAudioDemo: false,
      pendingValidation: false,
      notes: "Casa natal e museu dedicado ao poeta Abílio Guerra Junqueiro."
    },
    shortDescription: "Museu instalado na casa senhorial da família do poeta republicano Guerra Junqueiro.",
    fullDescription: "Instalado no centro histórico de Freixo, o museu homenageia Abílio Manuel Guerra Junqueiro (1850-1923), figura cimeira da poesia portuguesa, nascido nesta vila. O espaço expõe manuscritos, espólio pessoal do autor de «Os Simples», mobiliário oitocentista e um núcleo etnográfico das vivências transmontanas.",
    location: "Rua de São Francisco, n.º 5, Centro Histórico",
    coordinates: { lat: 41.0917, lng: -6.8055 },
    altitude: "485 m",
    estimatedTime: "1h 00 min",
    accessibility: "Acessível no piso térreo; rampa de apoio",
    highlights: [
      "Espólio literário e pessoal de Guerra Junqueiro",
      "Edifício nobre de traça senhorial oitocentista",
      "Núcleo etnográfico das artes e ofícios raianos"
    ],
    image: "assets/images/torre-galo.png",
    openingHours: "Terça a Sábado: 09h30 - 12h30 / 14h00 - 17h30 (Encerra a Domingo e Segunda)",
    tips: "Excelente complemento cultural ao Museu da Seda para compreender a identidade literária do concelho."
  },
  {
    id: "adega-cooperativa-montes-ermos",
    slug: "adega-cooperativa-montes-ermos",
    title: "Adega Cooperativa de Freixo de Espada à Cinta — Montes Ermos",
    category: "gastronomia",
    categoryLabel: "Enoturismo & Sabores",
    freguesiaId: "freixo-mazouco",
    verification: {
      status: "confirmado",
      source: "IVDP / Adega Cooperativa / Município de Freixo de Espada à Cinta",
      sourceType: "oficial",
      isAudioDemo: false,
      pendingValidation: false,
      notes: "Cooperativa vinícola fundada em 1963; vinhos DOC Douro Superior."
    },
    shortDescription: "Centro vitivinícola e oleícola de Freixo, produtor dos vinhos DOC Douro e azeite virgem Montes Ermos.",
    fullDescription: "Fundada em 1963, a Adega Cooperativa reúne o fruto do trabalho dos agricultores das quatro freguesias do concelho. Produz vinhos premiados da Região Demarcada do Douro (Douro Superior) e azeite virgem extra com denominação Negrinha de Freixo. Dispõe de loja oficial de produtores e provas de enoturismo.",
    location: "Avenida dos Combatentes do Ultramar, Freixo de Espada à Cinta",
    coordinates: { lat: 41.0906, lng: -6.8055 },
    altitude: "470 m",
    estimatedTime: "1h 00 min",
    accessibility: "Acesso universal térreo e estacionamento privativo",
    highlights: [
      "Provas de vinhos DOC Douro Superior",
      "Azeite virgem extra DOP Negrinha de Freixo",
      "Loja oficial de produtos gastronómicos certificados"
    ],
    image: "assets/images/douro-wine.png",
    openingHours: "Segunda a Sexta: 09h00 - 12h30 / 14h00 - 18h00; Sábados: 09h00 - 13h00",
    tips: "Prove os vinhos brancos colheita selecionada e o azeite de primeira extração a frio na loja de produtores."
  },
  {
    id: "miradouro-carrascalinho",
    slug: "miradouro-carrascalinho",
    title: "Miradouro do Carrascalinho",
    category: "miradouro",
    categoryLabel: "Miradouros & Natureza",
    freguesiaId: "lagoaca-fornos",
    verification: {
      status: "confirmado",
      source: "ICNF / Parque Natural do Douro Internacional / Rota dos Miradouros",
      sourceType: "oficial",
      isAudioDemo: false,
      pendingValidation: false,
      notes: "Miradouro natural com vista sobre a maior mancha de lodões da Europa."
    },
    shortDescription: "Miradouro agreste sobre as escarpas do Douro e a maior mancha natural de lodões da Europa.",
    fullDescription: "Situado junto à aldeia de Fornos, no Parque Natural do Douro Internacional, o Carrascalinho projeta-se sobre o canhão granítico do rio Douro. Destaca-se por uma panorâmica de beleza pura e por acolher nas suas encostas abrigadas a mais extensa população europeia de lodão-bastardo (Celtis australis).",
    location: "A 3 km a leste da aldeia de Fornos",
    coordinates: { lat: 41.1687, lng: -6.7318 },
    altitude: "600 m",
    estimatedTime: "1h 15 min",
    accessibility: "Acesso por caminho rural de terra batida; requer condução cuidada",
    highlights: [
      "Maior mancha florestal de lodões da Europa",
      "Garganta profunda do rio Douro Internacional",
      "Habitat protegido de aves de rapina"
    ],
    image: "assets/images/penedo-durao.png",
    openingHours: "Acesso livre e permanente",
    tips: "Recomendado para observadores de natureza e botânica; excelente ponto fotográfico ao meio da manhã."
  },
  {
    id: "miradouro-cruzinha",
    slug: "miradouro-cruzinha",
    title: "Miradouro da Cruzinha",
    category: "miradouro",
    categoryLabel: "Miradouros & Natureza",
    freguesiaId: "lagoaca-fornos",
    verification: {
      status: "confirmado",
      source: "ICNF / Parque Natural do Douro Internacional / Município",
      sourceType: "oficial",
      isAudioDemo: false,
      pendingValidation: false,
      notes: "Observatório panorâmico sobre a albufeira de Aldeadávila."
    },
    shortDescription: "Observatório panorâmico setentrional sobre a albufeira de Aldeadávila e os desfiladeiros.",
    fullDescription: "Localizado no termo da aldeia de Lagoaça, no extremo norte do concelho, a Cruzinha ergue-se numa crista quartzítica sobre o Douro Internacional e a imensa albufeira de Aldeadávila. Proporciona vistas contrastantes entre os socalcos de oliveiras do planalto e as vertentes alcantiladas da fronteira.",
    location: "A 2,5 km a leste da aldeia de Lagoaça",
    coordinates: { lat: 41.1910, lng: -6.7139 },
    altitude: "620 m",
    estimatedTime: "45 min",
    accessibility: "Acesso pedonal e viário florestal a partir de Lagoaça",
    highlights: [
      "Vistas panorâmicas sobre a albufeira de Aldeadávila",
      "Trilho de ligação pedestre pelo planalto mirandês",
      "Tranquilidade absoluta no Douro Selvagem"
    ],
    image: "assets/images/colado-view.png",
    openingHours: "Acesso livre e permanente",
    tips: "Espaço muito tranquilo, ideal para contemplação meditativa e fotografia de paisagem."
  },
  {
    id: "igreja-lagoaca",
    slug: "igreja-lagoaca",
    title: "Igreja Matriz de Lagoaça",
    category: "patrimonio",
    categoryLabel: "Património Religioso",
    freguesiaId: "lagoaca-fornos",
    verification: {
      status: "confirmado",
      source: "Diocese de Bragança-Miranda / Junta de Freguesia de Lagoaça e Fornos",
      sourceType: "oficial",
      isAudioDemo: false,
      pendingValidation: false,
      notes: "Templo matriz de arquitetura transmontana tradicional."
    },
    shortDescription: "Templo barroco rural dedicado à Natividade da Virgem, centro da vida comunitária do planalto.",
    fullDescription: "A Igreja Matriz de Lagoaça (Nossa Senhora da Natividade) ergue-se no centro da aldeia com a sua torre sineira em cantaria de granito. Apresenta altares de talha dourada de feição barroca rural e teto em madeira policromada, refletindo a piedade e autonomia da antiga freguesia raiana.",
    location: "Largo da Igreja, Aldeia de Lagoaça",
    coordinates: { lat: 41.1895, lng: -6.7456 },
    altitude: "650 m",
    estimatedTime: "30 min",
    accessibility: "Acesso pedonal plano no centro da aldeia",
    highlights: [
      "Torre sineira e cantaria tradicional transmontana",
      "Retábulo de talha de inspiração barroca rural",
      "Espaço comunitário de romarias e festas locais"
    ],
    image: "assets/images/igreja-matriz.png",
    openingHours: "Aberta em horários de culto e celebrações paroquiais",
    tips: "Aprecie a serenidade do largo da aldeia e a arquitetura das habitações em granito envolventes."
  },
  {
    id: "miradouro-assumadouro",
    slug: "miradouro-assumadouro",
    title: "Miradouro do Assumadouro",
    category: "miradouro",
    categoryLabel: "Miradouros & Paisagem",
    freguesiaId: "poia",
    verification: {
      status: "confirmado",
      source: "ICNF / Município de Freixo de Espada à Cinta / Rota dos Miradouros",
      sourceType: "oficial",
      isAudioDemo: false,
      pendingValidation: false,
      notes: "Varanda panorâmica virada a sul sobre o vale do Douro."
    },
    shortDescription: "Varanda panorâmica com perspetiva desafogada sobre as arribas do Douro e a aldeia espanhola de Barca d'Alva.",
    fullDescription: "Situado na freguesia de Poia, o Miradouro do Assumadouro debruça-se sobre a transição do Douro Internacional para o Alto Douro Vinhateiro. Desfruta de uma panorâmica ampla sobre as curvas do rio, a foz da ribeira do Mosteiro e a fronteira com Salamanca.",
    location: "A 1,5 km a leste da aldeia de Poiares",
    coordinates: { lat: 41.0423, lng: -6.8596 },
    altitude: "470 m",
    estimatedTime: "45 min",
    accessibility: "Acesso por estrada asfaltada com pequeno troço final empedrado",
    highlights: [
      "Vista aberta sobre o Douro e o relevo montanhoso espanhol",
      "Local de contemplação do pôr do sol",
      "Ponto de passagem da rota cénica das arribas de Poia"
    ],
    image: "assets/images/penedo-durao.png",
    openingHours: "Acesso livre e permanente",
    tips: "Excelente ponto para observar a luz dourada do final de tarde refletida nas escarpas e no rio."
  },
  {
    id: "castelo-de-alva",
    slug: "castelo-de-alva",
    title: "Ruínas do Castelo de Alva & Miradouro Histórico",
    category: "patrimonio",
    categoryLabel: "Arqueologia & História Militar",
    freguesiaId: "poia",
    verification: {
      status: "confirmado",
      source: "Património Cultural, I.P. (SIPA n.º 477) / Monumento Nacional",
      sourceType: "oficial",
      isAudioDemo: false,
      pendingValidation: false,
      notes: "Classificado como Imóvel de Interesse Público (Dec. 38147/1951)."
    },
    shortDescription: "Vestígios de fortaleza medieval fundada por D. Dinis e D. Sancho II na crista sobre o Douro.",
    fullDescription: "Localizado no sítio de Castro de Alva, no termo de Poiares, este castelo medieval foi erguido nos séculos XIII e XIV com foral outorgado por D. Dinis. As ruínas incluem panos de muralha em alvenaria de xisto e granito, dominando um esporão estratégico de vigia sobre a travessia fluvial do rio Douro.",
    location: "Cabeço de Castelo de Alva, termo de Poiares",
    coordinates: { lat: 41.0264, lng: -6.8797 },
    altitude: "385 m",
    estimatedTime: "1h 30 min",
    accessibility: "Trilho pedestre acidentado de montanha; calçado com boa aderência",
    highlights: [
      "Vestígios de muralhas góticas dionisinas",
      "Posição estratégica defensiva na confluência do Douro e Águeda",
      "Paisagem intocada de carrascos e zimbros centenários"
    ],
    image: "assets/images/alpajares.png",
    openingHours: "Acesso livre permanente (aconselhado com boa visibilidade diurna)",
    tips: "Levar água e bastão de caminhada; evitar em dias chuvosos devido ao terreno xistoso escorregadio."
  },
  {
    id: "igreja-poiares",
    slug: "igreja-poiares",
    title: "Igreja Matriz de São Pedro de Poiares",
    category: "patrimonio",
    categoryLabel: "Património Religioso",
    freguesiaId: "poia",
    verification: {
      status: "confirmado",
      source: "Diocese de Bragança-Miranda / Aldeias de Portugal",
      sourceType: "oficial",
      isAudioDemo: false,
      pendingValidation: false,
      notes: "Início e fim do percurso pedestre homologado PR5 FEC."
    },
    shortDescription: "Igreja matriz que marca o início do percurso pedestre homologado PR5 FEC até ao Penedo Durão.",
    fullDescription: "A Igreja Matriz de São Pedro é o coração comunitário da aldeia de Poiares. Construída em cantaria tradicional com torre sineira e retábulos devocionais em talha, testemunha séculos de história raiana. O seu largo serve de início e fim oficial ao percurso homologado PR5 FEC.",
    location: "Largo Principal, Aldeia de Poiares",
    coordinates: { lat: 41.0494, lng: -6.8778 },
    altitude: "490 m",
    estimatedTime: "30 min",
    accessibility: "Acesso plano no centro da aldeia",
    highlights: [
      "Ponto de partida do trilho homologado PR5 FEC",
      "Arquitetura religiosa rural transmontana",
      "Enquadramento na aldeia típica de Poiares"
    ],
    image: "assets/images/igreja-matriz.png",
    openingHours: "Aberta durante os períodos de celebração e eventos comunitários",
    tips: "Ponto de apoio ideal para iniciar a caminhada pelo PR5 FEC em direção ao Penedo Durão."
  },
  {
    id: "ponte-ligares-mosteiro",
    slug: "ponte-ligares-mosteiro",
    title: "Ponte Velha da Ribeira do Mosteiro & Calçadas de Xisto",
    category: "patrimonio",
    categoryLabel: "Engenharia Histórica & Paisagem",
    freguesiaId: "ligares",
    verification: {
      status: "confirmado",
      source: "Município de Freixo de Espada à Cinta / ICNF / PNDI",
      sourceType: "oficial",
      isAudioDemo: false,
      pendingValidation: false,
      notes: "Ponte secular de alvenaria de xisto sobre a Ribeira do Mosteiro."
    },
    shortDescription: "Ponte secular de xisto de tabuleiro plano sobre a Ribeira do Mosteiro, ligada a rotas monásticas.",
    fullDescription: "Erguida em alvenaria de xisto argamassado com um arco de volta perfeita e tabuleiro plano, esta ponte antiga situa-se no vale fértil da Ribeira do Mosteiro, junto à histórica Quinta de Santiago. Serviu de ponto de passagem estratégico em antigas ligações entre a freguesia de Ligares, as ermidas medievais e o rio Douro.",
    location: "Vale da Ribeira do Mosteiro / Quinta de Santiago, Ligares",
    coordinates: { lat: 41.0556, lng: -6.9011 },
    altitude: "220 m",
    estimatedTime: "45 min",
    accessibility: "Acesso por caminho de campo e ligação a percursos rurais",
    highlights: [
      "Construção secular em alvenaria de xisto duriense",
      "Enquadramento no microclima mediterrânico da Ribeira do Mosteiro",
      "Ligação histórica às rotas de Ligares e Poiares"
    ],
    image: "assets/images/alpajares.png",
    openingHours: "Acesso livre e permanente",
    tips: "Local bucólico com vegetação ribeirinha mediterrânica, amendoais e pomares de laranjeiras."
  },
  {
    id: "igreja-matriz-ligares",
    slug: "igreja-matriz-ligares",
    title: "Igreja Paroquial de São Lourenço de Ligares",
    category: "patrimonio",
    categoryLabel: "Património Religioso",
    freguesiaId: "ligares",
    verification: {
      status: "confirmado",
      source: "Diocese de Bragança-Miranda / Junta de Freguesia de Ligares",
      sourceType: "oficial",
      isAudioDemo: false,
      pendingValidation: false,
      notes: "Adro histórico com vestígios de sepulturas rupestres medievais."
    },
    shortDescription: "Igreja matriz com adro histórico e vestígios de sepulturas rupestres medievais.",
    fullDescription: "A Igreja Matriz de Ligares, dedicada a São Lourenço, destaca-se pelo seu enquadramento na pacata aldeia de Ligares. A envolvente do templo e o adro guardam vestígios arqueológicos de sepulturas antropomórficas escavadas na rocha, atestando o povoamento contínuo desde a Idade Média. A freguesia é célebre pela produção de azeite e amêndoa.",
    location: "Largo da Igreja, Aldeia de Ligares",
    coordinates: { lat: 41.0867, lng: -6.9653 },
    altitude: "520 m",
    estimatedTime: "35 min",
    accessibility: "Acesso pedonal no centro da aldeia",
    highlights: [
      "Adro com vestígios de sepulturas medievais escavadas na rocha",
      "Património de aldeia de grande tradição olivícola",
      "Arquitetura religiosa popular transmontana"
    ],
    image: "assets/images/igreja-matriz.png",
    openingHours: "Aberta durante serviços litúrgicos e festividades paroquiais",
    tips: "Visite as capelas vizinhas da aldeia e os olivais centenários que caracterizam a paisagem."
  }
];

export const CATEGORIES = [
  { id: "all", label: "Todos os Lugares", count: 19 },
  { id: "miradouro", label: "Miradouros & Natureza", count: 5 },
  { id: "patrimonio", label: "Património & Tradição", count: 12 },
  { id: "gastronomia", label: "Enoturismo & Sabores", count: 1 },
  { id: "natureza", label: "Rios & Praias Fluviais", count: 1 }
];
