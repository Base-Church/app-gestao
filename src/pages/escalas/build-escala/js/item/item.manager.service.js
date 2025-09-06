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
        
        // Configurar drag and drop para os conjuntos
        if (window.dragDropService) {
            window.dragDropService.setupConjuntosSortable(conjuntosContainer, itemId, seletorId);
        }
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
                
                // Mostra loading
                const originalContent = el.innerHTML;
                el.innerHTML = `<div class="flex items-center justify-center gap-2 p-4 text-center w-full">
                    <svg class="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="text-sm text-gray-500">Carregando...</span>
                </div>`;
                
                try {
                    await window.atividadesService.mostrarListaAtividades(el, (atividadeSelecionada) => {
                        const idx = parseInt(el.dataset.conjuntoIdx, 10);
                        const conjuntos = window.escalaService.getConjuntosDoItem(itemId);
                        if (conjuntos[idx]) {
                            conjuntos[idx].atividade = atividadeSelecionada;
                            this.renderizarConjuntos(itemId, seletorId);
                        }
                    });
                    // Remove loading após requisição concluída
                    el.innerHTML = originalContent;
                } catch (error) {
                    // Restaura conteúdo original em caso de erro
                    el.innerHTML = originalContent;
                    console.error('Erro ao carregar atividades:', error);
                }
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
                
                // Mostra loading
                const originalContent = el.innerHTML;
                el.innerHTML = `<div class="flex items-center justify-center gap-2 p-4 text-center w-full">
                    <svg class="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="text-sm text-gray-500">Carregando...</span>
                </div>`;
                
                try {
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
                    // Remove loading após requisição concluída
                    el.innerHTML = originalContent;
                } catch (error) {
                    // Restaura conteúdo original em caso de erro
                    el.innerHTML = originalContent;
                    console.error('Erro ao carregar voluntários:', error);
                }
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
