class App {
    constructor() {
        if (!window.USER) {
            console.error('Erro: Objeto USER não encontrado');
            return;
        }

        this.api = new PreenchimentosAPI();
        this.ui = new PreenchimentosUI();
        this.state = new PreenchimentosState();

        // Inicializa a aplicação
        this.init();
    }

    async init() {
        // Configura os event listeners
        this.setupEventListeners();

        // Expõe funções necessárias globalmente
        window.app = {
            changePage: this.changePage.bind(this),
            deletePreenchimento: this.deletePreenchimento.bind(this),
            viewPreenchimento: this.viewPreenchimento.bind(this),
            toggleDetailsModal: this.toggleDetailsModal.bind(this),
            clearFilters: this.clearFilters.bind(this)
        };

        // Carrega os formulários para o filtro
        await this.loadFormularios();

        // Carrega os preenchimentos
        await this.loadPreenchimentos();
    }

    setupEventListeners() {
        // Configura a busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.state.setSearch(e.target.value);
                    this.loadPreenchimentos();
                }, 300);
            });
        }

        // Configura o filtro de formulário
        const formularioFilter = document.getElementById('formulario-filter');
        if (formularioFilter) {
            formularioFilter.addEventListener('change', (e) => {
                this.state.setFormularioId(e.target.value);
                this.loadPreenchimentos();
            });
        }

        // Configura o filtro de data
        const dateFilter = document.getElementById('date-filter');
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.state.setCreatedAt(e.target.value);
                this.loadPreenchimentos();
            });
        }

        // Configura o fechamento do modal ao clicar fora
        const detailsModal = document.getElementById('details-modal');
        if (detailsModal) {
            detailsModal.addEventListener('click', (e) => {
                if (e.target === detailsModal) {
                    this.toggleDetailsModal(false);
                }
            });
        }

        // Configura o fechamento do modal com a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggleDetailsModal(false);
            }
        });
    }

    async loadFormularios() {
        try {
            const response = await this.api.getFormularios();
            if (response && response.data) {
                this.state.setFormularios(response.data);
                this.ui.renderFormularioOptions(response.data);
            }
        } catch (error) {
            console.error('Erro ao carregar formulários:', error);
            // Não exibe erro para o usuário, apenas falha silenciosamente
        }
    }

    async loadPreenchimentos() {
        try {
            this.ui.showLoading();

            const response = await this.api.list(
                this.state.getCurrentPage(),
                this.state.getLimit(),
                this.state.getSearch(),
                this.state.getFormularioId(),
                '',
                this.state.getCreatedAt()
            );

            if (response && response.data) {
                this.state.setPreenchimentos(response.data);
                this.state.setMeta(response.meta || {});

                if (response.data.length === 0) {
                    this.ui.showEmpty();
                } else {
                    this.ui.renderPreenchimentos(response.data, this.state.getFormularios());
                    this.ui.renderPagination(response.meta);
                    this.ui.showPreenchimentos();
                }
            } else {
                this.ui.showEmpty();
            }
        } catch (error) {
            console.error('Erro ao carregar preenchimentos:', error);
            this.ui.showError(error.message || 'Erro ao carregar preenchimentos');
        }
    }

    async changePage(page) {
        this.state.setPage(page);
        await this.loadPreenchimentos();
    }

    async deletePreenchimento(id) {
        if (!confirm('Tem certeza que deseja excluir este preenchimento? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            await this.api.delete(id);
            
            // Remove o preenchimento do estado local
            this.state.removePreenchimento(id);
            
            // Recarrega a lista para atualizar a paginação
            await this.loadPreenchimentos();
            
            // Mostra mensagem de sucesso
            this.showSuccessMessage('Preenchimento excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir preenchimento:', error);
            this.showErrorMessage(error.message || 'Erro ao excluir preenchimento');
        }
    }

    async viewPreenchimento(id) {
        try {
            // Busca os dados completos do preenchimento
            const preenchimentoResponse = await this.api.getById(id);
            if (!preenchimentoResponse || !preenchimentoResponse.data) {
                this.showErrorMessage('Preenchimento não encontrado');
                return;
            }

            const preenchimento = preenchimentoResponse.data;

            // Busca os dados do formulário se temos o ID
            if (preenchimento.formulario_id) {
                try {
                    const formularioResponse = await this.api.getFormularioById(preenchimento.formulario_id);
                    if (formularioResponse && formularioResponse.data) {
                        // Consolida os dados do formulário com os do preenchimento
                        preenchimento.formulario_detalhes = formularioResponse.data;
                    }
                } catch (formularioError) {
                    console.warn('Erro ao buscar detalhes do formulário:', formularioError);
                    // Continua mesmo sem os detalhes do formulário
                }
            }

            this.ui.showDetailsModal(preenchimento);
        } catch (error) {
            console.error('Erro ao carregar preenchimento:', error);
            this.showErrorMessage(error.message || 'Erro ao carregar preenchimento');
        }
    }

    toggleDetailsModal(show = true) {
        if (show) {
            this.ui.showDetailsModal();
        } else {
            this.ui.hideDetailsModal();
        }
    }

    showSuccessMessage(message) {
        // Cria uma notificação de sucesso temporária
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Anima a entrada
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove após 3 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showErrorMessage(message) {
        // Cria uma notificação de erro temporária
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Anima a entrada
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove após 5 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    clearFilters() {
        // Limpa todos os filtros
        const searchInput = document.getElementById('search-input');
        const formularioFilter = document.getElementById('formulario-filter');
        const dateFilter = document.getElementById('date-filter');

        if (searchInput) searchInput.value = '';
        if (formularioFilter) formularioFilter.value = '';
        if (dateFilter) dateFilter.value = '';

        // Reseta o estado
        this.state.reset();
        
        // Recarrega os preenchimentos
        this.loadPreenchimentos();
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new App();
});