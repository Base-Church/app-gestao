export class UI {
    constructor() {
        this.processosContainer = document.getElementById('processosContainer');
    }

    renderProcessos(processos, etapasPorProcesso) {
        this.processosContainer.innerHTML = processos.map(processo => this.renderProcessoCard(processo, etapasPorProcesso[processo.id] || [])).join('');
    }

    renderProcessoCard(processo, etapas) {
        return `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 process-card">
            <!-- Header do Processo -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-3 h-3 rounded-full bg-primary-500"></div>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">${processo.nome}</h2>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button class="btnAddEtapa inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 focus:ring-4 focus:ring-primary-300 transition-all duration-200 dark:bg-primary-900 dark:text-primary-300 dark:border-primary-800 dark:hover:bg-primary-800" data-processo-id="${processo.id}">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Nova Etapa
                        </button>
                        <button class="btnDeleteProcesso inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:ring-4 focus:ring-red-300 transition-all duration-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-800" data-processo-id="${processo.id}">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Container das Etapas -->
            <div class="p-6">
                <div class="etapasContainer min-h-[120px] flex flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-x-auto" data-processo-id="${processo.id}" id="etapasContainer-${processo.id}">
                    ${etapas.length === 0 ? 
                        `<div class="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                            <div class="text-center">
                                <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                <p>Nenhuma etapa cadastrada</p>
                                <p class="text-xs mt-1">Clique em "Nova Etapa" para começar</p>
                            </div>
                        </div>` : 
                        etapas.map(etapa => this.renderEtapaCard(etapa)).join('')
                    }
                </div>
            </div>
        </div>
        `;
    }

    renderEtapaCard(etapa) {
        return `
        <div class="draggableEtapa group relative flex flex-col items-center justify-center min-w-[140px] max-w-[200px] p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing transform hover:scale-105" data-id="${etapa.id}" data-nome="${etapa.nome}" data-orden="${etapa.orden}">
            <!-- Indicador de drag -->
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"/>
                </svg>
            </div>
            
            <!-- Número da ordem -->
            <div class="absolute -top-2 -left-2 w-6 h-6 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                ${etapa.orden}
            </div>
            
            <!-- Conteúdo da etapa -->
            <div class="text-center mt-2">
                <h4 class="font-semibold text-gray-900 dark:text-white text-sm">${etapa.nome}</h4>
            </div>
            
            <!-- Botão de excluir -->
            <button class="btnDeleteEtapa absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900" data-etapa-id="${etapa.id}">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
        `;
    }

    showModalNovoProcesso(show = true) {
        document.getElementById('modalNovoProcesso').classList.toggle('hidden', !show);
    }
}
