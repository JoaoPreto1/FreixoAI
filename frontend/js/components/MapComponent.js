import { openPoiModal } from './PoiModal.js';

export class FreixoMap {
  constructor(containerId = 'freixo-map-container') {
    this.containerId = containerId;
    this.map = null;
    this.markers = new Map();
    this.pois = [];
    this.trails = [];
    this.trailLayers = new Map();
    this.waypointsLayer = null;
    this.selectedTrailId = null;
    this.legendControl = null;
    this.resizeHandler = null;
  }

  init(pois = [], defaultCenter = [41.0750, -6.8150], defaultZoom = 12) {
    const container = document.getElementById(this.containerId);
    if (!container) return null;

    if (typeof L === 'undefined') {
      container.innerHTML = `
        <div class="h-full flex items-center justify-center p-6 text-center text-sm text-[#7E9283] bg-[#EBE4DA]/40 rounded-xl">
          <p>A carregar motor cartográfico...</p>
        </div>
      `;
      return null;
    }

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.map = L.map(this.containerId, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: true,
      scrollWheelZoom: false,
      tap: false
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(this.map);

    this.renderMarkers(pois, { fitBounds: false });
    this.addMapLegend();

    let resizeTimer = null;
    this.resizeHandler = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 150);
    };
    window.addEventListener('resize', this.resizeHandler);

