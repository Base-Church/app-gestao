import { FormulariosAPI } from './api.js';
import { deleteFormulario } from './delete-formulario.js';

class FormulariosListManager {
    constructor() {
        this.currentFilters = {
            search: '',
            page: 1
        };
        this.formulariosApi = new FormulariosAPI();
        this.initializeElements();
        this.addEventListeners();
        this.loadFormularios();
        this.currentFormularios = [];
        this.showAllFormularios = false;

        window.addEventListener('ministerio-changed', (event) => {
            if (event.detail?.ministerio_id) {
                this.currentFilters.page = 1;
                this.loadFormularios();
            }
        });
    }

    initializeElements() {
        this.searchInput = document.getElementById('search-input');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.emptyState = document.getElementById('empty-state');
        this.formulariosGrid = document.getElementById('formularios-grid');
        this.formulariosList = document.getElementById('formularios-list');
        this.formulariosCount = document.getElementById('formularios-count');
    }

    addEventListeners() {
        this.searchInput?.addEventListener('input', this.debounce(() => {
            this.currentFilters.search = this.searchInput.value;
            this.currentFilters.page = 1;
            this.loadFormularios();
        }, 300));
    }

    async loadFormularios() {
        try {
            this.showLoading();
            const organizacao_id = window.USER.organizacao_id;
            const ministerio_id = window.USER.ministerio_atual;
            const { data = [], meta = {} } = await this.formulariosApi.list({
                organizacao_id,
                ministerio_id,
                search: this.currentFilters.search,
                page: this.currentFilters.page
            });
            this.renderFormularios(data);
            // this.renderPagination(meta); // Adicione se implementar paginação
        } catch (error) {
            this.showError(error.message || 'Erro ao carregar formulários');
        }
    }

    renderFormularios(formularios) {
        if (!formularios || formularios.length === 0) {
            this.showEmptyState();
            return;
        }
        this.currentFormularios = formularios;
        const formulariosParaMostrar = formularios;
        this.formulariosCount.textContent = `Mostrando ${formulariosParaMostrar.length} formulários`;
        this.formulariosList.innerHTML = formulariosParaMostrar.map(formulario => `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">${formulario.nome}</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">${formulario.descricao || ''}</p>
                </div>
                <div class="mt-4 sm:mt-0 flex gap-2">
                    <a href="${window.APP_CONFIG.baseUrl}/formularios/editar?id=${formulario.id}" class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 rounded-lg">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Editar
                    </a>
                    <a href="http://link.basechurch.com.br/${formulario.id}" target="_blank" class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                        Link
                    </a>
                    <button class="delete-formulario inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg" data-id="${formulario.id}">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');
        this.addDeleteListeners();
        this.showFormulariosGrid();
    }

    addDeleteListeners() {
        const deleteButtons = this.formulariosList.querySelectorAll('.delete-formulario');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                if (!confirm('Tem certeza que deseja excluir este formulário?')) return;
                try {
                    await deleteFormulario(button.dataset.id);
                    this.loadFormularios();
                } catch (error) {
                    alert(error.message || 'Erro ao excluir formulário');
                }
            });
        });
    }

    showLoading() {
        this.loadingIndicator.classList.remove('hidden');
        this.errorContainer.classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.formulariosGrid.classList.add('hidden');
    }

    showError(message) {
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.remove('hidden');
        this.emptyState.classList.add('hidden');
        this.formulariosGrid.classList.add('hidden');
        document.getElementById('error-message').textContent = message;
    }

    showEmptyState() {
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.add('hidden');
        this.emptyState.classList.remove('hidden');
        this.formulariosGrid.classList.add('hidden');
    }

    showFormulariosGrid() {
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.formulariosGrid.classList.remove('hidden');
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.formulariosManager = new FormulariosListManager();
});
