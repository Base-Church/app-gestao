import { getEscalas } from './api.js';
import { deleteEscala as deleteEscalaApi } from './delete-escala.js';
import { shareEscala } from './share-escala.js';

class EscalasListManager {
    constructor() {
        this.currentFilters = {
            search: '',
            tipo: '',
            page: 1
        };
        
        this.initializeElements();
        this.addEventListeners();
        this.loadEscalas();
        this.currentEscalas = []; // Add this line
        this.showAllEscalas = false; // Novo estado para controle de exibição
    }

    initializeElements() {
        this.searchInput = document.getElementById('search-input');
        this.tipoSelect = document.getElementById('tipo-select');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.emptyState = document.getElementById('empty-state');
        this.escalasGrid = document.getElementById('escalas-grid');
        this.escalasList = document.getElementById('escalas-list');
        this.paginationContainer = document.getElementById('pagination-container');
        this.toggleButton = document.getElementById('toggle-escalas');
        this.escalasCount = document.getElementById('escalas-count');
        
        // Adiciona listener para o botão toggle
        this.toggleButton?.addEventListener('click', () => {
            this.showAllEscalas = !this.showAllEscalas;
            this.toggleButton.querySelector('span').textContent = 
                this.showAllEscalas ? 'Mostrar apenas ativas' : 'Mostrar todas as escalas';
            this.renderEscalas(this.currentEscalas);
        });
    }

    addEventListeners() {
        this.searchInput?.addEventListener('input', this.debounce(() => {
            this.currentFilters.search = this.searchInput.value;
            this.currentFilters.page = 1;
            this.loadEscalas();
        }, 300));

        this.tipoSelect?.addEventListener('change', () => {
            this.currentFilters.tipo = this.tipoSelect.value;
            this.currentFilters.page = 1;
            this.loadEscalas();
        });
    }

