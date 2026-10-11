# Freixo AI — Frontend Editorial & Inteligente

Frontend desenvolvido para o projeto **Freixo AI** (Freixo de Espada à Cinta, Douro Internacional), focado numa experiência visual editorial de alta qualidade, acessibilidade, modularidade e integração preparada para serviços de backend (Node.js/Express e Python/FastAPI).

---

## 🏛️ Tecnologias Utilizadas

- **HTML5 Semântico:** Estruturação acessível e otimizada para SEO.
- **JavaScript Vanilla (ES Modules):** Arquitetura moderna sem dependência de frameworks pesados (sem React/Vue/TS nesta fase).
- **Tailwind CSS + CSS Personalizado (`assets/css/editorial.css`):**
  - Tipografia editorial refinada (*Playfair Display*, *Cormorant Garamond*, *Plus Jakarta Sans*, *Cinzel*).
  - Paleta de cores inspirada na paisagem raiana: *Pine Green* (`#182E22`), *Parchment* (`#FAF8F5`, `#F4EFEA`), *Terracotta* (`#B65737`) e *Gold* (`#DFBA71`).
  - Textura suave de papel (*paper grain*), micro-animações, leitor de áudio interativo e gaveta de chat com IA.
- **Leaflet.js:** Cartografia interativa com azulejos sem marcas de água e marcadores temáticos com popups informativos.

---

## 📁 Estrutura Modular do Projeto

```text
FreixoAI/
├── index.html                   # Página inicial editorial, narrativa da seda e destaques
├── explorar.html                # Mapa interativo, pesquisa em tempo real, filtros e favoritos
├── roteiro.html                 # Gerador de roteiros com IA e roteiros de autor
├── patrimonio.html              # Ciclo vivo da seda, 42 portais manuelinos e lendas
├── gastronomia.html             # Pratos típicos, vinhos Montes Ermos e guia de restaurantes
├── server.js                    # Servidor de desenvolvimento local em Node.js (sem dependências)
├── package.json                 # Scripts npm para execução
│
├── assets/
│   ├── css/
│   │   └── editorial.css        # Tokens de design, fontes, animações e componentes
│   └── images/                  # Fotografias de alta resolução de Freixo de Espada à Cinta
│
└── js/
    ├── app.js                   # Bootstrap principal da aplicação
    ├── config/
    │   └── apiConfig.js         # Configurações de endpoints e fallback resiliente
    ├── data/
    │   ├── mockPois.js          # Dados autênticos de pontos de interesse com GPS e áudio
    │   ├── mockRoutes.js        # Roteiros temáticos curados
    │   ├── mockGastronomy.js    # Especialidades, vinhos DOC Douro e restaurantes
    │   ├── mockHeritage.js      # Etapas do ciclo da seda, portais e lendas
    │   └── mockAiData.js        # Base de conhecimento de IA e motor de itinerários
    ├── services/
    │   ├── apiService.js        # Cliente HTTP com controlo de timeouts e status
    │   ├── poiService.js        # Abstração de acesso a POIs e conteúdos
    │   ├── aiService.js         # Abstração de conversação e geração de planos
    │   └── storageService.js    # Gestão de favoritos e histórico no LocalStorage
    └── components/
        ├── Navbar.js            # Cabeçalho responsivo com contador reativo de favoritos
        ├── Footer.js            # Rodapé editorial com estado da API
        ├── Toast.js             # Notificações visuais flutuantes
        ├── PoiModal.js          # Modal imersivo com áudio-guia e detalhes
        ├── PoiCardComponent.js  # Cartões editoriais de lugares
        ├── MapComponent.js      # Integração cartográfica Leaflet
        ├── AiChatWidget.js      # Assistente conversacional de IA flutuante
        └── ItineraryPlanner.js  # Planeador de roteiros por dias e ritmo
```

---

## 🚀 Como Executar Localmente

### Opção 1: Com Node.js
```bash
npm start
# ou
node server.js
```
Acede a `http://localhost:3000` no teu navegador.

### Opção 2: Com qualquer servidor estático
Como o projeto utiliza ES Modules nativos (`import`/`export`), pode ser servido por qualquer servidor HTTP estático (ex.: `npx serve .`, `Live Server` no VS Code, ou Python `python -m http.server 3000`).

---

## 🔌 Prontidão para Integração com os Backends

O ficheiro [`js/config/apiConfig.js`](file:///c:/Users/Pedro%20e%20Gil/Desktop/FreixoAI/js/config/apiConfig.js) define as portas e rotas esperadas para os serviços:

1. **API Node.js / Express (`http://localhost:5000/api`)**:
   - `GET /pois` — Lista de pontos de interesse
   - `GET /pois/:id` — Detalhe de um ponto
   - `GET /routes` — Roteiros sugeridos
   - `GET /gastronomy` — Restaurantes e vinhos
   - `GET /heritage` — Informação histórica e patrimonial

2. **Serviço Python / FastAPI (`http://localhost:8000/api/ai`)**:
   - `POST /chat` — Conversação e perguntas sobre o concelho
   - `POST /itinerary/generate` — Geração algorítmica de roteiros dinâmicos
   - `GET /health` — Verificação de disponibilidade do serviço

### Fallback Inteligente e Modo Autónomo
Graças à flag `USE_MOCK_FALLBACK: true` no [`apiConfig.js`](file:///c:/Users/Pedro%20e%20Gil/Desktop/FreixoAI/js/config/apiConfig.js), enquanto os backends estiverem desligados ou noutro computador, a aplicação funciona a 100% com os dados de demonstração locais, áudio-guias, mapa e motor de IA simulado. Quando os serviços reais forem iniciados nas portas 5000 e 8000, o frontend passa a comunicar diretamente com as APIs sem necessidade de reescrever lógica visual.
