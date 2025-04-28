class LideresUI {
    constructor() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.errorMessage = document.getElementById('error-message');
        this.emptyState = document.getElementById('empty-state');
        this.lideresGrid = document.getElementById('lideres-grid');
        this.lideresList = document.getElementById('lideres-list');
        this.paginationContainer = document.getElementById('pagination-container');
        this.baseUrl = window.USER?.baseUrl || '';
    }

    showToast(message, type = 'success') {
        const className = type === 'error' ? 'error' : 'success';
        console.log(`[${className}] ${message}`);
    }

    toggleElements(loading = false, hasData = true, isEmpty = false) {
        this.loadingIndicator.classList.toggle('hidden', !loading);
        this.lideresGrid.classList.toggle('hidden', !hasData);
        this.emptyState.classList.toggle('hidden', !isEmpty);
        this.errorContainer.classList.toggle('hidden', true);
    }

    showError(message) {
        this.loadingIndicator.classList.add('hidden');
        this.lideresGrid.classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.errorContainer.classList.remove('hidden');
        this.errorMessage.textContent = message;
    }

    formatTelefone(whatsapp) {
        if (!whatsapp) return '';
        const numero = whatsapp.replace(/\D/g, '');
        return numero.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }

    getImageUrl(foto) {
        if (!foto) return `${this.baseUrl}/assets/img/placeholder.jpg`;
        return foto.startsWith('http') ? foto : `${this.baseUrl}/assets/img/lideres/${foto}`;
    }

    renderLiderRow(lider) {
        return `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full object-cover" 
                                 src="${this.getImageUrl(lider.foto)}" 
                                 alt="${lider.nome}"
                                 onerror="this.src='${this.baseUrl}/assets/img/placeholder.jpg'">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">${lider.nome}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">${this.formatTelefone(lider.whatsapp)}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300">
                        ${lider.ministerio_nome}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end items-center space-x-2">
                        <button onclick="window.app.editLider(${JSON.stringify(lider).replace(/"/g, '&quot;')})"
                                class="text-primary-600 hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-400">
                            <span class="sr-only">Editar</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <button onclick="window.app.deleteLider(${lider.id})"
                                class="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400">
                            <span class="sr-only">Excluir</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    renderLideres(lideres, total, currentPage, itemsPerPage) {
        if (!lideres || lideres.length === 0) {
            this.toggleElements(false, false, true);
            return;
        }

        this.toggleElements(false, true, false);
        
        // Renderiza a lista de líderes
        this.lideresList.innerHTML = lideres.map(lider => this.renderLiderRow(lider)).join('');
        
        // Renderiza a paginação
        this.renderPagination(total, currentPage, itemsPerPage);
    }

    renderPagination(total, currentPage, itemsPerPage) {
        const totalPages = Math.ceil(total / itemsPerPage);
        if (totalPages <= 1) {
            this.paginationContainer.innerHTML = '';
            return;
        }

        let html = `
            <nav class="flex items-center justify-between">
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                            Mostrando <span class="font-medium">${(currentPage - 1) * itemsPerPage + 1}</span> até <span class="font-medium">${Math.min(currentPage * itemsPerPage, total)}</span> de <span class="font-medium">${total}</span> resultados
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">`;

        // Botão Previous
        html += `
            <button onclick="window.app.changePage(${currentPage - 1})"
                    ${currentPage === 1 ? 'disabled' : ''}
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${currentPage === 1 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'}">
                <span class="sr-only">Anterior</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
            </button>`;

        // Números das páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                html += `
                    <button aria-current="page"
                            class="relative inline-flex items-center px-4 py-2 border border-primary-500 bg-primary-50 dark:bg-primary-900/50 text-sm font-medium text-primary-600 dark:text-primary-300">
                        ${i}
                    </button>`;
            } else {
                html += `
                    <button onclick="window.app.changePage(${i})"
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                        ${i}
                    </button>`;
            }
        }

        // Botão Next
        html += `
            <button onclick="window.app.changePage(${currentPage + 1})"
                    ${currentPage === totalPages ? 'disabled' : ''}
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'}">
                <span class="sr-only">Próxima</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
            </button>`;

        html += `
                        </nav>
                    </div>
                </div>
            </nav>`;

        this.paginationContainer.innerHTML = html;
    }

    // ...existing code for pagination and other UI methods...
}

// Exporta a classe globalmente
window.LideresUI = LideresUI;