    async loadEscalas() {
        try {
            this.showLoading();
            const response = await getEscalas(this.currentFilters);
            
            if (response.code === 200) {
                this.renderEscalas(response.data);
                this.renderPagination(response.meta);
            } else {
                throw new Error(response.message || 'Erro ao carregar escalas');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showError(error.message);
        }
    }

    renderEscalas(escalas) {
        if (!escalas || escalas.length === 0) {
            this.showEmptyState();
            return;
        }

        this.currentEscalas = escalas;
        const hoje = new Date();

        // Filtra escalas ativas se necessário
        const escalasParaMostrar = this.showAllEscalas ? 
            escalas : 
            escalas.filter(escala => new Date(escala.data_fim) >= hoje);

        // Atualiza contador
        this.escalasCount.textContent = `Mostrando ${escalasParaMostrar.length} de ${escalas.length} escalas`;

        this.escalasList.innerHTML = escalasParaMostrar.map(escala => {
            const dataInicio = new Date(escala.data_inicio).toLocaleDateString('pt-BR');
            const dataFim = new Date(escala.data_fim).toLocaleDateString('pt-BR');
            const isAtiva = new Date(escala.data_fim) >= hoje;
            const baseUrl = "https://app.basechurch.com.br";
            const viewUrl = `https://escalas.basechurch.com.br/ver?ec=${escala.prefixo}-${escala.slug}`;
            const editUrl = `${baseUrl}/escalas/editar?id=${escala.id}`;

            return `
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-3">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                        ${escala.nome}
                                    </h3>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        isAtiva ? 
                                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                    }">
                                        ${isAtiva ? 'Ativa' : 'Encerrada'}
                                    </span>
                                </div>
                                
                                <div class="mt-1 flex items-center gap-4">
                                    <span class="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                        </svg>
                                        ${dataInicio}${dataInicio !== dataFim ? ` até ${dataFim}` : ''}
                                    </span>
                                    <span class="inline-flex items-center text-sm font-medium rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-2.5 py-0.5">
                                        ${escala.tipo}
                                    </span>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                <a href="${viewUrl}" target="_blank" 
                                   class="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500"
                                   title="Visualizar">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                </a>
                                <a href="${editUrl}" 
                                   class="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                                   title="Editar">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                </a>
                                <button class="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-500 send-to-group" 
                                        data-id="${escala.id}" 
                                        title="Enviar para o Grupo">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                                    </svg>
                                </button>
                                <button class="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 delete-escala" 
                                        data-id="${escala.id}" 
                                        title="Excluir">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.addDeleteListeners();
        this.addSendToGroupListeners();
        this.showEscalasGrid();
    }

    addDeleteListeners() {
        const deleteButtons = this.escalasList.querySelectorAll('.delete-escala');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                this.deleteEscala(id);
            });
        });
    }

    addSendToGroupListeners() {
        const sendButtons = this.escalasList.querySelectorAll('.send-to-group');
        sendButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                this.sendToGroup(id);
            });
        });
    }

    renderPagination(meta) {
        if (!meta) return;

        const { current_page, last_page, from, to, total } = meta;

        // Atualiza os números de início, fim e total
        document.getElementById('page-start').textContent = from || 0;
        document.getElementById('page-end').textContent = to || 0;
        document.getElementById('total-items').textContent = total || 0;

        // Renderiza os números das páginas de forma simplificada
        const paginationNumbers = document.getElementById('pagination-numbers');
        if (paginationNumbers) {
            let html = '';
            for (let i = 1; i <= last_page; i++) {
                html += `
                    <button 
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            i === current_page 
                                ? 'text-primary-600 bg-primary-50 border-primary-500' 
                                : 'text-gray-700 hover:bg-gray-50'
                        }"
                        onclick="window.escalasManager.goToPage(${i})"
                    >
                        ${i}
                    </button>
                `;
            }
            paginationNumbers.innerHTML = html;
        }
    }

    goToPage(page) {
        this.currentFilters.page = page;
        this.loadEscalas();
    }

    // ... métodos auxiliares para mostrar/esconder estados ...
    showLoading() {
        this.loadingIndicator.classList.remove('hidden');
        this.errorContainer.classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.escalasGrid.classList.add('hidden');
    }

    showError(message) {
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.remove('hidden');
        this.emptyState.classList.add('hidden');
        this.escalasGrid.classList.add('hidden');
        document.getElementById('error-message').textContent = message;
    }

    showEmptyState() {
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.add('hidden');
        this.emptyState.classList.remove('hidden');
        this.escalasGrid.classList.add('hidden');
    }

    showEscalasGrid() {
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.escalasGrid.classList.remove('hidden');
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async deleteEscala(id) {
        if (!confirm('Tem certeza que deseja excluir esta escala?')) {
            return;
        }

        try {
            this.showLoading();
            const response = await deleteEscalaApi(id);
            
            if (response.code === 200) {
                // Reload the escalas list after successful deletion
                this.loadEscalas();
            } else {
                throw new Error(response.message || 'Erro ao excluir escala');
            }
        } catch (error) {
            console.error('Erro:', error);
            this.showError(error.message);
        }
    }

    sendToGroup(id) {
        const escalaCard = this.escalasList.querySelector(`button[data-id="${id}"]`).closest('.bg-white');
        if (!escalaCard) {
            console.error('Card da escala não encontrado');
            return;
        }

        // Pega as informações diretamente do array de escalas
        const escala = this.currentEscalas.find(e => e.id === parseInt(id));
        if (!escala) {
            console.error('Escala não encontrada');
            return;
        }

        const baseUrl = window.ENV?.URL_BASE || window.location.origin + '/baseescalas';
        const viewUrl = `${baseUrl}/ver?ec=${escala.prefixo}-${escala.slug}`;
        const ministerio_id = window.USER?.ministerio_atual;
        
        shareEscala(viewUrl, escala.nome, escala.tipo, ministerio_id, escala.data_fim);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.escalasManager = new EscalasListManager();
});
