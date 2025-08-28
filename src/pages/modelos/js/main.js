import { ModelosAPI } from './api.js';
import { UI } from './ui.js';
import { State } from './state.js';

class App {
    constructor() {
        if (!window.USER || !window.USER.ministerios) {
            return;
        }

        const baseUrl = window.APP_CONFIG.baseUrl;
        if (!baseUrl) {
            console.warn('Base URL não encontrada');
        }

        this.api = new ModelosAPI(baseUrl);
        this.ui = new UI();
        this.state = new State();
        
        this.setupEventListeners();
        this.loadModelos();
    }

    setupEventListeners() {
        window.app = {
            deleteModelo: (id, nome) => this.deleteModelo(id, nome)
        };
    }

    async loadModelos() {
        if (this.state.isLoading) return;

        try {
            const ministerio_atual = this.state.getCurrentMinisterio();

            this.state.setLoading(true);
            this.ui.toggleElements(true);

            const data = await this.api.list(ministerio_atual);
            
            if (!data.data || data.data.length === 0) {
                this.ui.toggleElements(false, false, true);
                return;
            }

            this.ui.renderModelos(data.data);
            this.ui.toggleElements();

        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
            this.state.setError(error.message);
            this.ui.toggleElements(false, true);
            this.ui.errorMessage.textContent = error.message;
        } finally {
            this.state.setLoading(false);
        }
    }

    async deleteModelo(id, nome) {
        try {
            if (!confirm(`Tem certeza que deseja excluir o modelo "${nome}"?`)) {
                return;
            }

            await this.api.delete(id);
            this.ui.showToast('Modelo excluído com sucesso!');
            this.loadModelos(); // Recarrega a lista
        } catch (error) {
            console.error('Erro ao excluir modelo:', error);
            this.ui.showToast(error.message || 'Erro ao excluir modelo', 'error');
        }
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => new App());
