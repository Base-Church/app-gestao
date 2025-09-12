// Gerenciador de Check-in Formulários
class CheckinManager {
    constructor() {
        this.currentCheckinFormulario = null;
        this.itens = [];
        this.acessos = [];
        this.sortableInstance = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        // Torna disponível globalmente
        window.checkinManager = this;
    }

    setupEventListeners() {
        // Event listeners para o modal de check-in
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="open-checkin-modal"]')) {
                e.preventDefault();
                this.openCheckinModal();
            }
        });

        // Event listeners quando o DOM estiver pronto
        document.addEventListener('DOMContentLoaded', () => {
            this.setupModalEventListeners();
        });
    }

    setupModalEventListeners() {
        // Aguardar um pouco para garantir que o modal foi criado
        setTimeout(() => {
            const closeBtn = document.getElementById('close-checkin-modal');
            const cancelBtn = document.getElementById('cancel-checkin-btn');
            const saveBtn = document.getElementById('save-checkin-btn');
            const addItemBtn = document.getElementById('add-checkin-item-btn');
            const addAcessoBtn = document.getElementById('add-checkin-acesso-btn');

            // Remover listeners existentes primeiro
            if (closeBtn) {
                closeBtn.replaceWith(closeBtn.cloneNode(true));
                document.getElementById('close-checkin-modal').addEventListener('click', () => this.closeCheckinModal());
            }
            if (cancelBtn) {
                cancelBtn.replaceWith(cancelBtn.cloneNode(true));
                document.getElementById('cancel-checkin-btn').addEventListener('click', () => this.closeCheckinModal());
            }
            if (saveBtn) {
                saveBtn.replaceWith(saveBtn.cloneNode(true));
                document.getElementById('save-checkin-btn').addEventListener('click', () => this.saveCheckin());
            }
            if (addItemBtn) {
                addItemBtn.replaceWith(addItemBtn.cloneNode(true));
                document.getElementById('add-checkin-item-btn').addEventListener('click', () => this.addCheckinItem());
            }
            if (addAcessoBtn) {
                addAcessoBtn.replaceWith(addAcessoBtn.cloneNode(true));
                document.getElementById('add-checkin-acesso-btn').addEventListener('click', () => this.addCheckinAcesso());
            }
        }, 100);
    }

    openCheckinModal(formularioId = null) {
        // Auto-popular o formulário ID da URL se não fornecido
        if (!formularioId) {
            formularioId = this.getFormularioIdFromUrl();
        }
        
        // Se tem formularioId, carregar dados existentes
        if (formularioId) {
            this.loadCheckinData(formularioId);
        } else {
            this.resetCheckinForm();
        }
        
        // Auto-popular o formulário ID no campo
        this.populateFormularioId(formularioId);
        
        // Mostrar modal
        const modal = document.getElementById('checkin-modal');
        if (modal) {
            modal.classList.remove('hidden');
            // Configurar event listeners se ainda não foram configurados
            this.setupModalEventListeners();
        }
        
        // Carregar dados para os selects (com loading)
        this.loadProcessosWithLoading();
        this.loadEventosWithLoading();
    }

    loadProcessosWithLoading() {
        const select = document.getElementById('checkin-processo-id');
        if (select) {
            select.innerHTML = '<option value="">Carregando processos...</option>';
            select.disabled = true;
            this.loadProcessos().finally(() => {
                select.disabled = false;
            });
        }
    }

    loadEventosWithLoading() {
        const select = document.getElementById('checkin-evento-id');
        if (select) {
            select.innerHTML = '<option value="">Carregando eventos...</option>';
            select.disabled = true;
            this.loadEventos().finally(() => {
                select.disabled = false;
            });
        }
    }

    getFormularioIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    populateFormularioId(formularioId) {
        if (formularioId) {
            const formularioField = document.getElementById('checkin-formulario-id');
            if (formularioField) {
                formularioField.value = formularioId;
                // Tornar readonly para evitar alteração acidental
                formularioField.setAttribute('readonly', true);
                formularioField.classList.add('bg-gray-100', 'dark:bg-gray-700');
            }
        }
    }

    async loadProcessos() {
        try {
            // Obter ministério ID
            const ministerioId = this.getMinisterioId();
            const response = await apiService.getProcessos(ministerioId);
            const select = document.getElementById('checkin-processo-id');
            if (select && (response.success || response.code === 200)) {
                // Limpar opções existentes
                select.innerHTML = '<option value="">Selecione um processo</option>';
                
                const processos = response.data || [];
                if (Array.isArray(processos)) {
                    processos.forEach(processo => {
                        const option = document.createElement('option');
                        option.value = processo.id;
                        option.textContent = processo.nome;
                        select.appendChild(option);
                    });
                } else if (typeof processos === 'object') {
                    // Se data é um objeto, pegar os valores
                    Object.values(processos).forEach(processo => {
                        const option = document.createElement('option');
                        option.value = processo.id;
                        option.textContent = processo.nome;
                        select.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao carregar processos:', error);
            const select = document.getElementById('checkin-processo-id');
            if (select) {
                select.innerHTML = '<option value="">Erro ao carregar processos</option>';
            }
        }
    }

    async loadEventos() {
        try {
            const response = await apiService.getEventos();
            const select = document.getElementById('checkin-evento-id');
            if (select && (response.success || response.code === 200)) {
                // Limpar opções existentes
                select.innerHTML = '<option value="">Selecione um evento</option>';
                
                const eventos = response.data || [];
                if (Array.isArray(eventos)) {
                    eventos.forEach(evento => {
                        const option = document.createElement('option');
                        option.value = evento.id;
                        option.textContent = evento.nome || evento.titulo;
                        select.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            const select = document.getElementById('checkin-evento-id');
            if (select) {
                select.innerHTML = '<option value="">Erro ao carregar eventos</option>';
            }
        }
    }

    getMinisterioId() {
        // Prioriza window.USER.ministerio_atual
        if (window.USER && window.USER.ministerio_atual) {
            if (typeof window.USER.ministerio_atual === 'object' && window.USER.ministerio_atual.id) {
                return window.USER.ministerio_atual.id;
            }
            return window.USER.ministerio_atual;
        }
        
        // Fallback para data-ministerio-id
        const element = document.querySelector('[data-ministerio-id]');
        if (element && element.dataset.ministerioId) {
            return element.dataset.ministerioId;
        }
        
        throw new Error('ID do ministério não encontrado');
    }

    closeCheckinModal() {
        const modal = document.getElementById('checkin-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    resetCheckinForm() {
        this.currentCheckinFormulario = null;
        this.itens = [];
        this.acessos = [];
        
        // Limpar campos
        const fields = [
            'checkin-nome',
            'checkin-formulario-id', 
            'checkin-processo-id',
            'checkin-evento-id'
        ];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });
        
        // Restaurar containers vazios
        const itensContainer = document.getElementById('checkin-itens-container');
        if (itensContainer) {
            itensContainer.innerHTML = `
                <div class="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                    <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p class="font-medium">Nenhum item adicionado</p>
                    <p class="mt-1">Clique em "Adicionar Item" para começar</p>
                </div>
            `;
        }
        
        const acessosContainer = document.getElementById('checkin-acessos-container');
        if (acessosContainer) {
            acessosContainer.innerHTML = `
                <div class="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                    <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                    </svg>
                    <p class="font-medium">Nenhuma pessoa autorizada</p>
                    <p class="mt-1">Clique em "Adicionar Pessoa" para começar</p>
                </div>
            `;
        }
    }

    addCheckinItem() {
        const container = document.getElementById('checkin-itens-container');
        if (!container) return;

        // Limpar mensagem vazia se for o primeiro item
        if (container.children.length === 1 && container.querySelector('.text-center')) {
            container.innerHTML = '';
        }

        const itemId = 'temp_' + Date.now();
        const ordem = this.itens.length + 1;
        
        const itemHtml = `
            <div class="checkin-item bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm" data-item-id="${itemId}">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
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
                            <button type="button" class="remove-item inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/40">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', itemHtml);
        
        // Adicionar evento de remoção
        const newItem = container.lastElementChild;
        const removeBtn = newItem.querySelector('.remove-item');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                newItem.remove();
                this.updateItemOrdens();
            });
        }
        
        // Configurar sortable se ainda não foi configurado
        this.setupSortable();
        
        // Adicionar item à lista
        this.itens.push({
            id: itemId,
            nome: '',
            data: '',
            hora: '',
            ordem: ordem,
            isNew: true
        });
    }

    addCheckinAcesso() {
        const container = document.getElementById('checkin-acessos-container');
        if (!container) return;

        // Limpar mensagem vazia se for o primeiro acesso
        if (container.children.length === 1 && container.querySelector('.text-center')) {
            container.innerHTML = '';
        }

        const acessoId = 'temp_' + Date.now();
        
        const acessoHtml = `
            <div class="checkin-acesso bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm" data-acesso-id="${acessoId}">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 mt-2">
                        <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                <input type="text" placeholder="Ex: João Silva Santos" class="acesso-nome w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">CPF</label>
                                <input type="text" placeholder="000.000.000-00" class="acesso-cpf w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <button type="button" class="remove-acesso inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/40">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', acessoHtml);
        
        // Adicionar evento de remoção
        const newAcesso = container.lastElementChild;
        const removeBtn = newAcesso.querySelector('.remove-acesso');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                newAcesso.remove();
            });
        }
        
        // Adicionar acesso à lista
        this.acessos.push({
            id: acessoId,
            nome: '',
            cpf: '',
            isNew: true
        });
    }

    setupSortable() {
        const container = document.getElementById('checkin-itens-container');
        if (!container) return;
        
        if (this.sortableInstance) {
            this.sortableInstance.destroy();
        }
        
        this.sortableInstance = new Sortable(container, {
            animation: 150,
            ghostClass: 'opacity-50',
            chosenClass: 'ring-primary-500',
            dragClass: 'transform rotate-2 scale-105',
            handle: '.cursor-move',
            onEnd: (evt) => {
                this.updateItemOrdens();
            }
        });
    }

    updateItemOrdens() {
        const items = document.querySelectorAll('.checkin-item');
        items.forEach((item, index) => {
            const ordemSpan = item.querySelector('.item-ordem');
            if (ordemSpan) {
                ordemSpan.textContent = `Ordem #${index + 1}`;
            }
        });
    }

    async saveCheckin() {
        try {
            // Validar campos obrigatórios
            const nome = document.getElementById('checkin-nome')?.value?.trim();
            const formularioId = document.getElementById('checkin-formulario-id')?.value?.trim();
            
            if (!nome || !formularioId) {
                this.showNotification('Nome e Formulário ID são obrigatórios!', 'error');
                return;
            }
            
            const ministerioId = apiService.getMinisterioId();
            
            // Preparar dados do check-in formulário
            const checkinData = {
                nome: nome,
                ministerio_id: ministerioId,
                formulario_id: parseInt(formularioId)
            };
            
            const processoId = document.getElementById('checkin-processo-id')?.value?.trim();
            const eventoId = document.getElementById('checkin-evento-id')?.value?.trim();
            
            if (processoId) checkinData.processo_id = parseInt(processoId);
            if (eventoId) checkinData.evento_id = parseInt(eventoId);
            
            // Criar ou atualizar check-in formulário
            let checkinFormulario;
            if (this.currentCheckinFormulario) {
                checkinFormulario = await apiService.updateCheckinFormulario(this.currentCheckinFormulario.id, checkinData);
            } else {
                checkinFormulario = await apiService.createCheckinFormulario(checkinData);
            }
            
            // Salvar itens
            await this.saveCheckinItens(checkinFormulario.data.id);
            
            // Salvar acessos
            await this.saveCheckinAcessos(checkinFormulario.data.id);
            
            // Fechar modal
            this.closeCheckinModal();
            
            // Mostrar notificação de sucesso
            this.showNotification('Check-in salvo com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao salvar check-in:', error);
            this.showNotification('Erro ao salvar check-in: ' + error.message, 'error');
        }
    }

    async saveCheckinItens(checkinFormularioId) {
        const items = document.querySelectorAll('.checkin-item');
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const nome = item.querySelector('.item-nome')?.value?.trim();
            const data = item.querySelector('.item-data')?.value;
            const hora = item.querySelector('.item-hora')?.value;
            
            if (nome) {
                const itemData = {
                    nome: nome,
                    data: data,
                    hora: hora,
                    ordem: i + 1,
                    checkin_formularios_id: checkinFormularioId
                };
                
                const itemId = item.dataset.itemId;
                if (itemId && itemId.startsWith('temp_')) {
                    // Novo item
                    await apiService.createCheckinItem(itemData);
                } else if (itemId) {
                    // Item existente
                    await apiService.updateCheckinItem(itemId, itemData);
                }
            }
        }
    }

    async saveCheckinAcessos(checkinFormularioId) {
        const acessos = document.querySelectorAll('.checkin-acesso');
        
        for (const acesso of acessos) {
            const nome = acesso.querySelector('.acesso-nome')?.value?.trim();
            const cpf = acesso.querySelector('.acesso-cpf')?.value?.trim();
            
            if (nome && cpf) {
                const acessoData = {
                    checkin_formularios_id: checkinFormularioId,
                    cpf: cpf,
                    nome: nome
                };
                
                const acessoId = acesso.dataset.acessoId;
                if (acessoId && acessoId.startsWith('temp_')) {
                    // Novo acesso
                    await apiService.createCheckinAcesso(acessoData);
                } else if (acessoId) {
                    // Acesso existente
                    await apiService.updateCheckinAcesso(acessoId, acessoData);
                }
            }
        }
    }

    async loadCheckinData(formularioId) {
        try {
            // Carregar dados do check-in formulário
            await this.loadCheckinFormulario(formularioId);
            
            // Carregar itens associados
            await this.loadCheckinItens(formularioId);
            
            // Carregar acessos associados
            await this.loadCheckinAcessos(formularioId);
            
        } catch (error) {
            console.error('Erro ao carregar dados do check-in:', error);
            this.showNotification('Erro ao carregar dados do check-in', 'error');
        }
    }

    async loadCheckinFormulario(formularioId) {
        try {
            const response = await apiService.getCheckinFormulario(formularioId);
            if (response.success || response.code === 200) {
                const formulario = response.data;
                this.currentCheckinFormulario = formulario;
                
                // Preencher campos do formulário
                const nomeField = document.getElementById('checkin-nome');
                if (nomeField && formulario.nome) {
                    nomeField.value = formulario.nome;
                }
                
                const processoField = document.getElementById('checkin-processo-id');
                if (processoField && formulario.processo_id) {
                    processoField.value = formulario.processo_id;
                }
                
                const eventoField = document.getElementById('checkin-evento-id');
                if (eventoField && formulario.evento_id) {
                    eventoField.value = formulario.evento_id;
                }
            }
        } catch (error) {
            console.error('Erro ao carregar check-in formulário:', error);
            // Não exibir erro se não encontrar (formulário novo)
            if (!error.message.includes('404')) {
                throw error;
            }
        }
    }

    async loadCheckinItens(formularioId) {
        try {
            const response = await apiService.getCheckinItens(formularioId);
            if (response.success || response.code === 200) {
                const itens = response.data || [];
                this.itens = itens;
                
                const container = document.getElementById('checkin-itens-container');
                if (!container) return;
                
                // Limpar container
                container.innerHTML = '';
                
                if (itens.length === 0) {
                    // Mostrar estado vazio
                    container.innerHTML = `
                        <div class="text-center text-sm text-gray-500 dark:text-gray-400 py-8 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            <p class="font-medium">Nenhum item adicionado</p>
                            <p class="mt-1">Clique em "Adicionar Item" para começar</p>
                        </div>
                    `;
                    return;
                }
                
                // Renderizar itens existentes
                itens.forEach(item => this.renderCheckinItem(item));
                
                // Configurar sortable
                this.setupSortable();
            }
        } catch (error) {
            console.error('Erro ao carregar itens do check-in:', error);
            // Não exibir erro se não encontrar (formulário novo)
            if (!error.message.includes('404')) {
                throw error;
            }
        }
    }

    async loadCheckinAcessos(formularioId) {
        try {
            const response = await apiService.getCheckinAcessos(formularioId);
            if (response.success || response.code === 200) {
                const acessos = response.data || [];
                this.acessos = acessos;
                
                const container = document.getElementById('checkin-acessos-container');
                if (!container) return;
                
                // Limpar container
                container.innerHTML = '';
                
                if (acessos.length === 0) {
                    // Mostrar estado vazio
                    container.innerHTML = `
                        <div class="text-center text-sm text-gray-500 dark:text-gray-400 py-8 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                            </svg>
                            <p class="font-medium">Nenhuma pessoa autorizada</p>
                            <p class="mt-1">Clique em "Adicionar Pessoa" para começar</p>
                        </div>
                    `;
                    return;
                }
                
                // Renderizar acessos existentes
                acessos.forEach(acesso => this.renderCheckinAcesso(acesso));
            }
        } catch (error) {
            console.error('Erro ao carregar acessos do check-in:', error);
            // Não exibir erro se não encontrar (formulário novo)
            if (!error.message.includes('404')) {
                throw error;
            }
        }
    }

    renderCheckinItem(item) {
        const container = document.getElementById('checkin-itens-container');
        if (!container) return;
        
        const itemHtml = `
            <div class="checkin-item bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm" data-item-id="${item.id}">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-2">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Item</label>
                                <input type="text" value="${item.nome || ''}" placeholder="Ex: Credencial, Material..." class="item-nome w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Data</label>
                                <input type="date" value="${item.data || ''}" class="item-data w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Horário</label>
                                <input type="time" value="${item.hora || ''}" class="item-hora w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="item-ordem inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
                                Ordem #${item.ordem || 1}
                            </span>
                            <button type="button" class="remove-item inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/40">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', itemHtml);
        
        // Adicionar evento de remoção
        const newItem = container.lastElementChild;
        const removeBtn = newItem.querySelector('.remove-item');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                newItem.remove();
                this.updateItemOrdens();
            });
        }
    }

    renderCheckinAcesso(acesso) {
        const container = document.getElementById('checkin-acessos-container');
        if (!container) return;
        
        const acessoHtml = `
            <div class="checkin-acesso bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm" data-acesso-id="${acesso.id}">
                <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 mt-2">
                        <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                <input type="text" value="${acesso.nome || ''}" placeholder="Ex: João Silva Santos" class="acesso-nome w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                            </div>
                            <div>
                                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">CPF</label>
                                <input type="text" value="${acesso.cpf || ''}" placeholder="000.000.000-00" class="acesso-cpf w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white">
                            </div>
                        </div>
                        <div class="flex justify-end">
                            <button type="button" class="remove-acesso inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/40">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                                Remover
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', acessoHtml);
        
        // Adicionar evento de remoção
        const newAcesso = container.lastElementChild;
        const removeBtn = newAcesso.querySelector('.remove-acesso');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                newAcesso.remove();
            });
        }
    }

    showNotification(message, type = 'info') {
        // Usar o sistema de notificação do FormBuilder se disponível
        if (window.formBuilder && window.formBuilder.showNotification) {
            window.formBuilder.showNotification(message, type);
        } else {
            // Fallback para alert
            alert(message);
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.checkinManager = new CheckinManager();
});
