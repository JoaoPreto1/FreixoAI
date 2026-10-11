/**
 * FREIXO AI — Rodapé Editorial Partilhado
 * Inclui estado técnico real das APIs, coordenadas e informações de apoio
 */

import { API_CONFIG } from '../config/apiConfig.js';

export function renderFooter() {
  const mountPoint = document.getElementById('footer-mount');
  if (!mountPoint) return;

  const currentYear = new Date().getFullYear();

  const getStatusMarkup = (state) => {
    if (state.nodeConnected) {
      return `
        <div class="flex items-center justify-between mb-1">
          <span class="font-semibold text-[#FAF8F5] flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Arquitetura API
          </span>
          <span class="text-[10px] bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded text-emerald-300 font-mono">Node.js Ligado</span>
        </div>
        <p class="text-[#7E9283] text-[10px] leading-tight">
          Conexão ativa à API Node.js (Porta 5000). Consultas em tempo real ativas.
        </p>
      `;
    }
    
    if (state.fastApiConnected) {
      return `
        <div class="flex items-center justify-between mb-1">
          <span class="font-semibold text-[#FAF8F5] flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Arquitetura API
          </span>
          <span class="text-[10px] bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded text-emerald-300 font-mono">FastAPI IA Ligado</span>
        </div>
        <p class="text-[#7E9283] text-[10px] leading-tight">
          Conexão direta ao serviço de IA FastAPI (Porta 8000). Respostas geradas por modelo.
        </p>
      `;
    }

    return `
      <div class="flex items-center justify-between mb-1">
        <span class="font-semibold text-[#FAF8F5] flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          Estado dos Serviços
        </span>
        <span class="text-[10px] bg-amber-950/80 border border-amber-600/40 px-2 py-0.5 rounded text-[#DFBA71] font-mono">Demonstração Local</span>
      </div>
      <p class="text-[#7E9283] text-[10px] leading-tight">
        Backend offline. A operar com base documental local e fallback de demonstração (Pendente de ligação a API).
      </p>
    `;
  };

  mountPoint.innerHTML = `
    <footer class="bg-[#122419] text-[#EBE4DA] pt-16 pb-12 border-t border-[#234332]/50 mt-auto editorial-grain">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Bloco Principal Superior -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#234332]/40">
          
          <!-- Coluna 1: Identidade & Missão (5 cols) -->
          <div class="lg:col-span-5 flex flex-col gap-5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#182E22] border border-[#DFBA71]/40 flex items-center justify-center text-[#DFBA71]">
                <span class="font-display italic text-xl font-bold">F</span>
              </div>
              <div>
                <span class="font-display text-2xl font-bold tracking-tight text-[#FAF8F5]">FREIXO <span class="italic font-normal text-[#B65737]">AI</span></span>
                <p class="text-[10px] uppercase tracking-[0.2em] text-[#7E9283] font-semibold">Douro Internacional • Trás-os-Montes</p>
              </div>
            </div>
            
            <p class="text-sm text-[#DDD4C7] leading-relaxed max-w-md font-sans">
              Onde o Douro abraça a tradição. Uma plataforma turística concebida para valorizar o património milenar da seda, a monumentalidade dos portais manuelinos e as arribas graníticas de Freixo de Espada à Cinta.
            </p>

            <div class="flex items-center gap-2 text-xs text-[#DFBA71]">
              <span class="w-1.5 h-1.5 rounded-full bg-[#DFBA71]"></span>
              <span class="font-mono uppercase tracking-wider text-[11px]">41°05'32'' N • 6°48'28'' W • 550m Alt.</span>
            </div>
          </div>

          <!-- Coluna 2: Navegação Rápida (3 cols) -->
          <div class="lg:col-span-3 flex flex-col gap-4">
            <h4 class="text-xs font-semibold uppercase tracking-[0.18em] text-[#DFBA71]">Exploração</h4>
            <ul class="flex flex-col gap-2.5 text-sm text-[#DDD4C7]">
              <li><a href="index.html" class="hover:text-[#FAF8F5] transition-colors">Página Inicial</a></li>
              <li><a href="explorar.html" class="hover:text-[#FAF8F5] transition-colors">Lugares & Mapa Interativo</a></li>
              <li><a href="roteiro.html" class="hover:text-[#FAF8F5] transition-colors">Planeador de Roteiro AI</a></li>
              <li><a href="patrimonio.html" class="hover:text-[#FAF8F5] transition-colors">Ciclo da Seda & Portais</a></li>
              <li><a href="gastronomia.html" class="hover:text-[#FAF8F5] transition-colors">Vinhos Montes Ermos & Sabores</a></li>
            </ul>
          </div>

          <!-- Coluna 3: Contactos & Informação Local (4 cols) -->
          <div class="lg:col-span-4 flex flex-col gap-4">
            <h4 class="text-xs font-semibold uppercase tracking-[0.18em] text-[#DFBA71]">Posto de Turismo Oficial</h4>
            <div class="text-xs text-[#DDD4C7] space-y-2">
              <p class="flex items-start gap-2">
                <span class="text-[#DFBA71]">📍</span>
                <span>Largo do Convento de S. Francisco, 5180-112 Freixo de Espada à Cinta</span>
              </p>
              <p class="flex items-center gap-2">
                <span class="text-[#DFBA71]">📞</span>
                <span>(+351) 279 652 230 • turismo@cm-freixoespadaacinta.pt</span>
              </p>
              <p class="flex items-center gap-2">
                <span class="text-[#DFBA71]">⏰</span>
                <span>Terça a Domingo: 09h30 - 13h00 / 14h00 - 17h30 (Sujeito a confirmação sazonal)</span>
              </p>
            </div>

            <!-- Badge de Estado Real da API -->
            <div id="footer-api-status-box" class="mt-2 p-3 rounded-lg bg-[#182E22] border border-[#234332] text-[11px] text-[#DDD4C7]">
              ${getStatusMarkup(API_CONFIG.STATE)}
            </div>
          </div>
        </div>

        <!-- Linha Inferior: Direitos e Créditos -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7E9283]">
          <p>© ${currentYear} Freixo AI. Promovendo a identidade do Douro Internacional e o património transmontano.</p>
          <div class="flex items-center gap-4">
            <button class="hover:text-[#DDD4C7] transition-colors cursor-pointer text-xs" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" aria-label="Voltar ao início da página">
              Voltar ao Topo ↑
            </button>
          </div>
        </div>

      </div>
    </footer>
  `;

  // Ouvinte dinâmico para atualizar o status do backend em tempo real
  window.addEventListener('freixo:apiStateChanged', (e) => {
    const box = document.getElementById('footer-api-status-box');
    if (box && e.detail) {
      box.innerHTML = getStatusMarkup(e.detail);
    }
  });
}
