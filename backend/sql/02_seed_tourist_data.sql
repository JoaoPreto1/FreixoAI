-- ==============================================================================
-- FREIXO AI — Dados Turísticos e Territoriais (Seed)
-- ==============================================================================
-- Dados rigorosos e verificados sobre Freixo de Espada à Cinta.
-- Todos os registos utilizam 'ON CONFLICT DO NOTHING' para não sobrescrever dados.
-- Registos sintéticos usados para validação de testes estão estritamente marcados
-- com 'is_demo = true' e 'verification_status = demonstracao'.
-- ==============================================================================

-- 1. Freguesias Oficiais (CAOP / Censos 2021)
INSERT INTO public.freguesias (id, name, short_name, description, headquarters, area_km2, population_census_2021)
VALUES
(
    'freixo-mazouco',
    'União das Freguesias de Freixo de Espada à Cinta e Mazouco',
    'Freixo e Mazouco',
    'Freguesia sede do concelho, abrangendo a vila histórica e a margem duriense do Mazouco (famoso pelo cavalo gravado na rocha). Concentra o maior património manuelino, museológico e a tradição viva da seda.',
    'Freixo de Espada à Cinta',
    144.38,
    2133
),
(
    'lagoaca-fornos',
    'União das Freguesias de Lagoaça e Fornos',
    'Lagoaça e Fornos',
    'Situada a norte do concelho, caracteriza-se pela paisagem agrícola do planalto mirandês/duriense, olivais tradicionais e proximidade ao Douro Internacional.',
    'Lagoaça',
    64.28,
    381
),
(
    'ligares',
    'Freguesia de Ligares',
    'Ligares',
    'Freguesia rural produtora de azeite e amêndoa, com forte identidade comunitária e património etnográfico secular.',
    'Ligares',
    46.29,
    334
),
(
    'poia',
    'Freguesia de Poia',
    'Poia',
    'Encaixada em vales térmicos favoráveis a citrinos e vinhas, vizinha do Douro e da albufeira de Aldeadávila.',
    'Poia',
    33.52,
    161
)
ON CONFLICT (id) DO NOTHING;

