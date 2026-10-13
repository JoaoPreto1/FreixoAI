const KEYS = {
  FAVORITES: 'freixo_ai_favorites',
  SAVED_ITINERARY: 'freixo_ai_saved_itinerary',
  SAVED_ITINERARIES: 'freixo_ai_saved_itineraries',
  CHAT_HISTORY: 'freixo_ai_chat_history',
  PREFERENCES: 'freixo_ai_user_preferences'
};

const memoryStore = new Map();

const getStorageItem = (key) => {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem) {
      return localStorage.getItem(key);
    }
  } catch {}
  return memoryStore.get(key) || null;
};

const setStorageItem = (key, value) => {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.setItem) {
      localStorage.setItem(key, value);
      return;
    }
  } catch {}
  memoryStore.set(key, value);
};

const removeStorageItem = (key) => {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.removeItem) {
      localStorage.removeItem(key);
      return;
    }
  } catch {}
  memoryStore.delete(key);
};

export const DEFAULT_FAVORITES = [
  {
    id: 'penedo-durao',
    type: 'place',
    title: 'Miradouro do Penedo Durão',
    category: 'miradouro',
    image: 'assets/images/penedo-durao.png',
    addedAt: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 'museu-da-seda',
    type: 'place',
    title: 'Museu da Seda e do Território',
    category: 'cultura',
    image: 'assets/images/seda-loom.png',
    addedAt: '2026-10-12T10:00:00.000Z'
  }
];

class StorageService {
  constructor() {
    this.listeners = [];
  }

  /**
   * Obtém os registos detalhados de favoritos ({ id, type, addedAt, title, image, category })
   */
  getFavoriteRecords() {
    try {
      const raw = getStorageItem(KEYS.FAVORITES);
      if (!raw) return [...DEFAULT_FAVORITES];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [...DEFAULT_FAVORITES];

      return parsed.map(item => {
        if (typeof item === 'string') {
          return { id: item, type: 'place', addedAt: new Date().toISOString() };
        }
        return {
          id: item.id,
          type: item.type || 'place',
          title: item.title || null,
          image: item.image || null,
          category: item.category || null,
          addedAt: item.addedAt || new Date().toISOString()
        };
      }).filter(item => Boolean(item && item.id));
    } catch {
      return [...DEFAULT_FAVORITES];
    }
  }

  /**
   * Obtém lista de IDs dos favoritos (para retrocompatibilidade estrita)
   */
  getFavorites() {
    return this.getFavoriteRecords().map(rec => rec.id);
  }

  /**
   * Verifica se um elemento (local, trilho ou evento) é favorito
   */
  isFavorite(id) {
    if (!id) return false;
    return this.getFavorites().includes(id);
  }

  /**
   * Adiciona um elemento aos favoritos com prevenção de duplicados
   */
  addFavorite(id, meta = {}) {
    if (!id) return false;
    const records = this.getFavoriteRecords();
    const existingIndex = records.findIndex(r => r.id === id);

    if (existingIndex > -1) {
      records[existingIndex] = {
        ...records[existingIndex],
        ...meta,
        id,
        type: meta.type || records[existingIndex].type || 'place'
      };
    } else {
      records.push({
        id,
        type: meta.type || 'place',
        title: meta.title || null,
        image: meta.image || null,
        category: meta.category || null,
        addedAt: new Date().toISOString()
      });
    }

    this._saveFavorites(records);
    return true;
  }

  /**
   * Remove um elemento dos favoritos
   */
  removeFavorite(id) {
    if (!id) return false;
    const records = this.getFavoriteRecords();
    const updated = records.filter(r => r.id !== id);
    if (updated.length !== records.length) {
      this._saveFavorites(updated);
      return true;
    }
    return false;
  }

  /**
   * Alterna estado de favorito de um elemento
   */
  toggleFavorite(id, meta = {}) {
    if (!id) return false;
    if (this.isFavorite(id)) {
      this.removeFavorite(id);
      return false;
    }
    this.addFavorite(id, meta);
    return true;
  }

  /**
   * Limpa todos os favoritos
   */
  clearFavorites() {
    this._saveFavorites([]);
  }

  _saveFavorites(records) {
    try {
      setStorageItem(KEYS.FAVORITES, JSON.stringify(records));
    } catch (e) {
      console.warn('[StorageService] Falha ao guardar favoritos:', e);
    }
    this.notifyFavoritesChanged(records.map(r => r.id));
  }

  onFavoritesChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  notifyFavoritesChanged(newList) {
    this.listeners.forEach(cb => {
      try { cb(newList); } catch (e) { console.error(e); }
    });
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('freixo:favoritesUpdated', {
        detail: { favorites: newList, records: this.getFavoriteRecords() }
      }));
    }
  }

  // ===========================================================================
  // Gestão e Persistência de Múltiplos Itinerários
  // ===========================================================================

  /**
   * Obtém a lista completa de roteiros guardados
   */
  getSavedItineraries() {
    try {
      const raw = getStorageItem(KEYS.SAVED_ITINERARIES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
      // Migração de registo único anterior se existir
      const single = this.getSavedItinerary();
      if (single && single.days) {
        const migrated = [this._normalizeItineraryRecord(single)];
        this._saveItinerariesList(migrated);
        return migrated;
      }
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Obtém um itinerário guardado pelo seu ID
   */
  getSavedItineraryById(id) {
    if (!id) return null;
    const list = this.getSavedItineraries();
    return list.find(it => it.id === id) || null;
  }

  /**
   * Guarda um roteiro no histórico e define-o como ativo
   */
  saveItinerary(itinerary) {
    if (!itinerary || !itinerary.days) return null;

    const normalized = this._normalizeItineraryRecord(itinerary);

    // Guarda como roteiro ativo mais recente
    try {
      setStorageItem(KEYS.SAVED_ITINERARY, JSON.stringify(normalized));
    } catch (e) {
      console.warn('[StorageService] Falha ao guardar roteiro ativo:', e);
    }

    // Guarda na lista de roteiros guardados
    const list = this.getSavedItineraries();
    const existingIdx = list.findIndex(item => item.id === normalized.id);

    if (existingIdx > -1) {
      list[existingIdx] = normalized;
    } else {
      list.unshift(normalized);
    }

    this._saveItinerariesList(list);
    return normalized;
  }

  /**
   * Remove um roteiro guardado pelo ID
   */
  deleteSavedItinerary(id) {
    if (!id) return false;
    const list = this.getSavedItineraries();
    const filtered = list.filter(item => item.id !== id);

    if (filtered.length !== list.length) {
      this._saveItinerariesList(filtered);

      const active = this.getSavedItinerary();
      if (active && active.id === id) {
        removeStorageItem(KEYS.SAVED_ITINERARY);
      }
      return true;
    }
    return false;
  }

  /**
   * Limpa todos os roteiros guardados
   */
  clearSavedItineraries() {
    this._saveItinerariesList([]);
    removeStorageItem(KEYS.SAVED_ITINERARY);
  }

  _saveItinerariesList(list) {
    try {
      setStorageItem(KEYS.SAVED_ITINERARIES, JSON.stringify(list));
    } catch (e) {
      console.warn('[StorageService] Falha ao guardar lista de roteiros:', e);
    }
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('freixo:itinerariesUpdated', { detail: { itineraries: list } }));
    }
  }

  _normalizeItineraryRecord(itinerary) {
    const summary = itinerary.summary || {};
    const meta = itinerary.meta || {};
    const days = itinerary.days || [];
    const id = itinerary.id || `itin_${meta.seed || Date.now()}_${days.length}d`;

    return {
      ...itinerary,
      id,
      title: itinerary.title || `Roteiro Oficial de ${days.length || summary.days || 2} Dias (${summary.interestLabel || summary.interest || 'Geral'})`,
      createdAt: itinerary.createdAt || new Date().toISOString(),
      daysCount: days.length || summary.days || 2,
      interest: summary.interest || 'cultura',
      pace: summary.pace || 'equilibrado',
      mobility: summary.mobility || 'carro',
      seed: meta.seed != null ? meta.seed : null,
      summary,
      meta,
      days
    };
  }

  /**
   * Obtém o itinerário previamente guardado como ativo
   */
  getSavedItinerary() {
    try {
      const raw = getStorageItem(KEYS.SAVED_ITINERARY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // ===========================================================================
  // Chat History
  // ===========================================================================

  saveChatHistory(messages) {
    try {
      setStorageItem(KEYS.CHAT_HISTORY, JSON.stringify(messages.slice(-20)));
    } catch (e) {
      console.warn(e);
    }
  }

  getChatHistory() {
    try {
      const raw = getStorageItem(KEYS.CHAT_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const storageService = new StorageService();
