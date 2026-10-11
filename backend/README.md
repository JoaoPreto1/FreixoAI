# FREIXO AI — Backend API (Node.js & Express)

API REST modular e gateway de aplicação para o ecossistema turístico e territorial de **Freixo de Espada à Cinta**.

Desenvolvida com **Node.js**, **Express** e **JavaScript ES Modules**, seguindo padrões arquiteturais limpos e resilientes:
- **Separação de Camadas:** `config/`, `middleware/`, `services/`, `controllers/` e `routes/`.
- **Rigor Territorial:** Nenhuma coordenada, monumento, facto histórico ou percurso é inventado. Registos para testes unitários estão expressamente catalogados como `is_demo: true` e `verification_status: "demonstracao"`.
- **Segurança Supabase:** Credenciais restritas ao ambiente do servidor; nenhuma chave secreta é exposta ao frontend.
- **Microserviço de IA:** Serviço proxy dedicado para comunicar com o FastAPI (porta 8000), preservando a arquitetura RAG e pgvector existente.

---

## 1. Estrutura de Diretórios

```
backend/
├── .env                         # Variáveis locais com credenciais (ignorado no Git)
├── .env.example                 # Exemplo de configuração sem credenciais reais
├── package.json                 # Dependências e scripts de execução
├── README.md                    # Documentação técnica e guia de execução
├── sql/
│   ├── 01_tourist_schema.sql    # Esquema DDL para Supabase (IF NOT EXISTS, preserva RAG)
│   └── 02_seed_tourist_data.sql # Dados verificados e sementes de demonstração
├── src/
│   ├── app.js                   # Inicialização da aplicação Express e middlewares
│   ├── server.js                # Ponto de entrada HTTP do servidor
│   ├── config/
│   │   ├── env.js               # Validação e carregamento de variáveis de ambiente
│   │   └── supabase.js          # Cliente Supabase restrito ao servidor
│   ├── data/
│   │   └── verifiedLocalData.js # Dados verificados locais (fallback transparente)
│   ├── middleware/
│   │   ├── cors.js              # Política de CORS com suporte a portas de desenvolvimento
│   │   ├── errorHandler.js      # Tratamento centralizado de erros e respostas 404
│   │   └── validate.js          # Validação de slugs, queries e payloads
│   ├── services/
│   │   ├── aiGatewayService.js  # Cliente HTTP para proxy do FastAPI (/health e /chat)
│   │   └── tourismService.js    # Resolução de dados Supabase com fallback local
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── eventsController.js
│   │   ├── freguesiasController.js
│   │   ├── healthController.js
│   │   ├── placesController.js
│   │   └── trailsController.js
│   └── routes/
│       ├── aiRoutes.js
│       ├── eventsRoutes.js
│       ├── freguesiasRoutes.js
│       ├── healthRoutes.js
│       ├── index.js             # Ponto central de montagem (/api)
│       ├── placesRoutes.js
│       └── trailsRoutes.js
└── tests/
    └── api.test.js              # Suite de testes automatizados (Node.js Test Runner)
```

---

## 2. Configuração de Variáveis de Ambiente

Cria o ficheiro `.env` na raiz da pasta `backend/` a partir do modelo fornecido:

No Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

Conteúdo de referência do ficheiro `.env`:
```ini
# Servidor Express
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000

# Conexão ao Microserviço FastAPI (IA / RAG)
FASTAPI_URL=http://127.0.0.1:8000

# Supabase (MANTIDO EXCLUSIVAMENTE NO SERVIDOR — NUNCA EXPÔR AO FRONTEND)
SUPABASE_URL=https://gvvlnotpvamruwoslmrk.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

---

## 3. Comandos de Execução no Windows (PowerShell / Prompt de Comando)

### Instalar Dependências
```powershell
cd "c:\Users\User\Desktop\Inteligencia artificial projeto\backend"
npm install
```

### Iniciar em Produção / Padrão
```powershell
npm start
```

### Iniciar em Modo de Desenvolvimento (Watch)
```powershell
npm run dev
```
O servidor ficará disponível em: `http://localhost:5000`

### Executar a Suite de Testes Automatizados
```powershell
npm test
```
Executa a validação nativa de todas as 17 asserções em `tests/api.test.js`.

---

## 4. Migração da Base de Dados Supabase (Opcional / Produção)

As tabelas de RAG existentes (`sources` e `knowledge_chunks`) são estritamente preservadas.
Para aplicar as novas tabelas turísticas na base de dados Supabase:

1. Aceda ao painel do Supabase do projeto (`https://supabase.com/dashboard`).
2. Abra o menu **SQL Editor**.
3. Execute o script `sql/01_tourist_schema.sql` para criar `freguesias`, `places`, `trails` e `events`.
4. Execute o script `sql/02_seed_tourist_data.sql` para carregar os registos territoriais e turísticos verificados.

> **Resiliência:** Se a migração ainda não tiver sido executada no Supabase, a API não falha nem gera erros 500 — devolve automaticamente os dados locais verificados com `meta: { source: "demonstracao_local" }`. Logo que a migração seja aplicada, a API passa dinamicamente a responder com `meta: { source: "supabase_db" }`.

---

## 5. Referência de Endpoints da API

Todos os endpoints utilizam envelopes JSON consistentes e códigos de estado HTTP semânticos (200, 400, 404, 503).

### Health Check
- `GET /api/health`
  - Responde com o estado do Gateway, estado da conexão ao Supabase e estado do FastAPI.

### Freguesias Oficiais
- `GET /api/freguesias`
  - Devolve as 4 freguesias oficiais: *Freixo de Espada à Cinta e Mazouco*, *Lagoaça e Fornos*, *Ligares* e *Poia*.

### Pontos de Interesse (Locais)
- `GET /api/places`
  - Parâmetros opcionais de pesquisa e filtro:
    - `?category=miradouro`
    - `?freguesia=freixo-mazouco`
    - `?search=seda`
    - `?includeDemo=false`
- `GET /api/places/:slug`
  - Detalhe de um local pelo slug ou ID (ex: `/api/places/penedo-durao`).
- `GET /api/pois` (Alias de compatibilidade com o frontend).

### Percursos e Rotas
- `GET /api/trails`
  - Percursos pedestres e circuitos recomendados.
  - Filtro opcional: `?difficulty=Facil`
- `GET /api/routes` (Alias de compatibilidade).

### Eventos e Festividades
- `GET /api/events`
  - Calendário cultural e feiras tradicionais (ex: Feira da Terra e da Seda, Amendoeiras em Flor).

### Assistente de IA (Gateway para FastAPI)
- `POST /api/chat`
  - Encaminha perguntas do assistente conversacional para o microserviço FastAPI (`/chat`).
  - Corpo da requisição:
    ```json
    {
      "question": "Onde posso ver tecer a seda artesanal?",
      "language": "pt"
    }
    ```
  - Em caso de indisponibilidade do FastAPI, devolve status `503 Service Unavailable` estruturado sem bloquear o servidor.