-- 2. Pontos de Interesse (Places)
INSERT INTO public.places (
    id, slug, title, category, category_label, freguesia_id, short_description, full_description,
    location, latitude, longitude, altitude, estimated_time, accessibility, opening_hours, tips,
    image_url, highlights, verification_status, verification_source, is_demo
)
VALUES
(
    'penedo-durao',
    'penedo-durao',
    'Miradouro do Penedo Durão',
    'miradouro',
    'Miradouros & Natureza',
    'freixo-mazouco',
    'O miradouro mais imponente do Douro Internacional, com vista para o canhão e o voo majestoso de grifos.',
    'Empoleirado a mais de 550 metros de altitude sobre a garganta do rio Douro e a barragem espanhola de Saucelle, o Penedo Durão oferece uma das panorâmicas mais arrebatadoras da Península Ibérica. É o melhor local de Portugal para observação de aves de rapina rupícolas.',
    'A 8 km a sudeste de Freixo de Espada à Cinta',
    41.0427, -6.8242, '550 m', '1h 30 min',
    'Acessível de carro; passadiço e rampa adaptada',
    'Acesso livre e permanente (melhor luz: fim de tarde)',
    'Leva binóculos para apreciar os ninhos nas escarpas espanholas e portuguesas.',
    'assets/images/penedo-durao.png',
    '["Voo próximo de grifos e abutres protegidos", "Vista panorâmica sobre o canhão granítico", "Espaço de piquenique sob pinhais aromáticos"]'::jsonb,
    'confirmado', 'Parque Natural do Douro Internacional / ICNF', FALSE
),
(
    'museu-da-seda',
    'museu-da-seda',
    'Museu da Seda e do Território',
    'patrimonio',
    'Património & Tradição',
    'freixo-mazouco',
    'O único local em Portugal onde o ciclo da seda é produzido artesanalmente desde o bicho ao tear.',
    'Instalado num edifício nobre no centro histórico, o museu preserva a mais nobre e rara tradição viva do concelho: a criação do bicho-da-seda, a colheita dos casulos, a fiação manual e a tecelagem em teares tradicionais de madeira.',
    'Largo do Convento, Centro Histórico',
    41.0926, -6.8062, '480 m', '1h 15 min',
    'Edifício adaptado com rampa e elevador',
    'Terça a Domingo: 10h00 - 12h30 / 14h00 - 17h30 (Segunda encerrado)',
    'Visite entre a primavera e o início do verão para observar os bichos-da-seda vivos a alimentar-se de folhas de amoreira.',
    'assets/images/seda-loom.png',
    '["Demonstração ao vivo de teares tradicionais em madeira", "Ciclo completo do bicho-da-seda", "Coleções raras de seda pura"]'::jsonb,
    'confirmado', 'Município de Freixo de Espada à Cinta', FALSE
),
(
    'torre-do-galo',
    'torre-do-galo',
    'Torre do Galo & Castelo Medieval',
    'patrimonio',
    'Património Histórico',
    'freixo-mazouco',
    'Singular torre heptagonal (7 lados) com vistas de 360° sobre a vila raiana e os olivais.',
    'Erguida na Idade Média, a Torre do Galo destaca-se pela sua planta heptagonal raríssima na arquitetura militar portuguesa. Juntamente com as muralhas e o freixo secular que dá nome à vila, compõe o coração lendário do concelho.',
    'Cimo da Vila, Centro Histórico',
    41.0935, -6.8080, '510 m', '45 min',
    'Acesso por calçada histórica; subida à torre por escadaria interna',
    'Acesso exterior livre; interior em horários de museu municipal',
    'Suba ao topo ao pôr-do-sol para ver as encostas durienses pintadas de dourado.',
    'assets/images/torre-galo.png',
    '["Planta heptagonal (7 faces) única na região", "Freixo centenário lendário no recinto amuralhado", "Paisagem raiana com Espanha no horizonte"]'::jsonb,
    'confirmado', 'DGPC / Monumento de Interesse Público', FALSE
),
(
    'igreja-matriz',
    'igreja-matriz',
    'Igreja Matriz de São Miguel',
    'patrimonio',
    'Monumento Nacional',
    'freixo-mazouco',
    'Obra-prima do manuelino duriense com pórtico esculpido e retábulo atribuído à oficina de Grão Vasco.',
    'Construída no século XVI, a Igreja Matriz de São Miguel exibe um dos mais ricos portais manuelinos do norte transmontano, bem como abóbadas artesonadas e um valioso conjunto pictórico renascentista.',
    'Largo do Município, Freixo de Espada à Cinta',
    41.0928, -6.8071, '485 m', '45 min',
    'Acesso plano pela entrada principal',
    'Aberta durante serviços religiosos e visitas guiadas coordenadas',
    'Repare nos pormenores marítimos do pórtico, como nós e cordas em plena terra transmontana.',
    'assets/images/igreja-matriz.png',
    '["Portal manuelino com motivos vegetalistas", "Retábulo com tábuas renascentistas", "Pinturas murais e talha dourada"]'::jsonb,
    'confirmado', 'DGPC / Monumento Nacional', FALSE
),
(
    'praia-congida',
    'praia-congida',
    'Praia Fluvial da Congida',
    'natureza',
    'Lazer & Natureza',
    'freixo-mazouco',
    'Oásis ribeirinho nas margens do Douro com piscinas flutuantes, parque de merendas e cais de embarque.',
    'Localizada na albufeira de Saucelle, a Congida combina a tranquilidade das águas mansas do rio com uma vegetação luxuriante e infraestruturas completas de apoio balnear e desportos náuticos.',
    'A 4 km da vila, margem do rio Douro',
    41.0664, -6.7869, '130 m', '2h a meio-dia',
    'Acesso pedonal pavimentado e estacionamento adjacente',
    'Época balnear vigiada: Junho a Setembro; espaço aberto todo o ano',
    'Aproveite os passeios de barco ambiental que partem do cais municipal.',
    'assets/images/praia-congida.png',
    '["Piscinas municipais sobre o leito da albufeira", "Parque arborizado e sombras refrescantes", "Cais de embarque para viagens de barco"]'::jsonb,
    'confirmado', 'Município de Freixo de Espada à Cinta / APA', FALSE
),
(
    'calcada-alpajares',
    'calcada-alpajares',
    'Calçada e Castelo Velho de Alpajares',
    'patrimonio',
    'Arqueologia & Paisagem',
    'freixo-mazouco',
    'Calçada antiga sobre o canhão granítico do rio Mosteiro, povoado fortificado proto-histórico e aves rupícolas.',
    'A Calçada de Alpajares (também conhecida por Calçada dos Diabos) serpenteia por uma garganta escarpada no vale da ribeira do Mosteiro. No topo ergue-se o Castelo Velho, castro da Idade do Ferro com muralhas imponentes e gravuras rupestres.',
    'Vale da Ribeira do Mosteiro, a 5 km a sul de Freixo',
    41.0503, -6.8532, '380 m', '2h 30 min (percurso pedestre)',
    'Trilho de montanha irregular; requer calçado de caminhada',
    'Acesso livre e permanente',
    'Evitar nas horas de maior calor no verão; levar água e bastão de caminhada.',
    'assets/images/alpajares.png',
    '["Calçada ancestral gravada em rocha granítica", "Castro e muralhas proto-históricas", "Paisagem agreste e observação de aves de rapina"]'::jsonb,
    'confirmado', 'DGPC / ICNF / PNDI', FALSE
),
(
    'ponto-teste-demonstracao',
    'ponto-teste-demonstracao',
    'Registo de Teste — Demonstração Técnica da API',
    'demonstracao',
    'Demonstração & Testes',
    'freixo-mazouco',
    'Registo de demonstração técnica para validação de contratos e testes automatizados.',
    'Este registo existe com a finalidade exclusiva de validar o comportamento do pipeline de dados, paginação e testes de integração da API Node.js/Express.',
    'Ambiente de Testes / Demonstração Controlada',
    41.0900, -6.8000, '500 m', '15 min',
    'Acesso universal de teste',
    'Acesso contínuo via API',
    'Identificado formalmente como demonstração conforme Requisito 7.',
    'assets/images/demo.png',
    '["Registo de validação técnica", "Filtro de integridade de testes"]'::jsonb,
    'demonstracao', 'Freixo AI Test Suite (Ambiente Local)', TRUE
)
ON CONFLICT (id) DO NOTHING;

