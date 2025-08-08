/**
 * Gerencia a UI dos itens (adicionar/remover, integração com eventos)
 */
class ItemManagerService {
    constructor() {
        this.configurarAdicionarItem();
    }

    configurarAdicionarItem() {
        const btnAdicionar = document.getElementById('btn-adicionar-item');
        if (!btnAdicionar) return;

        btnAdicionar.addEventListener('click', () => {
            this.adicionarNovoItem();
        });
    }

    adicionarNovoItem() {
        const itensContainer = document.getElementById('itens-container');
        if (!itensContainer) return;

        const itemId = `item-${Date.now()}`;
        const html = window.itemComponentesService.criarItemCard(itemId);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const novoItem = tempDiv.firstElementChild;
        itensContainer.appendChild(novoItem);

        // Popular o select de modelos (mas manter desabilitado até selecionar evento)
        const selectModelo = novoItem.querySelector('.select-modelo');
        if (selectModelo) {
            window.modelosService.buscarModelos(window.USER.ministerio_atual).then(modelos => {
                modelos.forEach(modelo => {
                    const opt = document.createElement('option');
                    opt.value = modelo.id;
                    opt.textContent = modelo.nome;
                    selectModelo.appendChild(opt);
                });
            });

            // Ao selecionar um modelo, adicionar atividades automaticamente
            selectModelo.addEventListener('change', async (e) => {
                const modeloId = e.target.value;
                if (!modeloId) return;
                const modelo = await window.modelosService.getModeloById(modeloId);
                if (!modelo || !modelo.atividades) return;
                // Limpa conjuntos existentes
                window.escalaService.getConjuntosDoItem(itemId).length = 0;
                // Para cada atividade, adiciona um conjunto
                for (const atividadeId of modelo.atividades) {
                    const atividade = await window.modelosService.buscarAtividadePorId(atividadeId);
                    window.escalaService.adicionarConjuntoAoItem(itemId, { atividade, voluntario: null });
                }
                // Atualiza UI
                const seletorId = novoItem.querySelector('[id^="detalhes-evento-"]')?.id?.replace('detalhes-evento-', '');
                if (seletorId) {
                    this.renderizarConjuntos(itemId, seletorId);
                }
            });
        }

        // Inicializa seletor de eventos dentro do item
        window.eventosService.abrirSeletorEventos(
            `eventos-seletor-container-${itemId}`,
            (eventoSelecionado, seletorId) => {
                // Atualiza o evento do item já existente, não adiciona novo item
                let itemExistente = window.itemService.getItens().find(i => i.id === itemId);
                if (itemExistente) {
                    itemExistente.evento = eventoSelecionado;
                } else {
                    // fallback para manter compatibilidade
                    window.itemService.adicionarItem({
                        id: itemId,
                        evento: eventoSelecionado
                    });
                }
                // Renderiza conjuntos dentro do detalhe do evento
                this.renderizarConjuntos(itemId, seletorId);
                // Habilita o select de modelos após selecionar evento
                if (selectModelo) {
                    selectModelo.disabled = false;
                }
            }
        );

        // Configura botão de remover item
        novoItem.querySelector('.btn-remover-item')?.addEventListener('click', () => {
            window.itemService.removerItem(itemId);
            novoItem.remove();
        });
    }

