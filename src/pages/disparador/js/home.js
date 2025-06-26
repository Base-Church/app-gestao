class DisparadorHomeService {
    constructor() {
        // Usar a configuração global existente
        this.baseUrl = window.APP_CONFIG?.apiWhatsapp || window.ENV?.API_WHATSAPP;
        this.token = window.APP_CONFIG?.apiTokenWhatsapp || window.ENV?.API_TOKEN_WHATSAPP;
        
        // Cache de campanhas para filtragem local
        this.allCampaigns = [];
        this.currentFilter = 'scheduled'; // Filtro padrão: Pendentes (scheduled)
        
        if (!this.baseUrl || !this.token) {
            console.error('Configurações da API WhatsApp não encontradas');
            this.showError('Configurações da API não encontradas. Verifique as variáveis de ambiente.');
            return;
        }
        
        this.init();
    }

    async makeRequest(endpoint, method = 'GET', data = null) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': this.token
            };

            const options = {
                method,
                headers,
                body: data ? JSON.stringify(data) : undefined
            };

            console.log(`Fazendo requisição para: ${url}`);
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Resposta da API:', result);
            return result;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    // Listar campanhas de envio
    async getCampaigns(status = null) {
        try {
            let endpoint = '/sender/listfolders';
            if (status) {
                endpoint += `?status=${status}`;
            }
            
            const campaigns = await this.makeRequest(endpoint, 'GET');
            return campaigns || [];
        } catch (error) {
            console.error('Erro ao buscar campanhas:', error);
            return [];
        }
    }

    // Filtrar campanhas localmente
    filterCampaigns(campaigns, status) {
        if (!status) {
            return campaigns;
        }
        return campaigns.filter(campaign => campaign.status === status);
    }

    // Calcular estatísticas das campanhas
    calculateStats(campaigns) {
        const stats = {
            total: campaigns.length,
            enviadas: 0,
            pendentes: 0,
            falhas: 0,
            agendadas: 0,
            concluidas: 0
        };

        campaigns.forEach(campaign => {
            // Contadores de log
            stats.enviadas += campaign.log_sucess || 0;
            stats.falhas += campaign.log_failed || 0;
            stats.pendentes += (campaign.log_total || 0) - (campaign.log_sucess || 0) - (campaign.log_failed || 0);

            // Status da campanha
            if (campaign.status === 'scheduled') {
                stats.agendadas++;
            } else if (campaign.status === 'done') {
                stats.concluidas++;
            }
        });

        return stats;
    }

    // Atualizar estatísticas na interface
    updateStats(stats) {
        const elements = {
            total: document.querySelector('[data-stat="total"]'),
            enviadas: document.querySelector('[data-stat="enviadas"]'),
            pendentes: document.querySelector('[data-stat="pendentes"]'),
            falhas: document.querySelector('[data-stat="falhas"]')
        };

        if (elements.total) elements.total.textContent = stats.total;
        if (elements.enviadas) elements.enviadas.textContent = stats.enviadas;
        if (elements.pendentes) elements.pendentes.textContent = stats.pendentes;
        if (elements.falhas) elements.falhas.textContent = stats.falhas;
    }

    // Calcular milissegundos para agendamento
    calculateScheduledFor(dateTime) {
        // Converter data/hora para milissegundos desde epoch
        // Exemplo de uso:
        // const scheduledFor = this.calculateScheduledFor('2024-01-15 14:30:00');
        // Resultado: 1750953053072 (milissegundos desde epoch)
        const targetDate = new Date(dateTime);
        return targetDate.getTime();
    }

    // Exemplo de como usar para agendamento:
    // Para agendar para 15 de janeiro de 2024 às 14:30:00:
    // const scheduledFor = this.calculateScheduledFor('2024-01-15 14:30:00');
    // 
    // Para agendar para daqui a 1 hora:
    // const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    // const scheduledFor = this.calculateScheduledFor(oneHourFromNow);
    //
    // Para agendar para amanhã às 9:00:
    // const tomorrow = new Date();
    // tomorrow.setDate(tomorrow.getDate() + 1);
    // tomorrow.setHours(9, 0, 0, 0);
    // const scheduledFor = this.calculateScheduledFor(tomorrow);

    // Formatar data de agendamento
    formatScheduledDate(scheduledFor) {
        try {
            const date = new Date(scheduledFor);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Data inválida';
        }
    }

    // Formatar data
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Data inválida';
        }
    }

    // Formatar status
    formatStatus(status) {
        const statusMap = {
            'scheduled': { text: 'Pendente', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
            'done': { text: 'Concluída', class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' }
        };
        
        return statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' };
    }

    // Renderizar lista de campanhas recentes
    renderCampaignsList(campaigns) {
        const container = document.querySelector('[data-campaigns-list]');
        if (!container) return;

        if (campaigns.length === 0) {
            const filterText = this.currentFilter ? ` com status "${this.formatStatus(this.currentFilter).text}"` : '';
            container.innerHTML = `
                <div class="text-center text-gray-500 dark:text-gray-400 py-8">
                    <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <p class="text-lg font-medium">Nenhuma campanha encontrada${filterText}</p>
                    <p class="text-sm">${this.currentFilter ? 'Tente alterar o filtro ou ' : ''}Crie sua primeira campanha para começar</p>
                    <a href="${window.APP_CONFIG?.baseUrl || window.ENV?.URL_BASE}/disparador/criar" 
                       class="inline-flex items-center px-4 py-2 mt-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Criar Primeira Campanha
                    </a>
                </div>
            `;
            return;
        }

        // Ordenar campanhas por data de criação (mais recentes primeiro)
        const sortedCampaigns = campaigns.sort((a, b) => new Date(b.created) - new Date(a.created));
        
        // Pegar apenas as 5 mais recentes
        const recentCampaigns = sortedCampaigns.slice(0, 5);

        const campaignsHTML = recentCampaigns.map(campaign => {
            const statusInfo = this.formatStatus(campaign.status);
            const progress = campaign.log_total > 0 ? (campaign.log_sucess / campaign.log_total * 100) : 0;
            
            // Calcular pendentes baseado no status e logs
            const pending = campaign.status === 'scheduled' ? 
                (campaign.log_total || 0) : 
                (campaign.log_total || 0) - (campaign.log_sucess || 0) - (campaign.log_failed || 0);
            
            return `
                <div class="border-b border-gray-200 dark:border-gray-700 last:border-b-0 py-4">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-1">
                                <h4 class="text-sm font-medium text-gray-900 dark:text-white">${campaign.info || 'Campanha ' + campaign.id}</h4>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Criada em ${this.formatDate(campaign.created)}</p>
                                ${campaign.scheduled_for ? `<p class="text-xs text-blue-600 dark:text-blue-400 mt-1">📅 Agendada para: ${this.formatScheduledDate(campaign.scheduled_for)}</p>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="px-2 py-1 text-xs font-medium rounded-full ${statusInfo.class}">
                                ${statusInfo.text}
                            </span>
                            <button 
                                onclick="window.disparadorHomeService.deleteCampaign('${campaign.id}', '${campaign.info || 'Campanha ' + campaign.id}')"
                                class="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                title="Excluir campanha">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="ml-13">
                        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Progresso: ${campaign.log_sucess || 0}/${campaign.log_total || 0}</span>
                            <span>${Math.round(progress)}%</span>
                        </div>
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div class="bg-primary-600 h-2 rounded-full" style="width: ${progress}%"></div>
                        </div>
                        
                        <div class="flex space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>✅ ${campaign.log_sucess || 0}</span>
                            <span>❌ ${campaign.log_failed || 0}</span>
                            <span>⏳ ${pending}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = campaignsHTML;
    }

    // Aplicar filtro
    applyFilter() {
        const filterSelect = document.querySelector('[data-status-filter]');
        if (!filterSelect) return;

        this.currentFilter = filterSelect.value;
        console.log('Aplicando filtro:', this.currentFilter);

        // Filtrar campanhas localmente
        const filteredCampaigns = this.filterCampaigns(this.allCampaigns, this.currentFilter);
        
        // Calcular estatísticas de TODAS as campanhas (não filtradas)
        const stats = this.calculateStats(this.allCampaigns);
        this.updateStats(stats);
        
        // Renderizar lista filtrada
        this.renderCampaignsList(filteredCampaigns);
    }

    // Carregar dados da página
    async loadPageData() {
        try {
            // Mostrar loading
            this.showLoading(true);
            this.hideError();
            
            // Buscar todas as campanhas (sem filtro)
            const campaigns = await this.getCampaigns();
            console.log('Campanhas carregadas:', campaigns);
            
            // Armazenar todas as campanhas no cache
            this.allCampaigns = campaigns;
            
            // Aplicar filtro atual
            this.applyFilter();
            
        } catch (error) {
            console.error('Erro ao carregar dados da página:', error);
            this.showError('Erro ao carregar dados. Tente novamente.');
        } finally {
            this.showLoading(false);
        }
    }

    // Mostrar/ocultar loading
    showLoading(show) {
        const loadingElement = document.querySelector('[data-loading]');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    }

    // Mostrar erro
    showError(message) {
        const errorContainer = document.querySelector('[data-error]');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="text-center text-red-500 dark:text-red-400 py-4">
                    <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p>${message}</p>
                </div>
            `;
            errorContainer.style.display = 'block';
        }
    }

    // Ocultar erro
    hideError() {
        const errorContainer = document.querySelector('[data-error]');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }

    // Inicializar
    init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Carregar dados iniciais
        this.loadPageData();

        // Listener para filtro de status
        const filterSelect = document.querySelector('[data-status-filter]');
        if (filterSelect) {
            filterSelect.addEventListener('change', () => this.applyFilter());
        }

        // Listener para refresh manual
        const refreshButton = document.querySelector('[data-refresh]');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.loadPageData());
        }
    }

    // Editar campanha (excluir, pausar, etc.)
    async editCampaign(folderId, action) {
        try {
            const data = {
                folder_id: folderId,
                action: action
            };
            
            const result = await this.makeRequest('/sender/edit', 'POST', data);
            return result;
        } catch (error) {
            console.error('Erro ao editar campanha:', error);
            throw error;
        }
    }

    // Deletar campanha
    async deleteCampaign(campaignId, campaignInfo) {
        try {
            const confirmed = await this.showDeleteConfirmation(campaignInfo);
            if (!confirmed) return;

            // Mostrar loading
            this.showLoading(true);
            
            const result = await this.editCampaign(campaignId, 'delete');
            console.log('Campanha deletada:', result);
            
            // Recarregar dados
            await this.loadPageData();
            
            // Mostrar sucesso
            this.showSuccess('Campanha deletada com sucesso!');
            
        } catch (error) {
            console.error('Erro ao deletar campanha:', error);
            this.showError('Erro ao deletar campanha. Tente novamente.');
        } finally {
            this.showLoading(false);
        }
    }

    // Mostrar modal de confirmação de exclusão
    showDeleteConfirmation(campaignInfo) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
            modal.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-4">
                                <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Confirmar Exclusão</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Esta ação não pode ser desfeita</p>
                            </div>
                        </div>
                        
                        <div class="mb-6">
                            <p class="text-gray-700 dark:text-gray-300 mb-2">
                                Tem certeza que deseja excluir a campanha:
                            </p>
                            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                <p class="font-medium text-gray-900 dark:text-white">${campaignInfo}</p>
                            </div>
                        </div>
                        
                        <div class="flex space-x-3">
                            <button type="button" 
                                    class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                    onclick="this.closest('.fixed').remove(); window.disparadorHomeService.resolveDeleteConfirmation(false);">
                                Cancelar
                            </button>
                            <button type="button" 
                                    class="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                    onclick="this.closest('.fixed').remove(); window.disparadorHomeService.resolveDeleteConfirmation(true);">
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Armazenar a função de resolução
            this.resolveDeleteConfirmation = resolve;
        });
    }

    // Mostrar sucesso
    showSuccess(message) {
        const successContainer = document.querySelector('[data-success]');
        if (successContainer) {
            successContainer.innerHTML = `
                <div class="text-center text-green-500 dark:text-green-400 py-4">
                    <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p>${message}</p>
                </div>
            `;
            successContainer.style.display = 'block';
            
            // Ocultar após 3 segundos
            setTimeout(() => {
                successContainer.style.display = 'none';
            }, 3000);
        }
    }
}

// Inicializar quando o script for carregado
document.addEventListener('DOMContentLoaded', () => {
    window.disparadorHomeService = new DisparadorHomeService();
}); 