    return this.map;
  }

  renderMarkers(pois, { fitBounds = true } = {}) {
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
          <div class="custom-map-pin" title="${poi.title}" id="pin-${poi.id}" aria-label="${poi.title}">
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
          <span class="text-[9px] font-bold uppercase tracking-wider text-[#B65737] block">${poi.categoryLabel || poi.category}</span>
          <h4 class="font-display font-bold text-sm text-[#182E22] leading-tight mb-1">${poi.title}</h4>
          <p class="text-[11px] text-[#3D3830] line-clamp-2 leading-relaxed mb-2">${poi.shortDescription || ''}</p>
          <div class="flex flex-col gap-1.5 mt-2">
            <a href="detalhe.html?slug=${poi.slug || poi.id}" class="w-full py-1.5 px-2 rounded bg-[#182E22] text-[#FAF8F5] text-[10px] uppercase font-semibold tracking-wider hover:bg-[#234332] transition-colors block text-center">
              Ficha Completa ↗
            </a>
            <button class="w-full py-1 px-2 rounded bg-white border border-[#182E22]/20 text-[#182E22] text-[10px] font-medium hover:bg-[#182E22]/5 transition-colors" onclick="window.__openPoiModalById('${poi.id}')">
              Espreitar no Modal
            </button>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" class="text-[10px] text-[#7E9283] hover:text-[#182E22] text-center pt-0.5">
              Como Chegar (GPS) ↗
            </a>
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

    if (fitBounds && group.length > 0) {
      if (group.length === 1) {
        this.map.setView(group[0], 14);
      } else {
        this.map.fitBounds(L.latLngBounds(group), { padding: [35, 35], maxZoom: 15 });
      }
    }
  }

  renderTrails(trails = []) {
    if (!this.map) return;
    this.trails = trails || [];

    this.trailLayers.forEach(layer => {
      if (layer && typeof layer.remove === 'function') {
        layer.remove();
      }
    });
    this.trailLayers.clear();

    if (this.waypointsLayer) {
      this.waypointsLayer.remove();
      this.waypointsLayer = null;
    }

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

      try {
        const layer = L.geoJSON(geojson, {
          style: () => ({ ...defaultStyle }),
          onEachFeature: (feature, featureLayer) => {
            featureLayer.bindTooltip(`
              <div class="text-xs">
                <strong>${trail.title}</strong><br>
                <span>📏 ${trail.distance || trail.distance_km + ' km'} • ⏱️ ${trail.duration || ''}</span>
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
                  ${trail.duration ? `<span>•</span><span>⏱️ ${trail.duration}</span>` : ''}
                  ${trail.difficulty ? `<span>•</span><span>Dificuldade: ${trail.difficulty}</span>` : ''}
                </div>
                <p class="text-[11px] text-[#3D3830] leading-relaxed mb-2 font-sans">${trail.description}</p>
                ${trail.geometry_limitations ? `
                  <div class="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-900 mb-2 font-sans">
                    <strong>Aviso:</strong> ${trail.geometry_limitations}
                  </div>
                ` : ''}
                <div class="text-[9px] text-[#7E9283] font-mono mb-2">
                  Fonte: ${trail.geometry_source || 'ICNF / OSM'}
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

  isValidGeoJson(geojson) {
    if (!geojson || typeof geojson !== 'object') return false;
    const geom = geojson.type === 'Feature' ? geojson.geometry : geojson;
    if (!geom || !geom.type || !Array.isArray(geom.coordinates)) return false;
    return ['LineString', 'MultiLineString'].includes(geom.type) && geom.coordinates.length > 0;
  }

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

    if (this.waypointsLayer) {
      this.waypointsLayer.remove();
      this.waypointsLayer = null;
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
      this.selectedTrailId = trail.id;
      this.renderTrailWaypoints(trail);

      window.dispatchEvent(new CustomEvent('freixo:trailGeometryUnavailable', {
        detail: {
          trailId: trail.id,
          title: trail.title,
          message: trail.geometry_limitations || 'Traçado contínuo em levantamento oficial. A apresentar paragens verificadas.'
        }
      }));
    }
  }

  renderTrailWaypoints(trail) {
    if (!this.map || !Array.isArray(trail.stops) || trail.stops.length === 0) return;

    const points = [];
    const markers = [];

    trail.stops.forEach((stop, idx) => {
      let lat = stop.lat;
      let lng = stop.lng;
      let stopPoi = null;

      if ((lat == null || lng == null) && (stop.poiId || stop.poi_id)) {
        const pId = stop.poiId || stop.poi_id;
        stopPoi = this.pois.find(p => p.id === pId || p.slug === pId);
        if (stopPoi?.coordinates) {
          lat = stopPoi.coordinates.lat;
          lng = stopPoi.coordinates.lng;
        }
      }

      if (lat != null && lng != null) {
        const pt = [Number(lat), Number(lng)];
        points.push(pt);

        const waypointIcon = L.divIcon({
          className: 'trail-waypoint-pin',
          html: `
            <div class="w-7 h-7 rounded-full bg-[#182E22] text-[#DFBA71] border-2 border-white flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-[#B65737]/60">
              ${idx + 1}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const stopTitle = stop.title || stopPoi?.title || `Paragem ${idx + 1}`;
        const targetSlug = stop.poiId || stop.poi_id || stopPoi?.slug || stopPoi?.id;

        const m = L.marker(pt, { icon: waypointIcon }).bindPopup(`
          <div class="custom-popup p-1 max-w-[220px]">
            <span class="text-[9px] uppercase tracking-wider text-[#B65737] font-bold block">Paragem #${idx + 1} • ${trail.title}</span>
            <h4 class="font-display font-bold text-sm text-[#182E22] leading-tight mb-1">${stopTitle}</h4>
            <p class="text-[11px] text-[#3D3830] leading-relaxed mb-2 font-sans">${stop.description || stopPoi?.shortDescription || ''}</p>
            ${targetSlug ? `
              <a href="detalhe.html?slug=${targetSlug}" class="w-full py-1.5 px-2 rounded bg-[#182E22] text-[#FAF8F5] text-[10px] uppercase font-semibold tracking-wider hover:bg-[#234332] transition-colors block text-center">
                Ver Ficha do Local ↗
              </a>
            ` : ''}
          </div>
        `);
        markers.push(m);
      }
    });

    if (markers.length > 0) {
      this.waypointsLayer = L.featureGroup(markers).addTo(this.map);

      if (points.length > 1) {
        L.polyline(points, {
          color: '#7E9283',
          weight: 2.5,
          dashArray: '4, 8',
          opacity: 0.75
        }).addTo(this.waypointsLayer);
      }

      const bounds = this.waypointsLayer.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }
  }

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
              <span>Trilho Verificado (GeoJSON)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-[#182E22] text-[#DFBA71] border border-white inline-flex items-center justify-center text-[8px] font-bold">1</span>
              <span>Paragem de Percurso</span>
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
      case 'gastronomia': return '🍷';
      default: return '📍';
    }
  }

  destroy() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

