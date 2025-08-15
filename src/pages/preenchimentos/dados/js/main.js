class PreenchimentosDadosApp {
    constructor() {
        if (!window.USER) {
            console.error('Erro: Objeto USER não encontrado');
            return;
        }

        this.formularioId = this.getFormularioIdFromUrl();
        if (!this.formularioId) {
            this.showError('ID do formulário não encontrado na URL');
            return;
        }

        this.api = new DadosAPI();
        this.ui = new DadosUI();
        this.state = new DadosState();

        this.init();
    }

    getFormularioIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async init() {
        this.setupEventListeners();
        this.state.setFormularioId(this.formularioId);
        
        // Expõe funções globalmente
        window.app = {
            deletePreenchimento: this.deletePreenchimento.bind(this),
            goBack: this.goBack.bind(this),
            toggleSelection: this.toggleSelection.bind(this),
            isSelected: (id) => this.state.isSelected(id)
        };

        await this.loadData();
    }

    setupEventListeners() {
        // Botão de voltar
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => this.goBack());
        }

        // Filtro de busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.state.setSearchTerm(e.target.value);
                    this.renderCurrentData();
                }, 300);
            });
        }

        // Filtros de data (client-side)
        const dateFrom = document.getElementById('filter-date-from');
        const dateTo = document.getElementById('filter-date-to');
        if (dateFrom || dateTo) {
            const applyDateFilter = () => {
                const from = dateFrom ? dateFrom.value : null;
                const to = dateTo ? dateTo.value : null;
                this.state.setFilterDates(from, to);
                this.renderCurrentData();
            };

            if (dateFrom) dateFrom.addEventListener('change', applyDateFilter);
            if (dateTo) dateTo.addEventListener('change', applyDateFilter);
        }

        // Botão exportar
        const exportBtn = document.getElementById('export-selected');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSelected());
        }
    }

    async loadData() {
        try {
            this.ui.showLoading();

            // Carrega o formulário primeiro para obter sua estrutura
            const formularioResponse = await this.api.getFormularioById(this.formularioId);
            if (formularioResponse && formularioResponse.data) {
                this.state.setFormulario(formularioResponse.data);
                this.ui.updatePageTitle(formularioResponse.data);
                this.ui.createTableHeader(formularioResponse.data);
            }

            // Carrega os preenchimentos
            const preenchimentosResponse = await this.api.getPreenchimentos(this.formularioId);
            if (preenchimentosResponse && preenchimentosResponse.data) {
                this.state.setPreenchimentos(preenchimentosResponse.data);
                this.renderCurrentData();
            } else {
                this.ui.showEmpty();
            }

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.ui.showError(error.message || 'Erro ao carregar preenchimentos');
        }
    }

    renderCurrentData() {
        const filteredPreenchimentos = this.state.getFilteredPreenchimentos();
        const formulario = this.state.getFormulario();

        if (filteredPreenchimentos.length > 0) {
            this.ui.renderTable(filteredPreenchimentos, formulario);
            this.ui.showTable();
        } else {
            this.ui.showEmpty();
        }

    // Atualiza estado do botão exportar
    this.updateExportButtonState();
    }

    async deletePreenchimento(id) {
        if (!confirm('Tem certeza que deseja excluir este preenchimento? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            await this.api.deletePreenchimento(id);
            
            // Remove o preenchimento do estado
            this.state.removePreenchimento(id);
            this.renderCurrentData();
            
            this.showSuccessMessage('Preenchimento excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir preenchimento:', error);
            this.showErrorMessage(error.message || 'Erro ao excluir preenchimento');
        }
    }

    goBack() {
        const baseUrl = window.APP_CONFIG?.baseUrl || window.location.origin;
        window.location.href = `${baseUrl}/src/pages/preenchimentos/`;
    }

    toggleSelection(id, checked) {
        this.state.toggleSelection(id, checked);
        this.updateExportButtonState();
    }

    updateExportButtonState() {
        const exportBtn = document.getElementById('export-selected');
        if (!exportBtn) return;
        const hasSelection = this.state.getSelectedIds().length > 0;
        exportBtn.disabled = !hasSelection;
    }

    async exportSelected() {
        const ids = this.state.getSelectedIds();
        if (!ids.length) return;
        try {
            await this.api.exportPreenchimentos(ids, this.formularioId);
        } catch (e) {
            this.showErrorMessage(e.message || 'Falha ao exportar');
        }
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 5000);
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new PreenchimentosDadosApp();
});
