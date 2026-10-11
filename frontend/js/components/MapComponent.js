/**
 * FREIXO AI — Componente de Mapa Interativo (Leaflet.js)
 * Visualização geoespacial com marcadores personalizados e popups interativos
 */

import { openPoiModal } from './PoiModal.js';

export class FreixoMap {
  constructor(containerId = 'freixo-map-container') {
    this.containerId = containerId;
    this.map = null;
    this.markers = new Map();
    this.pois = [];
  }

  init(pois = [], defaultCenter = [41.0750, -6.8150], defaultZoom = 12) {
    const container = document.getElementById(this.containerId);
    if (!container) return null;

    if (typeof L === 'undefined') {
      console.warn("Leaflet não encontrado no escopo global.");
      container.innerHTML = `
        <div class="h-full flex items-center justify-center p-6 text-center text-sm text-[#7E9283] bg-[#EBE4DA]/40 rounded-xl">
          <p>A carregar motor cartográfico...</p>
        </div>
      `;
      return null;
    }

    // Inicializar mapa
    this.map = L.map(this.containerId, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: true,
      scrollWheelZoom: false
    });

    // Adicionar camada de azulejos oficial OpenStreetMap livre de marca de água
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(this.map);

    this.renderMarkers(pois);
    return this.map;
  }

  renderMarkers(pois) {
    if (!this.map) return;
    this.pois = pois;

    // Limpar marcadores antigos
    this.markers.forEach(marker => marker.remove());
    this.markers.clear();

    const group = [];

    pois.forEach(poi => {
      if (!poi.coordinates) return;

      const { lat, lng } = poi.coordinates;

      // Ícone SVG personalizado com cores do design system
      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div class="custom-map-pin" title="${poi.title}" id="pin-${poi.id}">
            <span>${this.getCategoryEmoji(poi.category)}</span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);

      // Popup editorial refinado
      const popupContent = `
        <div class="custom-popup p-1 max-w-[220px]">
          <div class="h-24 w-full rounded-md overflow-hidden mb-2 bg-[#182E22]">
            <img src="${poi.image}" alt="${poi.title}" class="w-full h-full object-cover" />
          </div>
          <span class="text-[9px] font-bold uppercase tracking-wider text-[#B65737] block">${poi.categoryLabel}</span>
          <h4 class="font-display font-bold text-sm text-[#182E22] leading-tight mb-1">${poi.title}</h4>
          <p class="text-[11px] text-[#3D3830] line-clamp-2 leading-relaxed mb-2">${poi.shortDescription}</p>
          <button class="w-full py-1.5 px-2 rounded bg-[#182E22] text-[#FAF8F5] text-[10px] uppercase font-semibold tracking-wider hover:bg-[#234332] transition-colors" onclick="window.__openPoiModalById('${poi.id}')">
            Ver Detalhes →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 240, className: 'custom-popup-wrapper' });

      this.markers.set(poi.id, marker);
      group.push([lat, lng]);
    });

    // Bridge global para o popup abrir o modal
    window.__openPoiModalById = (id) => {
      const targetPoi = this.pois.find(p => p.id === id);
      if (targetPoi) openPoiModal(targetPoi);
    };
  }

  focusPoi(poiId) {
    const marker = this.markers.get(poiId);
    const poi = this.pois.find(p => p.id === poiId);
    if (marker && poi && this.map) {
      this.map.flyTo([poi.coordinates.lat, poi.coordinates.lng], 14, {
        duration: 1.2,
        easeLinearity: 0.25
      });
      setTimeout(() => marker.openPopup(), 1200);
    }
  }

  getCategoryEmoji(cat) {
    switch (cat) {
      case 'miradouro': return '🦅';
      case 'patrimonio': return '🏛️';
      case 'natureza': return '🏖️';
      case 'trilhos': return '🥾';
      default: return '📍';
    }
  }
}
