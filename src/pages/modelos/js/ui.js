export class UI {
    constructor() {
        this.initializeElements();
    }

    initializeElements() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.errorMessage = document.getElementById('error-message');
        this.emptyState = document.getElementById('empty-state');
        this.modelosGrid = document.getElementById('modelos-grid');
        this.modelosList = document.getElementById('modelos-list');
    }

    toggleElements(loading = false, error = false, empty = false) {
        this.loadingIndicator.classList.toggle('hidden', !loading);
        this.errorContainer.classList.toggle('hidden', !error);
        this.emptyState.classList.toggle('hidden', !empty);
        this.modelosGrid.classList.toggle('hidden', loading || error || empty);
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

    renderModeloRow(modelo) {
        // Escapa as aspas no nome para evitar problemas no onclick
        const nomeEscapado = modelo.nome.replace(/'/g, "\\'");
        
        return `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                        ${modelo.nome}
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        ${modelo.atividades.length} atividades
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end items-center space-x-2">
                        <a href="editar.php?id=${modelo.id}" 
                           class="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors">
                            Editar
                        </a>
                        <button onclick="app.deleteModelo(${modelo.id}, '${nomeEscapado}')" 
                                class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">
                            Excluir
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    renderModelos(modelos) {
        if (!this.modelosList) return;
        this.modelosList.innerHTML = modelos.map(modelo => this.renderModeloRow(modelo)).join('');
    }
}
