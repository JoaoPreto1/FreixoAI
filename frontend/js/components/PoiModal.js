import { storageService } from '../services/storageService.js';
import { showToast } from './Toast.js';

let activeAudioInterval = null;

export function openPoiModal(poi) {
  if (!poi) return;

  let modalOverlay = document.getElementById('poi-modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'poi-modal-overlay';
    modalOverlay.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 modal-backdrop opacity-0 transition-opacity duration-300 pointer-events-none hidden';
    document.body.appendChild(modalOverlay);
  }

  const isFav = storageService.isFavorite(poi.id);
  const verification = poi.verification || {
    status: 'confirmado',
    source: 'Município de Freixo de Espada à Cinta',
    notes: 'Dados patrimoniais de Freixo de Espada à Cinta.'
  };

  modalOverlay.innerHTML = `
    <div class="relative w-full max-w-3xl max-h-[90vh] bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#182E22]/15 transform scale-95 transition-transform duration-300" 
         id="poi-modal-card" 
         role="dialog" 
         aria-modal="true" 
         aria-labelledby="poi-modal-title">
      
      <div class="relative h-64 sm:h-72 w-full bg-[#182E22] overflow-hidden flex-shrink-0">
        <img src="${poi.image}" alt="${poi.title}" class="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105" />
        <button id="modal-close-btn" 
                type="button" 
                class="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/85 transition-colors backdrop-blur-sm cursor-pointer shadow-lg active:scale-95" 
                aria-label="Fechar janela de detalhes">
          <span class="text-base font-bold select-none pointer-events-none">✕</span>
        </button>

        <div class="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <span class="editorial-badge bg-[#FAF8F5]/90 text-[#182E22] font-semibold border-none">
            ${poi.categoryLabel}
          </span>
          <span class="text-[10px] bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur-sm">
            ✓ Fonte: ${verification.source}
          </span>
        </div>

        <div class="absolute bottom-4 left-4 right-4 text-[#FAF8F5]">
          <h2 id="poi-modal-title" class="font-display text-2xl sm:text-3xl font-bold tracking-tight leading-snug">${poi.title}</h2>
          <p class="text-xs text-[#EBE4DA] flex flex-wrap items-center gap-2 mt-1">
            <span>📍 ${poi.location}</span>
            <span>•</span>
            <span>⛰️ ${poi.altitude || '450m'}</span>
            <span>•</span>
            <span>⏱️ ${poi.estimatedTime || '1h'}</span>
          </p>
        </div>
      </div>

      <div class="p-6 sm:p-8 overflow-y-auto space-y-6">
        
        <div>
          <h3 class="text-xs uppercase tracking-[0.16em] font-bold text-[#B65737] mb-2">Narrativa & Contexto Histórico</h3>
          <p class="text-base text-[#24211D] leading-relaxed font-sans">
            ${poi.fullDescription || poi.shortDescription}
          </p>
        </div>

        <div class="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-xs text-emerald-900 flex items-start gap-2.5">
          <span class="text-sm">🏛️</span>
          <div>
            <span class="font-bold block">Enquadramento Documental:</span>
            <p class="text-[11px] leading-relaxed mt-0.5 text-emerald-800">
              ${verification.notes || 'Registo catalogado na memória histórica e patrimonial do concelho de Freixo de Espada à Cinta.'}
            </p>
          </div>
        </div>

        ${poi.audioGuide ? `
          <div class="p-4 rounded-xl bg-[#182E22] text-[#FAF8F5] shadow-inner space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <button id="audio-play-btn" class="w-10 h-10 rounded-full bg-[#DFBA71] text-[#182E22] flex items-center justify-center font-bold text-lg hover:scale-105 transition-transform shadow-md" aria-label="Reproduzir áudio guia">
                  <span id="audio-play-icon">▶</span>
                </button>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="text-sm font-semibold text-[#FAF8F5]">${poi.audioGuide.title}</h4>
                    <span class="text-[9px] bg-white/10 text-[#DFBA71] px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">Protótipo Áudio</span>
                  </div>
                  <p class="text-[11px] text-[#DDD4C7]">Narração de demonstração com contexto cultural</p>
                </div>
              </div>
              <span id="audio-timer" class="text-xs font-mono text-[#DFBA71]">00:00 / ${poi.audioGuide.duration}</span>
            </div>

            <div class="w-full bg-[#234332] h-1.5 rounded-full overflow-hidden" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
              <div id="audio-progress-bar" class="bg-[#DFBA71] h-full w-0 transition-all duration-300"></div>
            </div>

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
              <span class="font-bold text-[#B65737] block mb-0.5">💡 Recomendação de Visita:</span>
              <p class="text-[#3D3830]">${poi.tips}</p>
            </div>
          ` : ''}
        </div>

      </div>

      <div class="p-4 bg-[#F4EFEA] border-t border-[#182E22]/10 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button id="modal-fav-btn" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#182E22]/20 hover:border-[#182E22] text-xs font-semibold tracking-wide transition-all ${
            isFav ? 'bg-[#B65737] text-white border-[#B65737]' : 'bg-white text-[#182E22]'
          }" type="button">
            <span>${isFav ? '❤️ Nos Meus Favoritos' : '🤍 Guardar nos Favoritos'}</span>
          </button>

          <button id="modal-share-btn" class="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#182E22]/20 hover:border-[#182E22] bg-white text-[#182E22] text-xs font-medium transition-colors" type="button" title="Copiar link direto para este local">
            <span>🔗 Partilhar</span>
          </button>
        </div>

        <div class="flex items-center gap-2">
          <a href="detalhe.html?slug=${poi.slug || poi.id}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#182E22] text-[#FAF8F5] hover:bg-[#234332] text-xs font-semibold tracking-wider uppercase transition-colors shadow">
            <span>Ver Ficha Completa</span>
            <span>↗</span>
          </a>
        </div>
      </div>

    </div>
  `;

  modalOverlay.classList.remove('pointer-events-none', 'hidden');
  requestAnimationFrame(() => {
    modalOverlay.classList.remove('opacity-0');
    modalOverlay.classList.add('opacity-100');
    const card = document.getElementById('poi-modal-card');
    if (card) {
      card.classList.remove('scale-95');
      card.classList.add('scale-100');
    }
  });

  const closeModal = () => {
    if (activeAudioInterval) {
      clearInterval(activeAudioInterval);
      activeAudioInterval = null;
    }
    modalOverlay.classList.remove('opacity-100');
    modalOverlay.classList.add('opacity-0');
    const card = document.getElementById('poi-modal-card');
    if (card) {
      card.classList.remove('scale-100');
      card.classList.add('scale-95');
    }
    setTimeout(() => {
      modalOverlay.classList.add('pointer-events-none', 'hidden');
    }, 280);
  };

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay || e.target.closest('#modal-close-btn')) {
      closeModal();
    }
  });

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', onKeyDown);
    }
  };
  document.addEventListener('keydown', onKeyDown);

  const favBtn = document.getElementById('modal-fav-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      const nowFav = storageService.toggleFavorite(poi.id, {
        type: 'place',
        title: poi.title,
        category: poi.categoryLabel || poi.category || 'Património',
        image: poi.image || 'assets/images/penedo-durao.png'
      });
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

  const shareBtn = document.getElementById('modal-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareUrl = `${window.location.origin}/detalhe.html?slug=${poi.slug || poi.id}`;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl);
          showToast('Link do local copiado para a área de transferência!', 'success');
        } else {
          showToast(`Link: ${shareUrl}`, 'info');
        }
      } catch {
        showToast(`Link: ${shareUrl}`, 'info');
      }
    });
  }

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
