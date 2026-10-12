import { openPoiModal } from './PoiModal.js';

export class FreixoMap {
  constructor(containerId = 'freixo-map-container') {
    this.containerId = containerId;
    this.map = null;
    this.markers = new Map();
    this.pois = [];
    this.trails = [];
    this.trailLayers = new Map();
    this.selectedTrailId = null;
    this.legendControl = null;
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

    this.map = L.map(this.containerId, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(this.map);

    this.renderMarkers(pois);
    this.addMapLegend();
    return this.map;
  }

  /**
   * Renderiza os marcadores dos pontos de interesse
   */
  renderMarkers(pois) {
    if (!this.map) return;
    this.pois = pois || [];

    this.markers.forEach(marker => marker.remove());
    this.markers.clear();

    const group = [];

    this.pois.forEach(poi => {
      if (!poi.coordinates) return;

      const { lat, lng } = poi.coordinates;

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

      const popupContent = `
        <div class="custom-popup p-1 max-w-[220px]">
          <div class="h-24 w-full rounded-md overflow-hidden mb-2 bg-[#182E22]">
            <img src="${poi.image}" alt="${poi.title}" class="w-full h-full object-cover" />
          </div>
          <span class="text-[9px] font-bold uppercase tracking-wider text-[#B65737] block">${poi.categoryLabel}</span>
          <h4 class="font-display font-bold text-sm text-[#182E22] leading-tight mb-1">${poi.title}</h4>
          <p class="text-[11px] text-[#3D3830] line-clamp-2 leading-relaxed mb-2">${poi.shortDescription}</p>
          <div class="flex flex-col gap-1.5 mt-2">
            <a href="detalhe.html?slug=${poi.slug || poi.id}" class="w-full py-1.5 px-2 rounded bg-[#182E22] text-[#FAF8F5] text-[10px] uppercase font-semibold tracking-wider hover:bg-[#234332] transition-colors block text-center">
              Ficha Completa ↗
            </a>
            <button class="w-full py-1 px-2 rounded bg-white border border-[#182E22]/20 text-[#182E22] text-[10px] font-medium hover:bg-[#182E22]/5 transition-colors" onclick="window.__openPoiModalById('${poi.id}')">
              Espreitar no Modal
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 240, className: 'custom-popup-wrapper' });

      this.markers.set(poi.id, marker);
      group.push([lat, lng]);
    });

    window.__openPoiModalById = (id) => {
      const targetPoi = this.pois.find(p => p.id === id);
      if (targetPoi) openPoiModal(targetPoi);
    };
  }

  /**
   * Renderiza os percursos turísticos com geometrias GeoJSON verificadas
   */
  renderTrails(trails = []) {
    if (!this.map) return;
    this.trails = trails || [];

    this.trailLayers.forEach(layer => {
      if (layer && typeof layer.remove === 'function') {
        layer.remove();
      }
    });
    this.trailLayers.clear();

    this.trails.forEach(trail => {
      const geojson = trail.geojson || trail.geometry;

      if (!geojson || trail.geometry_status === 'indisponivel' || !this.isValidGeoJson(geojson)) {
        this.trailLayers.set(trail.id, null);
        return;
      }

      const defaultStyle = {
        color: '#B65737',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 6',
        lineCap: 'round',
        lineJoin: 'round'
      };

      const highlightStyle = {
        color: '#8E381C',
        weight: 6,
        opacity: 1.0,
        dashArray: null
      };

      try {
        const layer = L.geoJSON(geojson, {
          style: () => ({ ...defaultStyle }),
          onEachFeature: (feature, featureLayer) => {
            featureLayer.bindTooltip(`
              <div class="text-xs">
                <strong>${trail.title}</strong><br>
                <span>📏 ${trail.distance || trail.distance_km + ' km'} • ⏱️ ${trail.duration}</span>
              </div>
            `, { sticky: true, className: 'trail-leaflet-tooltip' });

            const popupContent = `
              <div class="custom-popup p-1 max-w-[240px]">
                <div class="flex items-center gap-1.5 mb-1">
                  <span class="text-[9px] font-bold uppercase tracking-wider text-[#B65737]">Percurso Verificado</span>
                  <span class="text-[9px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.2 rounded">Oficial</span>
                </div>
                <h4 class="font-display font-bold text-sm text-[#182E22] leading-tight mb-1">${trail.title}</h4>
                <div class="flex flex-wrap items-center gap-2 text-[10px] text-[#7E9283] font-mono mb-2">
                  <span>📏 ${trail.distance || trail.distance_km + ' km'}</span>
                  <span>•</span>
                  <span>⏱️ ${trail.duration}</span>
                  <span>•</span>
                  <span>Dificuldade: ${trail.difficulty}</span>
                </div>
                <p class="text-[11px] text-[#3D3830] leading-relaxed mb-2 font-sans">${trail.description}</p>
                ${trail.geometry_limitations ? `
                  <div class="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-900 mb-2 font-sans">
                    <strong>Aviso:</strong> ${trail.geometry_limitations}
                  </div>
                ` : ''}
                <div class="text-[9px] text-[#7E9283] font-mono mb-2">
                  Fonte: ${trail.geometry_source || 'ICNF / OSM'} (${trail.geometry_consulted_at || '2026'})
                </div>
                <div class="flex flex-col gap-1.5">
                  <a href="trilho.html?slug=${trail.slug || trail.id}" class="w-full py-1.5 px-2 rounded-xl bg-[#182E22] text-[#FAF8F5] text-[10px] uppercase font-semibold tracking-wider hover:bg-[#234332] transition-colors block text-center">
                    Ver Ficha Completa do Trilho ↗
                  </a>
                  <a href="roteiro.html" class="w-full py-1 px-2 rounded-xl bg-white border border-[#182E22]/20 text-[#182E22] text-[10px] uppercase font-semibold tracking-wider hover:bg-[#FAF8F5] transition-colors block text-center">
                    Adicionar ao Roteiro +
                  </a>
                </div>
              </div>
            `;
            featureLayer.bindPopup(popupContent, { maxWidth: 260, className: 'custom-popup-wrapper' });

            featureLayer.on({
              mouseover: (e) => {
                if (this.selectedTrailId !== trail.id) {
                  e.target.setStyle({ weight: 6, opacity: 1.0 });
                }
              },
              mouseout: (e) => {
                if (this.selectedTrailId !== trail.id) {
                  e.target.setStyle(defaultStyle);
                }
              },
              click: () => {
                this.selectTrail(trail.id);
              }
            });
          }
        }).addTo(this.map);

        this.trailLayers.set(trail.id, layer);
      } catch (err) {
        console.warn(`[FreixoMap] Erro ao carregar geometria de '${trail.id}':`, err.message);
        this.trailLayers.set(trail.id, null);
      }
    });
  }

  /**
   * Valida se o objeto fornecido possui estrutura GeoJSON compatível
   */
  isValidGeoJson(geojson) {
    if (!geojson || typeof geojson !== 'object') return false;
    const geom = geojson.type === 'Feature' ? geojson.geometry : geojson;
    if (!geom || !geom.type || !Array.isArray(geom.coordinates)) return false;
    return ['LineString', 'MultiLineString'].includes(geom.type) && geom.coordinates.length > 0;
  }

  /**
   * Destaca e enquadra um percurso no mapa
   */
  selectTrail(trailId) {
    if (!this.map) return;

    const trail = (this.trails || []).find(t => t.id === trailId || t.slug === trailId);
    const layer = this.trailLayers.get(trailId) || this.trailLayers.get(trail?.id);

    if (this.selectedTrailId && this.selectedTrailId !== trailId) {
      const prevLayer = this.trailLayers.get(this.selectedTrailId);
      if (prevLayer) {
        prevLayer.setStyle({
          color: '#B65737',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 6'
        });
      }
    }

    if (layer && typeof layer.getBounds === 'function') {
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        layer.setStyle({
          color: '#8E381C',
          weight: 6,
          opacity: 1.0,
          dashArray: null
        });
        this.selectedTrailId = trailId;
        this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
        layer.openPopup();
        return;
      }
    }

    if (trail) {
      this.selectedTrailId = null;
      window.dispatchEvent(new CustomEvent('freixo:trailGeometryUnavailable', {
        detail: {
          trailId: trail.id,
          title: trail.title,
          message: trail.geometry_limitations || 'Traçado contínuo em levantamento cartográfico oficial.'
        }
      }));
    }
  }

  /**
   * Adiciona legenda cartográfica integrada ao mapa
   */
  addMapLegend() {
    if (!this.map || this.legendControl) return;

    const LegendControl = L.Control.extend({
      options: { position: 'bottomright' },
      onAdd: () => {
        const div = L.DomUtil.create('div', 'map-trails-legend');
        div.innerHTML = `
          <div class="space-y-1">
            <span class="font-bold text-[10px] uppercase tracking-wider text-[#182E22] block mb-1">Legenda Cartográfica</span>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-[#182E22] border border-white inline-block"></span>
              <span>Ponto de Interesse</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-4 h-0.5 bg-[#B65737] border-t-2 border-dashed border-[#B65737] inline-block"></span>
              <span>Trilho Verificado (PR1)</span>
            </div>
          </div>
        `;
        return div;
      }
    });

    this.legendControl = new LegendControl();
    this.legendControl.addTo(this.map);
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
