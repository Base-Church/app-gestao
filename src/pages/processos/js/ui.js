export class UI {
    constructor() {
        this.processosContainer = document.getElementById('processosContainer');
    }

    renderProcessos(processos, etapasPorProcesso) {
        this.processosContainer.innerHTML = processos.map(processo => this.renderProcessoCard(processo, etapasPorProcesso[processo.id] || [])).join('');
    }

    renderProcessoCard(processo, etapas) {
        return `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">${processo.nome}</h2>
                    <span class="text-xs px-2 py-1 rounded bg-${processo.status === 'ativo' ? 'green' : 'red'}-100 text-${processo.status === 'ativo' ? 'green' : 'red'}-700">${processo.status}</span>
                </div>
                <div class="flex space-x-2">
                    <button class="btnAddEtapa px-3 py-1 rounded bg-primary-500 text-white" data-processo-id="${processo.id}">+ Etapa</button>
                    <button class="btnDeleteProcesso px-3 py-1 rounded bg-red-500 text-white" data-processo-id="${processo.id}">Excluir</button>
                </div>
            </div>
            <div class="etapasContainer flex flex-row gap-4 overflow-x-auto pb-2" data-processo-id="${processo.id}" id="etapasContainer-${processo.id}">
                ${etapas.length === 0 ? `<div class="text-gray-400 text-sm">Nenhuma etapa cadastrada</div>` : etapas.map(etapa => this.renderEtapaCard(etapa)).join('')}
            </div>
        </div>
        `;
    }

    renderEtapaCard(etapa) {
        return `
        <div class="draggableEtapa flex flex-col items-center justify-center min-w-[120px] max-w-[180px] p-3 rounded bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 cursor-move" data-id="${etapa.id}">
            <span class="font-medium text-gray-900 dark:text-white">${etapa.nome}</span>
            <span class="text-xs text-gray-500">#${etapa.orden}</span>
            <button class="btnDeleteEtapa text-red-500 mt-2" data-etapa-id="${etapa.id}">Excluir</button>
        </div>
        `;
    }

    showModalNovoProcesso(show = true) {
        document.getElementById('modalNovoProcesso').classList.toggle('hidden', !show);
    }
}
