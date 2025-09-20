class CheckinUI {
    constructor(api) {
        this.api = api;
        this.modal = null;
        this.currentCheckinId = null;
        
        this.init();
    }

    init() {
        this.modal = document.getElementById('modal-checkin');
        this.setupEventListeners();
        
        // Inicializa os módulos após garantir que as classes estão disponíveis
        this.initModules();
    }

    initModules() {
        // Containers dos módulos
        const acessosContainer = document.getElementById('checkin-acessos-container');
        const itensContainer = document.getElementById('checkin-itens-container');
        
        // Instâncias dos módulos com dependências
        this.acessosModule = new CheckinAcessos(
            this.api, 
            acessosContainer, 
            (msg, type) => this.showNotification(msg, type),
            (str) => this.escapeHtml(str)
        );
        
        this.itensModule = new CheckinItens(
            this.api, 
            itensContainer, 
            (msg, type) => this.showNotification(msg, type),
            (str) => this.escapeHtml(str),
            (date) => this.formatDateForInput(date),
            (time) => this.formatTimeForInput(time)
        );
        
        this.formulariosModule = new CheckinFormularios(this.api);
        
        // Inicializa os módulos
        if (this.formulariosModule.init) this.formulariosModule.init();
    }

    setupEventListeners() {
        // Eventos dos modais
        const closeBtn = document.getElementById('btn-close-modal');
        const cancelBtn = document.getElementById('btn-cancel-modal');
        
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeModal());

        // Busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    window.app.search(e.target.value);
                }, 300);
            });
        }

        // Botões do modal
        this.setupModalButtons();
    }

    setupModalButtons() {
        // Botão adicionar item - delega para o módulo de itens
        const addItemBtn = document.getElementById('add-checkin-item-btn');
        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => this.itensModule.addItem());
        }

        // Botão adicionar acesso - delega para o módulo de acessos
        const addAcessoBtn = document.getElementById('add-checkin-acesso-btn');
        if (addAcessoBtn) {
            addAcessoBtn.addEventListener('click', () => this.acessosModule.addAcesso());
        }
    }

    // ========== RENDERIZAÇÃO DA LISTA ==========
    renderCheckins(checkins) {
        const tbody = document.getElementById('checkins-list');
        const loadingIndicator = document.getElementById('loading-indicator');
        const errorContainer = document.getElementById('error-container');
        const checkinsGrid = document.getElementById('checkins-grid');
        
        // Esconde o loading
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        
        // Esconde o erro
        if (errorContainer) {
            errorContainer.classList.add('hidden');
        }
        
        if (!tbody) return;

        if (!checkins || checkins.length === 0) {
            this.showEmpty();
            return;
        }

        // Mostra a grid de check-ins
        if (checkinsGrid) {
            checkinsGrid.classList.remove('hidden');
        }

        tbody.innerHTML = '';
        
        checkins.forEach(checkin => {
            const row = this.createCheckinRow(checkin);
            tbody.appendChild(row);
        });
    }

    createCheckinRow(checkin) {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors duration-200';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${checkin.id}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${checkin.nome || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${this.formatDate(checkin.data_criacao)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="window.checkinUI.openModal(${checkin.id})" 
                        class="text-indigo-600 hover:text-indigo-900 mr-3">
                    Editar
                </button>
            </td>
        `;
        
        return row;
    }

    // ========== MODAL ==========
    async openModal(checkinId = null) {
        if (!this.modal) return;
        
        
        this.currentCheckinId = checkinId;
        
        // Define o checkinId nos módulos
        if (this.acessosModule && this.acessosModule.setCurrentCheckinId) {
            this.acessosModule.setCurrentCheckinId(checkinId);
        }
        if (this.itensModule && this.itensModule.setCurrentCheckinId) {
            this.itensModule.setCurrentCheckinId(checkinId);
        }
        
        // Carrega opções dos selects usando o módulo de formulários PRIMEIRO
        await this.formulariosModule.loadSelectOptions();
        
        if (checkinId) {
            // Carrega dados do check-in
            try {
                const checkin = await this.api.getById(checkinId);
                
                this.fillForm(checkin);
                
                // Carrega itens e acessos usando os módulos
                await this.itensModule.loadItens(checkinId);
                await this.acessosModule.loadAcessos(checkinId);
                
            } catch (error) {
            }
        } else {
            this.clearForm();
        }
        
        // Exibe o modal
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            this.modal.classList.remove('flex');
            this.currentCheckinId = null;
        }
    }

    openCreateModal() {
        if (this.formulariosModule && this.formulariosModule.openCreateModal) {
            this.formulariosModule.openCreateModal();
        }
    }

    clearForm() {
        const form = document.getElementById('form-checkin');
        if (form) {
            form.reset();
        }
        
        // Limpa containers de itens e acessos
        const itensContainer = document.getElementById('checkin-itens-container');
        const acessosContainer = document.getElementById('checkin-acessos-container');
        
        if (itensContainer) itensContainer.innerHTML = '';
        if (acessosContainer) acessosContainer.innerHTML = '';
    }

    fillForm(checkin) {
        
        // Preenche campos básicos conforme dados reais da API
        const nomeInput = document.getElementById('checkin-nome');
        const formularioSelect = document.getElementById('checkin-formulario');
        const processoSelect = document.getElementById('checkin-processo');
        const eventoSelect = document.getElementById('checkin-evento');
        
      
        
        // Preenche o nome do check-in
        if (nomeInput) {
            nomeInput.value = checkin.nome || '';
        }
        
        // Preenche os selects com os IDs corretos dos dados reais
        if (formularioSelect) {
            formularioSelect.value = checkin.formulario_id || '';
        }
        if (processoSelect) {
            processoSelect.value = checkin.processo_etapa_id || '';
        }
        if (eventoSelect) {
            eventoSelect.value = checkin.evento_id || '';
        }
    }

    // ========== UTILITÁRIOS ==========
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            return 'Data inválida';
        }
    }

    formatDateForInput(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            return '';
        }
    }

    formatTimeForInput(timeString) {
        if (!timeString) return '';
        
        try {
            // Se já está no formato HH:MM, retorna como está
            if (/^\d{2}:\d{2}$/.test(timeString)) {
                return timeString;
            }
            
            // Se é um timestamp completo, extrai apenas a hora
            const date = new Date(timeString);
            return date.toTimeString().slice(0, 5);
        } catch (error) {
            return '';
        }
    }

    showEmpty() {
        const tbody = document.getElementById('checkins-list');
        const loadingIndicator = document.getElementById('loading-indicator');
        const errorContainer = document.getElementById('error-container');
        const checkinsGrid = document.getElementById('checkins-grid');
        
        // Esconde o loading e erro
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        
        if (errorContainer) {
            errorContainer.classList.add('hidden');
        }
        
        // Mostra a grid para exibir o estado vazio
        if (checkinsGrid) {
            checkinsGrid.classList.remove('hidden');
        }
        
        if (!tbody) return;
        
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                        <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p class="text-lg font-medium">Nenhum check-in encontrado</p>
                        <p class="text-sm">Crie seu primeiro check-in para começar</p>
                    </div>
                </td>
            </tr>
        `;
    }

    startEditLoading(checkinId) {
        const editBtn = document.querySelector(`button[onclick="window.checkinUI.openModal(${checkinId})"]`);
        if (editBtn) {
            editBtn.disabled = true;
            editBtn.textContent = 'Carregando...';
        }
    }

    stopEditLoading(checkinId) {
        const editBtn = document.querySelector(`button[onclick="window.checkinUI.openModal(${checkinId})"]`);
        if (editBtn) {
            editBtn.disabled = false;
            editBtn.textContent = 'Editar';
        }
    }

    showNotification(message, type = 'info', timeout = 5000) {
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
        
        // Remove após o timeout especificado
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, timeout);
    }

    showError(message) {
        this.showNotification(message, 'error');
        
        // Também exibe no container de erro da página
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        const loadingIndicator = document.getElementById('loading-indicator');
        const checkinsGrid = document.getElementById('checkins-grid');
        
        if (errorContainer && errorMessage) {
            errorMessage.textContent = message;
            errorContainer.classList.remove('hidden');
        }
        
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        
        if (checkinsGrid) {
            checkinsGrid.classList.add('hidden');
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.CheckinUI = CheckinUI;