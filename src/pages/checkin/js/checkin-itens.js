class CheckinItens {
    constructor(api, container, showNotification, escapeHtml, formatDateForInput, formatTimeForInput) {
        this.api = api;
        this.container = container;
        this.showNotification = showNotification;
        this.escapeHtml = escapeHtml;
        this.formatDateForInput = formatDateForInput;
        this.formatTimeForInput = formatTimeForInput;
        this.currentCheckinId = null;
    }

    setCurrentCheckinId(checkinId) {
        this.currentCheckinId = checkinId;
    }

    async loadItens(checkinId) {
        if (!this.container) return;

        try {
            this.container.innerHTML = this.getLoadingHTML();
            
            const response = await this.api.getItens(checkinId);
            const itens = response.data || [];

            if (itens.length === 0) {
                this.container.innerHTML = this.getEmptyStateHTML('itens', 'Nenhum item adicionado', 'Clique em "Adicionar Item" para começar');
                return;
            }

            this.container.innerHTML = '';
            itens.forEach(item => {
                this.renderItem(item);
            });
        } catch (error) {
            console.error('Erro ao carregar itens:', error);
            this.container.innerHTML = this.getErrorHTML('Erro ao carregar itens');
        }
    }

    addItem() {
        if (!this.container) return;

        // Limpar mensagem vazia se for o primeiro item
        if (this.container.children.length === 1 && this.container.querySelector('.text-center')) {
            this.container.innerHTML = '';
        }

        const itemId = 'temp_' + Date.now();
        const ordem = this.container.children.length + 1;
        
        const itemElement = this.createItemElement({
            id: itemId,
            nome: '',
            data: '',
            hora: '',
            ordem: ordem
        }, true);

        this.container.appendChild(itemElement);
        this.setupItemEvents(itemElement);
    }

    renderItem(item) {
        const itemElement = this.createItemElement(item, false);
        this.container.appendChild(itemElement);
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
                response = await this.api.createItem(itemData);
            } else {
                const itemId = itemElement.dataset.itemId;
                response = await this.api.updateItem(itemId, itemData);
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
            const response = await this.api.updateItem(itemId, itemData);

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
                const response = await this.api.deleteItem(itemId);
                
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
        
        // Se não há mais itens, mostrar mensagem vazia
        if (this.container && this.container.children.length === 0) {
            this.container.innerHTML = this.getEmptyStateHTML('itens', 'Nenhum item adicionado', 'Clique em "Adicionar Item" para começar');
        }
    }

    getItemData(itemElement) {
        const nome = itemElement.querySelector('.item-nome')?.value || '';
        const data = itemElement.querySelector('.item-data')?.value || '';
        const hora = itemElement.querySelector('.item-hora')?.value || '';
        
        let ordem = parseInt(itemElement.querySelector('.item-ordem')?.textContent?.match(/\d+/)?.[0] || '1');
        
        if (!ordem || isNaN(ordem)) {
            const items = Array.from(this.container.querySelectorAll('.checkin-item'));
            ordem = items.indexOf(itemElement) + 1;
        }

        return { nome, data, hora, ordem };
    }

    reorderItems() {
        if (!this.container) return;

        const items = this.container.querySelectorAll('.checkin-item');
        items.forEach((item, index) => {
            const ordemSpan = item.querySelector('.item-ordem');
            if (ordemSpan) {
                ordemSpan.textContent = `Ordem #${index + 1}`;
            }
        });
    }

    getEmptyStateHTML(type, title, subtitle) {
        return `
            <div class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">${title}</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${subtitle}</p>
            </div>
        `;
    }

    getLoadingHTML() {
        return `
            <div class="text-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Carregando...</p>
            </div>
        `;
    }

    getErrorHTML(message) {
        return `
            <div class="text-center py-4 text-red-500">
                <svg class="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm">${message}</p>
            </div>
        `;
    }
}

window.CheckinItens = CheckinItens;