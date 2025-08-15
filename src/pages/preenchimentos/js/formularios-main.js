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
            viewFormulario: this.viewFormulario.bind(this),
            clearFilters: this.clearFilters.bind(this)
        };

        // Carrega os formulários
        await this.loadFormularios();
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
                    this.loadFormularios();
                }, 300);
            });
        }

        // Configura o filtro de data
        const dateFilter = document.getElementById('date-filter');
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.state.setCreatedAt(e.target.value);
                this.loadFormularios();
            });
        }
    }

    async loadFormularios() {
        try {
            this.ui.showLoading();

            const response = await this.api.getFormularios();
            
            if (response && response.code === 200 && response.data && response.data.length > 0) {
                // Aplica filtros locais
                let formularios = response.data;
                
                // Filtro de busca
                const search = this.state.getSearch();
                if (search) {
                    formularios = formularios.filter(f => 
                        (f.nome && f.nome.toLowerCase().includes(search.toLowerCase())) ||
                        (f.descricao && f.descricao.toLowerCase().includes(search.toLowerCase()))
                    );
                }

                // Filtro de data
                const created_at = this.state.getCreatedAt();
                if (created_at) {
                    formularios = formularios.filter(f => {
                        if (!f.created_at) return false;
                        const formularioDate = new Date(f.created_at).toISOString().split('T')[0];
                        return formularioDate === created_at;
                    });
                }

                // Aplica paginação local
                const page = this.state.getCurrentPage();
                const limit = this.state.getLimit();
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + limit;
                const paginatedFormularios = formularios.slice(startIndex, endIndex);

                // Prepara meta para paginação
                const meta = {
                    current_page: page,
                    total_pages: Math.ceil(formularios.length / limit),
                    total_items: formularios.length,
                    per_page: limit
                };

                this.state.setFormularios(formularios);
                this.state.setMeta(meta);
                
                this.ui.renderPreenchimentos(paginatedFormularios);
                this.ui.renderPagination(meta);
                this.ui.showPreenchimentos();
            } else {
                this.ui.showEmpty();
            }
        } catch (error) {
            console.error('Erro ao carregar formulários:', error);
            this.ui.showError(error.message || 'Erro ao carregar formulários');
        }
    }

    async changePage(page) {
        this.state.setPage(page);
        await this.loadFormularios();
    }

    viewFormulario(formularioId) {
        // Redireciona para a página de preenchimentos do formulário
        const baseUrl = window.APP_CONFIG?.baseUrl || window.location.origin;
        window.location.href = `${baseUrl}/formularios/preenchimentos/dados?id=${formularioId}`;
    }

    clearFilters() {
        // Limpa todos os filtros
        const searchInput = document.getElementById('search-input');
        const dateFilter = document.getElementById('date-filter');

        if (searchInput) searchInput.value = '';
        if (dateFilter) dateFilter.value = '';

        // Reseta o estado
        this.state.reset();
        
        // Recarrega os formulários
        this.loadFormularios();
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
                document.body.removeChild(notification);
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
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