    renderizarConjuntos(itemId, seletorId) {
        const detalhesContainer = document.getElementById(`detalhes-evento-${seletorId}`);
        if (!detalhesContainer) return;

        const eventoDetalhado = detalhesContainer.querySelector('.evento-detalhado');
        if (!eventoDetalhado) return;

        // Procura ou cria o container de conjuntos dentro do .evento-detalhado
        let conjuntosContainer = eventoDetalhado.querySelector('.conjuntos-container');
        if (!conjuntosContainer) {
            conjuntosContainer = document.createElement('div');
            conjuntosContainer.className = 'conjuntos-container flex flex-col gap-4 p-3';
            eventoDetalhado.appendChild(conjuntosContainer);
        }

        // Obter data do evento (input)
        const inputData = eventoDetalhado.querySelector('input.evento-datepicker');
        let eventoData = inputData ? inputData.value : null;

        // Corrige formato dd/mm/yyyy para yyyy-mm-dd (caso o usuário use o datepicker)
        if (inputData && inputData.value && /^\d{2}\/\d{2}\/\d{4}$/.test(inputData.value)) {
            const [dia, mes, ano] = inputData.value.split('/');
            eventoData = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        }

        // Sempre que mudar a data, re-renderiza os conjuntos para liberar/bloquear voluntário
        if (inputData && !inputData.dataset.listenerSet) {
            inputData.addEventListener('change', () => {
                this.renderizarConjuntos(itemId, seletorId);
            });
            // Para o datepicker (caso use jQuery UI)
            $(inputData).on('change', () => {
                this.renderizarConjuntos(itemId, seletorId);
            });
            inputData.dataset.listenerSet = "1";
        }

        const conjuntos = window.escalaService.getConjuntosDoItem(itemId);
        conjuntosContainer.innerHTML = '';
        conjuntos.forEach((conjunto, idx) => {
            conjuntosContainer.insertAdjacentHTML('beforeend', window.itemComponentesService.criarConjuntoHTML(itemId, conjunto, idx, eventoData));
        });
        // Botão "+ Adicionar Conjunto" ocupando toda a coluna (igual às colunas dos conjuntos)
        conjuntosContainer.insertAdjacentHTML('beforeend', `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                <div></div>
                <div>
                    <button type="button"
                        class="btn-adicionar-conjunto w-full py-2 px-4 border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-lg text-primary-700 dark:text-primary-300 bg-white dark:bg-gray-900 hover:bg-primary-50 dark:hover:bg-primary-800 font-semibold transition"
                        style="margin-top: 0.5rem;"
                        onclick="window.itemManagerService.adicionarNovoConjunto('${itemId}','${seletorId}')">
                        + Adicionar Conjunto
                    </button>
                </div>
            </div>
        `);
        this.configurarEventosConjuntos(itemId, seletorId, eventoData);
    }

