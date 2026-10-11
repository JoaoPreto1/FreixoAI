/**
 * FREIXO AI — Gestor de Armazenamento Local (LocalStorage)
 * Gere favoritos, preferências de viagem e histórico do assistente
 */

const KEYS = {
  FAVORITES: 'freixo_ai_favorites',
  SAVED_ITINERARY: 'freixo_ai_saved_itinerary',
  CHAT_HISTORY: 'freixo_ai_chat_history',
  PREFERENCES: 'freixo_ai_user_preferences'
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
      const raw = localStorage.getItem(KEYS.FAVORITES);
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
      localStorage.setItem(KEYS.FAVORITES, JSON.stringify(current));
    } catch (e) {
      console.warn("Não foi possível gravar favorito no localStorage:", e);
    }

    // Disparar evento para atualizar a interface em tempo real
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
    // Disparar também evento no window
    window.dispatchEvent(new CustomEvent('freixo:favoritesUpdated', { detail: { favorites: newList } }));
  }

  /**
   * Guarda o itinerário gerado
   */
  saveItinerary(itinerary) {
    try {
      localStorage.setItem(KEYS.SAVED_ITINERARY, JSON.stringify(itinerary));
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Obtém o itinerário previamente guardado
   */
  getSavedItinerary() {
    try {
      const raw = localStorage.getItem(KEYS.SAVED_ITINERARY);
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
      localStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(messages.slice(-20)));
    } catch (e) {
      console.warn(e);
    }
  }

  /**
   * Obtém histórico de chat
   */
  getChatHistory() {
    try {
      const raw = localStorage.getItem(KEYS.CHAT_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const storageService = new StorageService();
