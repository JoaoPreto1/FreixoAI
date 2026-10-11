/**
 * FREIXO AI — Componente de Navegação Editorial
 * Header responsivo, gaveta móvel e indicador de favoritos em tempo real
 */

import { storageService } from '../services/storageService.js';

export function renderNavbar(activePage = 'index') {
  const mountPoint = document.getElementById('navbar-mount');
  if (!mountPoint) return;

  const favCount = storageService.getFavorites().length;

  const navLinks = [
    { id: 'index', href: 'index.html', label: 'Início' },
    { id: 'explorar', href: 'explorar.html', label: 'Explorar & Mapa' },
    { id: 'roteiro', href: 'roteiro.html', label: 'Roteiro AI' },
    { id: 'patrimonio', href: 'patrimonio.html', label: 'Seda & História' },
    { id: 'gastronomia', href: 'gastronomia.html', label: 'Gastronomia' }
  ];

  mountPoint.innerHTML = `
    <header class="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#182E22]/10 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Marca & Logótipo Editorial -->
          <a href="index.html" class="flex items-center gap-3.5 group">
            <div class="w-10 h-10 rounded-full bg-[#182E22] flex items-center justify-center text-[#FAF8F5] transition-transform duration-300 group-hover:scale-105 shadow-md">
              <span class="font-display italic text-xl font-bold text-[#DFBA71]">F</span>
            </div>
            <div class="flex flex-col">
              <span class="font-display text-xl font-bold tracking-tight text-[#182E22] leading-none">FREIXO <span class="italic font-normal text-[#B65737]">AI</span></span>
              <span class="text-[9px] uppercase tracking-[0.2em] text-[#7E9283] font-semibold mt-1">Douro Internacional</span>
            </div>
          </a>

          <!-- Links de Navegação Desktop -->
          <nav class="hidden md:flex items-center gap-1 lg:gap-2">
            ${navLinks.map(link => {
              const isActive = activePage === link.id;
              return `
                <a href="${link.href}" 
                   class="px-3.5 py-2 text-sm font-medium tracking-wide rounded-md transition-all duration-200 ${
                     isActive 
                       ? 'text-[#182E22] bg-[#182E22]/5 font-semibold border-b-2 border-[#182E22]' 
                       : 'text-[#3D3830] hover:text-[#182E22] hover:bg-[#182E22]/5'
                   }">
                  ${link.label}
                </a>
              `;
            }).join('')}
          </nav>

          <!-- Ações: Favoritos + Botão Assistente IA + Mobile Menu Toggle -->
          <div class="flex items-center gap-2.5 sm:gap-4">
            
            <!-- Contador de Favoritos -->
            <a href="explorar.html?view=favorites" 
               id="nav-fav-link" 
               class="relative p-2 text-[#24211D] hover:text-[#B65737] transition-colors rounded-full hover:bg-black/5" 
               title="Ver Lugares Guardados">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span id="nav-fav-badge" class="absolute -top-1 -right-1 bg-[#B65737] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                ${favCount}
              </span>
            </a>

            <!-- Botão Assistente IA -->
            <button id="nav-open-ai-btn" 
                    class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#182E22] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase hover:bg-[#234332] transition-all shadow-sm hover:shadow hover:scale-[1.02]">
              <span class="w-2 h-2 rounded-full bg-[#DFBA71] animate-pulse"></span>
              <span>Assistente AI</span>
            </button>

            <!-- Hamburguer Mobile -->
            <button id="mobile-menu-toggle" 
                    class="md:hidden p-2 rounded-lg text-[#182E22] hover:bg-[#182E22]/10 transition-colors" 
                    aria-label="Abrir Menu">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Menu Gaveta Mobile -->
      <div id="mobile-menu-drawer" class="hidden md:hidden border-t border-[#182E22]/10 bg-[#FAF8F5] px-4 pt-3 pb-6 shadow-xl transition-all">
        <div class="flex flex-col gap-2">
          ${navLinks.map(link => {
            const isActive = activePage === link.id;
            return `
              <a href="${link.href}" 
                 class="px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between ${
                   isActive ? 'bg-[#182E22] text-[#FAF8F5]' : 'text-[#24211D] hover:bg-[#182E22]/5'
                 }">
                <span>${link.label}</span>
                ${isActive ? '<span class="text-xs text-[#DFBA71]">●</span>' : ''}
              </a>
            `;
          }).join('')}
          
          <div class="pt-3 mt-2 border-t border-[#182E22]/10">
            <button id="mobile-open-ai-btn" 
                    class="w-full py-3 rounded-xl bg-[#182E22] text-[#FAF8F5] text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md">
              <span class="w-2 h-2 rounded-full bg-[#DFBA71] animate-pulse"></span>
              <span>Conversar com o Freixo AI</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  `;

  // Event Listeners
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-menu-drawer');
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('hidden');
    });
  }

  // Atualizar contador de favoritos reativo
  storageService.onFavoritesChange((favs) => {
    const badge = document.getElementById('nav-fav-badge');
    if (badge) {
      badge.textContent = favs.length;
      badge.classList.add('scale-125');
      setTimeout(() => badge.classList.remove('scale-125'), 200);
    }
  });

  // Abrir widget de IA
  const openAiBtn = document.getElementById('nav-open-ai-btn');
  const mobileOpenAiBtn = document.getElementById('mobile-open-ai-btn');
  const triggerAi = () => {
    window.dispatchEvent(new CustomEvent('freixo:openAiChat'));
    if (drawer && !drawer.classList.contains('hidden')) {
      drawer.classList.add('hidden');
    }
  };

  if (openAiBtn) openAiBtn.addEventListener('click', triggerAi);
  if (mobileOpenAiBtn) mobileOpenAiBtn.addEventListener('click', triggerAi);
}
