/**
 * FREIXO AI — Modal Imersivo de Ponto de Interesse (POI)
 * Detalhes aprofundados, leitor de áudio-guia simulado e ações
 */

import { storageService } from '../services/storageService.js';
import { showToast } from './Toast.js';

let activeAudioInterval = null;

export function openPoiModal(poi) {
  if (!poi) return;

  let modalOverlay = document.getElementById('poi-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'poi-modal-overlay';
    modalOverlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 modal-backdrop opacity-0 transition-opacity duration-300 pointer-events-none';
    document.body.appendChild(modalOverlay);
  }

  const isFav = storageService.isFavorite(poi.id);

  modalOverlay.innerHTML = `
    <div class="relative w-full max-w-3xl max-h-[90vh] bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#182E22]/15 transform scale-95 transition-transform duration-300" id="poi-modal-card">
      
      <!-- Cabeçalho com Imagem e Fechar -->
      <div class="relative h-64 sm:h-72 w-full bg-[#182E22] overflow-hidden flex-shrink-0">
        <img src="${poi.image}" alt="${poi.title}" class="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#122419] via-black/30 to-black/20"></div>

        <!-- Botão Fechar -->
        <button id="modal-close-btn" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors backdrop-blur-sm" aria-label="Fechar">
          ✕
        </button>

        <!-- Categoria e Favorito -->
        <div class="absolute top-4 left-4 flex items-center gap-2">
          <span class="editorial-badge bg-[#FAF8F5]/90 text-[#182E22] font-semibold border-none">
            ${poi.categoryLabel}
          </span>
        </div>

        <!-- Título e Subtítulo sobre a imagem -->
        <div class="absolute bottom-4 left-4 right-4 text-[#FAF8F5]">
          <h2 class="font-display text-2xl sm:text-3xl font-bold tracking-tight leading-snug">${poi.title}</h2>
          <p class="text-xs text-[#EBE4DA] flex items-center gap-2 mt-1">
            <span>📍 ${poi.location}</span>
            <span>•</span>
            <span>⛰️ ${poi.altitude || '450m'}</span>
            <span>•</span>
            <span>⏱️ ${poi.estimatedTime || '1h'}</span>
          </p>
        </div>
      </div>

      <!-- Conteúdo do Modal com Scroll -->
      <div class="p-6 sm:p-8 overflow-y-auto space-y-6">
        
        <!-- Descrição Principal -->
        <div>
          <h3 class="text-xs uppercase tracking-[0.16em] font-bold text-[#B65737] mb-2">Narrativa & Contexto</h3>
          <p class="text-base text-[#24211D] leading-relaxed font-sans">
            ${poi.fullDescription || poi.shortDescription}
          </p>
        </div>

        <!-- Leitor de Áudio-Guia Simulado -->
        ${poi.audioGuide ? `
          <div class="p-4 rounded-xl bg-[#182E22] text-[#FAF8F5] shadow-inner space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button id="audio-play-btn" class="w-10 h-10 rounded-full bg-[#DFBA71] text-[#182E22] flex items-center justify-center font-bold text-lg hover:scale-105 transition-transform shadow-md">
                  <span id="audio-play-icon">▶</span>
                </button>
                <div>
                  <h4 class="text-sm font-semibold text-[#FAF8F5]">${poi.audioGuide.title}</h4>
                  <p class="text-[11px] text-[#DDD4C7]">Áudio-guia narrado com contexto histórico</p>
                </div>
              </div>
              <span id="audio-timer" class="text-xs font-mono text-[#DFBA71]">00:00 / ${poi.audioGuide.duration}</span>
            </div>

            <!-- Barra de Progresso do Áudio -->
            <div class="w-full bg-[#234332] h-1.5 rounded-full overflow-hidden">
              <div id="audio-progress-bar" class="bg-[#DFBA71] h-full w-0 transition-all duration-300"></div>
            </div>

            <!-- Transcrição Opcional -->
            <div class="pt-1">
              <details class="text-xs text-[#DDD4C7] cursor-pointer">
                <summary class="hover:text-[#FAF8F5] font-medium text-[11px] tracking-wide uppercase text-[#DFBA71]">Ver transcrição completa da narração</summary>
                <p class="mt-2 text-xs italic bg-black/20 p-3 rounded-lg border border-white/5 leading-relaxed">
                  "${poi.audioGuide.transcript}"
                </p>
              </details>
            </div>
          </div>
        ` : ''}

        <!-- Destaques -->
        ${poi.highlights && poi.highlights.length ? `
          <div>
            <h3 class="text-xs uppercase tracking-[0.16em] font-bold text-[#182E22] mb-3">Destaques da Visita</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${poi.highlights.map(h => `
                <div class="flex items-start gap-2.5 p-2.5 rounded-lg bg-black/5 text-xs text-[#24211D]">
                  <span class="text-[#B65737] font-bold">✓</span>
                  <span>${h}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Informações Práticas -->
        <div class="p-4 rounded-xl bg-[#EBE4DA]/60 border border-[#182E22]/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span class="font-bold text-[#182E22] block mb-1">Horário & Acesso:</span>
            <p class="text-[#3D3830]">${poi.openingHours || 'Acesso livre e permanente'}</p>
          </div>
          <div>
            <span class="font-bold text-[#182E22] block mb-1">Acessibilidade:</span>
            <p class="text-[#3D3830]">${poi.accessibility || 'Acesso regular'}</p>
          </div>
          ${poi.tips ? `
            <div class="sm:col-span-2 pt-2 border-t border-[#182E22]/10">
              <span class="font-bold text-[#B65737] block mb-0.5">💡 Dica do Especialista Freixo AI:</span>
              <p class="text-[#3D3830]">${poi.tips}</p>
            </div>
          ` : ''}
        </div>

      </div>

      <!-- Barra de Ações Inferior -->
      <div class="p-4 bg-[#F4EFEA] border-t border-[#182E22]/10 flex flex-wrap items-center justify-between gap-3">
        <button id="modal-fav-btn" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#182E22]/20 hover:border-[#182E22] text-xs font-semibold tracking-wide transition-all ${
          isFav ? 'bg-[#B65737] text-white border-[#B65737]' : 'bg-white text-[#182E22]'
        }">
          <span>${isFav ? '❤️ Nos Meus Favoritos' : '🤍 Guardar nos Favoritos'}</span>
        </button>

        <a href="roteiro.html" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#182E22] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase hover:bg-[#234332] transition-colors shadow">
          <span>Incluir no Roteiro AI</span>
          <span>→</span>
        </a>
      </div>

    </div>
  `;

  // Animar abertura
  modalOverlay.classList.remove('pointer-events-none');
  requestAnimationFrame(() => {
    modalOverlay.classList.remove('opacity-0');
    modalOverlay.classList.add('opacity-100');
    const card = document.getElementById('poi-modal-card');
    if (card) {
      card.classList.remove('scale-95');
      card.classList.add('scale-100');
    }
  });

  // Função para fechar o modal
  const closeModal = () => {
    if (activeAudioInterval) {
      clearInterval(activeAudioInterval);
      activeAudioInterval = null;
    }
    modalOverlay.classList.add('opacity-0');
    const card = document.getElementById('poi-modal-card');
    if (card) card.classList.add('scale-95');
    setTimeout(() => {
      modalOverlay.classList.add('pointer-events-none');
    }, 300);
  };

  // Botão fechar
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Fechar ao clicar fora do cartão
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Fechar com ESC
  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', onKeyDown);
    }
  };
  document.addEventListener('keydown', onKeyDown);

  // Toggle Favorito dentro do Modal
  const favBtn = document.getElementById('modal-fav-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      const nowFav = storageService.toggleFavorite(poi.id);
      if (nowFav) {
        favBtn.className = 'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#B65737] bg-[#B65737] text-white text-xs font-semibold tracking-wide transition-all';
        favBtn.innerHTML = '<span>❤️ Nos Meus Favoritos</span>';
        showToast(`"${poi.title}" adicionado aos favoritos!`, 'success');
      } else {
        favBtn.className = 'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#182E22]/20 hover:border-[#182E22] text-xs font-semibold tracking-wide transition-all bg-white text-[#182E22]';
        favBtn.innerHTML = '<span>🤍 Guardar nos Favoritos</span>';
        showToast(`"${poi.title}" removido dos favoritos.`, 'info');
      }
    });
  }

  // Simulação Interativa do Leitor de Áudio
  const playBtn = document.getElementById('audio-play-btn');
  const playIcon = document.getElementById('audio-play-icon');
  const progressBar = document.getElementById('audio-progress-bar');
  const timer = document.getElementById('audio-timer');

  if (playBtn && poi.audioGuide) {
    let isPlaying = false;
    let currentSeconds = 0;
    const totalSeconds = 165; // ~02:45

    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playIcon.textContent = '⏸';
        activeAudioInterval = setInterval(() => {
          currentSeconds++;
          const mins = Math.floor(currentSeconds / 60);
          const secs = currentSeconds % 60;
          const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
          if (timer) timer.textContent = `${formatted} / ${poi.audioGuide.duration}`;
          if (progressBar) progressBar.style.width = `${(currentSeconds / totalSeconds) * 100}%`;

          if (currentSeconds >= totalSeconds) {
            clearInterval(activeAudioInterval);
            isPlaying = false;
            playIcon.textContent = '▶';
            currentSeconds = 0;
          }
        }, 1000);
      } else {
        playIcon.textContent = '▶';
        if (activeAudioInterval) clearInterval(activeAudioInterval);
      }
    });
  }
}
