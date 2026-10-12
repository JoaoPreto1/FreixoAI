const KEYS = {
  FAVORITES: 'freixo_ai_favorites',
  SAVED_ITINERARY: 'freixo_ai_saved_itinerary',
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

class StorageService {
  constructor() {
    this.listeners = [];
  }

  /**
   * Obtém lista de IDs favoritos
   */
  getFavorites() {
    try {
      const raw = getStorageItem(KEYS.FAVORITES);
      return raw ? JSON.parse(raw) : ["penedo-durao", "museu-da-seda"];
    } catch {
      return ["penedo-durao", "museu-da-seda"];
    }
  }

  /**
   * Alterna estado de favorito de um POI
   */
  toggleFavorite(poiId) {
    if (!poiId) return false;
    const current = this.getFavorites();
    const index = current.indexOf(poiId);
    let isNowFav = false;

    if (index > -1) {
      current.splice(index, 1);
      isNowFav = false;
    } else {
      current.push(poiId);
      isNowFav = true;
    }

    try {
      setStorageItem(KEYS.FAVORITES, JSON.stringify(current));
    } catch (e) {
      console.warn("Não foi possível gravar favorito no localStorage:", e);
    }

    this.notifyFavoritesChanged(current);
    return isNowFav;
  }

  /**
   * Verifica se um POI é favorito
   */
  isFavorite(poiId) {
    const list = this.getFavorites();
    return list.includes(poiId);
  }

  /**
   * Regista ouvintes para mudanças nos favoritos
   */
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
      window.dispatchEvent(new CustomEvent('freixo:favoritesUpdated', { detail: { favorites: newList } }));
    }
  }

  /**
   * Guarda o itinerário gerado
   */
  saveItinerary(itinerary) {
    try {
      setStorageItem(KEYS.SAVED_ITINERARY, JSON.stringify(itinerary));
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Obtém o itinerário previamente guardado
   */
  getSavedItinerary() {
    try {
      const raw = getStorageItem(KEYS.SAVED_ITINERARY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Guarda histórico de chat
   */
  saveChatHistory(messages) {
    try {
      setStorageItem(KEYS.CHAT_HISTORY, JSON.stringify(messages.slice(-20)));
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Obtém histórico de chat
   */
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