    criarConjuntoHTML(itemId, conjunto, idx) {
        // Reduz altura, remove cabeçalhos/textos, botão remover como ícone na mesma linha à direita
        return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
            <div class="flex flex-row h-[80px] items-center">
                <div class="espaco-atividades flex-1 min-h-[85px] bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50 flex items-center justify-center mr-2" data-conjunto-idx="${idx}">
                    ${
                        conjunto.atividade
                        ? `<div class="w-full flex items-center gap-3 p-2">
                            <div class="w-15 h-15 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                                <img src="${conjunto.atividade.img || (window.APP_CONFIG.baseUrl + '/assets/img/placeholder.jpg')}" alt="${conjunto.atividade.nome}" class="w-12 h-12 object-cover rounded-full">
                            </div>
                            <div class="flex-1 min-w-0 pl-1">
                                <h4 class="font-medium text-gray-900 dark:text-white text-sm truncate">${conjunto.atividade.nome}</h4>
                                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${conjunto.atividade.descricao || ''}</p>
                            </div>
                        </div>`
                        : `<p class="text-sm text-gray-500 p-4 text-center w-full">Clique para selecionar</p>`
                    }
                </div>
            </div>
            <div class="flex flex-row h-[80px] items-center">
                <div class="espaco-voluntario flex-1 min-h-[85px] bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50 flex items-center justify-center mr-2" data-conjunto-idx="${idx}">
                    ${
                        conjunto.voluntario
                        ? `<div class="w-full flex items-center gap-3 p-2">
                            <div class="w-15 h-15 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                                <img src="${conjunto.voluntario.img || (window.APP_CONFIG.baseUrl + '/assets/img/placeholder.jpg')}" alt="${conjunto.voluntario.nome}" class="w-9 h-9 object-cover rounded-full">
                            </div>
                            <div class="flex-1 min-w-0 pl-1">
                                <h4 class="font-medium text-gray-900 dark:text-white text-sm truncate">${conjunto.voluntario.nome}</h4>
                            </div>
                        </div>`
                        : `<p class="text-sm text-gray-500 p-4 text-center w-full">Clique para selecionar</p>`
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

    adicionarNovoConjunto(itemId, seletorId) {
        window.escalaService.adicionarConjuntoAoItem(itemId, { atividade: null, voluntario: null });
        this.renderizarConjuntos(itemId, seletorId);
    }

    configurarEventosConjuntos(itemId, seletorId, eventoData) {
        const detalhesContainer = document.getElementById(`detalhes-evento-${seletorId}`);
        if (!detalhesContainer) return;
        detalhesContainer.querySelectorAll('.espaco-atividades').forEach(el => {
            el.onclick = async (e) => {
                e.stopPropagation();
                await window.atividadesService.mostrarListaAtividades(el, (atividadeSelecionada) => {
                    const idx = parseInt(el.dataset.conjuntoIdx, 10);
                    const conjuntos = window.escalaService.getConjuntosDoItem(itemId);
                    if (conjuntos[idx]) {
                        conjuntos[idx].atividade = atividadeSelecionada;
                        this.renderizarConjuntos(itemId, seletorId);
                    }
                });
            };
        });
        // Voluntário
        detalhesContainer.querySelectorAll('.espaco-voluntario').forEach(el => {
            if (el.dataset.bloqueado === "1") {
                el.onclick = null;
                el.style.pointerEvents = "none";
                return;
            }
            el.onclick = async (e) => {
                e.stopPropagation();
                const idx = parseInt(el.dataset.conjuntoIdx, 10);
                const conjuntos = window.escalaService.getConjuntosDoItem(itemId);
                const conjunto = conjuntos[idx];
                if (!conjunto || !conjunto.atividade) return;
                // Busca evento_id (do item), atividade_id, data
                const evento = window.itemService.getItens().find(i => i.id === itemId)?.evento;
                if (!evento) return;
                // Corrige formato da data para YYYY-MM-DD
                let dataISO = null;
                if (eventoData) {
                    // Aceita tanto dd/mm/yyyy quanto yyyy-mm-dd
                    if (/^\d{2}\/\d{2}\/\d{4}$/.test(eventoData)) {
                        const [dia, mes, ano] = eventoData.split('/');
                        dataISO = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
                    } else if (/^\d{4}-\d{2}-\d{2}$/.test(eventoData)) {
                        dataISO = eventoData;
                    }
                }
                await window.voluntariosService.abrirSidebarVoluntarios({
                    organizacao_id: window.USER.organizacao_id,
                    ministerio_id: window.USER.ministerio_atual,
                    atividade_id: conjunto.atividade.id,
                    data: dataISO,
                    data_evento: dataISO,
                    evento_id: evento.id,
                    page: 1,
                    limit: 100
                }, (voluntarioSelecionado) => {
                    conjunto.voluntario = voluntarioSelecionado;
                    this.renderizarConjuntos(itemId, seletorId);
                });
            };
        });
        // Remover conjunto
        detalhesContainer.querySelectorAll('.btn-remover-conjunto').forEach(btn => {
            btn.onclick = (e) => {
                const idx = parseInt(btn.dataset.conjuntoIdx, 10);
                const conjuntos = window.escalaService.getConjuntosDoItem(itemId);
                if (conjuntos[idx]) {
                    conjuntos.splice(idx, 1);
                    this.renderizarConjuntos(itemId, seletorId);
                }
            };
        });
    }
}

// Nenhuma alteração necessária para alinhamento visual.

document.addEventListener('DOMContentLoaded', () => {
    window.itemManagerService = new ItemManagerService();
    window.itemManagerService.adicionarNovoConjunto = window.itemManagerService.adicionarNovoConjunto.bind(window.itemManagerService);
});
