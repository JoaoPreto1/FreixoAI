/**
 * FREIXO AI — Rodapé Editorial Partilhado
 * Inclui estado técnico das APIs, coordenadas e informações úteis
 */

import { API_CONFIG } from '../config/apiConfig.js';

export function renderFooter() {
  const mountPoint = document.getElementById('footer-mount');
  if (!mountPoint) return;

  const currentYear = new Date().getFullYear();

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
              Onde o Douro abraça a tradição. Uma plataforma turística inteligente concebida para revelar o património milenar da seda, a monumentalidade das arribas graníticas e a riqueza dos sabores de Freixo de Espada à Cinta.
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
            <h4 class="text-xs font-semibold uppercase tracking-[0.18em] text-[#DFBA71]">Posto de Turismo & Apoio</h4>
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
                <span>Terça a Domingo: 09h30 - 13h00 / 14h00 - 17h30</span>
              </p>
            </div>

            <!-- Badge de Prontidão Técnica / Arquitetura API -->
            <div class="mt-2 p-3 rounded-lg bg-[#182E22] border border-[#234332] text-[11px] text-[#DDD4C7]">
              <div class="flex items-center justify-between mb-1">
                <span class="font-semibold text-[#FAF8F5] flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Arquitetura API
                </span>
                <span class="text-[10px] bg-[#234332] px-1.5 py-0.5 rounded text-[#DFBA71] font-mono">Modo Demo Ativo</span>
              </div>
              <p class="text-[#7E9283] text-[10px] leading-tight">
                Frontend desacoplado com fallback local. Pronto para Node.js (porta 5000) e FastAPI IA (porta 8000).
              </p>
            </div>
          </div>
        </div>

        <!-- Linha Inferior: Direitos e Créditos -->
        <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7E9283]">
          <p>© ${currentYear} Freixo AI. Todos os direitos reservados. Promovendo a identidade do Douro Internacional.</p>
          <div class="flex items-center gap-4">
            <span class="hover:text-[#DDD4C7] transition-colors cursor-pointer" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">Voltar ao Topo ↑</span>
          </div>
        </div>

      </div>
    </footer>
  `;
}
