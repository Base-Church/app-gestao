export class UI {
    constructor() {
        this.atividadesLista = document.getElementById('atividadesLista');
        // Adicionar estilo de rolagem suave
        this.atividadesLista?.classList.add('scroll-smooth');
    }

    renderAtividade(atividade, isInModel = false) {
        return `
            <div class="draggable relative flex items-center p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 cursor-move transition-all duration-200 hover:shadow-md ${isInModel ? 'bg-gray-50 dark:bg-gray-700/50 mb-3' : 'bg-white dark:bg-gray-700'}" 
                 draggable="true"
                 data-id="${atividade.id}"
                 data-categoria-id="${atividade.categoria_atividade_id}">
                <div class="w-3 h-3 rounded-full mr-4" style="background-color: ${atividade.cor_indicador}"></div>
                <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">${atividade.nome}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">${atividade.categoria_nome}</p>
                </div>
                ${isInModel ? `
                    <button class="delete-btn ml-2 p-1 text-red-500 hover:text-red-700 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <div class="drag-handle ml-2 p-1 cursor-move text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
                        </svg>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderCategoria(categoria, atividades) {
        return `
            <div class="mb-6">
                <div class="flex items-center space-x-2 mb-3">
                    <div class="w-3 h-3 rounded-full" style="background-color: ${categoria.cor}"></div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        ${categoria.nome}
                    </h3>
                </div>
                <div class="space-y-2">
                    ${atividades.map(atividade => this.renderAtividade(atividade, false)).join('')}
                </div>
            </div>
        `;
    }

    renderAtividadesPorCategoria(categorias, atividades) {
        // Agrupa atividades por categoria
        const atividadesPorCategoria = atividades.reduce((acc, atividade) => {
            const categoriaId = atividade.categoria_atividade_id;
            if (!acc[categoriaId]) {
                acc[categoriaId] = [];
            }
            acc[categoriaId].push(atividade);
            return acc;
        }, {});

        // Renderiza cada categoria com suas atividades
        const html = categorias.map(categoria => {
            const atividadesDaCategoria = atividadesPorCategoria[categoria.id] || [];
            return this.renderCategoria(categoria, atividadesDaCategoria);
        }).join('');

        this.atividadesLista.innerHTML = html;
    }
}
