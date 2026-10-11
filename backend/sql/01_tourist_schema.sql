-- ==============================================================================
-- FREIXO AI — Esquema SQL de Tabelas Turísticas (Supabase / PostgreSQL)
-- ==============================================================================
-- IMPORTANTE:
-- Este script NÃO apaga nem modifica as tabelas existentes 'sources' e 'knowledge_chunks'.
-- Cria apenas as tabelas complementares do domínio turístico do concelho de
-- Freixo de Espada à Cinta com cláusulas 'IF NOT EXISTS'.
-- ==============================================================================

-- 1. Freguesias do Concelho de Freixo de Espada à Cinta
CREATE TABLE IF NOT EXISTS public.freguesias (
    id TEXT PRIMARY KEY,                       -- Ex: 'freixo-mazouco', 'lagoaca-fornos', 'ligares', 'poia'
    name TEXT NOT NULL,                        -- Nome oficial completo
    short_name TEXT NOT NULL,                  -- Nome comum simplificado
    description TEXT,                          -- Enquadramento geográfico e histórico
    headquarters TEXT,                         -- Sede da freguesia
    area_km2 NUMERIC(6, 2),                    -- Área em quilómetros quadrados (dados INE/CAOP)
    population_census_2021 INTEGER,            -- População residente no Censos 2021
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Pontos de Interesse (Locais, Monumentos, Miradouros)
CREATE TABLE IF NOT EXISTS public.places (
    id TEXT PRIMARY KEY,                       -- Ex: 'penedo-durao', 'museu-da-seda'
    slug TEXT UNIQUE NOT NULL,                 -- Slug para URLs canónicos (ex: 'penedo-durao')
    title TEXT NOT NULL,                       -- Nome do ponto de interesse
    category TEXT NOT NULL,                    -- 'miradouro', 'patrimonio', 'natureza', 'artesanato', 'gastronomia'
    category_label TEXT,                       -- Rótulo visual
    freguesia_id TEXT REFERENCES public.freguesias(id) ON DELETE SET NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    location TEXT,                             -- Descrição textual de localização
    latitude DOUBLE PRECISION,                 -- Coordenada WGS84
    longitude DOUBLE PRECISION,                -- Coordenada WGS84
    altitude TEXT,                             -- Ex: '550 m'
    estimated_time TEXT,                       -- Ex: '1h 30 min'
    accessibility TEXT,                        -- Condições de mobilidade
    opening_hours TEXT,                        -- Horários verificados
    tips TEXT,                                 -- Dicas práticas para visitantes
    image_url TEXT,                            -- Caminho ou URL da imagem
    highlights JSONB DEFAULT '[]'::jsonb,      -- Lista de destaques
    audio_guide JSONB,                         -- Metadados de audioguia
    verification_status TEXT DEFAULT 'confirmado', -- 'confirmado' | 'demonstracao'
    verification_source TEXT,                  -- Entidade ou documento de validação (ex: ICNF, Município)
    is_demo BOOLEAN DEFAULT FALSE NOT NULL,    -- Indicador estrito de demonstração
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Percursos Pedestres e Rotas Turísticas
CREATE TABLE IF NOT EXISTS public.trails (
    id TEXT PRIMARY KEY,                       -- Ex: 'rota-seda-manuelino', 'rota-douro-grifos'
    slug TEXT UNIQUE NOT NULL,                 -- Slug canónico
    title TEXT NOT NULL,
    category TEXT NOT NULL,                    -- 'Cultura & Património', 'Natureza & Miradouros', etc.
    freguesia_id TEXT REFERENCES public.freguesias(id) ON DELETE SET NULL,
    duration TEXT,                             -- Ex: '1 Dia', '3h30'
    distance_km NUMERIC(5, 2),                 -- Distância em km
    difficulty TEXT,                           -- 'Fácil', 'Moderado', 'Difícil'
    description TEXT NOT NULL,
    hero_image TEXT,
    stops JSONB DEFAULT '[]'::jsonb,           -- Paragens ordenadas com tempo e descrição
    verification_status TEXT DEFAULT 'confirmado',
    verification_source TEXT,
    is_demo BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Eventos e Festividades
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,                       -- Ex: 'feira-da-terra-seda', 'festas-sao-cristovao'
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,                             -- 'Feira Tradicional', 'Religioso / Cultural', etc.
    freguesia_id TEXT REFERENCES public.freguesias(id) ON DELETE SET NULL,
    location TEXT,
    start_date DATE,
    end_date DATE,
    periodicity TEXT,                          -- Ex: 'Anual (Junho)', 'Anual (Agosto)'
    image_url TEXT,
    verification_status TEXT DEFAULT 'confirmado',
    verification_source TEXT,
    is_demo BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- Índices para otimização de consultas
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_places_slug ON public.places(slug);
CREATE INDEX IF NOT EXISTS idx_places_freguesia ON public.places(freguesia_id);
CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category);
CREATE INDEX IF NOT EXISTS idx_trails_slug ON public.trails(slug);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);

-- ==============================================================================
-- Políticas de Segurança (Row Level Security - RLS)
-- Apenas leitura pública permitida para SELECT; modificações restritas a administradores
-- ==============================================================================
ALTER TABLE public.freguesias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Garantir permissões de leitura no PostgREST para utilizadores anónimos e autenticados
GRANT SELECT ON TABLE public.freguesias TO anon, authenticated, service_role;
GRANT SELECT ON TABLE public.places TO anon, authenticated, service_role;
GRANT SELECT ON TABLE public.trails TO anon, authenticated, service_role;
GRANT SELECT ON TABLE public.events TO anon, authenticated, service_role;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'freguesias' AND policyname = 'Leitura pública de freguesias'
    ) THEN
        CREATE POLICY "Leitura pública de freguesias" ON public.freguesias FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'places' AND policyname = 'Leitura pública de locais'
    ) THEN
        CREATE POLICY "Leitura pública de locais" ON public.places FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'trails' AND policyname = 'Leitura pública de percursos'
    ) THEN
        CREATE POLICY "Leitura pública de percursos" ON public.trails FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'events' AND policyname = 'Leitura pública de eventos'
    ) THEN
        CREATE POLICY "Leitura pública de eventos" ON public.events FOR SELECT USING (true);
    END IF;
END
$$;
