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
                            <div>
                                <h4 class="text-sm font-medium text-gray-900 dark:text-white">Campanha ${campaign.id}</h4>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Criada em ${this.formatDate(campaign.created)}</p>
                                ${campaign.info ? `<p class="text-xs text-gray-400 dark:text-gray-500 mt-1">${campaign.info}</p>` : ''}
                            </div>
                        </div>
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${statusInfo.class}">
                            ${statusInfo.text}
                        </span>
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
}

// Inicializar quando o script for carregado
document.addEventListener('DOMContentLoaded', () => {
    window.disparadorHomeService = new DisparadorHomeService();
}); 