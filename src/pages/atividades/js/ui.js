export class UI {
    constructor() {
        this.initializeElements();
        this.baseUrl = window.APP_CONFIG.baseUrl;
    }

    initializeElements() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.errorMessage = document.getElementById('error-message');
        this.emptyState = document.getElementById('empty-state');
        this.atividadesGrid = document.getElementById('atividades-grid');
        this.atividadesList = document.getElementById('atividades-list');
        this.searchInput = document.getElementById('search-input');
        this.paginationContainer = document.getElementById('pagination-container');
    }

    toggleElements(loading = false, error = false, empty = false) {
        this.loadingIndicator.classList.toggle('hidden', !loading);
        this.errorContainer.classList.toggle('hidden', !error);
        this.emptyState.classList.toggle('hidden', !empty);
        this.atividadesGrid.classList.toggle('hidden', loading || error || empty);
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

    getImageUrl(foto) {
        if (!foto) return `${this.baseUrl}/assets/img/atividades/placeholder.jpg`;
        return `${this.baseUrl}/assets/img/atividades/${foto}`;
    }

    renderAtividadeRow(atividade) {
        const fotoUrl = this.getImageUrl(atividade.foto);
        
        // Escapa as aspas duplas e caracteres especiais no JSON
        const atividadeJSON = JSON.stringify(atividade)
            .replace(/"/g, '&quot;')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n');
        
        return `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full object-cover" src="${fotoUrl}" alt="${atividade.nome}">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                                ${atividade.nome}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 dark:text-white">
                        ${atividade.categoria_nome || '-'}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div class="h-6 w-6 rounded-full mr-2" style="background-color: ${atividade.cor_indicador || '#33ccad'}"></div>
                        <span class="text-sm text-gray-900 dark:text-white">
                            ${atividade.cor_indicador || '#33ccad'}
                        </span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end items-center space-x-2">
                        <button onclick='window.app.editAtividade(${atividadeJSON})' 
                                class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                        </button>
                        <button onclick="window.app.deleteAtividade(${atividade.id}, '${atividade.nome}')" 
                                class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
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

    renderAtividades(atividades) {
        if (!this.atividadesList) return;
        this.atividadesList.innerHTML = atividades.map(atividade => this.renderAtividadeRow(atividade)).join('');
    }

    renderPaginationContainer(meta) {
        if (!this.paginationContainer) return;
        this.paginationContainer.innerHTML = this.renderPagination(meta);
    }

    updateSelects(categorias) {
        const selects = ['categoria-select', 'categoria_atividade_id'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const defaultText = selectId === 'categoria-select' ? 
                    'Todas as categorias' : 'Selecione uma categoria';
                
                select.innerHTML = `<option value="">${defaultText}</option>` +
                    categorias.map(cat => 
                        `<option value="${cat.id}">${cat.nome}</option>`
                    ).join('');
            }
        });
    }
}
