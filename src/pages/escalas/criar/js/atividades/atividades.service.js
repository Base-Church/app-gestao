/**
 * Serviço para buscar e gerenciar atividades do ministério atual
 */
class AtividadesService {
    constructor() {
        this.listaAtual = null;
        this.ultimoElementoClicado = null;
        this.handleClickOutside = null;
        this.init();
    }

    init() {
        // Delegate click events for both .espaco-atividades and the <p> inside it
        document.addEventListener('click', async (e) => {

            // Check if click was on the text or the container
            const isAtividadeSpace = e.target.closest('.espaco-atividades') || 
                                   e.target.matches('.espaco-atividades p');
            
            if (isAtividadeSpace) {
                e.stopPropagation();
                const container = e.target.closest('.espaco-atividades') || e.target;
                if (!container.dataset.carregado) {
                    await this.mostrarListaAtividades(container);
                }
            }

            // Close list when clicking outside
            if (!e.target.closest('.lista-atividades-flutuante') && 
                !e.target.closest('.espaco-atividades')) {
                this.fecharListaAtividades();
            }
        });
    }

    async mostrarListaAtividades(elementoClicado, onSelecionarAtividade) {
        if (this.listaAtual) {
            this.fecharListaAtividades();
            if (elementoClicado === this.ultimoElementoClicado) {
                this.ultimoElementoClicado = null;
                return;
            }
        }
        
        this.ultimoElementoClicado = elementoClicado;

        try {
            const atividades = await window.apiService.buscarAtividades({
                organizacao_id: window.USER.organizacao_id,
                ministerio_id: window.USER.ministerio_atual
            });

            // Obter largura do conjunto todo (incluindo área de atividade e voluntário)
            const conjuntoContainer = elementoClicado.closest('.grid');
            const cardWidth = elementoClicado.offsetWidth;

            // Criar e posicionar o elemento flutuante
            this.listaAtual = document.createElement('div');
            this.listaAtual.className = `
                fixed bg-white dark:bg-gray-800 
                rounded-lg shadow-lg 
                p-3 z-[1000] 
                border border-gray-200 dark:border-gray-600
                transform opacity-0
                transition-all duration-200 ease-out
            `;

            // Definir largura igual ao card de atividade
            this.listaAtual.style.width = `${cardWidth}px`;

            // Calcular posição e espaço disponível
            const rect = elementoClicado.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            const listHeight = 320; // Altura máxima da lista

            // Determinar se deve abrir para cima ou para baixo
            const shouldOpenUpward = spaceBelow < listHeight && spaceAbove > spaceBelow;

            // Posicionar a lista e adicionar seta indicadora
            if (shouldOpenUpward) {
                this.listaAtual.style.bottom = `${viewportHeight - rect.top + 10}px`;
                this.listaAtual.innerHTML = `
                    <div class="absolute -bottom-2 left-4 w-3 h-3 bg-white dark:bg-gray-800 rotate-45 border-b border-r border-gray-200 dark:border-gray-600"></div>
                    ${this.gerarConteudoLista(atividades)}
                `;
            } else {
                this.listaAtual.style.top = `${rect.bottom + 10}px`;
                this.listaAtual.innerHTML = `
                    <div class="absolute -top-2 left-4 w-3 h-3 bg-white dark:bg-gray-800 rotate-45 border-t border-l border-gray-200 dark:border-gray-600"></div>
                    ${this.gerarConteudoLista(atividades)}
                `;
            }

            // Alinhar horizontalmente com o elemento clicado
            const leftPosition = rect.left;
            const rightSpace = window.innerWidth - (leftPosition + 256); // 256px = w-64
            
            if (rightSpace < 0) {
                this.listaAtual.style.left = `${window.innerWidth - 256 - 20}px`; // 20px margem
            } else {
                this.listaAtual.style.left = `${leftPosition}px`;
            }

            // Adicionar ao DOM e animar
            document.body.appendChild(this.listaAtual);
            requestAnimationFrame(() => {
                this.listaAtual.classList.add('opacity-100');
                this.listaAtual.style.transform = shouldOpenUpward ? 'translateY(-8px)' : 'translateY(8px)';
            });

            // Highlight do elemento selecionado
            elementoClicado.classList.add('bg-primary-50', 'dark:bg-primary-900/20');

            // Configurar eventos
            this.configurarEventosLista(this.listaAtual, elementoClicado, onSelecionarAtividade);

            // Adicionar evento de clique fora para fechar
            setTimeout(() => {
                document.addEventListener('click', this.handleClickOutside = (e) => {
                    if (!this.listaAtual?.contains(e.target) && !elementoClicado.contains(e.target)) {
                        this.fecharListaAtividades();
                    }
                });
            }, 100);

        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
            elementoClicado.classList.remove('bg-primary-50', 'dark:bg-primary-900/20');
        }
    }

