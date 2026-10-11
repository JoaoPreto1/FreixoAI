# Freixo AI — Plataforma Inteligente de Turismo e Património

Plataforma inteligente e editorial desenvolvida para a valorização turística, histórica, gastronómica e cultural do concelho de **Freixo de Espada à Cinta** (Douro Internacional).

---

## 🏛️ Arquitetura do Repositório

O projeto está organizado numa estrutura modular e desacoplada em três componentes principais:

```text
FreixoAI/
├── frontend/               # Interface web editorial, mapas interativos e guias
├── backend/                # API de orquestração e regras de negócio (Node.js)
├── ai-service/             # Motor de IA conversacional e RAG (Python / FastAPI)
├── .gitignore              # Regras de exclusão global (segredos, venvs e caches)
└── README.md               # Documentação global do projeto
```

---

## 📦 Componentes do Projeto

### 1. `frontend/` (Interface do Utilizador)
Interface web focada em estética editorial, acessibilidade e interatividade:
- **Tecnologias:** HTML5 semântico, JavaScript moderno (ES Modules), Tailwind CSS, Leaflet.js (mapas interativos sem marcas de água).
- **Funcionalidades:**
  - Exploração interativa do território com filtros georreferenciados.
  - Ciclo vivo da seda, portais manuelinos e património arquitetónico.
  - Gastronomia regional e vinhos DOC Douro (Montes Ermos).
  - Planeador inteligente de itinerários e assistente de IA.
- **Como executar:**
  ```bash
  cd frontend
  npm start
  ```
  Acede em: `http://localhost:3000`

---

### 2. `backend/` (Serviço de Aplicação)
API em Node.js responsável pela orquestração de pedidos e serviços de aplicação.
- **Tecnologias:** Node.js (ES Modules), arquitetura modular (`controllers`, `routes`, `services`).
- **Como executar:**
  ```bash
  cd backend
  npm install
  npm start
  ```

---

### 3. `ai-service/` (Motor de Inteligência Artificial)
Serviço Python/FastAPI encarregue da recuperação aumentada por geração (RAG), embeddings e chat com modelos de linguagem.
- **Tecnologias:** FastAPI, Ollama (`qwen3:4b` e `bge-m3`), Supabase (armazenamento vetorial com `pgvector`), Pydantic.
- **Funcionalidades:**
  - Embeddings de documentos e património histórico.
  - Segmentação inteligente de textos (chunking com overlap).
  - Respostas fundamentadas com citação de fontes e contexto geográfico.
- **Como executar:**
  ```bash
  cd ai-service
  python -m venv .venv
  # Ativar o venv (Windows: .venv\Scripts\activate | Linux: source .venv/bin/activate)
  pip install -r requirements.txt
  cp .env.example .env # Configurar credenciais
  uvicorn app.main:app --reload --port 8000
  ```
  Documentação da API: `http://localhost:8000/docs`

---

## 🔒 Segurança e Boas Práticas

- Ficheiros contendo credenciais ou segredos (`.env`, chaves de API do Supabase) **nunca** são enviados para o repositório. Use sempre os ficheiros `.env.example` como base.
- Ambientes virtuais (`.venv/`) e dependências (`node_modules/`) estão devidamente ignorados no `.gitignore`.
