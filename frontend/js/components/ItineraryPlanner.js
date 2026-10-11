/**
 * FREIXO AI — Gerador e Visualizador de Roteiro Inteligente
 * Gera planos personalizados por dias, ritmo, interesses e mobilidade
 * com distinção clara entre estimativas de demonstração e dados confirmados
 */

import { aiService } from '../services/aiService.js';
import { storageService } from '../services/storageService.js';
import { showToast } from './Toast.js';

export class ItineraryPlanner {
  constructor(containerId = 'itinerary-planner-container') {
    this.containerId = containerId;
    this.currentPlan = null;
    this.isLoading = false;
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Verificar se existe plano previamente guardado
    this.currentPlan = storageService.getSavedItinerary();

    this.render(container);
    this.bindEvents();

    // Se já havia plano, renderizar os dias
    if (this.currentPlan) {
      this.renderPlanResults(this.currentPlan);
    }
  }

  render(container) {
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        <!-- Formulário de Personalização (4 colunas) -->
        <div class="lg:col-span-4 bg-[#FAF8F5] p-6 sm:p-7 rounded-2xl border border-[#182E22]/15 shadow-lg space-y-6">
          <div>
            <span class="editorial-badge bg-[#182E22]/5 text-[#182E22] mb-2">Motor Generativo IA</span>
            <h3 class="font-display text-2xl font-bold text-[#182E22]">Configurar Roteiro</h3>
            <p class="text-xs text-[#7E9283] mt-1 font-sans">Personaliza a tua visita aos vales e monumentos de Freixo.</p>
          </div>

          <form id="itinerary-form" class="space-y-5">
            
            <!-- Duração em Dias -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#182E22] mb-2" id="days-label">
                Duração da Estadia
              </label>
              <div class="grid grid-cols-4 gap-2" role="group" aria-labelledby="days-label">
                ${[1, 2, 3, 4].map(d => `
                  <button type="button" class="day-btn py-2.5 text-xs font-semibold rounded-xl border border-[#182E22]/20 hover:border-[#182E22] transition-all text-center ${
                    d === 2 ? 'bg-[#182E22] text-[#FAF8F5] border-[#182E22]' : 'bg-white text-[#24211D]'
                  }" data-days="${d}" aria-pressed="${d === 2 ? 'true' : 'false'}">
                    ${d} ${d === 1 ? 'Dia' : 'Dias'}
                  </button>
                `).join('')}
              </div>
              <input type="hidden" id="input-days" value="2" />
            </div>

            <!-- Estilo / Interesse Principal -->
            <div>
              <label for="input-interest" class="block text-xs font-bold uppercase tracking-wider text-[#182E22] mb-2">
                Perfil de Interesse
              </label>
              <select id="input-interest" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#182E22]/20 text-xs text-[#24211D] font-medium focus:ring-1 focus:ring-[#182E22] focus:outline-none">
                <option value="cultura">🏛️ Cultura, Seda & História Medieval</option>
                <option value="natureza">🦅 Natureza, Miradouros & Arribas</option>
                <option value="enogastronomia">🍷 Vinhos do Douro & Gastronomia</option>
                <option value="familia">🏖️ Família, Rio & Descontração</option>
              </select>
            </div>

            <!-- Ritmo da Visita -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#182E22] mb-2" id="pace-label">
                Ritmo da Experiência
              </label>
              <div class="grid grid-cols-3 gap-2" role="group" aria-labelledby="pace-label">
                <button type="button" class="pace-btn py-2 text-[11px] font-medium rounded-xl border border-[#182E22]/20 bg-white text-[#24211D]" data-pace="tranquilo" aria-pressed="false">
                  Tranquilo
                </button>
                <button type="button" class="pace-btn py-2 text-[11px] font-semibold rounded-xl border border-[#182E22] bg-[#182E22] text-[#FAF8F5]" data-pace="equilibrado" aria-pressed="true">
                  Equilibrado
                </button>
                <button type="button" class="pace-btn py-2 text-[11px] font-medium rounded-xl border border-[#182E22]/20 bg-white text-[#24211D]" data-pace="dinamico" aria-pressed="false">
                  Dinâmico
                </button>
              </div>
              <input type="hidden" id="input-pace" value="equilibrado" />
            </div>

            <!-- Modo de Deslocação -->
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-[#182E22] mb-2" id="mobility-label">
                Mobilidade
              </label>
              <div class="grid grid-cols-2 gap-2" role="group" aria-labelledby="mobility-label">
                <button type="button" class="mobility-btn py-2 text-xs font-semibold rounded-xl border border-[#182E22] bg-[#182E22] text-[#FAF8F5]" data-mobility="carro" aria-pressed="true">
                  🚗 Automóvel
                </button>
                <button type="button" class="mobility-btn py-2 text-xs font-medium rounded-xl border border-[#182E22]/20 bg-white text-[#24211D]" data-mobility="a-pe" aria-pressed="false">
                  🚶 A Pé no Centro
                </button>
              </div>
              <input type="hidden" id="input-mobility" value="carro" />
            </div>

            <!-- Botão de Ação -->
            <button type="submit" 
                    id="generate-plan-btn"
                    class="w-full py-3.5 px-6 rounded-xl bg-[#182E22] hover:bg-[#234332] text-[#FAF8F5] text-xs font-bold tracking-wider uppercase transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
              <span id="btn-spinner" class="hidden w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              <span id="btn-text">Gerar Roteiro com IA</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </form>
        </div>

        <!-- Visualizador do Roteiro Gerado (8 colunas) -->
        <div class="lg:col-span-8 flex flex-col space-y-6">
          
          <!-- Estado Vazio / Inicial -->
          <div id="itinerary-placeholder" class="bg-[#FAF8F5] p-10 rounded-2xl border border-[#182E22]/10 text-center space-y-4">
            <div class="w-14 h-14 rounded-full bg-[#182E22]/5 text-[#182E22] flex items-center justify-center mx-auto text-2xl">
              🗺️
            </div>
            <h4 class="font-display text-xl font-bold text-[#182E22]">Nenhum Roteiro Gerado Ainda</h4>
            <p class="text-xs text-[#7E9283] max-w-md mx-auto leading-relaxed">
              Configura a duração da tua estadia e clica em <strong>"Gerar Roteiro com IA"</strong>. O sistema apresentará uma proposta diária articulando os monumentos do centro e os miradouros das arribas.
            </p>
            <button type="button" id="quick-demo-btn" class="px-5 py-2.5 rounded-full bg-white border border-[#182E22]/20 hover:border-[#182E22] text-xs font-semibold text-[#182E22] transition-colors">
              Ver Exemplo Rápido de 2 Dias
            </button>
          </div>

          <!-- Conteúdo Renderizado dos Dias -->
          <div id="itinerary-days-container" class="hidden space-y-6">
            <!-- Injetado por renderPlanResults() -->
          </div>

        </div>

      </div>
    `;
  }

  bindEvents() {
    const form = document.getElementById('itinerary-form');
    const dayBtns = document.querySelectorAll('.day-btn');
    const paceBtns = document.querySelectorAll('.pace-btn');
    const mobilityBtns = document.querySelectorAll('.mobility-btn');
    const quickDemoBtn = document.getElementById('quick-demo-btn');

    // Seleção de Dias
    dayBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dayBtns.forEach(b => {
          b.className = 'day-btn py-2.5 text-xs font-semibold rounded-xl border border-[#182E22]/20 bg-white text-[#24211D] hover:border-[#182E22] transition-all text-center';
          b.setAttribute('aria-pressed', 'false');
        });
        btn.className = 'day-btn py-2.5 text-xs font-semibold rounded-xl border border-[#182E22] bg-[#182E22] text-[#FAF8F5] transition-all text-center';
        btn.setAttribute('aria-pressed', 'true');
        const inputDays = document.getElementById('input-days');
        if (inputDays) inputDays.value = btn.dataset.days;
      });
    });

    // Seleção de Ritmo
    paceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        paceBtns.forEach(b => {
          b.className = 'pace-btn py-2 text-[11px] font-medium rounded-xl border border-[#182E22]/20 bg-white text-[#24211D]';
          b.setAttribute('aria-pressed', 'false');
        });
        btn.className = 'pace-btn py-2 text-[11px] font-semibold rounded-xl border border-[#182E22] bg-[#182E22] text-[#FAF8F5]';
        btn.setAttribute('aria-pressed', 'true');
        const inputPace = document.getElementById('input-pace');
        if (inputPace) inputPace.value = btn.dataset.pace;
      });
    });

    // Seleção de Mobilidade
    mobilityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mobilityBtns.forEach(b => {
          b.className = 'mobility-btn py-2 text-xs font-medium rounded-xl border border-[#182E22]/20 bg-white text-[#24211D]';
          b.setAttribute('aria-pressed', 'false');
        });
        btn.className = 'mobility-btn py-2 text-xs font-semibold rounded-xl border border-[#182E22] bg-[#182E22] text-[#FAF8F5]';
        btn.setAttribute('aria-pressed', 'true');
        const inputMobility = document.getElementById('input-mobility');
        if (inputMobility) inputMobility.value = btn.dataset.mobility;
      });
    });

    // Submissão do Formulário
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleGenerate();
      });
    }

    if (quickDemoBtn) {
      quickDemoBtn.addEventListener('click', async () => {
        await this.handleGenerate();
      });
    }
  }

  async handleGenerate() {
    if (this.isLoading) return;

    const days = document.getElementById('input-days')?.value || 2;
    const interest = document.getElementById('input-interest')?.value || 'cultura';
    const pace = document.getElementById('input-pace')?.value || 'equilibrado';
    const mobility = document.getElementById('input-mobility')?.value || 'carro';

    const btn = document.getElementById('generate-plan-btn');
    const spinner = document.getElementById('btn-spinner');
    const text = document.getElementById('btn-text');

    this.isLoading = true;
    if (btn) btn.disabled = true;
    if (spinner) spinner.classList.remove('hidden');
    if (text) text.textContent = 'A gerar itinerário...';

    try {
      const plan = await aiService.generateItinerary({ days, interest, pace, mobility });
      this.currentPlan = plan;
      storageService.saveItinerary(plan);
      this.renderPlanResults(plan);
      showToast('Roteiro gerado com sucesso!', 'success');
    } catch {
      showToast('Erro ao gerar roteiro. Tenta novamente.', 'warning');
    } finally {
      this.isLoading = false;
      if (btn) btn.disabled = false;
      if (spinner) spinner.classList.add('hidden');
      if (text) text.textContent = 'Gerar Roteiro com IA';
    }
  }

  renderPlanResults(plan) {
    const placeholder = document.getElementById('itinerary-placeholder');
    const container = document.getElementById('itinerary-days-container');
    if (!container) return;

    if (placeholder) placeholder.classList.add('hidden');
    container.classList.remove('hidden');

    const isDemo = Boolean(plan.isDemo || plan.summary?.isDemonstration);

    container.innerHTML = `
      <!-- Cabeçalho do Roteiro Gerado -->
      <div class="p-6 rounded-2xl bg-[#182E22] text-[#FAF8F5] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span class="editorial-badge bg-[#DFBA71] text-[#182E22] font-bold border-none text-[10px]">
              ${plan.summary.days} DIAS SUGERIDOS
            </span>
            <span class="text-xs text-[#DFBA71]">• ${plan.summary.totalStops} Paragens Indicativas</span>
            ${isDemo ? `
              <span class="text-[9px] bg-white/10 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                Sugestão Demonstrativa
              </span>
            ` : ''}
          </div>
          <h3 class="font-display text-2xl font-bold tracking-tight">Roteiro Personalizado para Freixo</h3>
          <p class="text-xs text-[#DDD4C7] mt-1 font-sans">${plan.summary.seasonTip}</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="print-plan-btn" class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors" title="Imprimir Roteiro" type="button">
            🖨️ Imprimir
          </button>
          <button id="ask-ai-plan-btn" class="px-3.5 py-2 rounded-xl bg-[#DFBA71] hover:bg-[#cda453] text-xs font-bold text-[#182E22] transition-colors" type="button">
            Perguntar à IA ✨
          </button>
        </div>
      </div>

      <!-- Aviso de Rigor Informativo -->
      <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <span class="text-sm">ℹ️</span>
        <div>
          <span class="font-bold">Aviso de Planeamento:</span>
          <p class="text-[11px] leading-relaxed mt-0.5 text-amber-800">
            ${plan.summary.disclaimer || 'Este itinerário resulta de um modelo algorítmico demonstrativo. Os horários e trajetos são orientativos e estão sujeitos a validação presencial no Posto de Turismo de Freixo de Espada à Cinta.'}
          </p>
        </div>
      </div>

      <!-- Lista de Dias e Paragens -->
      <div class="space-y-6">
        ${plan.days.map(dayPlan => `
          <div class="bg-[#FAF8F5] rounded-2xl border border-[#182E22]/15 shadow-md overflow-hidden">
            
            <!-- Barra do Dia -->
            <div class="px-6 py-4 bg-[#F4EFEA] border-b border-[#182E22]/10 flex items-center justify-between">
              <div>
                <h4 class="font-display text-lg font-bold text-[#182E22]">${dayPlan.title}</h4>
                <p class="text-xs text-[#B65737] font-semibold">${dayPlan.theme}</p>
              </div>
              <span class="text-xs font-mono bg-[#182E22]/10 px-2.5 py-1 rounded-full text-[#182E22] font-bold">
                Dia ${dayPlan.day}
              </span>
            </div>

            <!-- Paragens do Dia -->
            <div class="p-6 space-y-5">
              ${dayPlan.stops.map(stop => `
                <div class="flex items-start gap-4 pb-4 border-b border-[#182E22]/10 last:border-none last:pb-0">
                  <div class="flex flex-col items-center">
                    <span class="text-xs font-mono font-bold text-[#182E22] bg-[#182E22]/5 px-2 py-1 rounded-md mb-1">
                      ${stop.time}
                    </span>
                    <div class="w-0.5 h-full bg-[#182E22]/15 flex-grow"></div>
                  </div>

                  <div class="flex-grow space-y-1">
                    <div class="flex items-center justify-between gap-2">
                      <h5 class="text-sm font-bold text-[#182E22]">${stop.title}</h5>
                      <span class="text-[10px] text-[#7E9283] font-medium">📍 ${stop.location}</span>
                    </div>
                    <p class="text-xs text-[#3D3830] leading-relaxed font-sans">${stop.description}</p>
                    ${stop.tip ? `
                      <p class="text-[11px] text-[#B65737] italic font-medium pt-0.5">💡 ${stop.tip}</p>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>

          </div>
        `).join('')}
      </div>
    `;

    // Ações dos botões do cabeçalho
    const printBtn = document.getElementById('print-plan-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const askAiBtn = document.getElementById('ask-ai-plan-btn');
    if (askAiBtn) {
      askAiBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('freixo:openAiChat', {
          detail: { prompt: `Podes dar-me mais detalhes e sugestões de restaurantes para o roteiro de ${plan.summary.days} dias que acabei de gerar?` }
        }));
      });
    }
  }
}
