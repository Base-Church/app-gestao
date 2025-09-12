class CheckinUI {
    constructor(api) {
        this.api = api;
        this.modal = null;
        this.currentCheckinId = null;
        this.itensContainer = null;
        this.acessosContainer = null;
        this.init();
    }

    init() {
        this.modal = document.getElementById('modal-checkin');
        this.itensContainer = document.getElementById('checkin-itens-container');
        this.acessosContainer = document.getElementById('checkin-acessos-container');
        this.setupEventListeners();
    }

    setupEventListeners() {
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
        this.setupModalEventListeners();
    }

    setupModalEventListeners() {
        // Botão adicionar item
        const addItemBtn = document.getElementById('add-checkin-item-btn');
        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => this.addItem());
        }

        // Botão adicionar acesso
        const addAcessoBtn = document.getElementById('add-checkin-acesso-btn');
        if (addAcessoBtn) {
            addAcessoBtn.addEventListener('click', () => this.addAcesso());
        }
    }

    // ========== ESTADOS DA PÁGINA ==========
    showLoading() {
        document.getElementById('loading-indicator').classList.remove('hidden');
        document.getElementById('error-container').classList.add('hidden');
        document.getElementById('empty-state').classList.add('hidden');
        document.getElementById('checkins-grid').classList.add('hidden');
    }

    showError(message) {
        document.getElementById('loading-indicator').classList.add('hidden');
        document.getElementById('error-container').classList.remove('hidden');
        document.getElementById('empty-state').classList.add('hidden');
        document.getElementById('checkins-grid').classList.add('hidden');
        document.getElementById('error-message').textContent = message;
    }

    showEmpty() {
        document.getElementById('loading-indicator').classList.add('hidden');
        document.getElementById('error-container').classList.add('hidden');
        document.getElementById('empty-state').classList.remove('hidden');
        document.getElementById('checkins-grid').classList.add('hidden');
    }

    showGrid() {
        document.getElementById('loading-indicator').classList.add('hidden');
        document.getElementById('error-container').classList.add('hidden');
        document.getElementById('empty-state').classList.add('hidden');
        document.getElementById('checkins-grid').classList.remove('hidden');
    }

    // ========== RENDERIZAÇÃO DA LISTA ==========
    renderCheckins(checkins) {
        const tbody = document.getElementById('checkins-list');
        if (!tbody) return;

        if (!checkins || checkins.length === 0) {
            this.showEmpty();
            return;
        }

        tbody.innerHTML = '';
        
        checkins.forEach(checkin => {
            const row = this.createCheckinRow(checkin);
            tbody.appendChild(row);
        });

        this.showGrid();
    }

    createCheckinRow(checkin) {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50 dark:hover:bg-gray-700';
        
        // Nome do check-in
        const nomeCell = document.createElement('td');
        nomeCell.className = 'px-6 py-4 whitespace-nowrap';
        nomeCell.innerHTML = `
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <svg class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                    </div>
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                        ${this.escapeHtml(checkin.nome)}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        ID: ${checkin.id}
                    </div>
                </div>
            </div>
        `;
        
        // Processo/Evento
        const processoEventoCell = document.createElement('td');
        processoEventoCell.className = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white';
        
        let processoEventoText = '';
        if (checkin.processo_etapa_id) {
            processoEventoText += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-1">
                Processo: ${checkin.processo_etapa_id}
            </span>`;
        }
        if (checkin.evento_id) {
            processoEventoText += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Evento: ${checkin.evento_id}
            </span>`;
        }
        if (!processoEventoText) {
            processoEventoText = '<span class="text-gray-400 dark:text-gray-500">Nenhum</span>';
        }
        
        processoEventoCell.innerHTML = `<div class="space-y-1">${processoEventoText}</div>`;
        

        
        // Ações
        const acoesCell = document.createElement('td');
        acoesCell.className = 'px-6 py-4 whitespace-nowrap text-right text-sm font-medium';
        acoesCell.innerHTML = `
            <div class="flex items-center justify-end space-x-2">
                <button id="edit-btn-${checkin.id}" onclick="window.app.edit(${checkin.id})" 
                                class="edit-btn text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg class="h-5 w-5 edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            <svg class="h-5 w-5 loading-icon hidden animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </button>
                <button onclick="window.app.confirmDelete(${checkin.id}, '${this.escapeHtml(checkin.nome)}')" 
                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        `;
        
        tr.appendChild(nomeCell);
        tr.appendChild(processoEventoCell);
        tr.appendChild(acoesCell);
        
        return tr;
    }

    // ========== MODAL ==========
    async openModal(checkin = null) {
        if (!this.modal) return;

        this.currentCheckinId = checkin ? checkin.id : null;

        // Atualizar título
        const title = document.getElementById('modal-title');
        if (title) {
            title.textContent = checkin ? 'Editar Check-in' : 'Novo Check-in';
        }

        // Limpar e preencher formulário
        this.clearForm();
        if (checkin) {
            this.fillForm(checkin);
        }

        // Carregar dados auxiliares para os selects
        await this.loadAuxiliaryData();

        // Mostrar modal
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            this.clearForm();
            this.currentCheckinId = null;
        }
    }

    toggleModal(show) {
        if (show) {
            this.openModal();
        } else {
            this.closeModal();
        }
    }

    clearForm() {
        const form = document.getElementById('form-create');
        if (form) {
            form.reset();
        }

        // Limpar containers
        if (this.itensContainer) {
            this.itensContainer.innerHTML = this.getEmptyItensHTML();
        }
        if (this.acessosContainer) {
            this.acessosContainer.innerHTML = this.getEmptyAcessosHTML();
        }
    }

    fillForm(checkin) {
        const form = document.getElementById('form-create');
        if (!form) return;

        // Preencher campos básicos
        const nomeInput = form.querySelector('#checkin-nome');
        if (nomeInput) nomeInput.value = checkin.nome || '';

        const processoSelect = form.querySelector('#checkin-processo');
        if (processoSelect) processoSelect.value = checkin.processo_etapa_id || '';

        const eventoSelect = form.querySelector('#checkin-evento');
        if (eventoSelect) eventoSelect.value = checkin.evento_id || '';

        const formularioSelect = form.querySelector('#checkin-formulario');
        if (formularioSelect) formularioSelect.value = checkin.formulario_id || '';

        // Carregar itens e acessos
        if (checkin.id) {
            this.loadItens(checkin.id);
            this.loadAcessos(checkin.id);
        }
    }

    // Métodos de carregamento de dados auxiliares removidos
    // Agora usamos inputs diretos para IDs

    // ========== ITENS ==========
    async loadItens(checkinId) {
        if (!this.itensContainer) return;

        try {
            this.itensContainer.innerHTML = '<div class="text-center py-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>';
            
            const response = await window.app.api.getItens(checkinId);
            const itens = response.data || [];

            if (itens.length === 0) {
                this.itensContainer.innerHTML = this.getEmptyItensHTML();
                return;
            }

            this.itensContainer.innerHTML = '';
            itens.forEach(item => {
                this.renderItem(item);
            });
        } catch (error) {
            console.error('Erro ao carregar itens:', error);
            this.itensContainer.innerHTML = '<div class="text-center py-4 text-red-500">Erro ao carregar itens</div>';
        }
    }

    addItem() {
        if (!this.itensContainer) return;

        // Limpar mensagem vazia se for o primeiro item
        if (this.itensContainer.children.length === 1 && this.itensContainer.querySelector('.text-center')) {
            this.itensContainer.innerHTML = '';
        }

        const itemId = 'temp_' + Date.now();
        const ordem = this.itensContainer.children.length + 1;
        
        const itemElement = this.createItemElement({
            id: itemId,
            nome: '',
            data: '',
            hora: '',
            ordem: ordem
        }, true);

        this.itensContainer.appendChild(itemElement);
        this.setupItemEvents(itemElement);
    }

    renderItem(item) {
        const itemElement = this.createItemElement(item, false);
        this.itensContainer.appendChild(itemElement);
        this.setupItemEvents(itemElement);
    }

    createItemElement(item, isNew = false) {
        const div = document.createElement('div');
        div.className = 'checkin-item bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm';
        div.dataset.itemId = item.id;
        if (isNew) div.dataset.isNew = 'true';

        div.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Item</label>
                    <input type="text" placeholder="Ex: Credencial, Material..." value="${this.escapeHtml(item.nome || '')}" class="item-nome w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
                    <input type="date" value="${item.data ? this.formatDateForInput(item.data) : ''}" class="item-data w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Horário</label>
                    <input type="time" value="${item.hora ? this.formatTimeForInput(item.hora) : ''}" class="item-hora w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                </div>
            </div>
            <div class="flex items-center justify-between">
                <span class="item-ordem inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                    Ordem #${item.ordem || 1}
                </span>
                <div class="flex gap-2">
                    <button type="button" class="save-item ${isNew ? '' : 'hidden'} inline-flex items-center px-2 py-1 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/40">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        Salvar
                    </button>
                    <button type="button" class="remove-item inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/40">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                        Remover
                    </button>
                </div>
            </div>
        `;

        return div;
    }

    setupItemEvents(itemElement) {
        const removeBtn = itemElement.querySelector('.remove-item');
        const saveBtn = itemElement.querySelector('.save-item');
        const inputs = itemElement.querySelectorAll('input');

        // Evento de remoção
        if (removeBtn) {
            removeBtn.addEventListener('click', async () => {
                await this.removeItem(itemElement);
            });
        }

        // Evento de salvamento
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                await this.saveItem(itemElement);
            });
        }

        // Detectar mudanças nos inputs
        inputs.forEach(input => {
            let timeout;
            
            input.addEventListener('input', () => {
                // Mostrar botão salvar
                if (saveBtn && !itemElement.dataset.isNew) {
                    saveBtn.classList.remove('hidden');
                }
                
                // Auto-save para itens existentes
                if (itemElement.dataset.isNew !== 'true') {
                    clearTimeout(timeout);
                    timeout = setTimeout(async () => {
                        await this.autoSaveItem(itemElement);
                    }, 1000);
                }
            });
        });
    }

    async saveItem(itemElement) {
        const itemData = this.getItemData(itemElement);
        
        if (!itemData.nome.trim()) {
            this.showNotification('Nome do item é obrigatório', 'error');
            return;
        }

        try {
            let response;
            const isNew = itemElement.dataset.isNew === 'true';
            
            if (isNew) {
                if (!this.currentCheckinId) {
                    this.showNotification('Check-in não encontrado', 'error');
                    return;
                }
                
                itemData.checkin_formularios_id = this.currentCheckinId;
                response = await window.app.api.createItem(itemData);
            } else {
                const itemId = itemElement.dataset.itemId;
                response = await window.app.api.updateItem(itemId, itemData);
            }

            if (response.success || response.code === 200 || response.code === 201) {
                if (isNew && response.data?.id) {
                    itemElement.dataset.itemId = response.data.id;
                    itemElement.dataset.isNew = 'false';
                }
                
                const saveBtn = itemElement.querySelector('.save-item');
                if (saveBtn) {
                    saveBtn.classList.add('hidden');
                }
                
                this.showNotification('Item salvo com sucesso', 'success');
            } else {
                throw new Error(response.message || 'Erro ao salvar item');
            }
        } catch (error) {
            this.showNotification('Erro ao salvar item', 'error');
        }
    }

    async autoSaveItem(itemElement) {
        const itemData = this.getItemData(itemElement);
        
        if (!itemData.nome.trim() && !itemData.data && !itemData.hora) {
            return;
        }

        try {
            const itemId = itemElement.dataset.itemId;
            const response = await window.app.api.updateItem(itemId, itemData);

            if (response.success || response.code === 200) {
                const saveBtn = itemElement.querySelector('.save-item');
                if (saveBtn) {
                    saveBtn.classList.add('hidden');
                }
            }
        } catch (error) {
            // Falha silenciosa para auto-save
        }
    }

    async removeItem(itemElement) {
        const isNew = itemElement.dataset.isNew === 'true';
        
        if (!isNew) {
            try {
                const itemId = itemElement.dataset.itemId;
                const response = await window.app.api.deleteItem(itemId);
                
                if (!(response.success || response.code === 200)) {
                    throw new Error(response.message || 'Erro ao excluir item');
                }
                
                this.showNotification('Item removido com sucesso', 'success');
            } catch (error) {
                console.error('Erro ao remover item:', error);
                this.showNotification('Erro ao remover item', 'error');
                return;
            }
        }
        
        itemElement.remove();
        this.reorderItems();
    }

    getItemData(itemElement) {
        const nome = itemElement.querySelector('.item-nome')?.value || '';
        const data = itemElement.querySelector('.item-data')?.value || '';
        const hora = itemElement.querySelector('.item-hora')?.value || '';
        
        let ordem = parseInt(itemElement.querySelector('.item-ordem')?.textContent?.match(/\d+/)?.[0] || '1');
        
        if (!ordem || isNaN(ordem)) {
            const items = Array.from(this.itensContainer.querySelectorAll('.checkin-item'));
            ordem = items.indexOf(itemElement) + 1;
        }

        return { nome, data, hora, ordem };
    }

    reorderItems() {
        if (!this.itensContainer) return;

        const items = this.itensContainer.querySelectorAll('.checkin-item');
        items.forEach((item, index) => {
            const ordemSpan = item.querySelector('.item-ordem');
            if (ordemSpan) {
                ordemSpan.textContent = `Ordem #${index + 1}`;
            }
        });
    }

    getEmptyItensHTML() {
        return `
            <div class="text-center text-sm text-gray-500 dark:text-gray-400 py-8 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <p class="font-medium">Nenhum item adicionado</p>
                <p class="mt-1">Clique em "Adicionar Item" para começar</p>
            </div>
        `;
    }

    // ========== ACESSOS ==========
    async loadAcessos(checkinId) {
        if (!this.acessosContainer) return;

        try {
            this.acessosContainer.innerHTML = '<div class="text-center py-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>';
            
            const response = await window.app.api.getAcessos(checkinId);
            const acessos = response.data || [];

            if (acessos.length === 0) {
                this.acessosContainer.innerHTML = this.getEmptyAcessosHTML();
                return;
            }

            this.acessosContainer.innerHTML = '';
            acessos.forEach(acesso => {
                this.renderAcesso(acesso);
            });
        } catch (error) {
            console.error('Erro ao carregar acessos:', error);
            this.acessosContainer.innerHTML = '<div class="text-center py-4 text-red-500">Erro ao carregar acessos</div>';
        }
    }

    addAcesso() {
        if (!this.acessosContainer) return;

        // Limpar mensagem vazia se for o primeiro acesso
        if (this.acessosContainer.children.length === 1 && this.acessosContainer.querySelector('.text-center')) {
            this.acessosContainer.innerHTML = '';
        }

        const acessoId = 'temp_' + Date.now();
        
        const acessoElement = this.createAcessoElement({
            id: acessoId,
            nome: '',
            cpf: ''
        }, true);

        this.acessosContainer.appendChild(acessoElement);
        this.setupAcessoEvents(acessoElement);
    }

    renderAcesso(acesso) {
        const acessoElement = this.createAcessoElement(acesso, false);
        this.acessosContainer.appendChild(acessoElement);
        this.setupAcessoEvents(acessoElement);
    }

    createAcessoElement(acesso, isNew = false) {
        const div = document.createElement('div');
        div.className = 'checkin-acesso bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm';
        div.dataset.acessoId = acesso.id;
        if (isNew) div.dataset.isNew = 'true';

        div.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                    <input type="text" placeholder="Nome da pessoa" value="${this.escapeHtml(acesso.nome || '')}" class="acesso-nome w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                </div>
                <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">CPF</label>
                    <input type="text" placeholder="000.000.000-00" value="${this.escapeHtml(acesso.cpf || '')}" class="acesso-cpf w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white" maxlength="14">
                </div>
            </div>
            <div class="flex items-center justify-end">
                <div class="flex gap-2">
                    <button type="button" class="save-acesso ${isNew ? '' : 'hidden'} inline-flex items-center px-2 py-1 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/40">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        Salvar
                    </button>
                    <button type="button" class="remove-acesso inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/40">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                        Remover
                    </button>
                </div>
            </div>
        `;

        return div;
    }

    setupAcessoEvents(acessoElement) {
        const removeBtn = acessoElement.querySelector('.remove-acesso');
        const saveBtn = acessoElement.querySelector('.save-acesso');
        const inputs = acessoElement.querySelectorAll('input');

        // Evento de remoção
        if (removeBtn) {
            removeBtn.addEventListener('click', async () => {
                await this.removeAcesso(acessoElement);
            });
        }

        // Evento de salvamento
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                await this.saveAcesso(acessoElement);
            });
        }

        // Detectar mudanças nos inputs
        inputs.forEach(input => {
            let timeout;
            
            input.addEventListener('input', () => {
                // Mostrar botão salvar
                if (saveBtn && !acessoElement.dataset.isNew) {
                    saveBtn.classList.remove('hidden');
                }
                
                // Auto-save para acessos existentes
                if (acessoElement.dataset.isNew !== 'true') {
                    clearTimeout(timeout);
                    timeout = setTimeout(async () => {
                        await this.autoSaveAcesso(acessoElement);
                    }, 1000);
                }
            });
        });
    }

    async saveAcesso(acessoElement) {
        const acessoData = this.getAcessoData(acessoElement);
        
        if (!acessoData.nome.trim()) {
            this.showNotification('Nome da pessoa é obrigatório', 'error');
            return;
        }

        try {
            let response;
            const isNew = acessoElement.dataset.isNew === 'true';
            
            if (isNew) {
                if (!this.currentCheckinId) {
                    this.showNotification('Check-in não encontrado', 'error');
                    return;
                }
                
                acessoData.checkin_formularios_id = this.currentCheckinId;
                response = await window.app.api.createAcesso(acessoData);
            } else {
                const acessoId = acessoElement.dataset.acessoId;
                response = await window.app.api.updateAcesso(acessoId, acessoData);
            }

            if (response.success || response.code === 200 || response.code === 201) {
                if (isNew && response.data?.id) {
                    acessoElement.dataset.acessoId = response.data.id;
                    acessoElement.dataset.isNew = 'false';
                }
                
                const saveBtn = acessoElement.querySelector('.save-acesso');
                if (saveBtn) {
                    saveBtn.classList.add('hidden');
                }
                
                this.showNotification('Pessoa autorizada salva com sucesso', 'success');
            } else {
                throw new Error(response.message || 'Erro ao salvar pessoa autorizada');
            }
        } catch (error) {
            this.showNotification('Erro ao salvar pessoa autorizada', 'error');
        }
    }

    async autoSaveAcesso(acessoElement) {
        const acessoData = this.getAcessoData(acessoElement);
        
        if (!acessoData.nome.trim() && !acessoData.cpf.trim()) {
            return;
        }

        try {
            const acessoId = acessoElement.dataset.acessoId;
            const response = await window.app.api.updateAcesso(acessoId, acessoData);

            if (response.success || response.code === 200) {
                const saveBtn = acessoElement.querySelector('.save-acesso');
                if (saveBtn) {
                    saveBtn.classList.add('hidden');
                }
            }
        } catch (error) {
            // Falha silenciosa para auto-save
        }
    }

    async removeAcesso(acessoElement) {
        const isNew = acessoElement.dataset.isNew === 'true';
        
        if (!isNew) {
            try {
                const acessoId = acessoElement.dataset.acessoId;
                const response = await window.app.api.deleteAcesso(acessoId);
                
                if (!(response.success || response.code === 200)) {
                    throw new Error(response.message || 'Erro ao excluir pessoa autorizada');
                }
                
                this.showNotification('Pessoa autorizada removida com sucesso', 'success');
            } catch (error) {
                console.error('Erro ao remover acesso:', error);
                this.showNotification('Erro ao remover pessoa autorizada', 'error');
                return;
            }
        }
        
        acessoElement.remove();
        
        // Se não há mais acessos, mostrar mensagem vazia
        if (this.acessosContainer && this.acessosContainer.children.length === 0) {
            this.acessosContainer.innerHTML = this.getEmptyAcessosHTML();
        }
    }

    getAcessoData(acessoElement) {
        const nome = acessoElement.querySelector('.acesso-nome')?.value || '';
        const cpf = acessoElement.querySelector('.acesso-cpf')?.value || '';

        return { nome, cpf };
    }

    getEmptyAcessosHTML() {
        return `
            <div class="text-center text-sm text-gray-500 dark:text-gray-400 py-8 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                </svg>
                <p class="font-medium">Nenhuma pessoa autorizada</p>
                <p class="mt-1">Clique em "Adicionar Pessoa" para começar</p>
            </div>
        `;
    }

    // ========== UTILITÁRIOS ==========
    escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }



    formatDateForInput(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
        } catch (error) {
            return '';
        }
    }

    formatTimeForInput(timeString) {
        if (!timeString) return '';
        try {
            // Se já está no formato HH:MM:SS, extrair apenas HH:MM
            if (timeString.includes(':')) {
                const parts = timeString.split(':');
                return `${parts[0]}:${parts[1]}`;
            }
            return timeString;
        } catch (error) {
            return '';
        }
    }

    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-[9999] max-w-sm`;
        
        // Definir cores baseadas no tipo
        const colors = {
            'success': 'bg-green-500 text-white',
            'error': 'bg-red-500 text-white',
            'warning': 'bg-yellow-500 text-black',
            'info': 'bg-blue-500 text-white'
        };
        
        notification.className += ` ${colors[type] || colors.info}`;
        notification.textContent = message;
        
        // Adicionar ao DOM
        document.body.appendChild(notification);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    startEditLoading(checkinId) {
        const button = document.getElementById(`edit-btn-${checkinId}`);
        if (button) {
            button.disabled = true;
            const editIcon = button.querySelector('.edit-icon');
            const loadingIcon = button.querySelector('.loading-icon');
            if (editIcon) editIcon.classList.add('hidden');
            if (loadingIcon) loadingIcon.classList.remove('hidden');
        }
    }

    stopEditLoading(checkinId) {
        const button = document.getElementById(`edit-btn-${checkinId}`);
        if (button) {
            button.disabled = false;
            const editIcon = button.querySelector('.edit-icon');
            const loadingIcon = button.querySelector('.loading-icon');
            if (editIcon) editIcon.classList.remove('hidden');
            if (loadingIcon) loadingIcon.classList.add('hidden');
        }
    }

    async loadAuxiliaryData() {
        try {
            const [processos, eventos, formularios] = await Promise.all([
                this.api.getProcessos(),
                this.api.getEventos(),
                this.api.getFormularios()
            ]);

            console.log('Dados carregados:', { processos, eventos, formularios });

            // Verificar se os dados têm a propriedade 'data' (formato padrão da API)
            const processosData = processos?.data || processos;
            const eventosData = eventos?.data || eventos;
            const formulariosData = formularios?.data || formularios;

            this.populateSelect('#checkin-processo', processosData, 'id', 'nome');
            this.populateSelect('#checkin-evento', eventosData, 'id', 'nome');
            this.populateSelect('#checkin-formulario', formulariosData, 'id', 'nome');
        } catch (error) {
            console.error('Erro ao carregar dados auxiliares:', error);
        }
    }

    populateSelect(selector, data, valueField, textField) {
        const select = document.querySelector(selector);
        if (!select) return;

        // Limpar opções existentes (exceto a primeira)
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        // Verificar se data é um array
        if (!Array.isArray(data)) {
            console.warn('Dados não são um array:', data);
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
}



// Instância global da UI
window.CheckinUI = CheckinUI;