import { renderNavbar } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';
import { AiChatWidget } from './components/AiChatWidget.js';
import { apiService } from './services/apiService.js';

class FreixoApp {
  constructor() {
    this.aiWidget = null;
  }

  async init(activePage = 'index') {
    renderNavbar(activePage);
    renderFooter();

    this.aiWidget = new AiChatWidget();
    this.aiWidget.init();

    this.checkApiHealth();
    this.bindGlobalShortcuts();
  }

  async checkApiHealth() {
    try {
      await apiService.checkHealth();
    } catch {
      // Ignora silenciosamente, o modo mock já está garantido como fallback
    }
  }

  bindGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Tecla 'k' com Ctrl ou Cmd abre a IA
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('freixo:openAiChat'));
      }
    });
  }
}

export const freixoApp = new FreixoApp();
