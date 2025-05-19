import { SolicitacoesAPI } from './api.js';
import { UI } from './ui.js';
import { State } from './state.js';

class App {
    constructor() {
        if (!window.USER || !window.USER.ministerios) {
            return;
        }

        this.api = new SolicitacoesAPI();
        this.ui = new UI();
        this.state = new State();
        
        this.setupEventListeners();
        this.loadSolicitacoes();
    }

    setupEventListeners() {
        window.app = {
            aprovarSolicitacao: (id) => this.confirmarAcao(id, true),
            rejeitarSolicitacao: (id) => this.confirmarAcao(id, false)
        };

        // Escutar mudanças de ministério
        window.addEventListener('ministerio-changed', (event) => {
            if (event.detail?.ministerio_id) {
                this.loadSolicitacoes();
            }
        });
    }

    async loadSolicitacoes() {
        if (this.state.isLoading) return;

        try {
            const ministerio_atual = this.state.getCurrentMinisterio();

            this.state.setLoading(true);
            this.ui.toggleElements(true);

            const response = await this.api.list(ministerio_atual);
            
            if (!response.data || response.data.length === 0) {
                this.ui.toggleElements(false, false, true);
                return;
            }

            this.ui.renderSolicitacoes(response.data);
            this.ui.toggleElements();

        } catch (error) {
            console.error('Erro ao carregar solicitações:', error);
            this.state.setError(error.message);
            this.ui.toggleElements(false, true);
            this.ui.errorMessage.textContent = error.message;
        } finally {
            this.state.setLoading(false);
        }
    }

    confirmarAcao(id, isApproval) {
        this.ui.showConfirmModal(isApproval, () => this.responderSolicitacao(id, isApproval));
    }

    async responderSolicitacao(id, isApproval) {
        try {
            const status = isApproval ? 'APROVADO' : 'REJEITADO';
            const observacao = isApproval ? 
                'Bem-vindo ao ministério!' : 
                await this.promptObservacao();

            if (!observacao) return; // Usuário cancelou

            const response = await this.api.responder(id, { status, observacao });
            
            this.ui.showFeedbackModal(true, 
                isApproval ? 
                'Solicitação aprovada com sucesso!' : 
                'Solicitação rejeitada com sucesso!'
            );

            this.loadSolicitacoes(); // Recarrega a lista

        } catch (error) {
            console.error('Erro ao responder solicitação:', error);
            this.ui.showFeedbackModal(false, error.message || 'Erro ao responder solicitação');
        }
    }

    async promptObservacao() {
        return prompt('Por favor, insira um motivo para a rejeição:');
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => new App());