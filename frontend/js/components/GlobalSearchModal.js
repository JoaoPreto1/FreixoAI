import { searchService } from '../services/searchService.js';

export class GlobalSearchModal {
  constructor() {
    this.modalEl = null;
    this.inputEl = null;
    this.resultsEl = null;
    this.spinnerEl = null;
    this.clearBtn = null;
    this.debounceTimer = null;
    this.isOpen = false;
    this.selectedIndex = -1;
    this.currentItems = [];
  }

  init() {
    if (document.getElementById('freixo-search-modal')) return;

    this.render();
    this.bindEvents();
  }

  render() {
    const backdrop = document.createElement('div');
    backdrop.id = 'freixo-search-modal';
    backdrop.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-start justify-center p-4 sm:p-6 md:p-20 overflow-y-auto animate-fade-in';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Pesquisa Global Freixo AI');

    backdrop.innerHTML = `
      <div class="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl border border-[#182E22]/15 shadow-2xl overflow-hidden flex flex-col my-auto sm:my-0 max-h-[85vh]">
        
        <!-- Barra de Entrada de Pesquisa -->
        <div class="p-4 sm:p-5 border-b border-[#182E22]/10 bg-white flex items-center gap-3">
          <span class="text-lg text-[#182E22]/60 select-none">🔍</span>
          
          <input type="text"
                 id="global-search-input"
                 placeholder="Pesquisar locais, miradouros, trilhos, eventos, seda..."
                 autocomplete="off"
                 class="w-full text-sm sm:text-base bg-transparent text-[#182E22] placeholder:text-[#7E9283] focus:outline-none font-medium"
                 aria-label="Campo de pesquisa global" />

          <span id="global-search-spinner" class="hidden w-4 h-4 rounded-full border-2 border-[#182E22] border-t-transparent animate-spin flex-shrink-0"></span>

          <button type="button" 
                  id="global-search-clear" 
                  class="hidden p-1.5 rounded-full text-xs text-[#7E9283] hover:text-[#182E22] hover:bg-black/5 cursor-pointer" 
                  aria-label="Limpar termo de pesquisa">
            ✕
          </button>

          <button type="button"
                  id="global-search-close"
                  class="p-1 rounded-full text-xs text-[#7E9283] hover:text-[#182E22] hover:bg-black/5 transition-colors cursor-pointer flex items-center justify-center w-7 h-7"
                  aria-label="Fechar pesquisa global">
            ✕
          </button>

          <kbd class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-[#7E9283] bg-black/5 border border-[#182E22]/10 rounded-md">ESC</kbd>
        </div>

        <!-- Área de Resultados -->
        <div id="global-search-results" class="p-4 sm:p-6 overflow-y-auto flex-grow space-y-6">
          <div class="text-center py-8 text-xs text-[#7E9283] space-y-2">
            <p class="font-medium text-[#182E22]">Escreve para pesquisar em todo o património do concelho</p>
            <p class="text-[11px] text-[#7E9283]">Experimenta: <span class="font-bold cursor-pointer hover:text-[#B65737] search-suggestion">Penedo Durão</span>, <span class="font-bold cursor-pointer hover:text-[#B65737] search-suggestion">Seda</span>, <span class="font-bold cursor-pointer hover:text-[#B65737] search-suggestion">Alpajares</span>, <span class="font-bold cursor-pointer hover:text-[#B65737] search-suggestion">Amendoeiras</span></p>
          </div>
        </div>

        <!-- Rodapé do Modal -->
        <div class="px-5 py-3 bg-[#F4EFEA] border-t border-[#182E22]/10 flex flex-wrap items-center justify-between text-[11px] text-[#7E9283]">
          <div class="flex items-center gap-3">
            <span><kbd class="font-mono bg-white px-1.5 py-0.5 rounded border border-[#182E22]/10">↑</kbd> <kbd class="font-mono bg-white px-1.5 py-0.5 rounded border border-[#182E22]/10">↓</kbd> navegar</span>
            <span><kbd class="font-mono bg-white px-1.5 py-0.5 rounded border border-[#182E22]/10">Enter</kbd> abrir</span>
          </div>
          <a href="pesquisa.html" class="hover:text-[#182E22] font-semibold underline underline-offset-2">
            Página de Pesquisa Completa →
          </a>
        </div>

      </div>
    `;

    document.body.appendChild(backdrop);

