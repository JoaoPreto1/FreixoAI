# Freixo AI — Plataforma Inteligente de Turismo e Património

Plataforma inteligente de valorização turística, histórica, gastronómica e cultural do concelho de **Freixo de Espada à Cinta**, no Douro Internacional.

O Freixo AI combina uma interface web interativa, uma API REST e um assistente de inteligência artificial com recuperação aumentada por geração (RAG), com o objetivo de disponibilizar informação turística útil, contextualizada e fundamentada em fontes verificáveis.

## Arquitetura do projeto

```text
FreixoAI/
├── frontend/       # Interface web, mapas e componentes turísticos
├── backend/        # API REST Node.js/Express e gateway de IA
├── ai-service/     # Serviço de IA Python/FastAPI e RAG
├── .gitignore
└── README.md
```

### Tecnologias

| Componente | Tecnologias |
|---|---|
| Frontend | HTML5, CSS, JavaScript ES Modules, Tailwind CSS, Leaflet |
| Backend | Node.js, Express, API REST |
| Serviço de IA | Python, FastAPI, Ollama |
| Modelos locais | `qwen3:4b` e `bge-m3:latest` |
| Base de dados | Supabase, PostgreSQL e pgvector |

## Pré-requisitos

Antes de iniciar a aplicação, instala ou confirma que tens:

- Node.js e npm.
- Python e pip.
- Ollama para executar os modelos de IA localmente.
- Acesso ao projeto Supabase.
- As dependências dos componentes instaladas e os respetivos ficheiros `.env` configurados.

O projeto foi testado num ambiente Windows com PowerShell. Os comandos seguintes pressupõem que o repositório está localizado em:

```text
C:\Users\User\Desktop\Inteligencia artificial projeto
```

Se a pasta estiver noutro local, ajusta os caminhos.

## 1. Configuração inicial

Abre um terminal na raiz do projeto.

### Backend

```powershell
cd backend
npm ci
```

Se não existir um `package-lock.json`, utiliza `npm install`.

Confirma que o ficheiro `backend/.env` existe e contém as variáveis necessárias à API e à ligação ao Supabase.

### Serviço de IA

```powershell
cd ..\ai-service
```

Se o ambiente virtual já existir, não precisas de o recriar.

```powershell
.\.venv\Scripts\Activate.ps1
```

Se ainda não existir, cria-o e instala as dependências:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
```

Confirma que o ficheiro `ai-service/.env` contém as configurações necessárias ao Ollama e ao Supabase.

> Não publiques ficheiros `.env`, chaves privadas ou credenciais no GitHub. Utiliza os ficheiros `.env.example` apenas como modelos de configuração.

### Frontend

```powershell
cd ..\frontend
npm install
```

Confirma os scripts disponíveis no `package.json` com `npm run`.

## 2. Como iniciar toda a aplicação

**Cada serviço deve correr num terminal separado.** Não feches os terminais enquanto estiveres a utilizar a aplicação localmente.

### Terminal 1 — Ollama

O Ollama pode iniciar automaticamente com o Windows.

Confirma que está disponível:

```powershell
ollama list
```

Devem estar disponíveis os modelos:

```text
qwen3:4b
bge-m3:latest
```

Se o Ollama não estiver em execução, inicia-o:

```powershell
ollama serve
```

Se aparecer um erro a indicar que a porta `11434` já está a ser utilizada, verifica se o Ollama já está a correr. Não inicies outra instância se o serviço já estiver disponível.

### Terminal 2 — Serviço de IA (FastAPI)

```powershell
cd "C:\Users\User\Desktop\Inteligencia artificial projeto\ai-service"
.\.venv\Scripts\Activate.ps1
py -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

O comando `app.main:app` é importante porque o ficheiro principal está em `ai-service/app/main.py`.

Endereços:

- Serviço: http://127.0.0.1:8000
- Documentação da API: http://127.0.0.1:8000/docs
- Estado da ligação à base de dados: http://127.0.0.1:8000/db-health

### Terminal 3 — Backend (Node.js/Express)

```powershell
cd "C:\Users\User\Desktop\Inteligencia artificial projeto\backend"
npm start
```

O servidor deverá indicar que está ativo em `http://localhost:5000` e que o gateway de IA utiliza `http://127.0.0.1:8000`.

Endereços:

- API: http://127.0.0.1:5000
- Estado da API: http://127.0.0.1:5000/api/health

### Terminal 4 — Frontend

```powershell
cd "C:\Users\User\Desktop\Inteligencia artificial projeto\frontend"
npm start
```

Se o comando não estiver definido, executa `npm run` para consultar os scripts disponíveis no projeto.

Quando o servidor iniciar, abre:

**http://localhost:3000**

## 3. Ordem recomendada de arranque

