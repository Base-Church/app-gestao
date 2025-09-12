// Gerenciador de UI para Check-in
class CheckinUI {
    constructor() {
        this.modal = null;
        this.init();
    }

    // Helper para formatar data ISO para formato HTML date input (yyyy-MM-dd)
    formatDateForInput(isoDate) {
        if (!isoDate) return '';
        // Se a data contém 'T', extrai apenas a parte da data
        if (isoDate.includes('T')) {
            return isoDate.split('T')[0];
        }
        return isoDate;
    }

    init() {
        this.setupEventListeners();
        window.checkinUI = this;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="open-checkin-modal"]')) {
                e.preventDefault();
                // Delegar para o service
                window.checkinService?.openCheckinFlow();
            }
        });
    }

    // Abrir modal principal (chamado pelo service)
    openMainModal() {
        this.modal = document.getElementById('checkin-modal');
        if (this.modal) {
            this.modal.classList.remove('hidden');
            this.setupModalListeners();
            
            // Carregar dados (sempre, para pegar dados atualizados)
            if (window.checkinService) {
                window.checkinService.loadData();
            }
        }
    }

    // Abrir mini modal (chamado pelo service)
    openMiniModal() {
        const miniModal = document.getElementById('checkin-nome-modal');
        if (miniModal) {
            miniModal.classList.remove('hidden');
            this.setupMiniModalListeners();
            
            // Focar no campo nome
            const nomeField = document.getElementById('mini-checkin-nome');
            if (nomeField) {
                setTimeout(() => nomeField.focus(), 100);
            }
        }
    }

    // Configurar listeners do mini modal
    setupMiniModalListeners() {
        const miniModal = document.getElementById('checkin-nome-modal');
        if (!miniModal) return;

        // Botão fechar
        const closeBtn = miniModal.querySelector('#close-checkin-nome-modal');
        if (closeBtn) {
            closeBtn.removeEventListener('click', this.closeMiniModal);
            closeBtn.addEventListener('click', () => this.closeMiniModal());
        }

        // Botão cancelar
        const cancelBtn = miniModal.querySelector('#cancel-checkin-nome-btn');
        if (cancelBtn) {
            cancelBtn.removeEventListener('click', this.closeMiniModal);
            cancelBtn.addEventListener('click', () => this.closeMiniModal());
        }

        // Botão criar
        const createBtn = miniModal.querySelector('#create-checkin-btn');
        if (createBtn) {
            createBtn.removeEventListener('click', this.createAndOpenMain);
            this.createAndOpenMain = async () => await this.handleCreateCheckin();
            createBtn.addEventListener('click', this.createAndOpenMain);
        }

        // Enter no campo nome
        const nomeField = miniModal.querySelector('#mini-checkin-nome');
        if (nomeField) {
            nomeField.removeEventListener('keypress', this.handleEnterKey);
            this.handleEnterKey = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleCreateCheckin();
                }
            };
            nomeField.addEventListener('keypress', this.handleEnterKey);
        }
    }

    // Criar checkin e abrir modal principal (apenas UI, lógica no service)
    async handleCreateCheckin() {
        const nomeField = document.getElementById('mini-checkin-nome');
        const nome = nomeField?.value?.trim();

        // Delegar para o service
        await window.checkinService?.createCheckinFromMiniModal(nome);
    }

    // Fechar mini modal
    closeMiniModal() {
        const miniModal = document.getElementById('checkin-nome-modal');
        if (miniModal) {
            miniModal.classList.add('hidden');
            // Limpar campo
            const nomeField = document.getElementById('mini-checkin-nome');
            if (nomeField) nomeField.value = '';
        }
    }

    setupModalListeners() {
        const modal = document.getElementById('checkin-modal');
        if (!modal) {
            return;
        }


        // Botão fechar (ID correto: close-checkin-modal)
        const closeBtn = modal.querySelector('#close-checkin-modal');
        if (closeBtn) {
            closeBtn.removeEventListener('click', this.closeModal); // Remove listener anterior
            closeBtn.addEventListener('click', () => this.closeModal());
        } else {
        }

        // Botão cancelar (ID: cancel-checkin-btn)
        const cancelBtn = modal.querySelector('#cancel-checkin-btn');
        if (cancelBtn) {
            cancelBtn.removeEventListener('click', this.closeModal);
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        // Botão salvar (ID correto: save-checkin-btn)
        const saveBtn = modal.querySelector('#save-checkin-btn');
        if (saveBtn) {
            saveBtn.removeEventListener('click', this.saveHandler); // Remove listener anterior
            this.saveHandler = () => window.checkinService?.save();
            saveBtn.addEventListener('click', this.saveHandler);
        } else {
        }

        // Botão adicionar item (ID correto: add-checkin-item-btn)
        const addItemBtn = modal.querySelector('#add-checkin-item-btn');
        if (addItemBtn) {
            addItemBtn.removeEventListener('click', this.addItemHandler); // Remove listener anterior
            this.addItemHandler = () => this.addItem();
            addItemBtn.addEventListener('click', this.addItemHandler);
        } else {
        }

        // Botão adicionar acesso (ID correto: add-checkin-acesso-btn)
        const addAcessoBtn = modal.querySelector('#add-checkin-acesso-btn');
        if (addAcessoBtn) {
            addAcessoBtn.removeEventListener('click', this.addAcessoHandler); // Remove listener anterior
            this.addAcessoHandler = () => this.addAcesso();
            addAcessoBtn.addEventListener('click', this.addAcessoHandler);
        } else {
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        // Implementação simples de notificação
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg ${
            type === 'error' ? 'bg-red-500 text-white' : 
            type === 'success' ? 'bg-green-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.style.zIndex = '9999'; // Garantir que fique acima do modal
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Mostrar loading geral
    showLoading(message = 'Carregando...') {
        // Remover loading existente se houver
        this.hideLoading();
        
        const loading = document.createElement('div');
        loading.id = 'checkin-general-loading';
        loading.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
        loading.style.zIndex = '10000';
        loading.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span class="text-gray-700 dark:text-gray-300">${message}</span>
            </div>
        `;
        
        document.body.appendChild(loading);
    }

    // Esconder loading geral
    hideLoading() {
        const loading = document.getElementById('checkin-general-loading');
        if (loading) {
            loading.remove();
        }
    }

    // Mostrar loading para itens
    showItensLoading(show) {
        const container = document.getElementById('checkin-itens-container');
        if (!container) return;

        if (show) {
            container.innerHTML = '<div class="text-center py-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p class="mt-2 text-gray-500">Carregando itens...</p></div>';
        }
    }

    // Mostrar loading para acessos
    showAcessosLoading(show) {
        const container = document.getElementById('checkin-acessos-container');
        if (!container) return;

        if (show) {
            container.innerHTML = '<div class="text-center py-4"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div><p class="mt-2 text-gray-500">Carregando pessoas autorizadas...</p></div>';
        }
    }

    addItem() {
        const container = document.getElementById('checkin-itens-container');
        if (!container) return;

        // Limpar mensagem vazia se for o primeiro item
        if (container.children.length === 1 && container.querySelector('.text-center')) {
            container.innerHTML = '';
        }

        const itemId = 'temp_' + Date.now();
        const ordem = container.children.length + 1;
        
        const itemHtml = `
            <div class="checkin-item bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm" data-item-id="${itemId}" data-is-new="true">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Item</label>
                        <input type="text" placeholder="Ex: Credencial, Material..." class="item-nome w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
                        <input type="date" class="item-data w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Horário</label>
                        <input type="time" class="item-hora w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                    </div>
                </div>
                <div class="flex items-center justify-between">
                    <span class="item-ordem inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                        Ordem #${ordem}
                    </span>
                    <div class="flex gap-2">
                        <button type="button" class="save-item hidden inline-flex items-center px-2 py-1 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/40">
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
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', itemHtml);
        
        // Adicionar eventos
        const newItem = container.lastElementChild;
        this.setupItemEvents(newItem);
        
        // Mostrar botão salvar para item novo
        const saveBtn = newItem.querySelector('.save-item');
        if (saveBtn) {
            saveBtn.classList.remove('hidden');
        }
    }

    // Configurar eventos para um item específico
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
                this.showSaveButton(itemElement);
                
                // PUT automático após parar de digitar (apenas para itens existentes)
                if (itemElement.dataset.isNew !== 'true') {
                    clearTimeout(timeout);
                    timeout = setTimeout(async () => {
                        await this.autoSaveItem(itemElement);
                    }, 1000); // Aguarda 1 segundo após parar de digitar
                }
            });
        });
    }

    // Mostrar botão salvar
    showSaveButton(itemElement) {
        const saveBtn = itemElement.querySelector('.save-item');
        if (saveBtn && !itemElement.dataset.isNew) {
            saveBtn.classList.remove('hidden');
        }
    }

    // Salvar item
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
                // Verificar se existe checkin
                if (!window.checkinService?.currentFormulario?.id) {
                    this.showNotification('Checkin não encontrado', 'error');
                    return;
                }
                
                itemData.checkin_formularios_id = window.checkinService.currentFormulario.id;
                response = await window.formulariosAPI.createCheckinItem(itemData);
            } else {
                const itemId = itemElement.dataset.itemId;
                response = await window.formulariosAPI.updateCheckinItem(itemId, itemData);
            }

            if (response.success || response.code === 200 || response.code === 201) {
                // Atualizar elemento
                if (isNew && response.data?.id) {
                    itemElement.dataset.itemId = response.data.id;
                    itemElement.dataset.isNew = 'false';
                }
                
                // Esconder botão salvar
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

    // Salvar item automaticamente (sem notificação)
    async autoSaveItem(itemElement) {
        const itemData = this.getItemData(itemElement);
        
        // Só salva se pelo menos um campo estiver preenchido
        if (!itemData.nome.trim() && !itemData.data && !itemData.hora) {
            return;
        }

        try {
            const itemId = itemElement.dataset.itemId;
            const response = await window.formulariosAPI.updateCheckinItem(itemId, itemData);

            if (response.success || response.code === 200) {
                // Esconder botão salvar
                const saveBtn = itemElement.querySelector('.save-item');
                if (saveBtn) {
                    saveBtn.classList.add('hidden');
                }
            }
        } catch (error) {
            // Falha silenciosa para auto-save
        }
    }

    // Remover item
    async removeItem(itemElement) {
        const isNew = itemElement.dataset.isNew === 'true';
        
        if (!isNew) {
            // Item existente - fazer DELETE na API
            try {
                const itemId = itemElement.dataset.itemId;
                const response = await window.formulariosAPI.deleteCheckinItem(itemId);
                
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
        
        // Remover do DOM
        itemElement.remove();
        
        // Reordenar itens restantes
        this.reorderItems();
    }

    // Obter dados do item
    getItemData(itemElement) {
        const nome = itemElement.querySelector('.item-nome')?.value || '';
        const data = itemElement.querySelector('.item-data')?.value || '';
        const hora = itemElement.querySelector('.item-hora')?.value || '';
        
        // Obter ordem do elemento ou calcular baseado na posição
        let ordem = parseInt(itemElement.querySelector('.item-ordem')?.textContent?.match(/\d+/)?.[0] || '1');
        
        // Se não conseguiu obter a ordem do texto, calcular pela posição no container
        if (!ordem || isNaN(ordem)) {
            const container = document.getElementById('checkin-itens-container');
            if (container) {
                const items = Array.from(container.querySelectorAll('.checkin-item'));
                ordem = items.indexOf(itemElement) + 1;
            } else {
                ordem = 1;
            }
        }

        return {
            nome: nome,
            data: data,
            hora: hora,
            ordem: ordem
        };
    }

    // Reordenar itens
    reorderItems() {
        const container = document.getElementById('checkin-itens-container');
        if (!container) return;

        const items = container.querySelectorAll('.checkin-item');
        items.forEach((item, index) => {
            const ordemSpan = item.querySelector('.item-ordem');
            if (ordemSpan) {
                ordemSpan.textContent = `Ordem #${index + 1}`;
            }
        });
    }

    addAcesso() {
        const container = document.getElementById('checkin-acessos-container');
        if (!container) return;

        // Limpar mensagem vazia se for o primeiro acesso
        if (container.children.length === 1 && container.querySelector('.text-center')) {
            container.innerHTML = '';
        }

        const acessoId = 'temp_' + Date.now();
        
        const acessoHtml = `
            <div class="checkin-acesso bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm" data-acesso-id="${acessoId}" data-is-new="true">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                    <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                        <input type="text" placeholder="Nome completo" class="acesso-nome w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">CPF</label>
                        <input type="text" placeholder="000.000.000-00" class="acesso-cpf w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                    </div>
                </div>
                <div class="flex items-center justify-end">
                    <div class="flex gap-2">
                        <button type="button" class="save-acesso hidden inline-flex items-center px-2 py-1 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/40">
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
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', acessoHtml);
        
        // Adicionar eventos
        const newAcesso = container.lastElementChild;
        this.setupAcessoEvents(newAcesso);
        
        // Mostrar botão salvar para acesso novo
        const saveBtn = newAcesso.querySelector('.save-acesso');
        if (saveBtn) {
            saveBtn.classList.remove('hidden');
        }
    }

    // Configurar eventos para um acesso específico
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
                this.showSaveButtonAcesso(acessoElement);
                
                // PUT automático após parar de digitar (apenas para acessos existentes)
                if (acessoElement.dataset.isNew !== 'true') {
                    clearTimeout(timeout);
                    timeout = setTimeout(async () => {
                        await this.autoSaveAcesso(acessoElement);
                    }, 1000); // Aguarda 1 segundo após parar de digitar
                }
            });
        });
    }

    // Mostrar botão salvar para acesso
    showSaveButtonAcesso(acessoElement) {
        const saveBtn = acessoElement.querySelector('.save-acesso');
        if (saveBtn && !acessoElement.dataset.isNew) {
            saveBtn.classList.remove('hidden');
        }
    }

    // Salvar acesso
    async saveAcesso(acessoElement) {
        const acessoData = this.getAcessoData(acessoElement);
        
        if (!acessoData.nome.trim()) {
            this.showNotification('Nome é obrigatório', 'error');
            return;
        }

        if (!acessoData.cpf.trim()) {
            this.showNotification('CPF é obrigatório', 'error');
            return;
        }

        try {
            let response;
            const isNew = acessoElement.dataset.isNew === 'true';
            
            if (isNew) {
                // Verificar se existe checkin
                if (!window.checkinService?.currentFormulario?.id) {
                    this.showNotification('Checkin não encontrado', 'error');
                    return;
                }
                
                acessoData.checkin_formularios_id = window.checkinService.currentFormulario.id;
                response = await window.formulariosAPI.createCheckinAcesso(acessoData);
            } else {
                const acessoId = acessoElement.dataset.acessoId;
                response = await window.formulariosAPI.updateCheckinAcesso(acessoId, acessoData);
            }

            if (response.success || response.code === 200 || response.code === 201) {
                // Atualizar elemento
                if (isNew && response.data?.id) {
                    acessoElement.dataset.acessoId = response.data.id;
                    acessoElement.dataset.isNew = 'false';
                }
                
                // Esconder botão salvar
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

    // Salvar acesso automaticamente (sem notificação)
    async autoSaveAcesso(acessoElement) {
        const acessoData = this.getAcessoData(acessoElement);
        
        if (!acessoData.nome.trim() && !acessoData.cpf.trim()) {
            return;
        }

        try {
            const acessoId = acessoElement.dataset.acessoId;
            const response = await window.formulariosAPI.updateCheckinAcesso(acessoId, acessoData);

            if (response.success || response.code === 200) {
                // Esconder botão salvar
                const saveBtn = acessoElement.querySelector('.save-acesso');
                if (saveBtn) {
                    saveBtn.classList.add('hidden');
                }
            }
        } catch (error) {
            // Falha silenciosa para auto-save
        }
    }

    // Remover acesso
    async removeAcesso(acessoElement) {
        const isNew = acessoElement.dataset.isNew === 'true';
        
        if (!isNew) {
            // Acesso existente - fazer DELETE na API
            try {
                const acessoId = acessoElement.dataset.acessoId;
                const response = await window.formulariosAPI.deleteCheckinAcesso(acessoId);
                
                if (!(response.success || response.code === 200)) {
                    throw new Error(response.message || 'Erro ao excluir pessoa autorizada');
                }
                
                this.showNotification('Pessoa autorizada removida com sucesso', 'success');
            } catch (error) {
                console.error('Erro ao remover pessoa autorizada:', error);
                this.showNotification('Erro ao remover pessoa autorizada', 'error');
                return;
            }
        }
        
        // Remover do DOM
        acessoElement.remove();
    }

    // Obter dados do acesso
    getAcessoData(acessoElement) {
        return {
            nome: acessoElement.querySelector('.acesso-nome')?.value || '',
            cpf: acessoElement.querySelector('.acesso-cpf')?.value || ''
        };
    }

    // Popular itens existentes no DOM
    populateItens(itens) {
        const container = document.getElementById('checkin-itens-container');
        if (!container) return;

        // Limpar container
        container.innerHTML = '';

        if (!itens || itens.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum item adicionado</div>';
            return;
        }

        itens.forEach((item, index) => {
            const itemHtml = `
                <div class="checkin-item bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm" data-item-id="${item.id}" data-is-new="false">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Item</label>
                            <input type="text" value="${item.nome || ''}" class="item-nome w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
                            <input type="date" value="${this.formatDateForInput(item.data)}" class="item-data w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Horário</label>
                            <input type="time" value="${item.hora || ''}" class="item-hora w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="item-ordem inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                            Ordem #${item.ordem || (index + 1)}
                        </span>
                        <div class="flex gap-2">
                            <button type="button" class="save-item hidden inline-flex items-center px-2 py-1 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/40">
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
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', itemHtml);
            
            // Configurar eventos para o item
            const itemElement = container.lastElementChild;
            this.setupItemEvents(itemElement);
        });
    }

    // Popular acessos existentes no DOM
    populateAcessos(acessos) {
        const container = document.getElementById('checkin-acessos-container');
        if (!container) return;

        // Limpar container
        container.innerHTML = '';

        if (!acessos || acessos.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 dark:text-gray-400 py-4">Nenhuma pessoa autorizada</div>';
            return;
        }

        acessos.forEach(acesso => {
            const acessoHtml = `
                <div class="checkin-acesso bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm" data-acesso-id="${acesso.id}" data-is-new="false">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                            <input type="text" value="${acesso.nome || ''}" class="acesso-nome w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">CPF</label>
                            <input type="text" value="${acesso.cpf || ''}" class="acesso-cpf w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                        </div>
                    </div>
                    <div class="flex items-center justify-end">
                        <div class="flex gap-2">
                            <button type="button" class="save-acesso hidden inline-flex items-center px-2 py-1 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/40">
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
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', acessoHtml);
            
            // Configurar eventos para o acesso
            const acessoElement = container.lastElementChild;
            this.setupAcessoEvents(acessoElement);
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    new CheckinUI();
});