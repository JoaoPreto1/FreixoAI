import { renderNavbar } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';
import { AiChatWidget } from './components/AiChatWidget.js';
import { globalSearchModal } from './components/GlobalSearchModal.js';
import { apiService } from './services/apiService.js';

class FreixoApp {
  constructor() {
    this.aiWidget = null;
  }

  async init(activePage = 'index') {
    renderNavbar(activePage);
    renderFooter();

    globalSearchModal.init();

    this.aiWidget = new AiChatWidget();
    this.aiWidget.init();

    this.checkApiHealth();
  }

  async checkApiHealth() {
    try {
      await apiService.checkHealth();
    } catch {
      // O modo mock já está garantido como fallback
    }
  }
}

export const freixoApp = new FreixoApp();
