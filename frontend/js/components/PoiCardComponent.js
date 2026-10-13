import { storageService } from '../services/storageService.js';
import { openPoiModal } from './PoiModal.js';
import { showToast } from './Toast.js';

export function createPoiCard(poi, onCardClick = null) {
  const card = document.createElement('article');
  card.className = 'group relative flex flex-col bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#182E22]/10 hover:border-[#182E22]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-[#182E22]';
  card.dataset.poiId = poi.id;
  card.dataset.category = poi.category;
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${poi.title}, ${poi.categoryLabel}`);

  const isFav = storageService.isFavorite(poi.id);
  const isPending = poi.verification?.pendingValidation === true;

  card.innerHTML = `
    <div class="relative h-56 sm:h-64 w-full bg-[#182E22] overflow-hidden cursor-pointer" data-action="open-modal">
      <img src="${poi.image}" 
           alt="${poi.title}" 
           loading="lazy"
           class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:opacity-95" />
      
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

      <div class="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
        <span class="editorial-badge bg-[#FAF8F5]/90 text-[#182E22] shadow-sm">
          ${poi.categoryLabel}
        </span>
        ${poi.is_demo ? `
          <span class="text-[9px] font-medium bg-amber-900/85 text-amber-200 px-2 py-0.5 rounded-full backdrop-blur-sm border border-amber-500/30">
            Registo de Teste (Demonstração)
          </span>
        ` : (poi._provenance === 'api_node' ? `
          <span class="text-[9px] font-medium bg-emerald-950/85 text-emerald-300 px-2 py-0.5 rounded-full backdrop-blur-sm border border-emerald-500/30">
            ✓ API Node.js
          </span>
        ` : `
          <span class="text-[9px] font-medium bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded-full backdrop-blur-sm">
            Demonstração Local
          </span>
        `)}
      </div>

      <button class="fav-toggle-btn absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-[#FAF8F5]/85 text-[#182E22] hover:text-[#B65737] hover:bg-white flex items-center justify-center transition-all duration-200 shadow-md ${
        isFav ? 'text-[#B65737]' : ''
      }" 
              data-action="toggle-fav"
              aria-label="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
              type="button">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="${isFav ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div class="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-[#FAF8F5] font-medium">
        <span class="flex items-center gap-1 opacity-90">
          <span>⛰️</span> ${poi.altitude || '450m'}
        </span>
        <span class="flex items-center gap-1 opacity-90">
          <span>⏱️</span> ${poi.estimatedTime || '1h'}
        </span>
      </div>
    </div>

    <div class="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
      
      <div>
        <h3 class="font-display text-xl font-bold text-[#182E22] group-hover:text-[#B65737] transition-colors leading-snug cursor-pointer" data-action="open-modal">
          ${poi.title}
        </h3>
        <p class="text-xs text-[#7E9283] font-medium mt-1 mb-2.5 flex items-center gap-1">
          <span>📍</span> ${poi.location}
        </p>
        <p class="text-xs text-[#3D3830] leading-relaxed line-clamp-3 font-sans">
          ${poi.shortDescription}
        </p>
      </div>

      <div class="pt-3 border-t border-[#182E22]/10 flex items-center justify-between gap-2">
        <a href="detalhe.html?slug=${poi.slug || poi.id}" 
           class="inline-flex items-center gap-1.5 text-xs font-bold text-[#182E22] hover:text-[#B65737] transition-colors group/link" 
           aria-label="Ver ficha completa de ${poi.title}">
          <span>Ficha do Local</span>
          <span class="text-sm transition-transform group-hover/link:translate-x-1">→</span>
        </a>

        <div class="flex items-center gap-2">
          <button class="text-[11px] text-[#7E9283] hover:text-[#182E22] transition-colors font-medium px-2 py-1 rounded hover:bg-[#182E22]/5 flex items-center gap-1" 
                  data-action="focus-map" 
                  type="button"
                  title="Centrar e ver localização no mapa interativo">
            <span>🗺️</span>
            <span>Ver no Mapa</span>
          </button>
        </div>
      </div>

    </div>
  `;

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target === card) {
      openPoiModal(poi);
    }
  });

  card.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) {
      if (typeof onCardClick === 'function') {
        onCardClick(poi);
      } else {
        openPoiModal(poi);
      }
      return;
    }

    const action = target.dataset.action;
    if (action === 'toggle-fav') {
      e.stopPropagation();
      const nowFav = storageService.toggleFavorite(poi.id, {
        type: 'place',
        title: poi.title,
        category: poi.categoryLabel || poi.category || 'Património',
        image: poi.image || 'assets/images/penedo-durao.png'
      });
      const svg = target.querySelector('svg');
      if (nowFav) {
        target.classList.add('text-[#B65737]');
        if (svg) svg.setAttribute('fill', 'currentColor');
        showToast(`"${poi.title}" guardado nos favoritos.`, 'success');
      } else {
        target.classList.remove('text-[#B65737]');
        if (svg) svg.setAttribute('fill', 'none');
        showToast(`"${poi.title}" removido dos favoritos.`, 'info');
      }
    } else if (action === 'focus-map') {
      e.stopPropagation();
      if (typeof onCardClick === 'function') {
        onCardClick(poi);
        const mapEl = document.getElementById('freixo-map-container');
        if (mapEl) {
          mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        window.location.href = `explorar.html?slug=${encodeURIComponent(poi.slug || poi.id)}`;
      }
    } else if (action === 'open-modal') {
      e.stopPropagation();
      openPoiModal(poi);
    }
  });

  return card;
}
