class CheckinApp {
    constructor() {
        this.api = null;
        this.ui = null;
        this.state = null;
        this.init();
    }

    async init() {
        try {
            // Inicializar componentes
            this.api = new CheckinAPI();
            this.ui = new CheckinUI(this.api);
            this.state = new CheckinState();

            // Configurar eventos
            this.setupEventListeners();

            // Carregar dados iniciais
            await this.loadCheckins();

            console.log('CheckinApp inicializado com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar CheckinApp:', error);
            this.ui?.showError('Erro ao inicializar a aplicação');
        }
    }



    setupEventListeners() {
        // Botão novo check-in
        const newBtn = document.getElementById('btn-new-checkin');
        if (newBtn) {
            newBtn.addEventListener('click', async () => await this.create());
        }

        // Botão fechar modal
        const closeBtn = document.getElementById('btn-close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggleModal(false));
        }

        // Botão cancelar modal
        const cancelBtn = document.getElementById('btn-cancel-modal');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.toggleModal(false));
        }

        // Formulário de criação/edição
        const form = document.getElementById('form-create');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Eventos de paginação
        this.setupPaginationEvents();

        // Eventos de ordenação
        this.setupSortingEvents();


    }

    setupPaginationEvents() {
        // Implementação básica se necessário
    }

    setupSortingEvents() {
        // Implementação básica se necessário
    }

    // ========== OPERAÇÕES CRUD ==========
    async loadCheckins() {
        try {
            const response = await this.api.list();
            const checkins = response.data || response.checkins || response || [];
            this.state.setCheckins(checkins);
            this.renderCheckins();
        } catch (error) {
            console.error('Erro ao carregar check-ins:', error);
            this.ui.showError('Erro ao carregar check-ins: ' + error.message);
        }
    }

    async create() {
        // Solicitar apenas o nome do check-in
        const nome = prompt('Digite o nome do novo check-in:');
        if (!nome || nome.trim() === '') {
            this.ui.showNotification('Nome do check-in é obrigatório', 'error');
            return;
        }

        try {
            // Criar check-in apenas com nome
            const checkinData = { nome: nome.trim() };
            const response = await this.api.create(checkinData);
            
            if (response.success || response.code === 201) {
                const newCheckin = response.data || { ...checkinData, id: Date.now() };
                this.state.addCheckin(newCheckin);
                this.renderCheckins();
                this.ui.showNotification('Check-in criado com sucesso! Agora você pode editá-lo para adicionar mais detalhes.', 'success');
                
                // Abrir automaticamente para edição
                setTimeout(() => {
                    this.edit(newCheckin.id);
                }, 1000);
            } else {
                throw new Error(response.message || 'Erro ao criar check-in');
            }
        } catch (error) {
            console.error('Erro ao criar check-in:', error);
            this.ui.showNotification('Erro ao criar check-in: ' + error.message, 'error');
        }
    }

    async edit(checkinId) {
        try {
            this.ui.startEditLoading(checkinId);
            
            // Primeiro tentar buscar no estado local
            let checkin = this.state.getCheckinById(checkinId);
            
            // Se não encontrar localmente, buscar na API
            if (!checkin) {
                const response = await this.api.getById(checkinId);
                if (response.success || response.code === 200) {
                    checkin = response.data;
                } else {
                    throw new Error(response.message || 'Check-in não encontrado');
                }
            }

            this.state.setCurrentCheckinId(checkinId);
            await this.ui.openModal(checkin);
        } catch (error) {
            console.error('Erro ao carregar check-in para edição:', error);
            this.ui.showNotification('Erro ao carregar check-in: ' + error.message, 'error');
        } finally {
            this.ui.stopEditLoading(checkinId);
        }
    }

    getFormData() {
        const form = document.getElementById('form-create');
        if (!form) return null;

        return {
            nome: form.querySelector('#checkin-nome')?.value || '',
            processo_etapa_id: form.querySelector('#checkin-processo')?.value || null,
            evento_id: form.querySelector('#checkin-evento')?.value || null,
            formulario_id: form.querySelector('#checkin-formulario')?.value || null
        };
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const checkinData = this.getFormData();
        if (!checkinData) return;

        // Validação básica
        if (!checkinData.nome) {
            this.ui.showNotification('Nome do check-in é obrigatório', 'error');
            return;
        }

        try {
            const checkinId = formData.get('checkin-id');
            let response;

            if (checkinId) {
                // Editar
                response = await this.api.update(checkinId, checkinData);
                if (response.success || response.code === 200) {
                    this.state.updateCheckin(parseInt(checkinId), response.data || checkinData);
                    this.ui.showNotification('Check-in atualizado com sucesso', 'success');
                } else {
                    throw new Error(response.message || 'Erro ao atualizar check-in');
                }
            } else {
                // Criar
                response = await this.api.create(checkinData);
                if (response.success || response.code === 201) {
                    const newCheckin = response.data || { ...checkinData, id: Date.now() };
                    this.state.addCheckin(newCheckin);
                    this.ui.showNotification('Check-in criado com sucesso', 'success');
                } else {
                    throw new Error(response.message || 'Erro ao criar check-in');
                }
            }

            this.ui.closeModal();
            this.renderCheckins();
        } catch (error) {
            console.error('Erro ao salvar check-in:', error);
            this.ui.showNotification('Erro ao salvar check-in: ' + error.message, 'error');
        }
    }

    confirmDelete(checkinId, checkinName) {
        if (confirm(`Tem certeza que deseja excluir o check-in "${checkinName}"?\n\nEsta ação não pode ser desfeita.`)) {
            this.delete(checkinId);
        }
    }

    async delete(checkinId) {
        try {
            const response = await this.api.delete(checkinId);
            
            if (response.success || response.code === 200) {
                this.state.removeCheckin(parseInt(checkinId));
                this.renderCheckins();
                this.ui.showNotification('Check-in excluído com sucesso', 'success');
            } else {
                throw new Error(response.message || 'Erro ao excluir check-in');
            }
        } catch (error) {
            console.error('Erro ao excluir check-in:', error);
            this.ui.showNotification('Erro ao excluir check-in: ' + error.message, 'error');
        }
    }

    toggleModal(show) {
        if (show) {
            this.ui.openModal();
        } else {
            this.ui.closeModal();
            this.state.setCurrentCheckinId(null);
        }
    }



    // ========== RENDERIZAÇÃO ==========
    renderCheckins() {
        const checkins = this.state.getCheckins();
        this.ui.renderCheckins(checkins);
    }

    // ========== UTILITÁRIOS ==========
    refresh() {
        this.loadCheckins();
    }

    getState() {
        return this.state;
    }

    getAPI() {
        return this.api;
    }

    getUI() {
        return this.ui;
    }

    // ========== MÉTODOS PÚBLICOS PARA DEBUGGING ==========
    debug() {
        return {
            checkins: this.state.getCheckins(),
            api: this.api,
            ui: this.ui,
            state: this.state
        };
    }
}

// Inicializar aplicação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CheckinApp();
});

// Exportar para uso global
window.CheckinApp = CheckinApp;