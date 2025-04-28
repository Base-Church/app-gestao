class RecadosUI {
    constructor() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.errorMessage = document.getElementById('error-message');
        this.emptyState = document.getElementById('empty-state');
        this.recadosList = document.getElementById('recados-list');
    }

    toggleElements(loading = false, hasData = true, isEmpty = false) {
        this.loadingIndicator.classList.toggle('hidden', !loading);
        this.recadosList.closest('.recados-grid').classList.toggle('hidden', !hasData);
        this.emptyState.classList.toggle('hidden', !isEmpty);
        this.errorContainer.classList.toggle('hidden', true);
    }

    showError(message) {
        this.loadingIndicator.classList.add('hidden');
        this.recadosList.closest('.recados-grid').classList.add('hidden');
        this.emptyState.classList.add('hidden');
        this.errorContainer.classList.remove('hidden');
        this.errorMessage.textContent = message;
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR');
    }

    renderRecadoCard(recado) {
        const validadeText = recado.validade 
            ? `Válido até: ${this.formatDate(recado.validade)}`
            : 'Sem data de validade';

        return `
            <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
                <div class="flex justify-between items-start">
                    <div class="flex-grow">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                            ${recado.titulo}
                        </h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            ${recado.texto}
                        </p>
                        <div class="mt-2 flex items-center text-xs text-gray-500">
                            <span class="mr-4">${validadeText}</span>
                            <span>Criado em: ${this.formatDate(recado.data_criacao)}</span>
                        </div>
                    </div>
                    <div class="flex space-x-2 ml-4">
                        <button onclick="window.app.editRecado(${JSON.stringify(recado).replace(/"/g, '&quot;')})"
                                class="text-primary-600 hover:text-primary-800">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                        </button>
                        <button onclick="window.app.deleteRecado(${recado.id}, '${recado.titulo}')"
                                class="text-red-600 hover:text-red-800">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderRecados(data) {
        if (!data || (!data.gerais?.length && !data.ministerios?.length)) {
            this.toggleElements(false, false, true);
            return;
        }

        this.toggleElements(false, true, false);
        
        const html = [];

        // Adiciona recados gerais primeiro
        if (data.gerais && data.gerais.length > 0) {
            html.push('<div class="mb-8"><h2 class="text-lg font-semibold mb-4">Recados Gerais</h2>');
            html.push('<div class="grid gap-4">');
            html.push(data.gerais.map(recado => this.renderRecadoCard(recado)).join(''));
            html.push('</div></div>');
        }

        // Adiciona recados do ministério
        if (data.ministerios && data.ministerios.length > 0) {
            const ministerioNome = data.ministerios[0].ministerio_nome;
            const ministerioCor = data.ministerios[0].ministerio_cor;
            
            html.push(`<div class="mb-8">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="w-3 h-3 rounded-full mr-2" style="background-color: ${ministerioCor}"></span>
                    ${ministerioNome}
                </h2>`);
            html.push('<div class="grid gap-4">');
            html.push(data.ministerios.map(recado => this.renderRecadoCard(recado)).join(''));
            html.push('</div></div>');
        }

        this.recadosList.innerHTML = html.join('');
    }
}

window.RecadosUI = RecadosUI;
