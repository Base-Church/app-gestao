class CheckinAcessos {
    constructor(api, container, showNotification, escapeHtml) {
        this.api = api;
        this.container = container;
        this.showNotification = showNotification;
        this.escapeHtml = escapeHtml;
        this.currentCheckinId = null;
    }

    setCurrentCheckinId(checkinId) {
        this.currentCheckinId = checkinId;
    }

    async loadAcessos(checkinId) {
        if (!this.container) return;

        try {
            this.container.innerHTML = this.getLoadingHTML();
            
            const response = await this.api.getAcessos(checkinId);
            const acessos = response.data || [];

            if (acessos.length === 0) {
                this.container.innerHTML = this.getEmptyStateHTML('acessos', 'Nenhuma pessoa autorizada', 'Clique em "Adicionar Pessoa" para começar');
                return;
            }

            this.container.innerHTML = '';
            acessos.forEach(acesso => {
                this.renderAcesso(acesso);
            });
        } catch (error) {
            console.error('Erro ao carregar acessos:', error);
            this.container.innerHTML = this.getErrorHTML('Erro ao carregar acessos');
        }
    }

    addAcesso() {
        if (!this.container) return;

        // Limpar mensagem vazia se for o primeiro acesso
        if (this.container.children.length === 1 && this.container.querySelector('.text-center')) {
            this.container.innerHTML = '';
        }

        const acessoId = 'temp_' + Date.now();
        
        const acessoElement = this.createAcessoElement({
            id: acessoId,
            nome: '',
            cpf: ''
        }, true);

        this.container.appendChild(acessoElement);
        this.setupAcessoEvents(acessoElement);
    }

    renderAcesso(acesso) {
        const acessoElement = this.createAcessoElement(acesso, false);
        this.container.appendChild(acessoElement);
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
                response = await this.api.createAcesso(acessoData);
            } else {
                const acessoId = acessoElement.dataset.acessoId;
                response = await this.api.updateAcesso(acessoId, acessoData);
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
            const response = await this.api.updateAcesso(acessoId, acessoData);

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
                const response = await this.api.deleteAcesso(acessoId);
                
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
        if (this.container && this.container.children.length === 0) {
            this.container.innerHTML = this.getEmptyStateHTML('acessos', 'Nenhuma pessoa autorizada', 'Clique em "Adicionar Pessoa" para começar');
        }
    }

    getAcessoData(acessoElement) {
        const nomeInput = acessoElement.querySelector('.acesso-nome');
        const cpfInput = acessoElement.querySelector('.acesso-cpf');

        return {
            nome: nomeInput ? nomeInput.value.trim() : '',
            cpf: cpfInput ? cpfInput.value.trim() : ''
        };
    }

    getEmptyStateHTML(type, title, subtitle) {
        return `
            <div class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
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

window.CheckinAcessos = CheckinAcessos;