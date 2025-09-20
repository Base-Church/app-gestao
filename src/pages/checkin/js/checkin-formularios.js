class CheckinFormularios {
    constructor(api) {
        this.api = api;
        this.createModal = null;
    }

    init() {
        this.createModal = document.getElementById('modal-create-checkin');
        this.setupFormEventListeners();
    }

    setupFormEventListeners() {
        // Event listener para o formulário de criação
        const createForm = document.getElementById('form-create-checkin');
        if (createForm) {
            createForm.addEventListener('submit', (e) => this.handleCreateFormSubmit(e));
        }
        
        // Event listener para fechar o modal
        const closeBtn = document.getElementById('btn-close-create-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCreateModal());
        }
        
        // Event listener para fechar clicando no backdrop
        if (this.createModal) {
            this.createModal.addEventListener('click', (e) => {
                if (e.target === this.createModal) {
                    this.closeCreateModal();
                }
            });
        }
    }

    async loadSelectOptions(isCreateModal = false) {
        try {
            const ministerioId = await this.api.getMinisterioId();
            if (!ministerioId) return;

            // Carrega dados em paralelo
            const [formularios, processos, eventos] = await Promise.all([
                this.api.getFormularios(ministerioId),
                this.api.getProcessos(ministerioId),
                this.api.getEventos(ministerioId)
            ]);

            // Determina os seletores baseado no tipo de modal
            const prefix = isCreateModal ? 'create-checkin-' : 'checkin-';
            const processoSelector = isCreateModal ? 'create-checkin-etapas' : 'checkin-processo';
            
            // Popula os selects - corrigindo os seletores
            this.populateSelect(`${prefix}formulario`, formularios.data || [], 'id', 'nome');
            this.populateSelect(processoSelector, processos.data || [], 'id', 'nome');
            this.populateSelect(`${prefix}evento`, eventos.data || [], 'id', 'nome');

        } catch (error) {
            console.error('Erro ao carregar opções dos selects:', error);
        }
    }

    async loadFormularios(ministerioId) {
        const select = document.getElementById('checkin-formulario');
        if (!select) return;

        try {
            // Mostrar loading
            select.innerHTML = '<option value="">Carregando...</option>';
            
            const response = await this.api.getFormularios(ministerioId);
            const formularios = response.data || response.formularios || response || [];
            
            // Limpar e adicionar opção padrão
            select.innerHTML = '<option value="">Selecione um formulário</option>';
            
            // Adicionar formulários
            formularios.forEach(formulario => {
                const option = document.createElement('option');
                option.value = formulario.id;
                option.textContent = formulario.nome || formulario.titulo;
                select.appendChild(option);
            });
            
        } catch (error) {
            console.error('Erro ao carregar formulários:', error);
            select.innerHTML = '<option value="">Erro ao carregar formulários</option>';
        }
    }

    async loadProcessos(ministerioId) {
        const select = document.getElementById('checkin-processo');
        if (!select) return;

        try {
            // Mostrar loading
            select.innerHTML = '<option value="">Carregando...</option>';
            
            const response = await this.api.getProcessos(ministerioId);
            const processos = response.data || response.processos || response || [];
            
            // Limpar e adicionar opção padrão
            select.innerHTML = '<option value="">Selecione um processo</option>';
            
            // Adicionar processos
            processos.forEach(processo => {
                const option = document.createElement('option');
                option.value = processo.id;
                option.textContent = processo.nome || processo.titulo;
                select.appendChild(option);
            });
            
        } catch (error) {
            console.error('Erro ao carregar processos:', error);
            select.innerHTML = '<option value="">Erro ao carregar processos</option>';
        }
    }

    async loadEventos(ministerioId) {
        const select = document.getElementById('checkin-evento');
        if (!select) return;

        try {
            // Mostrar loading
            select.innerHTML = '<option value="">Carregando...</option>';
            
            const response = await this.api.getEventos();
            const eventos = response.data || response.eventos || response || [];
            
            // Limpar e adicionar opção padrão
            select.innerHTML = '<option value="">Selecione um evento</option>';
            
            // Adicionar eventos
            eventos.forEach(evento => {
                const option = document.createElement('option');
                option.value = evento.id;
                option.textContent = evento.nome || evento.titulo;
                select.appendChild(option);
            });
            
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            select.innerHTML = '<option value="">Erro ao carregar eventos</option>';
        }
    }

    async openCreateModal() {
        if (!this.createModal) return;
        
        // Carrega os selects
        await this.loadSelectOptions(true);
        
        // Limpa o formulário
        this.clearCreateForm();
        
        // Exibe o modal
        this.createModal.classList.remove('hidden');
        this.createModal.classList.add('flex');
    }

    closeCreateModal() {
        if (this.createModal) {
            this.createModal.classList.add('hidden');
            this.createModal.classList.remove('flex');
        }
    }

    clearCreateForm() {
        const form = document.getElementById('form-create-checkin');
        if (form) {
            form.reset();
        }
    }

    async handleCreateFormSubmit(e) {
        e.preventDefault();
        
        const formData = this.getCreateFormData();
        
        // Validação: apenas formulário é obrigatório
        if (!formData.formulario_id) {
            this.showNotification('Por favor, selecione um formulário.', 'error');
            return;
        }

        try {
            const result = await this.api.create(formData);
            
            if (result.success) {
                this.showNotification('Check-in criado com sucesso!', 'success');
                this.closeCreateModal();
                
                // Recarrega a lista
                if (window.checkinApp && window.checkinApp.loadCheckins) {
                    window.checkinApp.loadCheckins();
                }
            } else {
                this.showNotification(result.message || 'Erro ao criar check-in', 'error');
            }
        } catch (error) {
            console.error('Erro ao criar check-in:', error);
            this.showNotification('Erro ao criar check-in', 'error');
        }
    }

    getCreateFormData() {
        const form = document.getElementById('form-create-checkin');
        if (!form) return {};

        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }

    populateSelect(selector, data, valueField, textField) {
        // Adicionar # se não estiver presente no seletor
        const selectorWithHash = selector.startsWith('#') ? selector : `#${selector}`;
        const select = document.querySelector(selectorWithHash);
        
        if (!select) {
            return;
        }

        // Limpar opções existentes (exceto a primeira)
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        // Verificar se data é um array
        if (!Array.isArray(data)) {
            return;
        }

        // Adicionar novas opções
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            select.appendChild(option);
        });
        
    }

    showNotification(message, type = 'info') {
        // Remove notificações existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
        
        // Define cores baseado no tipo
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white'
        };
        
        notification.className += ` ${colors[type] || colors.info}`;
        notification.textContent = message;
        
        // Adiciona ao DOM
        document.body.appendChild(notification);
        
        // Anima entrada
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove após 5 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

window.CheckinFormularios = CheckinFormularios;