-- 3. Percursos (Trails)
INSERT INTO public.trails (
    id, slug, title, category, freguesia_id, duration, distance_km, difficulty,
    description, hero_image, stops, verification_status, verification_source, is_demo
)
VALUES
(
    'rota-seda-manuelino',
    'rota-seda-manuelino',
    'A Rota da Seda e dos Portais Manuelinos',
    'Cultura & Património',
    'freixo-mazouco',
    '1 Dia (A pé no centro)',
    3.50,
    'Fácil',
    'Uma imersão no coração histórico de Freixo. Descobre tecedeiras de seda viva, a torre heptagonal do Castelo e dezenas de portais esculpidos em cantaria quinhentista.',
    'assets/images/manueline-portal.png',
    '[{"order": 1, "poiId": "museu-da-seda", "title": "Museu da Seda e do Território"}, {"order": 2, "poiId": "igreja-matriz", "title": "Igreja Matriz de São Miguel"}, {"order": 3, "poiId": "torre-do-galo", "title": "Torre do Galo & Castelo"}]'::jsonb,
    'confirmado', 'Município de Freixo de Espada à Cinta', FALSE
),
(
    'rota-douro-grifos',
    'rota-douro-grifos',
    'Canhões do Douro e o Voo dos Grifos',
    'Natureza & Miradouros',
    'freixo-mazouco',
    '1 Dia (Carro + Pequenos percursos)',
    28.00,
    'Moderado',
    'Um dia inesquecível pelo Parque Natural do Douro Internacional. Miradouros vertiginosos sobre arribas imensas e praias fluviais serenas.',
    'assets/images/penedo-durao.png',
    '[{"order": 1, "poiId": "penedo-durao", "title": "Miradouro do Penedo Durão"}, {"order": 2, "poiId": "praia-congida", "title": "Praia Fluvial da Congida"}]'::jsonb,
    'confirmado', 'ICNF / Parque Natural do Douro Internacional', FALSE
),
(
    'trilho-teste-demonstracao',
    'trilho-teste-demonstracao',
    'Trilho de Demonstração para Testes de Integração',
    'Demonstração & Testes',
    'freixo-mazouco',
    '30 min',
    1.20,
    'Fácil',
    'Percurso de teste para verificação do contrato de resposta JSON da rota GET /api/trails.',
    'assets/images/demo.png',
    '[{"order": 1, "title": "Ponto A"}, {"order": 2, "title": "Ponto B"}]'::jsonb,
    'demonstracao', 'Freixo AI Test Suite', TRUE
)
ON CONFLICT (id) DO NOTHING;

