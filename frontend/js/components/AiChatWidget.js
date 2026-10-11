/**
 * FREIXO AI — Widget Flutuante de Assistente com Inteligência Artificial
 * Conversação natural, sugestões em tempo real, distinção rigorosa de fontes
 * e preparação para proxy Node.js / FastAPI
 */

import { aiService } from '../services/aiService.js';
import { storageService } from '../services/storageService.js';
import { API_CONFIG } from '../config/apiConfig.js';

export class AiChatWidget {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.isGenerating = false;
  }

  init() {
    let mountPoint = document.getElementById('ai-chat-mount');
    if (!mountPoint) {
      mountPoint = document.createElement('div');
      mountPoint.id = 'ai-chat-mount';
      document.body.appendChild(mountPoint);
    }

    // Carregar histórico anterior
    const saved = storageService.getChatHistory();
    if (saved && saved.length > 0) {
      this.messages = saved;
    } else {
      this.messages = [
        {
          sender: 'ai',
          text: `Olá! Sou o **Freixo AI**, o teu assistente para conhecer o concelho de Freixo de Espada à Cinta.

Podes perguntar-me sobre a **arte da seda**, os **miradouros do Douro**, o **circuito manuelino**, a **gastronomia local** ou pedir um roteiro à medida.

*Nota: Em caso de indisponibilidade dos serviços de backend, respondo com base na documentação local de demonstração.*`,
          isDemo: true,
          source: 'demonstracao_inicial',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    }

    this.render(mountPoint);
    this.bindEvents();

    // Ouvinte global para abrir de qualquer botão no site
    window.addEventListener('freixo:openAiChat', (e) => {
      this.openChat();
      if (e.detail?.prompt) {
        this.handleUserPrompt(e.detail.prompt);
      }
    });

    // Ouvinte de mudança de conectividade da API
    window.addEventListener('freixo:apiStateChanged', (e) => {
      this.updateHeaderBadge(e.detail);
    });
  }

  getHeaderBadgeText() {
    if (API_CONFIG.STATE.nodeConnected && API_CONFIG.STATE.fastApiConnected) {
      return { label: 'Online • IA & Backend Ativos', dotColor: 'bg-emerald-400' };
    }
    if (API_CONFIG.STATE.nodeConnected) {
      return { label: 'Online • Gateway Node.js (IA em espera)', dotColor: 'bg-emerald-400' };
    }
    return { label: 'Demonstração Local • Backend Offline', dotColor: 'bg-amber-400' };
  }

  updateHeaderBadge(state) {
    const badgeEl = document.getElementById('ai-status-badge');
    const dotEl = document.getElementById('ai-status-dot');
    if (!badgeEl || !dotEl) return;

    if (state.nodeConnected && state.fastApiConnected) {
      badgeEl.textContent = 'Online • IA & Backend Ativos';
      dotEl.className = 'w-2 h-2 rounded-full bg-emerald-400';
    } else if (state.nodeConnected) {
      badgeEl.textContent = 'Online • Gateway Node.js (IA em espera)';
      dotEl.className = 'w-2 h-2 rounded-full bg-emerald-400';
    } else {
      badgeEl.textContent = 'Demonstração Local • Backend Offline';
      dotEl.className = 'w-2 h-2 rounded-full bg-amber-400';
    }
  }

  render(container) {
    const status = this.getHeaderBadgeText();

    container.innerHTML = `
      <!-- Botão Flutuante (Trigger) -->
      <button id="ai-chat-bubble" 
              class="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#182E22] text-[#FAF8F5] border border-[#DFBA71]/40 shadow-2xl hover:bg-[#234332] transition-all group"
              aria-label="Abrir Assistente com IA">
        <div class="relative w-7 h-7 rounded-full bg-[#234332] flex items-center justify-center text-sm font-bold text-[#DFBA71]">
          <span>✨</span>
          <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </div>
        <span class="text-xs font-semibold tracking-wider uppercase pr-1 hidden sm:inline">Perguntar à IA</span>
      </button>

      <!-- Painel de Conversação (Gaveta Flutuante) -->
      <section id="ai-chat-panel" 
               class="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[85vh] bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#182E22]/15 flex flex-col overflow-hidden transition-all duration-300 transform scale-90 opacity-0 pointer-events-none"
               role="dialog"
               aria-label="Janela de Conversação com o Assistente Freixo AI"
               aria-modal="false">
        
        <!-- Cabeçalho do Chat -->
        <div class="px-5 py-3.5 bg-[#182E22] text-[#FAF8F5] flex items-center justify-between border-b border-[#234332]">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#234332] border border-[#DFBA71]/30 flex items-center justify-center text-[#DFBA71] font-bold text-base shadow">
              <span>F</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-display font-bold text-sm tracking-wide leading-none text-[#FAF8F5]">Assistente Freixo AI</h3>
                <span id="ai-status-dot" class="w-2 h-2 rounded-full ${status.dotColor}"></span>
              </div>
              <p id="ai-status-badge" class="text-[10px] text-[#DDD4C7] mt-1 font-mono">${status.label}</p>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button id="ai-clear-btn" class="p-1.5 text-xs text-[#DDD4C7] hover:text-[#FAF8F5] rounded hover:bg-white/10 transition-colors" title="Limpar conversa" aria-label="Limpar histórico de conversa">
              🗑️
            </button>
            <button id="ai-close-btn" class="p-1.5 text-sm text-[#DDD4C7] hover:text-[#FAF8F5] rounded hover:bg-white/10 transition-colors" aria-label="Fechar janela de chat">
              ✕
            </button>
          </div>
        </div>

        <!-- Sugestões Rápidas (Chips de Pergunta) -->
        <div class="px-4 py-2.5 bg-[#F4EFEA] border-b border-[#182E22]/10 overflow-x-auto flex items-center gap-2 no-scrollbar text-[11px]" role="region" aria-label="Sugestões de perguntas">
          <button type="button" class="ai-chip flex-shrink-0 px-2.5 py-1 rounded-full bg-white border border-[#182E22]/15 text-[#182E22] hover:border-[#182E22] hover:bg-[#182E22] hover:text-white transition-all">
            🌿 Onde ver a seda a tecer?
          </button>
          <button type="button" class="ai-chip flex-shrink-0 px-2.5 py-1 rounded-full bg-white border border-[#182E22]/15 text-[#182E22] hover:border-[#182E22] hover:bg-[#182E22] hover:text-white transition-all">
            🦅 Como visitar o Penedo Durão?
          </button>
          <button type="button" class="ai-chip flex-shrink-0 px-2.5 py-1 rounded-full bg-white border border-[#182E22]/15 text-[#182E22] hover:border-[#182E22] hover:bg-[#182E22] hover:text-white transition-all">
            🍷 O que comer de típico?
          </button>
          <button type="button" class="ai-chip flex-shrink-0 px-2.5 py-1 rounded-full bg-white border border-[#182E22]/15 text-[#182E22] hover:border-[#182E22] hover:bg-[#182E22] hover:text-white transition-all">
            🏛️ Rota dos Portais Manuelinos
          </button>
        </div>

        <!-- Área de Mensagens -->
        <div id="ai-messages-container" class="flex-grow p-4 overflow-y-auto space-y-3.5 bg-[#FAF8F5]" role="log" aria-live="polite">
          <!-- As mensagens serão inseridas aqui dinamicamente -->
        </div>

        <!-- Indicador de Digitação da IA (Oculto por defeito) -->
        <div id="ai-typing-indicator" class="hidden px-5 py-2 flex items-center gap-2 text-xs text-[#7E9283] bg-[#FAF8F5]">
          <span class="font-medium text-[11px]">Freixo AI está a preparar a resposta...</span>
          <div class="flex items-center gap-1">
            <span class="ai-typing-dot"></span>
            <span class="ai-typing-dot"></span>
            <span class="ai-typing-dot"></span>
          </div>
        </div>

        <!-- Formulário de Envio -->
        <form id="ai-chat-form" class="p-3 bg-[#F4EFEA] border-t border-[#182E22]/10 flex items-center gap-2">
          <input type="text" 
                 id="ai-input" 
                 placeholder="Pergunta qualquer coisa sobre Freixo..." 
                 class="flex-grow px-3.5 py-2.5 rounded-xl bg-white border border-[#182E22]/20 text-xs sm:text-sm text-[#24211D] focus:outline-none focus:border-[#182E22] focus:ring-1 focus:ring-[#182E22] placeholder:text-[#7E9283]"
                 autocomplete="off"
                 aria-label="Mensagem para o assistente de IA" />
          
          <button type="submit" 
                  id="ai-send-btn" 
                  class="p-2.5 rounded-xl bg-[#182E22] text-[#FAF8F5] hover:bg-[#234332] transition-colors disabled:opacity-40 flex items-center justify-center flex-shrink-0"
                  aria-label="Enviar mensagem">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>

      </section>
    `;

    this.renderMessages();
  }

  bindEvents() {
    const bubble = document.getElementById('ai-chat-bubble');
    const closeBtn = document.getElementById('ai-close-btn');
    const clearBtn = document.getElementById('ai-clear-btn');
    const form = document.getElementById('ai-chat-form');
    const chips = document.querySelectorAll('.ai-chip');

    if (bubble) bubble.addEventListener('click', () => this.toggleChat());
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeChat());

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.messages = [{
          sender: 'ai',
          text: 'Conversa reiniciada. Em que posso ser útil agora?',
          isDemo: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
        storageService.saveChatHistory(this.messages);
        this.renderMessages();
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('ai-input');
        if (!input) return;
        const text = input.value.trim();
        if (text) {
          input.value = '';
          this.handleUserPrompt(text);
        }
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.trim().replace(/^[^\wÀ-ÿ]+/g, '');
        this.handleUserPrompt(text);
      });
    });

    // Fechar com Escape quando focado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    if (this.isOpen) this.closeChat();
    else this.openChat();
  }

  openChat() {
    const panel = document.getElementById('ai-chat-panel');
    const bubble = document.getElementById('ai-chat-bubble');
    if (!panel) return;

    this.isOpen = true;
    panel.classList.remove('pointer-events-none', 'opacity-0', 'scale-90');
    panel.classList.add('opacity-100', 'scale-100');
    if (bubble) bubble.classList.add('opacity-0', 'pointer-events-none');

    const input = document.getElementById('ai-input');
    if (input) setTimeout(() => input.focus(), 200);

    this.scrollToBottom();
  }

  closeChat() {
    const panel = document.getElementById('ai-chat-panel');
    const bubble = document.getElementById('ai-chat-bubble');
    if (!panel) return;

    this.isOpen = false;
    panel.classList.add('pointer-events-none', 'opacity-0', 'scale-90');
    panel.classList.remove('opacity-100', 'scale-100');
    if (bubble) bubble.classList.remove('opacity-0', 'pointer-events-none');
  }

  async handleUserPrompt(text) {
    if (this.isGenerating) return;

    // Adicionar mensagem do utilizador
    const userMsg = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.messages.push(userMsg);
    this.renderMessages();
    this.scrollToBottom();

    this.isGenerating = true;
    const indicator = document.getElementById('ai-typing-indicator');
    if (indicator) indicator.classList.remove('hidden');

    try {
      const history = this.messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const response = await aiService.sendMessage(text, history);

      const aiMsg = {
        sender: 'ai',
        text: response.reply,
        source: response.source,
        isConfirmed: response.isConfirmed,
        isDemo: response.isDemo,
        disclaimer: response.disclaimer,
        sources: response.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.messages.push(aiMsg);
      storageService.saveChatHistory(this.messages);
    } catch {
      this.messages.push({
        sender: 'ai',
        text: 'Lamento, ocorreu uma pequena indisponibilidade temporária. Por favor tenta novamente.',
        isDemo: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      this.isGenerating = false;
      if (indicator) indicator.classList.add('hidden');
      this.renderMessages();
      this.scrollToBottom();
    }
  }

  renderMessages() {
    const container = document.getElementById('ai-messages-container');
    if (!container) return;

    container.innerHTML = this.messages.map(m => {
      const isUser = m.sender === 'user';
      return `
        <div class="flex flex-col ${isUser ? 'items-end' : 'items-start'}">
          <div class="max-w-[88%] px-4 py-3 text-xs sm:text-[13px] leading-relaxed ${
            isUser ? 'chat-bubble-user' : 'chat-bubble-ai text-[#24211D]'
          }">
            ${this.formatMarkdown(m.text)}

            ${!isUser && m.isDemo ? `
              <div class="mt-2 pt-2 border-t border-[#182E22]/10 text-[10px] text-amber-800 font-sans flex items-center gap-1">
                <span>ℹ️</span>
                <span>Modo de demonstração local (Pendente de validação de API)</span>
              </div>
            ` : ''}

            ${!isUser && m.isError ? `
              <div class="mt-2 pt-2 border-t border-rose-300/50 text-[10px] text-rose-800 font-sans flex items-center gap-1">
                <span>⚠️</span>
                <span>Serviço de IA temporariamente indisponível</span>
              </div>
            ` : ''}

            ${!isUser && m.sources && m.sources.length ? `
              <div class="mt-2 pt-2 border-t border-[#182E22]/10 text-[10px] text-emerald-800 font-sans">
                <span class="font-bold">Fontes documentadas:</span> ${this.formatSources(m.sources)}
              </div>
            ` : ''}
          </div>
          <span class="text-[9px] text-[#7E9283] mt-1 px-1 font-mono">${m.timestamp}</span>
        </div>
      `;
    }).join('');
  }

  formatSources(sources) {
    if (!Array.isArray(sources) || sources.length === 0) return '';
    return sources.map(s => {
      if (typeof s === 'string') return s;
      const title = s.title || s.name || `Documento ${s.id || ''}`;
      const institution = s.institution ? ` (${s.institution})` : '';
      return `${title}${institution}`;
    }).join('; ');
  }

  formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n• (.*?)(?=\n|$)/g, '<br/>• $1')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  }

  scrollToBottom() {
    const container = document.getElementById('ai-messages-container');
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  }
}
