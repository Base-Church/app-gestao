export class UI {
    constructor() {
        this.initializeElements();
    }

    initializeElements() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.errorMessage = document.getElementById('error-message');
        this.emptyState = document.getElementById('empty-state');
        this.ministeriosGrid = document.getElementById('ministerios-list');
        this.gridContainer = document.getElementById('ministerios-grid');
        this.searchInput = document.getElementById('search-input');
        this.paginationContainer = document.getElementById('pagination-container');
    }

    toggleElements(loading = false, error = false, empty = false) {
        this.loadingIndicator.classList.toggle('hidden', !loading);
        this.errorContainer.classList.toggle('hidden', !error);
        this.emptyState.classList.toggle('hidden', !empty);
        this.gridContainer.classList.toggle('hidden', loading || error || empty);
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        
        toast.className = `fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 translate-y-0 opacity-100`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('translate-y-full', 'opacity-0');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    renderMinisterioCard(ministerio) {
        const photoUrl = ministerio.foto || 'assets/img/ministerios/placeholder.jpg';
        const safeFoto = photoUrl ? `${window.APP_CONFIG.baseUrl}/${photoUrl}` : `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`;
        const cor = ministerio.cor || '#000000';
        const voluntarios = parseInt(ministerio.quantidade_voluntarios) || 0;

        return `
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow group hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 flex flex-col items-center p-0 pt-8 pb-4 overflow-visible">
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div class="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <img src="${safeFoto}" alt="${ministerio.nome}" class="w-full h-full object-cover"
                         onerror="this.src='${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg'">
                </div>
                <div class="mt-2 w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow" style="background:${cor};"></div>
            </div>
            <div class="flex-1 flex flex-col items-center mt-14 w-full px-4">
                <h3 class="text-lg font-extrabold text-gray-900 dark:text-white text-center w-full truncate">${ministerio.nome}</h3>
                <span class="mt-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold">${ministerio.prefixo}</span>
                <div class="flex items-center gap-2 mt-2 mb-2">
                    ${ministerio.grupo_whatsapp ? `
                        <span class="inline-flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-4.243-1.757a.75.75 0 00-1.06-1.06L9 10.939 7.303 9.243a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.244-4.243z" clip-rule="evenodd" />
                            </svg>
                            WhatsApp Vinculado
                        </span>
                    ` : `
                        <span class="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                            </svg>
                            Não vinculado
                        </span>
                    `}
                </div>
                <div class="mb-3 text-sm text-gray-700 dark:text-gray-300 text-center min-h-[2.5em] line-clamp-2">${ministerio.descricao || '-'}</div>
                <div class="flex items-center justify-center w-full mt-auto pt-2">
                    <div class="flex flex-col items-center">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Voluntários</span>
                        <span class="font-extrabold text-primary-600 dark:text-primary-400 text-2xl animate-vol-counter" data-count="${voluntarios}">0</span>
                    </div>
                </div>
            </div>
            <div class="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="window.app.editMinisterio(${JSON.stringify(ministerio).replace(/"/g, '&quot;')})" 
                        class="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 shadow transition" title="Editar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </button>
                <button onclick="window.app.deleteMinisterio(${ministerio.id}, '${ministerio.nome}')" 
                        class="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 shadow transition" title="Excluir">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
        `;
    }

    renderMinisteriosGrid(ministerios) {
        // Grid de 4 colunas em telas grandes
        return `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
                ${ministerios.map(m => this.renderMinisterioCard(m)).join('')}
            </div>
        `;
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
