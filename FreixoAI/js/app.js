/**
 * FREIXO AI — Aplicação Principal (Bootstrap)
 * Inicialização de componentes partilhados, navegação e assistente inteligente
 */

import { renderNavbar } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';
import { AiChatWidget } from './components/AiChatWidget.js';
import { apiService } from './services/apiService.js';

class FreixoApp {
  constructor() {
    this.aiWidget = null;
  }

  async init(activePage = 'index') {
    // 1. Renderizar Navegação e Rodapé
    renderNavbar(activePage);
    renderFooter();

    // 2. Inicializar Widget Flutuante de IA
    this.aiWidget = new AiChatWidget();
    this.aiWidget.init();

    // 3. Verificação de Saúde das APIs em background (Node.js & FastAPI)
    this.checkApiHealth();

    // 4. Configurar atalhos globais de teclado
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