    // Método auxiliar para gerar o conteúdo da lista
    gerarConteudoLista(atividades) {
        return `
            <div class="relative">
                <div class="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 dark:border-gray-600">
                    <h3 class="text-base font-medium text-gray-900 dark:text-white">Selecionar Atividade</h3>
                    <button type="button" class="fechar-lista text-gray-400 hover:text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div class="overflow-y-auto max-h-[280px]">
                    ${atividades.map(a => window.atividadesComponentesService.criarCardAtividade(a)).join('')}
                </div>
            </div>
        `;
    }

    configurarEventosLista(lista, elementoOrigem, onSelecionarAtividade) {
        lista.querySelector('.fechar-lista').addEventListener('click', () => {
            this.fecharListaAtividades();
        });

        lista.querySelectorAll('.atividade-card').forEach(card => {
            card.addEventListener('click', () => {
                const atividadeId = card.dataset.atividadeId;
                this.selecionarAtividade(atividadeId, elementoOrigem, onSelecionarAtividade);
            });
        });
    }

    fecharListaAtividades() {
        if (!this.listaAtual) return;

        try {
            this.listaAtual.style.opacity = '0';
            this.listaAtual.style.transform = 'translateY(-8px)';
            
            const removerLista = () => {
                if (this.listaAtual && this.listaAtual.parentNode) {
                    this.listaAtual.remove();
                }
                this.listaAtual = null;
            };

            setTimeout(removerLista, 200);
        } catch (error) {
            // Fallback em caso de erro
            if (this.listaAtual && this.listaAtual.parentNode) {
                this.listaAtual.remove();
            }
            this.listaAtual = null;
        }
    }

    async selecionarAtividade(atividadeId, elementoOrigem, onSelecionarAtividade) {
        try {
            // Corrigido: pode ser que this.listaAtual seja null se já foi removida
            let atividade = null;
            if (this.listaAtual) {
                atividade = this.listaAtual.querySelector(`[data-atividade-id="${atividadeId}"]`);
            }
            // Se não encontrar na lista flutuante, tenta buscar no DOM global (fallback)
            if (!atividade) {
                atividade = document.querySelector(`[data-atividade-id="${atividadeId}"]`);
            }
            if (!atividade) return;

            // Pegar o nome e descrição dos elementos do card
            const nome = atividade.querySelector('h4').textContent;
            const descricao = atividade.querySelector('p').textContent;
            const img = atividade.querySelector('img').src;

            // Montar objeto da atividade selecionada
            const atividadeSelecionada = {
                id: atividadeId,
                nome,
                descricao,
                img
            };

            // Atualiza o container da atividade com um card fixo (visual)
            elementoOrigem.innerHTML = `
                <div class="h-full w-full flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div class="w-full p-4 flex items-center gap-3">
                        <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex-shrink-0">
                            <img src="${img}" alt="${nome}" class="w-full h-full object-cover">
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="font-medium text-gray-900 dark:text-white text-sm truncate">${nome}</h4>
                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${descricao}</p>
                        </div>
                    </div>
                </div>`;

            elementoOrigem.dataset.atividadeSelecionada = atividadeId;
            this.fecharListaAtividades();

            // Chama o callback para atualizar o conjunto no item
            if (typeof onSelecionarAtividade === 'function') {
                onSelecionarAtividade(atividadeSelecionada);
            }
        } catch (error) {
            console.error('Erro ao selecionar atividade:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.atividadesService = new AtividadesService();
});
// Nenhuma redundância relevante. Busca via apiService, HTML via componentes.service.