    this.modalEl = backdrop;
    this.inputEl = document.getElementById('global-search-input');
    this.resultsEl = document.getElementById('global-search-results');
    this.spinnerEl = document.getElementById('global-search-spinner');
    this.clearBtn = document.getElementById('global-search-clear');
    this.closeBtn = document.getElementById('global-search-close');
  }

  bindEvents() {
    window.addEventListener('freixo:openSearch', (e) => {
      this.open(e.detail?.query || '');
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      });
    }

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl || e.target.closest('#global-search-close')) {
        this.close();
      }
    });

    this.inputEl.addEventListener('input', () => {
      const q = this.inputEl.value.trim();
      this.clearBtn.classList.toggle('hidden', !q);
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.performSearch(q), 180);
    });

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateResults(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateResults(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.selectCurrent();
      }
    });

    this.clearBtn.addEventListener('click', () => {
      this.inputEl.value = '';
      this.clearBtn.classList.add('hidden');
      this.inputEl.focus();
      this.performSearch('');
    });

    this.resultsEl.addEventListener('click', (e) => {
      const suggestion = e.target.closest('.search-suggestion');
      if (suggestion) {
        const text = suggestion.textContent.trim();
        this.inputEl.value = text;
        this.clearBtn.classList.remove('hidden');
        this.performSearch(text);
      }
    });
  }

  open(initialQuery = '') {
    this.isOpen = true;
    this.modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (initialQuery) {
      this.inputEl.value = initialQuery;
      this.clearBtn.classList.remove('hidden');
      this.performSearch(initialQuery);
    }

    setTimeout(() => {
      this.inputEl.focus();
      this.inputEl.select();
    }, 50);
  }

  close() {
    this.isOpen = false;
    this.modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  async performSearch(query) {
    if (!query) {
      this.resultsEl.innerHTML = `
        <div class="text-center py-8 text-xs text-[#7E9283] space-y-2">
          <p class="font-medium text-[#182E22]">Escreve para pesquisar em todo o património do concelho</p>
          <p class="text-[11px] text-[#7E9283]">Experimenta: <span class="font-bold cursor-pointer hover:text-[#B65737] search-suggestion">Penedo Durão</span>, <span class="font-bold cursor-pointer hover:text-[#B65737] search-suggestion">Seda</span>, <span class="font-bold cursor-pointer hover:text-[#B65737] search-suggestion">Alpajares</span>, <span class="font-bold cursor-pointer hover:text-[#B65737] search-suggestion">Amendoeiras</span></p>
        </div>
      `;
      this.currentItems = [];
      this.selectedIndex = -1;
      return;
    }

    this.spinnerEl.classList.remove('hidden');

    try {
      const res = await searchService.search(query);
      this.renderResults(res, query);
    } catch (err) {
      this.resultsEl.innerHTML = `
        <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          Ocorreu uma falha na pesquisa. Por favor, tenta novamente.
        </div>
      `;
    } finally {
      this.spinnerEl.classList.add('hidden');
    }
  }

  renderResults({ results, total, source }, query) {
    this.selectedIndex = -1;
    this.currentItems = [];

    if (total === 0) {
      this.resultsEl.innerHTML = `
        <div class="text-center py-10 space-y-3">
          <span class="text-3xl block">🔍</span>
          <h4 class="font-display text-base font-bold text-[#182E22]">Nenhum resultado para «${escapeHtml(query)}»</h4>
          <p class="text-xs text-[#7E9283] max-w-sm mx-auto leading-relaxed">
            Verifica a ortografia ou experimenta termos mais gerais como <strong>seda</strong>, <strong>miradouro</strong>, <strong>igreja</strong> ou <strong>douro</strong>.
          </p>
        </div>
      `;
      return;
    }

    const { places = [], trails = [], events = [], freguesias = [] } = results;
    let html = '';

    if (places.length > 0) {
      html += `
        <div>
          <div class="flex items-center justify-between mb-2 pb-1 border-b border-[#182E22]/10">
            <span class="text-xs font-bold uppercase tracking-wider text-[#182E22] flex items-center gap-1.5">
              <span>🏛️</span> Locais de Interesse (${places.length})
            </span>
          </div>
          <div class="space-y-1.5">
            ${places.map(p => {
              const url = `detalhe.html?slug=${p.slug || p.id}`;
              this.currentItems.push(url);
              const idx = this.currentItems.length - 1;
              return `
                <a href="${url}" data-search-index="${idx}" class="search-result-item flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-[#F4EFEA] border border-[#182E22]/5 transition-colors group">
                  <div class="flex items-center gap-3">
                    <img src="${p.image || 'assets/images/penedo-durao.png'}" alt="" class="w-10 h-10 rounded-lg object-cover bg-[#182E22]/10" />
                    <div>
                      <h5 class="text-xs font-bold text-[#182E22] group-hover:text-[#B65737] leading-snug">${highlightMatch(p.title, query)}</h5>
                      <span class="text-[10px] text-[#7E9283]">${p.location || 'Freixo de Espada à Cinta'} • ${p.categoryLabel || p.category || 'Património'}</span>
                    </div>
                  </div>
                  <span class="text-xs text-[#7E9283] group-hover:translate-x-0.5 transition-transform">→</span>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (trails.length > 0) {
      html += `
        <div>
          <div class="flex items-center justify-between mb-2 pb-1 border-b border-[#182E22]/10">
            <span class="text-xs font-bold uppercase tracking-wider text-[#182E22] flex items-center gap-1.5">
              <span>🥾</span> Trilhos & Percursos (${trails.length})
            </span>
          </div>
          <div class="space-y-1.5">
            ${trails.map(t => {
              const url = `trilho.html?slug=${t.slug || t.id}`;
              this.currentItems.push(url);
              const idx = this.currentItems.length - 1;
              return `
                <a href="${url}" data-search-index="${idx}" class="search-result-item flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-[#F4EFEA] border border-[#182E22]/5 transition-colors group">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      ${t.distance || 'PR'}
                    </div>
                    <div>
                      <h5 class="text-xs font-bold text-[#182E22] group-hover:text-[#B65737] leading-snug">${highlightMatch(t.title, query)}</h5>
                      <span class="text-[10px] text-[#7E9283]">${t.difficulty || 'Homologado'} • ${t.duration || 'Percurso'}</span>
                    </div>
                  </div>
                  <span class="text-xs text-[#7E9283] group-hover:translate-x-0.5 transition-transform">→</span>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (events.length > 0) {
      html += `
        <div>
          <div class="flex items-center justify-between mb-2 pb-1 border-b border-[#182E22]/10">
            <span class="text-xs font-bold uppercase tracking-wider text-[#182E22] flex items-center gap-1.5">
              <span>🎪</span> Eventos & Tradições (${events.length})
            </span>
          </div>
          <div class="space-y-1.5">
            ${events.map(e => {
              const url = `evento.html?slug=${e.slug || e.id}`;
              this.currentItems.push(url);
              const idx = this.currentItems.length - 1;
              return `
                <a href="${url}" data-search-index="${idx}" class="search-result-item flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-[#F4EFEA] border border-[#182E22]/5 transition-colors group">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-base">
                      📅
                    </div>
                    <div>
                      <h5 class="text-xs font-bold text-[#182E22] group-hover:text-[#B65737] leading-snug">${highlightMatch(e.title, query)}</h5>
                      <span class="text-[10px] text-[#7E9283]">${e.edition_dates || e.periodicity || 'Agenda Anual'}</span>
                    </div>
                  </div>
                  <span class="text-xs text-[#7E9283] group-hover:translate-x-0.5 transition-transform">→</span>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    if (freguesias.length > 0) {
      html += `
        <div>
          <div class="flex items-center justify-between mb-2 pb-1 border-b border-[#182E22]/10">
            <span class="text-xs font-bold uppercase tracking-wider text-[#182E22] flex items-center gap-1.5">
              <span>📍</span> Freguesias (${freguesias.length})
            </span>
          </div>
          <div class="space-y-1.5">
            ${freguesias.map(f => {
              const url = `explorar.html?freguesia=${f.id}`;
              this.currentItems.push(url);
              const idx = this.currentItems.length - 1;
              return `
                <a href="${url}" data-search-index="${idx}" class="search-result-item flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-[#F4EFEA] border border-[#182E22]/5 transition-colors group">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg bg-pine-100 text-pine-900 font-bold flex items-center justify-center text-sm">
                      📍
                    </div>
                    <div>
                      <h5 class="text-xs font-bold text-[#182E22] group-hover:text-[#B65737] leading-snug">${highlightMatch(f.name, query)}</h5>
                      <span class="text-[10px] text-[#7E9283]">Explorar no mapa do concelho</span>
                    </div>
                  </div>
                  <span class="text-xs text-[#7E9283] group-hover:translate-x-0.5 transition-transform">→</span>
                </a>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    this.resultsEl.innerHTML = html;
  }

  navigateResults(direction) {
    if (this.currentItems.length === 0) return;

    this.selectedIndex += direction;
    if (this.selectedIndex < 0) this.selectedIndex = this.currentItems.length - 1;
    if (this.selectedIndex >= this.currentItems.length) this.selectedIndex = 0;

    const items = this.resultsEl.querySelectorAll('.search-result-item');
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add('ring-2', 'ring-[#182E22]', 'bg-[#F4EFEA]');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('ring-2', 'ring-[#182E22]', 'bg-[#F4EFEA]');
      }
    });
  }

  selectCurrent() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.currentItems.length) {
      const url = this.currentItems[this.selectedIndex];
      if (url) window.location.href = url;
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlightMatch(text, query) {
  if (!text || !query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escaped.replace(regex, '<mark class="bg-[#DFBA71]/40 text-[#182E22] rounded px-0.5 font-bold">$1</mark>');
}

export const globalSearchModal = new GlobalSearchModal();
