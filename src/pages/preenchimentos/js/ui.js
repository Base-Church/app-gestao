class PreenchimentosUI {
    constructor() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.emptyState = document.getElementById('empty-state');
        this.preenchimentosGrid = document.getElementById('preenchimentos-grid');
        this.preenchimentosList = document.getElementById('preenchimentos-list');
        this.paginationContainer = document.getElementById('pagination-container');
    }

    showLoading() {
        this.hideAll();
        this.loadingIndicator.classList.remove('hidden');
    }

    showError(message) {
        this.hideAll();
        document.getElementById('error-message').textContent = message;
        this.errorContainer.classList.remove('hidden');
    }

    showEmpty() {
        this.hideAll();
        this.emptyState.classList.remove('hidden');
    }

    showPreenchimentos() {
        this.hideAll();
        this.preenchimentosGrid.classList.remove('hidden');
    }

    hideAll() {
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.preenchimentosGrid.classList.add('hidden');
    }

    renderPreenchimentos(formularios) {
        this.preenchimentosList.innerHTML = '';

        formularios.forEach(formulario => {
            const card = this.createFormularioCard(formulario);
            this.preenchimentosList.appendChild(card);
        });
    }

    createFormularioCard(formulario) {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200 cursor-pointer';
        
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        };

        card.innerHTML = `
            <div class="p-6">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            ${formulario.nome || 'Formulário sem nome'}
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            ${formulario.descricao || 'Sem descrição'}
                        </p>
                    </div>
                </div>
                
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Slug: ${formulario.slug || 'N/A'}
                    </div>
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        ID: ${formulario.id}
                    </div>
                </div>
                
                <div class="mt-4">
                    <button 
                        onclick="window.app.viewFormulario(${formulario.id})" 
                        class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Ver Preenchimentos
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    renderPagination(meta) {
        if (!meta || !this.paginationContainer) return;

        const { current_page, total_pages, total_items, per_page } = meta;
        
        if (total_pages <= 1) {
            this.paginationContainer.innerHTML = '';
            return;
        }

        const startItem = ((current_page - 1) * per_page) + 1;
        const endItem = Math.min(current_page * per_page, total_items);

        let paginationHTML = `
            <div class="flex-1 flex justify-between sm:hidden">
                ${current_page > 1 ? 
                    `<button onclick="window.app.changePage(${current_page - 1})" class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Anterior</button>` : 
                    '<span></span>'
                }
                ${current_page < total_pages ? 
                    `<button onclick="window.app.changePage(${current_page + 1})" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">Próximo</button>` : 
                    '<span></span>'
                }
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                        Mostrando <span class="font-medium">${startItem}</span> a <span class="font-medium">${endItem}</span> de <span class="font-medium">${total_items}</span> resultados
                    </p>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        `;

        // Botão anterior
        if (current_page > 1) {
            paginationHTML += `
                <button onclick="window.app.changePage(${current_page - 1})" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <span class="sr-only">Anterior</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </button>
            `;
        }

        // Números das páginas
        const startPage = Math.max(1, current_page - 2);
        const endPage = Math.min(total_pages, current_page + 2);

        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === current_page;
            paginationHTML += `
                <button onclick="window.app.changePage(${i})" class="relative inline-flex items-center px-4 py-2 border ${isActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-200' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} text-sm font-medium">
                    ${i}
                </button>
            `;
        }

        // Botão próximo
        if (current_page < total_pages) {
            paginationHTML += `
                <button onclick="window.app.changePage(${current_page + 1})" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <span class="sr-only">Próximo</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                </button>
            `;
        }

        paginationHTML += `
                    </nav>
                </div>
            </div>
        `;

        this.paginationContainer.innerHTML = paginationHTML;
    }
}

window.PreenchimentosUI = PreenchimentosUI;