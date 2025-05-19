/**
 * Serviço para componentes HTML de atividades
 */
class AtividadesComponentesService {
    criarListaAtividadesFlutuante(atividades, posicaoElemento) {
        const lista = document.createElement('div');
        lista.className = 'fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50';
        lista.style.minWidth = '320px';
        lista.style.maxHeight = '480px';
        
        // Posiciona a lista próxima ao elemento clicado
        if (posicaoElemento) {
            const rect = posicaoElemento.getBoundingClientRect();
            lista.style.top = `${rect.bottom + window.scrollY + 5}px`;
            lista.style.left = `${rect.left + window.scrollX}px`;
        }

        lista.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium">Selecione uma Atividade</h3>
                <button type="button" class="fechar-lista text-gray-500 hover:text-gray-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="overflow-y-auto max-h-[400px]">
                ${atividades.map(this.criarCardAtividade).join('')}
            </div>
        `;

        return lista;
    }

    criarCardAtividade(atividade) {
        const imagemPath = atividade.foto
            ? `${window.URL_BASE}/assets/img/atividades/${atividade.foto}`
            : `${window.URL_BASE}/assets/img/placeholder.jpg`;
        
        return `
        <div class="atividade-card flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 transition-all duration-200"
             data-atividade-id="${atividade.id}">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                <img src="${imagemPath}" alt="${atividade.nome}" class="w-full h-full object-cover">
            </div>
            <div class="ml-3 flex-1">
                <h4 class="text-sm font-medium text-gray-800 dark:text-white truncate">${atividade.nome}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400">${atividade.descricao || ''}</p>
            </div>
        </div>`;
    }
}

window.atividadesComponentesService = new AtividadesComponentesService();
