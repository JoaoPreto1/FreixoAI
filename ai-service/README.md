# Freixo AI — Serviço de IA (FastAPI & RAG)

Serviço de Inteligência Artificial e RAG (Retrieval-Augmented Generation) para o ecossistema **Freixo AI**, focado no apoio turístico, histórico e gastronómico de Freixo de Espada à Cinta.

## 🚀 Tecnologias

- **FastAPI**: Framework web Python de alta performance para APIs assíncronas.
- **Ollama**: Execução local de modelos de linguagem (`qwen3:4b` ou similar) e embeddings (`bge-m3`).
- **Supabase**: Base de dados vetorial (PostgreSQL com extensão `pgvector`) para busca de similaridade de fragmentos e conhecimento.
- **Pydantic & HTTPX**: Validação estrita de esquemas e requisições HTTP assíncronas.

## 📁 Estrutura

```text
ai-service/
├── app/
│   ├── __init__.py
│   ├── config.py       # Carregamento de variáveis de ambiente
│   ├── database.py     # Conexão com o Supabase
│   ├── ingestion.py    # Chunking e segmentação de texto
│   └── main.py         # Endpoints FastAPI (chat, ingestão, pesquisa semântica)
├── .env.example        # Exemplo de configuração de ambiente
├── .gitignore          # Ignora .venv, .env e caches Python
├── README.md           # Documentação do serviço
└── requirements.txt    # Dependências do projeto
```

## ⚙️ Configuração Local

1. Criar e ativar o ambiente virtual:
   ```bash
   python -m venv .venv
   # No Windows:
   .venv\Scripts\activate
   # No Linux/Mac:
   source .venv/bin/activate
   ```

2. Instalar as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Configurar as variáveis de ambiente:
   - Duplicar `.env.example` para `.env`
   - Preencher o URL e chave de API do Supabase e o endpoint do Ollama.

4. Iniciar o servidor em modo de desenvolvimento:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

A documentação interativa estará disponível em `http://localhost:8000/docs`.