-- 4. Eventos (Events)
INSERT INTO public.events (
    id, slug, title, description, category, freguesia_id, location,
    start_date, end_date, periodicity, image_url, verification_status, verification_source, is_demo
)
VALUES
(
    'feira-da-terra-seda',
    'feira-da-terra-seda',
    'Feira da Terra e da Seda',
    'Grande certame anual que celebra a tradição da seda artesanal, os vinhos do Douro Superior, o azeite transmontano e o artesanato local com animação de rua.',
    'Feira Tradicional & Gastronomia',
    'freixo-mazouco',
    'Zona Ribeirinha e Centro de Freixo de Espada à Cinta',
    '2026-06-12', '2026-06-14', 'Anual (Junho)',
    'assets/images/seda-loom.png',
    'confirmado', 'Município de Freixo de Espada à Cinta', FALSE
),
(
    'amendoeiras-em-flor',
    'amendoeiras-em-flor',
    'Festa das Amendoeiras em Flor',
    'Celebração da floração das amendoeiras que cobre as encostas durienses de um manto branco e rosado, com mostras de doçaria tradicional e passeios guiados.',
    'Natureza & Tradição',
    'freixo-mazouco',
    'Todo o concelho de Freixo de Espada à Cinta',
    '2026-02-20', '2026-03-08', 'Anual (Fevereiro/Março)',
    'assets/images/colado-view.png',
    'confirmado', 'Município de Freixo de Espada à Cinta / Região de Turismo', FALSE
),
(
    'festas-sao-cristovao',
    'festas-sao-cristovao',
    'Festas do Padroeiro São Cristóvão',
    'Festividades tradicionais de cariz religioso e popular, com procissão, concertos, arraial e fogo de artifício.',
    'Religioso & Cultural',
    'freixo-mazouco',
    'Largo do Convento e Centro Histórico',
    '2026-08-14', '2026-08-16', 'Anual (Agosto)',
    'assets/images/igreja-matriz.png',
    'confirmado', 'Comissão de Festas de São Cristóvão', FALSE
),
(
    'evento-teste-demonstracao',
    'evento-teste-demonstracao',
    'Evento de Demonstração para Testes Automatizados',
    'Evento sintético utilizado para validação de endpoints e filtros temporais.',
    'Demonstração & Testes',
    'freixo-mazouco',
    'Ambiente de Testes',
    '2026-12-01', '2026-12-02', 'Demonstração',
    'assets/images/demo.png',
    'demonstracao', 'Freixo AI Test Suite', TRUE
)
ON CONFLICT (id) DO NOTHING;
