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

    this.currentPlan = storageService.getSavedItinerary();

    this.render(container);
    this.bindEvents();
    this.updateSavedBadge();

    const urlParams = new URLSearchParams(window.location.search);
    const rawDays = urlParams.get('dias') || urlParams.get('days');
    const rawInterest = urlParams.get('interesse') || urlParams.get('interest');
    const rawPace = urlParams.get('ritmo') || urlParams.get('pace');
    const rawMobility = urlParams.get('mobilidade') || urlParams.get('mobility');
    const rawSeed = urlParams.get('semente') || urlParams.get('seed');

    if (rawDays || rawInterest || rawSeed || rawPace || rawMobility) {
      const parsedDays = rawDays ? parseInt(rawDays, 10) : 2;
      const days = Number.isInteger(parsedDays) ? Math.min(4, Math.max(1, parsedDays)) : 2;
      const validInterests = ['cultura', 'natureza', 'enogastronomia', 'familia', 'geral'];
      const interest = validInterests.includes(rawInterest) ? rawInterest : 'cultura';
      const validPaces = ['tranquilo', 'equilibrado', 'dinamico'];
      const pace = validPaces.includes(rawPace) ? rawPace : 'equilibrado';
      const validMobilities = ['carro', 'a-pe'];
      const mobility = validMobilities.includes(rawMobility) ? rawMobility : 'carro';
      const parsedSeed = rawSeed ? parseInt(rawSeed, 10) : undefined;
      const seed = Number.isInteger(parsedSeed) ? parsedSeed : undefined;

      this.applyUrlConfigAndGenerate({ days, interest, pace, mobility, seed });
      return;
    }

    if (this.currentPlan && this.currentPlan.days) {
      this.renderPlanResults(this.currentPlan);
    }
  }

  render(container) {
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        <div id="itinerary-form-col" class="lg:col-span-4 bg-[#FAF8F5] p-6 sm:p-7 rounded-2xl border border-[#182E22]/15 shadow-lg space-y-6">
          <div class="flex items-start justify-between gap-2 pb-2 border-b border-[#182E22]/10">
            <div>
              <span class="editorial-badge bg-[#182E22]/5 text-[#182E22] mb-1">Motor Territorial & IA</span>
              <h3 class="font-display text-2xl font-bold text-[#182E22]">Configurar Roteiro</h3>
            </div>
            <button type="button" id="open-saved-itins-modal-btn" class="px-2.5 py-1.5 rounded-xl border border-[#182E22]/20 hover:border-[#182E22] bg-white text-xs font-semibold text-[#182E22] flex items-center gap-1.5 transition-colors shadow-sm" title="Consultar roteiros guardados">
              <span>📚</span>
              <span>Guardados (<span id="saved-itins-badge">0</span>)</span>
            </button>
          </div>
          <p class="text-xs text-[#7E9283] font-sans -mt-2">Personaliza a tua visita a Freixo de Espada à Cinta com base em dados turísticos oficiais e IA local.</p>

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

            <div>
              <label for="input-interest" class="block text-xs font-bold uppercase tracking-wider text-[#182E22] mb-2">
                Perfil de Interesse
              </label>
              <select id="input-interest" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#182E22]/20 text-xs text-[#24211D] font-medium focus:ring-1 focus:ring-[#182E22] focus:outline-none">
                <option value="cultura">🏛️ Cultura, Seda & História Manuelina</option>
                <option value="natureza">🦅 Natureza, Miradouros & Arribas do Douro</option>
                <option value="enogastronomia">🍷 Vinhos do Douro & Gastronomia Tradicional</option>
                <option value="familia">🏖️ Família, Rio Douro & Lazer Fluvial</option>
                <option value="geral">✨ Destaques Gerais do Concelho</option>
              </select>
            </div>

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
              <p class="text-[10px] text-[#7E9283] mt-1 italic">
                * Locais exteriores (ex: Penedo Durão e Congida) requerem viatura.
              </p>
            </div>

            <div class="space-y-2 pt-1">
              <button type="submit" 
                      id="generate-plan-btn"
                      class="w-full py-3.5 px-6 rounded-xl bg-[#182E22] hover:bg-[#234332] text-[#FAF8F5] text-xs font-bold tracking-wider uppercase transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                <span id="btn-spinner" class="hidden w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                <span id="btn-text">Gerar Roteiro Oficial</span>
                <span class="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button type="button" 
                      id="form-regenerate-btn"
                      class="w-full py-2.5 px-4 rounded-xl border border-[#182E22]/20 hover:border-[#182E22] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#182E22] transition-all flex items-center justify-center gap-2"
                      title="Explora outra combinação válida mantendo as tuas preferências">
                <span>🎲</span>
                <span>Gerar Outra Versão</span>
              </button>
            </div>
          </form>
        </div>

        <div class="lg:col-span-8 flex flex-col space-y-6" id="itinerary-output-wrapper">
          
          <div id="itinerary-error-box" class="hidden bg-amber-50 border border-amber-300 p-7 rounded-2xl space-y-4">
            <div class="flex items-start gap-3">
              <span class="text-2xl">⚠️</span>
              <div>
                <h4 class="font-display text-lg font-bold text-amber-950">Não foi possível gerar o itinerário</h4>
                <p id="itinerary-error-message" class="text-xs text-amber-900 mt-1 leading-relaxed">
                  Ocorreu uma falha na ligação aos serviços de dados.
                </p>
              </div>
            </div>
            <div class="pt-2">
              <button type="button" id="itinerary-retry-btn" class="px-5 py-2.5 bg-[#182E22] text-[#FAF8F5] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#234332] transition-colors">
                🔄 Tentar Novamente
              </button>
            </div>
          </div>

          <div id="itinerary-placeholder" class="bg-[#FAF8F5] p-10 rounded-2xl border border-[#182E22]/10 text-center space-y-4">
            <div class="w-14 h-14 rounded-full bg-[#182E22]/5 text-[#182E22] flex items-center justify-center mx-auto text-2xl">
              🗺️
            </div>
            <h4 class="font-display text-xl font-bold text-[#182E22]">Nenhum Roteiro Gerado Ainda</h4>
            <p class="text-xs text-[#7E9283] max-w-md mx-auto leading-relaxed">
              Configura a duração da tua estadia e clica em <strong>"Gerar Roteiro Oficial"</strong>. O sistema consultará a base de dados de locais verificados e estruturará uma visita diária coerente com tempos reais.
            </p>
            <button type="button" id="quick-demo-btn" class="px-5 py-2.5 rounded-full bg-white border border-[#182E22]/20 hover:border-[#182E22] text-xs font-semibold text-[#182E22] transition-colors">
              Gerar Exemplo Rápido de 2 Dias
            </button>
          </div>

          <div id="itinerary-days-container" class="hidden space-y-6">
          </div>

        </div>

      </div>

      <!-- Modal de Roteiros Guardados -->
      <div id="saved-itins-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true" aria-label="Roteiros Guardados">
        <div class="bg-[#FAF8F5] rounded-3xl border border-[#182E22]/15 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden">
          <div class="p-5 border-b border-[#182E22]/10 bg-white flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="text-xl">📚</span>
              <div>
                <h4 class="font-display text-lg font-bold text-[#182E22]">Os Teus Roteiros Guardados</h4>
                <p class="text-[11px] text-[#7E9283]">Consulta, recupera ou remove roteiros anteriores.</p>
              </div>
            </div>
            <button id="close-saved-itins-modal-btn" class="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-xs text-[#7E9283] hover:text-[#182E22] flex items-center justify-center transition-colors">✕</button>
          </div>
          <div id="saved-itins-list" class="p-5 overflow-y-auto space-y-3 flex-grow">
          </div>
          <div class="p-4 bg-[#F4EFEA] border-t border-[#182E22]/10 flex items-center justify-between text-xs text-[#7E9283]">
            <span>Armazenamento local seguro e privado</span>
            <button id="clear-saved-itins-btn" class="text-terracotta hover:underline font-semibold" type="button">Limpar Histórico</button>
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
    const retryBtn = document.getElementById('itinerary-retry-btn');
    const formRegenerateBtn = document.getElementById('form-regenerate-btn');

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

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleGenerate();
      });
    }

    if (formRegenerateBtn) {
      formRegenerateBtn.addEventListener('click', async () => {
        await this.handleGenerate({ isRegenerate: true });
      });
    }

    if (quickDemoBtn) {
      quickDemoBtn.addEventListener('click', async () => {
        await this.handleGenerate();
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', async () => {
        await this.handleGenerate();
      });
    }

    const openSavedModalBtn = document.getElementById('open-saved-itins-modal-btn');
    const closeSavedModalBtn = document.getElementById('close-saved-itins-modal-btn');
    const clearSavedBtn = document.getElementById('clear-saved-itins-btn');
    const savedModal = document.getElementById('saved-itins-modal');

    if (openSavedModalBtn) {
      openSavedModalBtn.addEventListener('click', () => this.openSavedModal());
    }

    if (closeSavedModalBtn) {
      closeSavedModalBtn.addEventListener('click', () => this.closeSavedModal());
    }

    if (savedModal) {
      savedModal.addEventListener('click', (e) => {
        if (e.target === savedModal) this.closeSavedModal();
      });
    }

    if (clearSavedBtn) {
      clearSavedBtn.addEventListener('click', () => {
        storageService.clearSavedItineraries();
        this.renderSavedList();
        this.updateSavedBadge();
        showToast('Histórico de roteiros limpo.', 'info');
      });
    }

    window.addEventListener('freixo:itinerariesUpdated', () => {
      this.updateSavedBadge();
    });
  }

  async handleGenerate({ isRegenerate = false, seed } = {}) {
    if (this.isLoading) return;

    const days = parseInt(document.getElementById('input-days')?.value || '2', 10);
    const interest = document.getElementById('input-interest')?.value || 'cultura';
    const pace = document.getElementById('input-pace')?.value || 'equilibrado';
    const mobility = document.getElementById('input-mobility')?.value || 'carro';

    const chosenSeed = seed !== undefined ? seed : (isRegenerate ? Math.floor(Math.random() * 1000000) : undefined);

    const btn = document.getElementById('generate-plan-btn');
    const formRegenerateBtn = document.getElementById('form-regenerate-btn');
    const resultRegenerateBtn = document.getElementById('regenerate-plan-btn');
    const quickDemoBtn = document.getElementById('quick-demo-btn');
    const retryBtn = document.getElementById('itinerary-retry-btn');
    const spinner = document.getElementById('btn-spinner');
    const text = document.getElementById('btn-text');
    const errorBox = document.getElementById('itinerary-error-box');

    this.isLoading = true;
    if (btn) btn.disabled = true;
    if (formRegenerateBtn) formRegenerateBtn.disabled = true;
    if (resultRegenerateBtn) resultRegenerateBtn.disabled = true;
    if (quickDemoBtn) quickDemoBtn.disabled = true;
    if (retryBtn) retryBtn.disabled = true;

    if (spinner) spinner.classList.remove('hidden');
    if (text) text.textContent = isRegenerate ? 'A gerar nova versão...' : 'A gerar itinerário...';
    if (errorBox) errorBox.classList.add('hidden');

    try {
      const plan = await aiService.generateItinerary({ days, interest, pace, mobility, seed: chosenSeed });
      this.currentPlan = plan;
      storageService.saveItinerary(plan);
      this.updateSavedBadge();
      this.renderPlanResults(plan);
      showToast(isRegenerate ? 'Nova versão gerada com sucesso!' : 'Roteiro gerado com sucesso!', 'success');
    } catch (err) {
      console.error('[ItineraryPlanner] Erro na geração:', err);
      this.showError(err.message || 'Falha ao comunicar com o servidor. Por favor tenta novamente.');
      showToast('Erro ao gerar roteiro. Tenta novamente.', 'warning');
    } finally {
      this.isLoading = false;
      if (btn) btn.disabled = false;
      if (formRegenerateBtn) formRegenerateBtn.disabled = false;
      if (resultRegenerateBtn) resultRegenerateBtn.disabled = false;
      if (quickDemoBtn) quickDemoBtn.disabled = false;
      if (retryBtn) retryBtn.disabled = false;

      if (spinner) spinner.classList.add('hidden');
      if (text) text.textContent = 'Gerar Roteiro Oficial';
    }
  }

  showError(message) {
    const placeholder = document.getElementById('itinerary-placeholder');
    const container = document.getElementById('itinerary-days-container');
    const errorBox = document.getElementById('itinerary-error-box');
    const errorMsg = document.getElementById('itinerary-error-message');

    if (placeholder) placeholder.classList.add('hidden');
    if (container) container.classList.add('hidden');
    if (errorBox) {
      errorBox.classList.remove('hidden');
      if (errorMsg) errorMsg.textContent = message;
    }
  }

  renderPlanResults(plan) {
    const placeholder = document.getElementById('itinerary-placeholder');
    const errorBox = document.getElementById('itinerary-error-box');
    const container = document.getElementById('itinerary-days-container');
    if (!container) return;

    if (placeholder) placeholder.classList.add('hidden');
    if (errorBox) errorBox.classList.add('hidden');
    container.classList.remove('hidden');

    const summary = plan.summary || {};
    const meta = plan.meta || {};
    const daysList = plan.days || [];
    const isAiEnhanced = Boolean(meta.is_ai_enhanced || meta.generation_method === 'ia_personalizada');
    const isSupabase = meta.source === 'supabase_db';

    let methodBadge = '';
    if (isAiEnhanced) {
      methodBadge = `
        <span class="inline-flex items-center gap-1.5 text-[11px] bg-purple-950/80 text-purple-200 border border-purple-400/40 px-3 py-0.5 rounded-full font-semibold shadow-sm">
          ✨ IA Personalizada (${meta.model || 'qwen3:4b'})
        </span>
      `;
    } else {
      methodBadge = `
        <span class="inline-flex items-center gap-1.5 text-[11px] bg-emerald-950/80 text-emerald-200 border border-emerald-400/40 px-3 py-0.5 rounded-full font-semibold shadow-sm">
          🏛️ Algoritmo Territorial (Rigor Oficial & Contingência)
        </span>
      `;
    }

    const sourceBadge = isSupabase
      ? `<span class="text-[10px] bg-white/10 text-[#FAF8F5] px-2 py-0.5 rounded-full font-mono">Base de Dados Supabase</span>`
      : `<span class="text-[10px] bg-white/10 text-amber-200 px-2 py-0.5 rounded-full font-mono">Catálogo Oficial Verificado</span>`;

    const seedBadge = meta.seed != null
      ? `<span class="text-[10px] bg-white/10 text-[#DDD4C7] px-2 py-0.5 rounded-full font-mono" title="Semente de geração">Semente: #${meta.seed}</span>`
      : '';

    const timingBadge = meta.timings?.total_ms != null
      ? `<span class="text-[10px] bg-white/10 text-emerald-200 px-2 py-0.5 rounded-full font-mono" title="Tempo total: ${meta.timings.total_ms}ms (Node: ${meta.timings.node_processing_ms}ms, IA: ${meta.timings.ollama_inference_ms || meta.timings.fastapi_response_ms}ms)">⚡ ${(meta.timings.total_ms / 1000).toFixed(2)}s</span>`
      : '';

    container.innerHTML = `
      <div class="p-6 sm:p-7 rounded-2xl bg-[#182E22] text-[#FAF8F5] shadow-xl space-y-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span class="editorial-badge bg-[#DFBA71] text-[#182E22] font-bold border-none text-[10px]">
                ${summary.days || 1} ${summary.days === 1 ? 'DIA' : 'DIAS'}
              </span>
              <span class="text-xs text-[#DFBA71] font-medium">• ${summary.totalStops || 0} Paragens Estruturadas</span>
              ${methodBadge}
              ${sourceBadge}
              ${seedBadge}
              ${timingBadge}
            </div>
            <h3 class="font-display text-2xl sm:text-3xl font-bold tracking-tight">Roteiro Oficial de Freixo</h3>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button id="save-plan-btn" class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1.5" type="button" title="Guardar este roteiro no histórico">
              💾 <span>Guardar</span>
            </button>
            <button id="share-plan-btn" class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1.5" type="button" title="Copiar link partilhável reproduzível">
              🔗 <span>Partilhar</span>
            </button>
            <button id="regenerate-plan-btn" class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1.5" type="button" title="Gerar Outra Versão mantendo as preferências">
              🎲 <span>Gerar outra versão</span>
            </button>
            <button id="copy-plan-btn" class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1.5" type="button" title="Copiar Itinerário em Texto">
              📋 <span>Copiar</span>
            </button>
            <button id="print-plan-btn" class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1.5" title="Imprimir Roteiro" type="button">
              🖨️ <span>Imprimir</span>
            </button>
            <button id="ask-ai-plan-btn" class="px-3.5 py-2 rounded-xl bg-[#DFBA71] hover:bg-[#cda453] text-xs font-bold text-[#182E22] transition-colors flex items-center gap-1" type="button">
              Perguntar à IA ✨
            </button>
          </div>
        </div>

        ${summary.overview ? `
          <div class="p-4 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-[#DDD4C7] leading-relaxed font-sans italic">
            "${summary.overview}"
          </div>
        ` : ''}

        ${summary.seasonTip ? `
          <p class="text-xs text-[#DFBA71] font-sans flex items-center gap-1.5 pt-1">
            <span>💡</span> <span>${summary.seasonTip}</span>
          </p>
        ` : ''}

        ${summary.catalogNote ? `
          <p class="text-[11px] text-[#DDD4C7]/80 font-sans italic pt-0.5">
            ℹ️ ${summary.catalogNote}
          </p>
        ` : ''}
      </div>

      <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
        <div class="flex items-start gap-2.5">
          <span class="text-base">ℹ️</span>
          <div class="space-y-1">
            <span class="font-bold">Rigor Factual & Mobilidade:</span>
            <p class="text-[11px] leading-relaxed text-amber-800">
              ${summary.disclaimer || 'Os horários e acessos baseiam-se em registos oficiais. Recomendamos confirmação sazonal no Posto de Turismo Municipal.'}
            </p>
            ${summary.mobility === 'a-pe' ? `
              <p class="text-[11px] font-semibold text-amber-900 bg-amber-100/70 p-2 rounded-lg mt-1">
                🚶 Nota de Mobilidade a Pé: Selecionaste modo pedonal. Os locais no centro histórico da vila são facilmente percorridos a pé; no entanto, locais como o Miradouro do Penedo Durão, a Praia da Congida ou os Alpajares distam vários quilómetros e exigem viatura ou táxi.
              </p>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="space-y-6">
        ${daysList.map(dayPlan => `
          <div class="bg-[#FAF8F5] rounded-2xl border border-[#182E22]/15 shadow-md overflow-hidden">
            
            <div class="px-6 py-4 bg-[#F4EFEA] border-b border-[#182E22]/10 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 class="font-display text-lg font-bold text-[#182E22]">${dayPlan.title}</h4>
                <p class="text-xs text-[#B65737] font-semibold">${dayPlan.theme}</p>
              </div>
              <span class="text-xs font-mono bg-[#182E22]/10 px-3 py-1 rounded-full text-[#182E22] font-bold">
                Dia ${dayPlan.day}
              </span>
            </div>

            <div class="p-6 space-y-6">
              ${(dayPlan.stops || []).map((stop, sIdx) => {
                const isTrail = stop.category === 'trilho' || stop.category?.toLowerCase().includes('percurso');
                const detailUrl = isTrail
                  ? `trilho.html?slug=${encodeURIComponent(stop.poiSlug || stop.poiId)}`
                  : `detalhe.html?slug=${encodeURIComponent(stop.poiSlug || stop.poiId)}`;
                const mapUrl = isTrail
                  ? `explorar.html?trilho=${encodeURIComponent(stop.poiSlug || stop.poiId)}`
                  : `explorar.html?slug=${encodeURIComponent(stop.poiSlug || stop.poiId)}`;

                return `
                <div class="flex items-start gap-4 pb-6 border-b border-[#182E22]/10 last:border-none last:pb-0">
                  
                  <div class="flex flex-col items-center flex-shrink-0">
                    <span class="text-xs font-mono font-bold text-[#182E22] bg-[#182E22]/5 px-2.5 py-1 rounded-md mb-2 border border-[#182E22]/10">
                      ${stop.time}
                    </span>
                    <div class="w-0.5 h-full bg-[#182E22]/15 flex-grow"></div>
                  </div>

                  <div class="flex-grow space-y-3">
                    
                    <!-- Deslocação / Acesso Prévio -->
                    ${stop.travelNote ? `
                      <div class="flex items-center gap-2 p-2 rounded-lg bg-[#F0EBE1] border border-[#182E22]/10 text-[11px] text-[#4A443C]">
                        <span>🚗</span>
                        <span><strong>Deslocação:</strong> ${stop.travelNote}</span>
                      </div>
                    ` : ''}

                    <!-- Bloco da Visita / Atividade -->
                    <div class="flex flex-wrap items-baseline justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-mono font-bold text-[#B65737] bg-[#B65737]/10 px-2 py-0.5 rounded">
                          #${stop.order || (sIdx + 1)}
                        </span>
                        <h5 class="text-base font-bold text-[#182E22]">${stop.title}</h5>
                        ${isTrail ? `
                          <span class="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                            🥾 Percurso Pedestre
                          </span>
                        ` : ''}
                      </div>
                      <span class="text-[11px] text-[#7E9283] font-medium flex items-center gap-1">
                        📍 ${stop.location}
                      </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-[#182E22]/10">
                      <div>
                        <span class="font-bold text-[#182E22]">⏱️ Duração da Visita:</span>
                        <span class="text-[#3D3830] ml-1">${stop.estimatedVisitTime || '1h'}</span>
                      </div>
                      <div>
                        <span class="font-bold text-[#182E22]">🕒 Acesso:</span>
                        <span class="text-[#3D3830] ml-1">${stop.openingHours || 'Acesso livre e permanente'}</span>
                      </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-3 text-[11px] text-[#7E9283]">
                      <span>♿ ${stop.accessibility || 'Acesso regular'}</span>
                      <span>•</span>
                      <span>🏷️ ${stop.categoryLabel || stop.category}</span>
                    </div>

                    <p class="text-xs text-[#3D3830] leading-relaxed font-sans">
                      ${stop.description}
                    </p>

                    <!-- Razão Factual da Seleção -->
                    ${stop.reason ? `
                      <div class="p-2.5 rounded-lg bg-[#182E22]/5 border-l-2 border-[#182E22] text-[11px] text-[#182E22]">
                        <strong>🧭 Razão da seleção:</strong> ${stop.reason}
                      </div>
                    ` : ''}

                    ${stop.tip ? `
                      <p class="text-[11px] text-[#B65737] italic font-medium">
                        💡 <strong>Dica prática:</strong> ${stop.tip}
                      </p>
                    ` : ''}

                    ${stop.limitation ? `
                      <div class="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                        <span>⚠️</span>
                        <span><strong>Nota de Mobilidade:</strong> ${stop.limitation}</span>
                      </div>
                    ` : ''}

                    <!-- Ações de Navegação -->
                    <div class="pt-2 flex flex-wrap items-center gap-2">
                      <a href="${detailUrl}" 
                         class="inline-flex items-center gap-1 text-xs font-semibold text-[#182E22] hover:text-[#B65737] bg-white hover:bg-[#FAF8F5] px-3.5 py-1.5 rounded-xl border border-[#182E22]/20 hover:border-[#B65737] transition-all shadow-sm">
                        <span>${isTrail ? 'Ver Ficha do Percurso' : 'Ver Ficha do Local'}</span>
                        <span>↗</span>
                      </a>
                      <a href="${mapUrl}" 
                         class="inline-flex items-center gap-1 text-xs font-semibold text-[#182E22] hover:text-[#B65737] bg-white hover:bg-[#FAF8F5] px-3.5 py-1.5 rounded-xl border border-[#182E22]/20 hover:border-[#B65737] transition-all shadow-sm">
                        <span>Ver no Mapa</span>
                        <span>🗺️</span>
                      </a>
                    </div>

                  </div>
                </div>
              `}).join('')}
            </div>

          </div>
        `).join('')}
      </div>
    `;

    const copyBtn = document.getElementById('copy-plan-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.copyPlanToClipboard(plan);
      });
    }

    const saveBtn = document.getElementById('save-plan-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        storageService.saveItinerary(plan);
        this.updateSavedBadge();
        showToast('Roteiro guardado com sucesso no histórico!', 'success');
      });
    }

    const shareBtn = document.getElementById('share-plan-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const url = new URL(window.location.href);
        url.searchParams.set('dias', summary.days || 2);
        url.searchParams.set('interesse', summary.interest || document.getElementById('input-interest')?.value || 'cultura');
        url.searchParams.set('ritmo', summary.pace || 'equilibrado');
        url.searchParams.set('mobilidade', summary.mobility || 'carro');
        if (meta.seed != null) {
          url.searchParams.set('semente', meta.seed);
        }
        const shareUrl = url.toString();

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareUrl);
          } else {
            prompt('Copia o link de partilha do roteiro:', shareUrl);
          }
          showToast('Link de partilha copiado! O roteiro é reproduzido com a mesma semente.', 'success');
        } catch {
          prompt('Copia o link de partilha do roteiro:', shareUrl);
        }
      });
    }

    const printBtn = document.getElementById('print-plan-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const regenerateBtn = document.getElementById('regenerate-plan-btn');
    if (regenerateBtn) {
      regenerateBtn.addEventListener('click', () => {
        this.handleGenerate({ isRegenerate: true });
      });
    }

    const askAiBtn = document.getElementById('ask-ai-plan-btn');
    if (askAiBtn) {
      askAiBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('freixo:openAiChat', {
          detail: { prompt: `Podes dar-me mais pormenores e sugestões gastronómicas para o roteiro oficial de ${summary.days} dias que acabei de gerar?` }
        }));
      });
    }
  }

  /**
   * Formata e copia o itinerário em texto para a área de transferência
   */
  async copyPlanToClipboard(plan) {
    const summary = plan.summary || {};
    const meta = plan.meta || {};
    const daysList = plan.days || [];

    let text = `========================================================\n`;
    text += `FREIXO AI — ROTEIRO OFICIAL DE VISITA\n`;
    text += `Duração: ${summary.days} dias | Ritmo: ${summary.pace} | Mobilidade: ${summary.mobility}\n`;
    text += `Método de Geração: ${meta.generation_method === 'ia_personalizada' ? 'IA Personalizada' : 'Algoritmo Territorial'}\n`;
    if (meta.seed != null) text += `Semente: #${meta.seed}\n`;
    text += `========================================================\n\n`;

    if (summary.overview) {
      text += `${summary.overview}\n\n`;
    }

    daysList.forEach(day => {
      text += `--------------------------------------------------------\n`;
      text += `${day.title} (${day.theme})\n`;
      text += `--------------------------------------------------------\n`;
      (day.stops || []).forEach(stop => {
        text += `• ${stop.time} — ${stop.title}\n`;
        text += `  Local: ${stop.location}\n`;
        text += `  Visita: ${stop.estimatedVisitTime} | Deslocação: ${stop.travelNote}\n`;
        if (stop.reason) text += `  Razão da Escolha: ${stop.reason}\n`;
        if (stop.limitation) text += `  Aviso: ${stop.limitation}\n`;
        text += `\n`;
      });
    });

    if (summary.seasonTip) {
      text += `Dica Sazonal: ${summary.seasonTip}\n`;
    }
    text += `\nNota: Horários e acessos sujeitos a confirmação sazonal no Posto de Turismo de Freixo de Espada à Cinta.\n`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('Itinerário copiado para a área de transferência!', 'success');
    } catch {
      showToast('Não foi possível copiar automaticamente o roteiro.', 'warning');
    }
  }

  updateSavedBadge() {
    const badge = document.getElementById('saved-itins-badge');
    if (!badge) return;
    const list = storageService.getSavedItineraries();
    badge.textContent = list.length;
  }

  openSavedModal() {
    const modal = document.getElementById('saved-itins-modal');
    if (!modal) return;
    this.renderSavedList();
    modal.classList.remove('hidden');
  }

  closeSavedModal() {
    const modal = document.getElementById('saved-itins-modal');
    if (modal) modal.classList.add('hidden');
  }

  renderSavedList() {
    const container = document.getElementById('saved-itins-list');
    if (!container) return;
    const list = storageService.getSavedItineraries();

    if (list.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-xs text-[#7E9283] space-y-2">
          <p class="text-2xl">🗺️</p>
          <p class="font-medium">Ainda não tens nenhum roteiro guardado.</p>
          <p class="text-[11px]">Gera um itinerário e clica em "Guardar" para o consultar mais tarde.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(item => {
      const summary = item.summary || {};
      const meta = item.meta || {};
      const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
      const days = summary.days || item.daysCount || item.days?.length || 1;
      const stops = summary.totalStops || (item.days ? item.days.reduce((acc, d) => acc + (d.stops?.length || 0), 0) : 0);

      const escapedId = escapeHtml(item.id);
      const interestText = escapeHtml(summary.interest || item.interest || 'Geral');
      const overviewText = escapeHtml(summary.overview || (item.days && item.days[0] ? item.days[0].title : 'Roteiro em Freixo de Espada à Cinta'));

      return `
        <div class="p-4 rounded-2xl bg-white border border-[#182E22]/10 hover:border-[#182E22]/30 shadow-sm transition-all flex items-center justify-between gap-3">
          <div class="space-y-1 min-w-0 flex-grow cursor-pointer load-saved-item-btn" data-id="${escapedId}">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#182E22]/10 text-[#182E22]">
                ${days} ${days === 1 ? 'Dia' : 'Dias'}
              </span>
              <span class="text-xs font-bold text-[#182E22] truncate">${interestText} • ${stops} Paragens</span>
            </div>
            <p class="text-[11px] text-[#7E9283] truncate">
              ${overviewText}
            </p>
            <div class="flex items-center gap-2 text-[10px] text-[#7E9283]">
              ${dateStr ? `<span>🕒 ${dateStr}</span>` : ''}
              ${meta.seed != null || item.seed != null ? `<span>• Semente #${meta.seed || item.seed}</span>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <button type="button" class="load-saved-item-btn px-3 py-1.5 rounded-xl bg-[#182E22] text-[#FAF8F5] text-xs font-semibold hover:bg-[#234332] transition-colors" data-id="${escapedId}" title="Carregar este roteiro">
              Abrir
            </button>
            <button type="button" class="delete-saved-item-btn p-1.5 rounded-xl hover:bg-red-50 text-[#7E9283] hover:text-red-600 transition-colors" data-id="${escapedId}" title="Eliminar este roteiro" aria-label="Eliminar roteiro">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.load-saved-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        this.loadSavedPlan(id);
      });
    });

    container.querySelectorAll('.delete-saved-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        storageService.deleteSavedItinerary(id);
        this.renderSavedList();
        this.updateSavedBadge();
        showToast('Roteiro removido dos guardados.', 'info');
      });
    });
  }

  loadSavedPlan(id) {
    const plan = storageService.getSavedItineraryById(id);
    if (!plan) {
      showToast('Roteiro não encontrado.', 'warning');
      return;
    }
    this.currentPlan = plan;
    this.renderPlanResults(plan);
    this.closeSavedModal();
    showToast('Roteiro carregado com sucesso!', 'success');
  }

  async applyUrlConfigAndGenerate(config) {
    const inputDays = document.getElementById('input-days');
    if (inputDays) inputDays.value = config.days || 2;
    document.querySelectorAll('.day-btn').forEach(b => {
      const isSelected = parseInt(b.dataset.days, 10) === (config.days || 2);
      b.className = isSelected
        ? 'day-btn py-2.5 text-xs font-semibold rounded-xl border border-[#182E22] bg-[#182E22] text-[#FAF8F5] transition-all text-center'
        : 'day-btn py-2.5 text-xs font-semibold rounded-xl border border-[#182E22]/20 bg-white text-[#24211D] hover:border-[#182E22] transition-all text-center';
      b.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    const selectInterest = document.getElementById('input-interest');
    if (selectInterest && config.interest) {
      selectInterest.value = config.interest;
    }

    const inputPace = document.getElementById('input-pace');
    if (inputPace) inputPace.value = config.pace || 'equilibrado';
    document.querySelectorAll('.pace-btn').forEach(b => {
      const isSelected = b.dataset.pace === (config.pace || 'equilibrado');
      b.className = isSelected
        ? 'pace-btn py-2 text-[11px] font-semibold rounded-xl border border-[#182E22] bg-[#182E22] text-[#FAF8F5]'
        : 'pace-btn py-2 text-[11px] font-medium rounded-xl border border-[#182E22]/20 bg-white text-[#24211D]';
      b.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    const inputMobility = document.getElementById('input-mobility');
    if (inputMobility) inputMobility.value = config.mobility || 'carro';
    document.querySelectorAll('.mobility-btn').forEach(b => {
      const isSelected = b.dataset.mobility === (config.mobility || 'carro');
      b.className = isSelected
        ? 'mobility-btn py-2 text-xs font-semibold rounded-xl border border-[#182E22] bg-[#182E22] text-[#FAF8F5]'
        : 'mobility-btn py-2 text-xs font-medium rounded-xl border border-[#182E22]/20 bg-white text-[#24211D]';
      b.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    await this.handleGenerate({ seed: config.seed });
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


