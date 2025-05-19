export class UI {
    constructor() {
        this.initializeElements();
        this.initializeModalEvents();
    }

    initializeElements() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.errorMessage = document.getElementById('error-message');
        this.emptyState = document.getElementById('empty-state');
        this.solicitacoesGrid = document.getElementById('solicitacoes-grid');
        this.solicitacoesList = document.getElementById('solicitacoes-list');
        
        // Elementos dos modais
        this.confirmModal = document.getElementById('confirm-modal');
        this.confirmMessage = document.getElementById('confirm-message');
        this.confirmAction = document.getElementById('confirm-action');
        this.cancelAction = document.getElementById('cancel-action');
        this.confirmButtonText = document.getElementById('confirm-button-text');
        this.confirmSpinner = document.getElementById('confirm-spinner');
        this.confirmIconContainer = document.getElementById('confirm-icon-container');
        
        this.feedbackModal = document.getElementById('feedback-modal');
        this.feedbackTitle = document.getElementById('feedback-title');
        this.feedbackMessage = document.getElementById('feedback-message');
        this.feedbackIconContainer = document.getElementById('feedback-icon-container');
        this.closeFeedback = document.getElementById('close-feedback');
    }

    initializeModalEvents() {
        // Fechar modais quando clicar fora
        [this.confirmModal, this.feedbackModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModals();
                }
            });
        });

        // Fechar modal de feedback
        this.closeFeedback.addEventListener('click', () => {
            this.hideFeedbackModal();
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModals();
            }
        });
    }

    toggleElements(loading = false, error = false, empty = false) {
        this.loadingIndicator.classList.toggle('hidden', !loading);
        this.errorContainer.classList.toggle('hidden', !error);
        this.emptyState.classList.toggle('hidden', !empty);
        this.solicitacoesGrid.classList.toggle('hidden', loading || error || empty);
    }

    showConfirmModal(isApproval = true, callback) {
        // Configurar aparência baseada no tipo de ação
        const iconBg = isApproval ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50';
        const iconColor = isApproval ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
        const buttonBg = isApproval ? 'bg-primary-600 hover:bg-primary-500' : 'bg-red-600 hover:bg-red-500';
        
        this.confirmIconContainer.className = `mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBg} sm:mx-0 sm:h-10 sm:w-10`;
        
        // Usar setAttribute para SVG
        const svg = this.confirmIconContainer.querySelector('svg');
        svg.setAttribute('class', `h-6 w-6 ${iconColor}`);
        
        this.confirmAction.className = `inline-flex w-full justify-center rounded-md ${buttonBg} px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`;
        
        // Atualizar texto
        this.confirmMessage.textContent = isApproval ? 
            'Tem certeza que deseja aprovar esta solicitação?' : 
            'Tem certeza que deseja rejeitar esta solicitação?';
        this.confirmButtonText.textContent = isApproval ? 'Aprovar' : 'Rejeitar';

        // Configurar eventos
        const handleConfirm = async () => {
            this.setConfirmLoading(true);
            try {
                await callback();
            } finally {
                this.setConfirmLoading(false);
                this.hideConfirmModal();
            }
        };

        this.confirmAction.onclick = handleConfirm;
        this.cancelAction.onclick = () => this.hideConfirmModal();

        // Mostrar modal
        this.confirmModal.classList.remove('hidden');
    }

    showFeedbackModal(success = true, message) {
        const iconBg = success ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50';
        const iconColor = success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
        
        this.feedbackIconContainer.className = `mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBg} sm:mx-0 sm:h-10 sm:w-10`;
        
        // Usar setAttribute para SVG
        const svg = this.feedbackIconContainer.querySelector('svg');
        svg.setAttribute('class', `h-6 w-6 ${iconColor}`);
        
        this.feedbackTitle.textContent = success ? 'Sucesso!' : 'Erro';
        this.feedbackMessage.textContent = message;
        
        this.feedbackModal.classList.remove('hidden');
    }

    setConfirmLoading(loading) {
        this.confirmSpinner.classList.toggle('hidden', !loading);
        this.confirmButtonText.classList.toggle('hidden', loading);
        this.confirmAction.disabled = loading;
        this.cancelAction.disabled = loading;
    }

    hideModals() {
        this.hideConfirmModal();
        this.hideFeedbackModal();
    }

    hideConfirmModal() {
        this.confirmModal.classList.add('hidden');
        this.setConfirmLoading(false);
    }

    hideFeedbackModal() {
        this.feedbackModal.classList.add('hidden');
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        
        toast.className = `fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 translate-y-0 opacity-100`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStatusBadge(status) {
        const badges = {
            'PENDENTE': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
            'APROVADO': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            'REJEITADO': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
        };

        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status] || badges['PENDENTE']}">
            ${status}
        </span>`;
    }

    renderSolicitacaoRow(solicitacao) {
        return `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                        ${solicitacao.voluntario_nome}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        ${this.formatDate(solicitacao.data_solicitacao)}
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${this.getStatusBadge(solicitacao.status)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${solicitacao.status === 'PENDENTE' ? `
                        <div class="flex justify-end items-center space-x-2">
                            <button onclick="app.aprovarSolicitacao(${solicitacao.id})" 
                                    class="inline-flex items-center px-3 py-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/50 dark:text-primary-400 dark:hover:bg-primary-800/50 rounded-lg transition-colors">
                                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Aprovar
                            </button>
                            <button onclick="app.rejeitarSolicitacao(${solicitacao.id})" 
                                    class="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-800/50 rounded-lg transition-colors">
                                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Rejeitar
                            </button>
                        </div>
                    ` : ''}
                </td>
            </tr>
        `;
    }

    renderSolicitacoes(solicitacoes) {
        if (!this.solicitacoesList) return;
        this.solicitacoesList.innerHTML = solicitacoes.map(solicitacao => this.renderSolicitacaoRow(solicitacao)).join('');
    }
}