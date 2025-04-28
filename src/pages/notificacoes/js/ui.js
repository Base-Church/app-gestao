export class UI {
    constructor() {
        this.initializeElements();
    }

    initializeElements() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.errorMessage = document.getElementById('error-message');
        this.emptyState = document.getElementById('empty-state');
        this.notificacoesList = document.getElementById('notificacoes-list'); // Corrigido de notificacoes-grid para notificacoes-list
        this.searchInput = document.getElementById('search-input');
        this.paginationContainer = document.getElementById('pagination-container');
    }

    toggleElements(loading = false, error = false, empty = false) {
        const loadingContainer = document.getElementById('loading-container');
        const errorContainer = document.getElementById('error-container');
        const emptyState = document.getElementById('empty-state');
        const notificacoesList = document.getElementById('notificacoes-list');

        if (loadingContainer) loadingContainer.classList.toggle('hidden', !loading);
        if (errorContainer) errorContainer.classList.toggle('hidden', !error);
        if (emptyState) emptyState.classList.toggle('hidden', !empty);
        if (notificacoesList) notificacoesList.classList.toggle('hidden', loading || error || empty);
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        
        toast.className = `fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 translate-y-0 opacity-100 z-50`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    renderPagination(meta) {
        if (!meta || meta.totalPages <= 1) return '';

        let html = '<nav class="flex items-center justify-between mt-6" aria-label="Pagination">';
        
        // Botões para mobile
        html += '<div class="flex flex-1 justify-between sm:hidden">';
        if (meta.page > 1) {
            html += `<button onclick="window.app.changePage(${meta.page - 1})" class="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Anterior</button>`;
        }
        if (meta.page < meta.totalPages) {
            html += `<button onclick="window.app.changePage(${meta.page + 1})" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">Próxima</button>`;
        }
        html += '</div>';

        // Paginação desktop
        html += '<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">';
        html += `<div><p class="text-sm text-gray-700 dark:text-gray-400">Mostrando <span class="font-medium">${meta.total}</span> resultados</p></div>`;
        html += '<div><nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">';

        // Números das páginas
        for (let i = 1; i <= meta.totalPages; i++) {
            if (i === meta.page) {
                html += `<button aria-current="page" class="relative z-10 inline-flex items-center bg-primary-600 px-4 py-2 text-sm font-semibold text-white focus:z-20">${i}</button>`;
            } else {
                html += `<button onclick="window.app.changePage(${i})" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20">${i}</button>`;
            }
        }

        html += '</nav></div></div>';
        return html;
    }
}
