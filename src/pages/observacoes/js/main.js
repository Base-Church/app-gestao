import { ObservacoesAPI } from './api.js';
import { UI } from './ui.js';

class App {
    constructor() {
        if (!window.USER) {
            console.error('Dados do usuário não encontrados');
            return;
        }

        this.api = new ObservacoesAPI();
        this.ui = new UI();
        this.setupEventListeners();
        this.initialize();
    }

    setupEventListeners() {
        // Listener para mudança de mês
        this.ui.mesSelect?.addEventListener('change', () => this.loadObservacoes());
    }

    initialize() {
        // Define o mês atual como valor inicial
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        this.ui.mesSelect.value = `${year}-${month.toString().padStart(2, '0')}`;
        
        this.loadObservacoes();
    }

    async loadObservacoes() {
        try {
            this.ui.toggleElements(true);
            
            const { organizacao_id, ministerio_atual } = window.USER;
            const mes = this.ui.mesSelect.value;

            const response = await this.api.list(organizacao_id, ministerio_atual, mes);
            
            if (!response.data || response.data.length === 0) {
                this.ui.toggleElements(false, false, true);
                return;
            }

            this.ui.renderObservacoes(response.data);
            this.ui.toggleElements();

        } catch (error) {
            this.ui.showError(error.message);
        }
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    // Expõe o app globalmente para debug
    window.app = app;
});