```text
Ollama
   ↓
FastAPI — porta 8000
   ↓
Node.js/Express — porta 5000
   ↓
Frontend — porta 3000
```

O frontend comunica com o backend, que funciona como gateway para o serviço de IA. O FastAPI utiliza o Ollama para os modelos locais e o Supabase para a recuperação de conhecimento, conforme a configuração do projeto.

## 4. Verificar se os serviços estão operacionais

### Testar o Ollama

```powershell
ollama list
Invoke-RestMethod http://127.0.0.1:11434/api/tags
```

Testar a geração de texto:

```powershell
ollama run qwen3:4b "Responde apenas: Freixo AI operacional"
```

### Testar o FastAPI

Abre http://127.0.0.1:8000/docs e confirma que a documentação da API é apresentada.

Para verificar a ligação ao Supabase, abre:

http://127.0.0.1:8000/db-health

Uma resposta com `status: ok` e `supabase: connected` indica que a ligação à base de dados está funcional. Não garante, por si só, que a recuperação RAG esteja a devolver documentos relevantes.

### Testar o backend

```powershell
Invoke-RestMethod http://127.0.0.1:5000/api/health
```

Confirma que a API responde e verifica o estado dos serviços e das tabelas indicados no resultado.

### Testar a aplicação

1. Abre http://localhost:3000.
2. Navega pelas páginas e funcionalidades turísticas.
3. Experimenta a pesquisa global, os favoritos e o planeador de itinerários.
4. Envia uma pergunta ao assistente de IA.
5. Confirma que as fontes apresentadas correspondem a documentos reais e verificáveis.

## 5. Testes automatizados

### Backend

```powershell
cd "C:\Users\User\Desktop\Inteligencia artificial projeto\backend"
npm test
```

Para consultar os scripts disponíveis:

```powershell
npm run
```

Executa os testes do frontend apenas através dos scripts efetivamente definidos no respetivo `package.json`.

## 6. Problemas comuns

### Erro: `Could not import module "main"`

O ficheiro principal do serviço de IA está dentro da pasta `app`. Utiliza:

```powershell
py -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Executa o comando a partir da pasta `ai-service`, com o ambiente virtual ativado.

### Erro: porta `11434` já está a ser utilizada

O Ollama poderá já estar a correr. Confirma com:

```powershell
ollama list
```

Se os modelos aparecerem e o serviço responder, não precisas de executar novamente `ollama serve`.

### Erro: tempo limite excedido na resposta do Ollama

Testa diretamente o modelo:

```powershell
ollama run qwen3:4b "Responde apenas: teste"
```

Se o modelo responder, mas o chat continuar a falhar, verifica os terminais do FastAPI e do backend. A causa poderá estar no tempo limite configurado ou na comunicação entre serviços.

### Erro: microserviço de IA temporariamente indisponível

Confirma, pela seguinte ordem:

1. Ollama disponível na porta `11434`.
2. FastAPI disponível na porta `8000`.
3. Backend disponível na porta `5000`.
4. Configuração do gateway no ficheiro `.env` do backend.
5. Logs dos serviços quando envias uma pergunta pelo frontend.

### Modo de demonstração local

Se a interface apresentar uma indicação de modo de demonstração, confirma no backend se os dados estão a ser obtidos da API real ou de um mecanismo de fallback local.

Não consideres a IA totalmente validada apenas porque gera texto. É necessário confirmar a recuperação de documentos, a qualidade das fontes e o comportamento perante perguntas sem informação suficiente.

### Supabase indisponível

Confirma o estado do projeto no painel do Supabase, as variáveis de ambiente e o resultado de `/db-health`.

Não executes scripts SQL de inicialização ou expansão sem verificar primeiro as tabelas e os registos existentes.

## 7. Segurança e boas práticas

- Nunca publiques credenciais, tokens ou ficheiros `.env`.
- Mantém os ficheiros `.env` excluídos do Git.
- Não exponhas serviços locais ou credenciais administrativas diretamente à Internet.
- Restringe CORS aos domínios necessários em produção.
- Utiliza HTTPS e configura cabeçalhos de segurança no ambiente de produção.
- Valida e sanitiza os dados recebidos pela API.
- Utiliza fontes verificáveis para informação histórica, patrimonial e turística.
- Não apresentes informação gerada pelo modelo como facto confirmado sem validação documental.

## Estado do projeto

O Freixo AI utiliza uma arquitetura modular com frontend, backend, serviço de IA local e integração com o Supabase.

A validação funcional deve abranger os quatro serviços, as rotas da API, a recuperação RAG, as fontes apresentadas ao utilizador e a integridade dos dados turísticos.

O objetivo é disponibilizar uma plataforma turística útil, acessível e multilingue, com informação fundamentada e sem inventar factos históricos.

---

**Freixo AI — Descobrir Freixo de Espada à Cinta com conhecimento, contexto e autenticidade.**

