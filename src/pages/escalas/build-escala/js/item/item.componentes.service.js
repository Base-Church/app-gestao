/**
 * Componentes HTML para itens
 */
class ItemComponentesService {
    criarItemCard(itemId) {
        return `
        <div id="${itemId}" class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
            <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3">
                    <!-- Handle de drag para item -->
                    <div class="item-drag-handle cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Arrastar item">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9h8M8 15h8"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Item</h3>
                </div>
                <div class="flex items-center gap-2">
                    <div class="flex items-center gap-2">
                        <div class="relative flex items-center">
                            <select
                                class="select-modelo appearance-none border border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-gray-900 text-primary-800 dark:text-primary-200 font-medium rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-400 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm h-[40px]"
                                data-item-id="${itemId}" disabled
                                title="Selecione um evento antes de escolher um modelo"
                                style="min-width: 130px;"
                            >
                                <option value="" class="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">- Modelo de Escala -</option>
                                <!-- opções serão populadas via JS -->
                            </select>
                            <span class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-primary-500 dark:text-primary-300">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </span>
                        </div>
                        <!-- O botão duplicar será injetado via JS ao lado do select -->
                    </div>
                    <button type="button" class="btn-remover-item text-gray-400 hover:text-red-500 transition h-[40px] flex items-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div id="eventos-seletor-container-${itemId}" class="p-0"></div>
            <!-- Aqui pode vir atividades/voluntários depois -->
        </div>
        `;
    }

    criarConjuntoHTML(itemId, conjunto, idx, eventoData) {
        // eventoData: string ou null (data do evento)
        const voluntarioBloqueado = !eventoData;
        return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 items-center" style="position: relative;">
            <!-- Handle de drag para conjunto -->
            <div class="conjunto-drag-handle cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 absolute top-2 left-2 z-10" title="Arrastar conjunto">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9h8M8 15h8"></path>
                </svg>
            </div>
            
            <div class="flex flex-row h-[80px] items-center">
                <div class="espaco-atividades flex-1 min-h-[85px] bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50 flex items-center justify-center mr-2" data-conjunto-idx="${idx}">
                    ${
                        conjunto.atividade
                        ? `<div class="h-full w-full flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="w-full p-4 flex items-center gap-3">
                                <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
                                    <img src="${conjunto.atividade.img || (window.APP_CONFIG.baseUrl + '/assets/img/placeholder.jpg')}" alt="${conjunto.atividade.nome}" class="w-full h-full object-cover rounded-full">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-medium text-gray-900 dark:text-white text-sm truncate">${conjunto.atividade.nome}</h4>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${conjunto.atividade.descricao || ''}</p>
                                </div>
                            </div>
                        </div>`
                        : `<p class="text-sm text-gray-500 p-4 text-center w-full">Clique para selecionar</p>`
                    }
                </div>
            </div>
            <div class="flex flex-row h-[80px] items-center">
                <div class="espaco-voluntario flex-1 min-h-[85px] bg-gray-50 dark:bg-gray-700/30 rounded-lg ${voluntarioBloqueado ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50'} flex items-center justify-center mr-2" data-conjunto-idx="${idx}" ${voluntarioBloqueado ? 'data-bloqueado="1"' : ''}>
                    ${
                        conjunto.voluntario
                        ? `<div class="h-full w-full flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="w-full p-4 flex items-center gap-3">
                                <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
                                    <img src="${conjunto.voluntario.img || (window.APP_CONFIG.baseUrl + '/assets/img/placeholder.jpg')}" alt="${conjunto.voluntario.nome}" class="w-full h-full object-cover rounded-full" onerror="this.onerror=null;this.src='${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg'">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-medium text-gray-900 dark:text-white text-sm truncate">${conjunto.voluntario.nome}</h4>
                                </div>
                            </div>
                        </div>`
                        : `<p class="text-sm text-gray-500 p-4 text-center w-full">${voluntarioBloqueado ? 'Selecione uma data no evento' : 'Clique para selecionar'}</p>`
                    }
                </div>
                <button type="button" class="btn-remover-conjunto text-red-500 hover:text-red-700 text-base ml-2" data-conjunto-idx="${idx}" title="Remover Conjunto">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        </div>
        `;
    }
}

window.itemComponentesService = new ItemComponentesService();
// Nenhuma redundância encontrada.
