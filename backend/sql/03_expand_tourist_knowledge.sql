-- ==============================================================================
-- FREIXO AI — Expansão da Base de Conhecimento Turística (03_expand_tourist_knowledge.sql)
-- ==============================================================================
-- Registos oficiais verificados cobrindo as quatro freguesias do concelho:
-- 1. União das Freguesias de Freixo de Espada à Cinta e Mazouco ('freixo-mazouco')
-- 2. União das Freguesias de Lagoaça e Fornos ('lagoaca-fornos')
-- 3. Freguesia de Poia ('poia')
-- 4. Freguesia de Ligares ('ligares')
--
-- Todos os comandos são rigorosamente idempotentes ('ON CONFLICT DO UPDATE/NOTHING').
-- ==============================================================================

-- 1. EXPANSÃO DE PONTOS DE INTERESSE (PLACES)
INSERT INTO public.places (
    id, slug, title, category, category_label, freguesia_id, short_description, full_description,
    location, latitude, longitude, altitude, estimated_time, accessibility, opening_hours, tips,
    image_url, highlights, verification_status, verification_source, is_demo
)
VALUES
-- FREIXO-MAZOUCO: Circuito dos Portais Manuelinos
(
    'portais-manuelinos',
    'portais-manuelinos',
    'Circuito dos Portais Manuelinos',
    'patrimonio',
    'Arquitetura Manuelina',
    'freixo-mazouco',
    'A maior concentração de portais manuelinos dos séculos XV e XVI de todo o Portugal interior.',
    'Caminhar pelas ruelas estreitas de Freixo é viajar até à era dos Descobrimentos. A vila guarda mais de 40 portais, janelas de chanfro e arquitraves esculpidas com cordas náuticas, motivos vegetalistas, esferas armilares e escudos heráldicos, testemunho de uma época em que nobres e abastados mercadores investiram em residências de prestígio.',
    'Rua do Ouro, Rua do Castelo e envolvente do Centro Histórico',
    41.0921, -6.8073, '490 m', '1h 30 min',
    'Percurso pedestre em calçada tradicional com acessibilidade urbana moderada',
    'Circuito aberto ao ar livre permanente',
    'Repare nas molduras das janelas de canto e nos símbolos heráldicos gravados nos lintéis.',
    'assets/images/manueline-portal.png',
    '["Mais de 40 portais manuelinos catalogados", "Detalhes de escultura Manuelina em granito duriense", "Casario de traça tradicional com varandas floridas"]'::jsonb,
    'confirmado', 'DGPC / Inventário do Património Arquitetónico (IHRU)', FALSE
),
-- FREIXO-MAZOUCO: Estação com Gravuras Rupestres do Mazouco (Cavalo do Mazouco)
(
    'cavalo-do-mazouco',
    'cavalo-do-mazouco',
    'Estação Arqueológica do Mazouco & Cavalo do Mazouco',
    'patrimonio',
    'Arqueologia & Paleolítico',
    'freixo-mazouco',
    'Primeira gravura rupestre paleolítica ao ar livre identificada em Portugal, esculpida em xisto vertical.',
    'Classificada como Imóvel de Interesse Público desde 1983 (Decreto n.º 31/83), a estação arqueológica do Mazouco situa-se no sítio do Carneiro, Cabeço da Vigia, sobranceira à ribeira de Albagueira e ao rio Douro. A gravura principal representa um cavalo finamente picotado e raspado em estilo magdalenense com cerca de 65 cm de comprimento, constituindo um marco na arte rupestre europeia.',
    'Lugar do Carneiro, aldeia de Mazouco, a 12 km a norte de Freixo',
    41.1402, -6.7629, '280 m', '1h 00 min',
    'Acesso pedestre por caminho de terra a partir da aldeia de Mazouco; requer calçado confortável',
    'Acesso livre e permanente (melhor visibilidade com luz rasante matinal ou ao fim da tarde)',
    'A iluminação solar rasante permite apreciar os contornos raspados da cabeça e crina do cavalo.',
    'assets/images/alpajares.png',
    '["Primeira estação paleolítica ao ar livre de Portugal", "Gravura de cavalo com estilo magdalenense milenar", "Enquadramento paisagístico no vale do Douro Internacional"]'::jsonb,
    'confirmado', 'Património Cultural, I.P. (SIPA n.º 438) / Decreto n.º 31/83', FALSE
),
-- FREIXO-MAZOUCO: Miradouro do Colado & Capela de N.ª Sr.ª dos Montes Ermos
(
    'miradouro-colado',
    'miradouro-colado',
    'Miradouro do Colado & Capela de N.ª Sr.ª dos Montes Ermos',
    'miradouro',
    'Miradouros & Paisagem',
    'freixo-mazouco',
    'Miradouro aéreo no cume da serra com panorâmica sobre amendoais, olivais e o casario histórico.',
    'Localizado a cerca de 630 metros de altitude na Serra dos Montes Ermos, este miradouro acolhe a tradicional capela e santuário mariano de Nossa Senhora dos Montes Ermos. Oferece uma vista aberta de 360 graus sobre a vila sede, os socalcos agrícolas transmontanos e as serras espanholas no horizonte raiano.',
    'Serra dos Montes Ermos, a 3 km a noroeste da vila',
    41.0995, -6.8290, '630 m', '45 min',
    'Acessível por estrada municipal pavimentada; parque de estacionamento no recinto',
    'Acesso livre e permanente',
    'Visita imperdível durante a Festa das Amendoeiras em Flor (fevereiro/março) para contemplar os vales floridos.',
    'assets/images/colado-view.png',
    '["Vista panorâmica sobre a vila de Freixo e montanhas de Espanha", "Capela de devoção popular de N.ª Sr.ª dos Montes Ermos", "Origem inspiradora da marca vinícola concelhia"]'::jsonb,
    'confirmado', 'Município de Freixo de Espada à Cinta / Rota dos Miradouros', FALSE
),
-- FREIXO-MAZOUCO: Museu Regional Casa Junqueiro
(
    'museu-casa-junqueiro',
    'museu-casa-junqueiro',
    'Museu Regional Casa Junqueiro',
    'patrimonio',
    'Património & Literatura',
    'freixo-mazouco',
    'Museu instalado na casa senhorial da família do poeta republicano Guerra Junqueiro.',
    'Instalado no centro histórico de Freixo, o museu homenageia Abílio Manuel Guerra Junqueiro (1850-1923), figura cimeira da poesia portuguesa, nascido nesta vila. O espaço expõe manuscritos, espólio pessoal do autor de «Os Simples», mobiliário oitocentista e um núcleo etnográfico das vivências transmontanas.',
    'Rua de São Francisco, n.º 5, Centro Histórico',
    41.0917, -6.8055, '485 m', '1h 00 min',
    'Acessível no piso térreo; rampa de apoio',
    'Terça a Sábado: 09h30 - 12h30 / 14h00 - 17h30 (Encerra a Domingo e Segunda)',
    'Excelente complemento cultural ao Museu da Seda para compreender a identidade literária do concelho.',
    'assets/images/torre-galo.png',
    '["Espólio literário e pessoal de Guerra Junqueiro", "Edifício nobre de traça senhorial oitocentista", "Núcleo etnográfico das artes e ofícios raianos"]'::jsonb,
    'confirmado', 'Município de Freixo de Espada à Cinta / Rede Portuguesa de Museus', FALSE
),
-- FREIXO-MAZOUCO: Adega Cooperativa de Freixo de Espada à Cinta (Montes Ermos)
(
    'adega-cooperativa-montes-ermos',
    'adega-cooperativa-montes-ermos',
    'Adega Cooperativa de Freixo de Espada à Cinta — Montes Ermos',
    'gastronomia',
    'Enoturismo & Sabores',
    'freixo-mazouco',
    'Centro vitivinícola e oleícola de Freixo, produtor dos vinhos DOC Douro e azeite virgem Montes Ermos.',
    'Fundada em 1963, a Adega Cooperativa reúne o fruto do trabalho dos agricultores das quatro freguesias do concelho. Produz vinhos premiados da Região Demarcada do Douro (Douro Superior) e azeite virgem extra com denominação Negrinha de Freixo. Dispõe de loja oficial de produtores e provas de enoturismo.',
    'Avenida dos Combatentes do Ultramar, Freixo de Espada à Cinta',
    41.0906, -6.8055, '470 m', '1h 00 min',
    'Acesso universal térreo e estacionamento privativo',
    'Segunda a Sexta: 09h00 - 12h30 / 14h00 - 18h00; Sábados: 09h00 - 13h00',
    'Prove os vinhos brancos colheita selecionada e o azeite de primeira extração a frio na loja de produtores.',
    'assets/images/douro-wine.png',
    '["Provas de vinhos DOC Douro Superior", "Azeite virgem extra DOP Negrinha de Freixo", "Loja oficial de produtos gastronómicos certificados"]'::jsonb,
    'confirmado', 'IVDP / Adega Cooperativa / Município de Freixo de Espada à Cinta', FALSE
),
-- LAGOAÇA-FORNOS: Miradouro do Carrascalinho
(
    'miradouro-carrascalinho',
    'miradouro-carrascalinho',
    'Miradouro do Carrascalinho',
    'miradouro',
    'Miradouros & Natureza',
    'lagoaca-fornos',
    'Miradouro agreste sobre as escarpas do Douro e a maior mancha natural de lodões da Europa.',
    'Situado junto à aldeia de Fornos, no Parque Natural do Douro Internacional, o Carrascalinho projeta-se sobre o canhão granítico do rio Douro. Destaca-se por uma panorâmica de beleza pura e por acolher nas suas encostas abrigadas a mais extensa população europeia de lodão-bastardo (Celtis australis).',
    'A 3 km a leste da aldeia de Fornos',
    41.1687, -6.7318, '600 m', '1h 15 min',
    'Acesso por caminho rural de terra batida; requer condução cuidada',
    'Acesso livre e permanente',
    'Recomendado para observadores de natureza e botânica; excelente ponto fotográfico ao meio da manhã.',
    'assets/images/penedo-durao.png',
    '["Maior mancha florestal de lodões da Europa", "Garganta profunda do rio Douro Internacional", "Habitat protegido de aves de rapina"]'::jsonb,
    'confirmado', 'ICNF / Parque Natural do Douro Internacional / Rota dos Miradouros', FALSE
),
-- LAGOAÇA-FORNOS: Miradouro da Cruzinha
(
    'miradouro-cruzinha',
    'miradouro-cruzinha',
    'Miradouro da Cruzinha',
    'miradouro',
    'Miradouros & Natureza',
    'lagoaca-fornos',
    'Observatório panorâmico setentrional sobre a albufeira de Aldeadávila e os desfiladeiros.',
    'Localizado no termo da aldeia de Lagoaça, no extremo norte do concelho, a Cruzinha ergue-se numa crista quartzítica sobre o Douro Internacional e a imensa albufeira de Aldeadávila. Proporciona vistas contrastantes entre os socalcos de oliveiras do planalto e as vertentes alcantiladas da fronteira.',
    'A 2,5 km a leste da aldeia de Lagoaça',
    41.1910, -6.7139, '620 m', '45 min',
    'Acesso pedonal e viário florestal a partir de Lagoaça',
    'Acesso livre e permanente',
    'Espaço muito tranquilo, ideal para contemplação meditativa e fotografia de paisagem.',
    'assets/images/colado-view.png',
    '["Vistas panorâmicas sobre a albufeira de Aldeadávila", "Trilho de ligação pedestre pelo planalto mirandês", "Tranquilidade absoluta no Douro Selvagem"]'::jsonb,
    'confirmado', 'ICNF / Parque Natural do Douro Internacional / Município', FALSE
),
-- LAGOAÇA-FORNOS: Igreja Matriz de Lagoaça
(
    'igreja-lagoaca',
    'igreja-lagoaca',
    'Igreja Matriz de Lagoaça',
    'patrimonio',
    'Património Religioso',
    'lagoaca-fornos',
    'Templo paroquial com torre sineira e elementos de tradição barroca no planalto duriense.',
    'A Igreja Matriz de Lagoaça (sob a invocação de Santo Antão) situa-se no largo central da aldeia. Edificada em cantaria e alvenaria tradicional, reflete a arquitetura religiosa do interior transmontano dos séculos XVII e XVIII. É ponto focal das festividades e marca o início do percurso homologado PR2 FEC.',
    'Largo da Igreja, Aldeia de Lagoaça',
    41.1934, -6.7283, '640 m', '30 min',
    'Acesso plano no largo da aldeia',
    'Visitas no horário de culto ou sob marcação com a paróquia local',
    'Aprecie o cruzeiro de granito e as fontes tradicionais nas imediações do adro paroquial.',
    'assets/images/igreja-matriz.png',
    '["Núcleo histórico e arquitetura tradicional de Lagoaça", "Ponto de passagem da rota pedestre PR2 FEC", "Cruzeiro e largo comunitário"]'::jsonb,
    'confirmado', 'Diocese de Bragança-Miranda / Município de Freixo de Espada à Cinta', FALSE
),
-- POIA: Miradouro e Baloiço do Assumadouro
(
    'miradouro-assumadouro',
    'miradouro-assumadouro',
    'Miradouro e Baloiço do Assumadouro',
    'miradouro',
    'Miradouros & Paisagem',
    'poia',
    'Ponto cénico com baloiço panorâmico sobre o rio Douro, o rio Águeda e Barca d''Alva.',
    'Situado na freguesia de Poia (aldeia de Poiares), o Miradouro do Assumadouro oferece uma ampla janela sobre o vale do Douro Internacional na zona de transição para o Douro vinhateiro. Dispõe de um baloiço panorâmico que se tornou um ponto muito procurado para fotografias com fundo sobre as águas fronteiriças e a veiga de Barca d''Alva.',
    'Termo de Poiares, a sudoeste do concelho',
    41.0430, -6.8953, '450 m', '45 min',
    'Acesso por caminho de terra em bom estado a partir de Poiares',
    'Acesso livre e permanente',
    'Excelente paragem ao fim da tarde para assistir ao reflexo dourado das encostas nas águas do Douro.',
    'assets/images/penedo-durao.png',
    '["Baloiço panorâmico sobre o rio Douro", "Vista aberta sobre a confluência do rio Águeda", "Enquadramento paisagístico no vale de Poiares"]'::jsonb,
    'confirmado', 'Município de Freixo de Espada à Cinta / Aldeias de Portugal', FALSE
),
-- POIA: Ruínas do Castelo de Alva
(
    'castelo-de-alva',
    'castelo-de-alva',
    'Ruínas do Castelo de Alva',
    'patrimonio',
    'Arqueologia & História',
    'poia',
    'Fortificação medieval classificada como Imóvel de Interesse Público sobre o vale do Douro.',
    'Classificado pelo Decreto n.º 37077 de 1948 (SIPA n.º 477), o Castelo de Alva remonta à Idade Média cristã e integrava a linha defensiva fronteiriça do reino de Leão e Portugal. Erguido num cabeço escarpado sobre o rio Douro, preserva vestígios de muralhas em alvenaria de xisto e granito associados à antiga povoação medieval de Alva.',
    'Lugar de Alva, termo de Poiares',
    41.0403, -6.9239, '380 m', '1h 00 min',
    'Acesso pedonal por trilho rural acidentado; calçado de caminhada recomendado',
    'Acesso livre e permanente',
    'Local de elevado interesse para entusiastas de arqueologia militar e história medieval.',
    'assets/images/torre-galo.png',
    '["Classificado como Imóvel de Interesse Público (SIPA n.º 477)", "Vestígios arqueológicos de cerca amuralhada medieval", "Vistas cénicas imponentes sobre o desfiladeiro do Douro"]'::jsonb,
    'confirmado', 'Património Cultural, I.P. (SIPA n.º 477) / DGPC', FALSE
),
-- POIA: Igreja Matriz de Poiares (São Pedro)
(
    'igreja-poiares',
    'igreja-poiares',
    'Igreja Matriz de São Pedro de Poiares',
    'patrimonio',
    'Património Religioso',
    'poia',
    'Igreja paroquial tradicional em granito e xisto, ponto de partida da Rota do Penedo Durão.',
    'A Igreja Matriz de São Pedro é o coração comunitário da aldeia de Poiares. Construída em cantaria tradicional com torre sineira e retábulos devocionais em talha, testemunha séculos de história raiana. O seu largo serve de início e fim oficial ao percurso homologado PR5 FEC.',
    'Largo Principal, Aldeia de Poiares',
    41.0494, -6.8778, '490 m', '30 min',
    'Acesso plano no centro da aldeia',
    'Aberta durante os períodos de celebração e eventos comunitários',
    'Ponto de apoio ideal para iniciar a caminhada pelo PR5 FEC em direção ao Penedo Durão.',
    'assets/images/igreja-matriz.png',
    '["Ponto de partida do trilho homologado PR5 FEC", "Arquitetura religiosa rural transmontana", "Enquadramento na aldeia típica de Poiares"]'::jsonb,
    'confirmado', 'Diocese de Bragança-Miranda / Aldeias de Portugal', FALSE
),
-- LIGARES: Ponte Velha da Ribeira do Mosteiro (Ponte de Ligares)
(
    'ponte-ligares-mosteiro',
    'ponte-ligares-mosteiro',
    'Ponte Velha da Ribeira do Mosteiro & Calçadas de Xisto',
    'patrimonio',
    'Engenharia Histórica & Paisagem',
    'ligares',
    'Ponte secular de xisto de tabuleiro plano sobre a Ribeira do Mosteiro, ligada a rotas monásticas.',
    'Erguida em alvenaria de xisto argamassado com um arco de volta perfeita e tabuleiro plano, esta ponte antiga situa-se no vale fértil da Ribeira do Mosteiro, junto à histórica Quinta de Santiago. Serviu de ponto de passagem estratégico em antigas ligações entre a freguesia de Ligares, as ermidas medievais e o rio Douro.',
    'Vale da Ribeira do Mosteiro / Quinta de Santiago, Ligares',
    41.0556, -6.9011, '220 m', '45 min',
    'Acesso por caminho de campo e ligação a percursos rurais',
    'Acesso livre e permanente',
    'Local bucólico com vegetação ribeirinha mediterrânica, amendoais e pomares de laranjeiras.',
    'assets/images/alpajares.png',
    '["Construção secular em alvenaria de xisto duriense", "Enquadramento no microclima mediterrânico da Ribeira do Mosteiro", "Ligação histórica às rotas de Ligares e Poiares"]'::jsonb,
    'confirmado', 'Município de Freixo de Espada à Cinta / ICNF / PNDI', FALSE
),
-- LIGARES: Igreja Paroquial de Ligares (São Lourenço)
(
    'igreja-matriz-ligares',
    'igreja-matriz-ligares',
    'Igreja Paroquial de São Lourenço de Ligares',
    'patrimonio',
    'Património Religioso',
    'ligares',
    'Igreja matriz com adro histórico e vestígios de sepulturas rupestres medievais.',
    'A Igreja Matriz de Ligares, dedicada a São Lourenço, destaca-se pelo seu enquadramento na pacata aldeia de Ligares. A envolvente do templo e o adro guardam vestígios arqueológicos de sepulturas antropomórficas escavadas na rocha, atestando o povoamento contínuo desde a Idade Média. A freguesia é célebre pela produção de azeite e amêndoa.',
    'Largo da Igreja, Aldeia de Ligares',
    41.0867, -6.9653, '520 m', '35 min',
    'Acesso pedonal no centro da aldeia',
    'Aberta durante serviços litúrgicos e festividades paroquiais',
    'Visite as capelas vizinhas da aldeia e os olivais centenários que caracterizam a paisagem.',
    'assets/images/igreja-matriz.png',
    '["Adro com vestígios de sepulturas medievais escavadas na rocha", "Património de aldeia de grande tradição olivícola", "Arquitetura religiosa popular transmontana"]'::jsonb,
    'confirmado', 'Diocese de Bragança-Miranda / Junta de Freguesia de Ligares', FALSE
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    category_label = EXCLUDED.category_label,
    freguesia_id = EXCLUDED.freguesia_id,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    location = EXCLUDED.location,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    altitude = EXCLUDED.altitude,
    estimated_time = EXCLUDED.estimated_time,
    accessibility = EXCLUDED.accessibility,
    opening_hours = EXCLUDED.opening_hours,
    tips = EXCLUDED.tips,
    highlights = EXCLUDED.highlights,
    verification_status = EXCLUDED.verification_status,
    verification_source = EXCLUDED.verification_source,
    updated_at = NOW();

-- 2. EXPANSÃO DE PERCURSOS HOMOLOGADOS (TRAILS)
INSERT INTO public.trails (
    id, slug, title, category, freguesia_id, duration, distance_km, difficulty,
    description, hero_image, stops, verification_status, verification_source, is_demo,
    geometry_status, geometry_source, geometry_consulted_at, geometry_limitations
)
VALUES
-- PR2 FEC: Rota do Carrascalinho
(
    'pr2-rota-carrascalinho',
    'pr2-rota-carrascalinho',
    'PR2 FEC — Rota do Carrascalinho',
    'Natureza & Miradouros',
    'lagoaca-fornos',
    '4h30',
    14.90,
    'Moderado',
    'Percurso pedestre circular homologado no Parque Natural do Douro Internacional. Liga as aldeias de Lagoaça e Fornos, serpenteando por olivais e permitindo acesso ao Miradouro do Carrascalinho sobre a maior mancha europeia de lodões.',
    'assets/images/penedo-durao.png',
    '[{"order": 1, "poiId": "miradouro-carrascalinho", "title": "Miradouro do Carrascalinho"}, {"order": 2, "poiId": "igreja-lagoaca", "title": "Igreja Matriz de Lagoaça"}]'::jsonb,
    'confirmado', 'ICNF / Natural.pt / Município de Freixo de Espada à Cinta / FCMP', FALSE,
    'indisponivel', 'ICNF / Natural.pt / Federação de Campismo e Montanhismo de Portugal', '2026-10-13',
    'Percurso homologado formal com marcações oficiais no terreno. Extensão considerável de 14,9 km; requer preparação física moderada e água abundante.'
),
-- PR5 FEC: Rota do Penedo Durão
(
    'pr5-rota-penedo-durao',
    'pr5-rota-penedo-durao',
    'PR5 FEC — Rota do Penedo Durão',
    'Natureza & Miradouros',
    'poia',
    '4h30',
    14.10,
    'Moderado',
    'Percurso pedestre circular homologado com início na aldeia de Poiares. Percorre caminhos rurais de amendoeiras e olivais ancestrais até culminar no emblemático Miradouro do Penedo Durão, célebre santuário de observação de aves de rapina.',
    'assets/images/penedo-durao.png',
    '[{"order": 1, "poiId": "igreja-poiares", "title": "Igreja Matriz de Poiares"}, {"order": 2, "poiId": "penedo-durao", "title": "Miradouro do Penedo Durão"}]'::jsonb,
    'confirmado', 'ICNF / Natural.pt / Município de Freixo de Espada à Cinta / FCMP', FALSE,
    'indisponivel', 'ICNF / Natural.pt / Federação de Campismo e Montanhismo de Portugal', '2026-10-13',
    'Percurso homologado circular a partir de Poiares. Requer calçado de caminhada; evitar nas horas de calor estival intenso.'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    freguesia_id = EXCLUDED.freguesia_id,
    duration = EXCLUDED.duration,
    distance_km = EXCLUDED.distance_km,
    difficulty = EXCLUDED.difficulty,
    description = EXCLUDED.description,
    stops = EXCLUDED.stops,
    verification_status = EXCLUDED.verification_status,
    verification_source = EXCLUDED.verification_source,
    geometry_status = EXCLUDED.geometry_status,
    geometry_source = EXCLUDED.geometry_source,
    geometry_consulted_at = EXCLUDED.geometry_consulted_at,
    geometry_limitations = EXCLUDED.geometry_limitations,
    updated_at = NOW();

-- 3. EXPANSÃO DE EVENTOS TRADICIONAIS (EVENTS)
INSERT INTO public.events (
    id, slug, title, description, category, freguesia_id, location,
    start_date, end_date, periodicity, image_url, verification_status, verification_source, is_demo
)
VALUES
(
    'festa-sao-lourenco-ligares',
    'festa-sao-lourenco-ligares',
    'Festa Tradicional de São Lourenço em Ligares',
    'Festividade popular e religiosa na aldeia de Ligares em honra de São Lourenço, com missa solene, procissão pelo casario, música tradicional e convívio popular.',
    'Religioso & Cultural',
    'ligares',
    'Largo da Igreja e Aldeia de Ligares',
    '2026-08-08', '2026-08-10', 'Anual (Agosto)',
    'assets/images/igreja-matriz.png',
    'confirmado', 'Junta de Freguesia de Ligares / Comissão de Festas', FALSE
),
(
    'festa-santo-antao-lagoaca',
    'festa-santo-antao-lagoaca',
    'Festa e Romaria de Santo Antão em Lagoaça',
    'Celebração tradicional e romaria na aldeia de Lagoaça, reunindo os residentes e a comunidade num ambiente festivo com celebração litúrgica e arraial popular.',
    'Religioso & Cultural',
    'lagoaca-fornos',
    'Largo de Santo Antão e Aldeia de Lagoaça',
    '2026-01-17', '2026-01-18', 'Anual (Janeiro/Agosto)',
    'assets/images/colado-view.png',
    'confirmado', 'União das Freguesias de Lagoaça e Fornos', FALSE
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    freguesia_id = EXCLUDED.freguesia_id,
    location = EXCLUDED.location,
    periodicity = EXCLUDED.periodicity,
    verification_status = EXCLUDED.verification_status,
    verification_source = EXCLUDED.verification_source,
    updated_at = NOW();
