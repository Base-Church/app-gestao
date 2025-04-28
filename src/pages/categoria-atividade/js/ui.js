class CategoriaAtividadeUI {
    constructor() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.errorMessage = document.getElementById('error-message');
        this.emptyState = document.getElementById('empty-state');
        this.categoriasGrid = document.getElementById('categorias-grid');
        this.categoriasList = document.getElementById('categorias-list');
        this.paginationContainer = document.getElementById('pagination-container');
    }

    showToast(message, type = 'success') {
        console.log(`[${type}] ${message}`);
    }

    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
        }
        this.toggleElements(false, true);
    }

    toggleElements(loading = false, error = false, empty = false) {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.toggle('hidden', !loading);
        }
        if (this.errorContainer) {
            this.errorContainer.classList.toggle('hidden', !error);
        }
        if (this.emptyState) {
            this.emptyState.classList.toggle('hidden', !empty);
        }
        if (this.categoriasGrid) {
            this.categoriasGrid.classList.toggle('hidden', loading || error || empty);
        }
    }

    renderCategorias(categorias, total, currentPage, itemsPerPage) {
        if (!categorias || categorias.length === 0) {
            this.toggleElements(false, false, true);
            return;
        }

        const html = categorias.map(categoria => this.renderCategoriaRow(categoria)).join('');
        if (this.categoriasList) {
            this.categoriasList.innerHTML = html;
        }

        if (this.paginationContainer) {
            this.paginationContainer.innerHTML = this.renderPagination(total, currentPage, itemsPerPage);
        }

        this.toggleElements();
    }

    renderCategoriaRow(categoria) {
        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">${categoria.nome}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="h-6 w-6 rounded border border-gray-300 dark:border-gray-600" style="background-color: ${categoria.cor}"></div>
                        <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">${categoria.cor}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button type="button"
                            onclick='window.app.editCategoria(${JSON.stringify({id: categoria.id, nome: categoria.nome, cor: categoria.cor})})'
                            class="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </button>
                    <button type="button"
                            onclick="window.app.deleteCategoria(${categoria.id})" 
                            class="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </td>
            </tr>`;
    }

    renderPagination(total, currentPage, itemsPerPage) {
        const totalPages = Math.ceil(total / itemsPerPage);
        if (totalPages <= 1) return '';

        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 || // Primeira página
                i === totalPages || // Última página
                (i >= currentPage - 2 && i <= currentPage + 2) // 2 páginas antes e depois da atual
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        return `
            <nav class="flex justify-center space-x-1">
                ${pages.map(page => {
                    if (page === '...') {
                        return `<span class="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>`;
                    }
                    return `
                        <button onclick="window.app.changePage(${page})"
                                class="${page === currentPage
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                } px-3 py-2 rounded-md text-sm font-medium">
                            ${page}
                        </button>`;
                }).join('')}
            </nav>`;
    }
}

// Exporta a classe globalmente
window.CategoriaAtividadeUI = CategoriaAtividadeUI;
