export class UI {
    constructor() {
        this.initializeElements();
    }

    initializeElements() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.errorMessage = document.getElementById('error-message');
        this.emptyState = document.getElementById('empty-state');
        this.observacoesGrid = document.getElementById('observacoes-grid');
        this.mesSelect = document.getElementById('mes-select');
    }

    toggleElements(loading = false, error = false, empty = false) {
        this.loadingIndicator.classList.toggle('hidden', !loading);
        this.errorContainer.classList.toggle('hidden', !error);
        this.emptyState.classList.toggle('hidden', !empty);
        this.observacoesGrid.classList.toggle('hidden', loading || error || empty);
    }

    renderObservacaoCard(observacao) {
        const datas = observacao.datas.map(data => {
            const date = new Date(data);
            return {
                raw: data,
                formatted: date.toLocaleDateString('pt-BR'),
                dayName: date.toLocaleDateString('pt-BR', { weekday: 'long' })
            };
        });

        // Gera as iniciais do nome de forma segura
        const iniciaisNome = observacao.voluntario.nome
            .split(' ')
            .filter(n => n.length > 0)
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

        // ID único para o container de datas
        const uniqueId = `datas-${Math.random().toString(36).substr(2, 9)}`;

        // Constrói o elemento de avatar
        const renderAvatar = () => {
            if (!observacao.voluntario.foto) {
                return `
                    <div class="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span class="text-lg font-medium text-gray-600 dark:text-gray-300">${iniciaisNome}</span>
                    </div>`;
            }

            const fallbackScript = `
                this.parentElement.innerHTML = \`
                    <div class="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span class="text-lg font-medium text-gray-600 dark:text-gray-300">${iniciaisNome}</span>
                    </div>\``;

            return `
                <img class="h-12 w-12 rounded-full object-cover" 
                     src="${observacao.voluntario.foto}" 
                     alt="${observacao.voluntario.nome}"
                     onerror="${fallbackScript.replace(/"/g, '&quot;')}">`;
        };

        return `
            <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden card-container">
                <div class="p-6">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div class="flex-1">
                            <!-- Foto e Nome sempre juntos -->
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-12 w-12">
                                    ${renderAvatar()}
                                </div>
                                <div class="ml-4">
                                    <div class="flex items-center space-x-2">
                                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                                            ${observacao.voluntario.nome}
                                        </h3>
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800/20 dark:text-primary-400">
                                            ${datas.length} dia${datas.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Observações em bloco separado -->
                            <div class="mt-4 sm:mt-2">
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                    ${observacao.observacoes || ''}
                                </p>
                            </div>
                        </div>

                        <!-- Botão à direita -->
                        <div class="mt-4 sm:mt-0 sm:ml-4">
                            <button 
                                type="button"
                                onclick="document.getElementById('${uniqueId}').classList.toggle('hidden')"
                                class="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Ver datas
                            </button>
                        </div>
                    </div>

                    <!-- Container de Datas (mantém o mesmo) -->
                    <div id="${uniqueId}" class="hidden mt-4 pt-4 border-t dark:border-gray-700">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            ${datas.map(data => `
                                <div class="flex items-center p-2 rounded bg-gray-50 dark:bg-gray-700/50">
                                    <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                                            ${data.formatted}
                                        </span>
                                        <span class="text-xs text-gray-500 dark:text-gray-400">
                                            ${data.dayName}
                                        </span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `.trim();
    }

    renderObservacoes(observacoes) {
        if (!this.observacoesGrid) return;
        this.observacoesGrid.innerHTML = observacoes.map(obs => this.renderObservacaoCard(obs)).join('');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.toggleElements(false, true);
    }
}
