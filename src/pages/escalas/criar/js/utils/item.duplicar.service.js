class ItemDuplicarService {
    constructor() {
        this.init();
    }

    init() {
        // Injeta botão ao carregar e ao adicionar novos itens
        document.addEventListener('DOMContentLoaded', () => this.injetarBotoesDuplicar());
        const container = document.getElementById('itens-container');
        if (container) {
            new MutationObserver(() => this.injetarBotoesDuplicar()).observe(container, { childList: true, subtree: true });
        }
    }

    injetarBotoesDuplicar() {
        document.querySelectorAll('.select-modelo').forEach(select => {
            if (select.parentElement && !select.parentElement.querySelector('.btn-duplicar-item')) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn-duplicar-item ml-2 flex items-center px-3 py-2 h-[40px] bg-primary-50 hover:bg-primary-100 border border-primary-300 text-primary-700 rounded-lg transition text-sm font-semibold ';
                btn.title = 'Duplicar este item';
                btn.innerHTML = `
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8M8 12h8m-7 8h6a2 2 0 002-2V6a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    Duplicar
                `;
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const itemDiv = select.closest('.bg-white, .dark\\:bg-gray-800');
                    if (!itemDiv) return;
                    const itemId = itemDiv.id;
                    window.itemDuplicarService.duplicarItem(itemId);
                };
                // Garante altura igual ao select
                btn.style.height = `${select.offsetHeight || 40}px`;
                select.parentElement.appendChild(btn);
            }
        });
    }

    async duplicarItem(itemId) {
        // Busca o item original
        const original = window.itemService.getItens().find(i => i.id === itemId);
        if (!original) return;
        const conjuntosOriginais = window.escalaService.getConjuntosDoItem(itemId);

        // Cria novo itemId
        const novoItemId = `item-${Date.now()}`;

        // Clona o evento
        const eventoClonado = original.evento ? JSON.parse(JSON.stringify(original.evento)) : null;

        // Adiciona novo item ao itemService e escalaService
        const novoItem = { id: novoItemId, evento: eventoClonado };
        window.itemService.adicionarItem(novoItem);

        // Adiciona conjuntos clonados ao novo item
        if (conjuntosOriginais && conjuntosOriginais.length) {
            for (const conjunto of conjuntosOriginais) {
                window.escalaService.adicionarConjuntoAoItem(novoItemId, {
                    atividade: conjunto.atividade ? { ...conjunto.atividade } : null,
                    voluntario: conjunto.voluntario ? { ...conjunto.voluntario } : null
                });
            }
        }

        // Renderiza novo item na tela
        const itensContainer = document.getElementById('itens-container');
        if (itensContainer) {
            // Cria o card do novo item
            const html = window.itemComponentesService.criarItemCard(novoItemId);
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const novoItemDiv = tempDiv.firstElementChild;
            itensContainer.appendChild(novoItemDiv);

            // Popular o select de modelos (igual ao fluxo do item original)
            const selectModelo = novoItemDiv.querySelector('.select-modelo');
            if (selectModelo) {
                window.modelosService.buscarModelos(window.USER.ministerio_atual).then(modelos => {
                    modelos.forEach(modelo => {
                        const opt = document.createElement('option');
                        opt.value = modelo.id;
                        opt.textContent = modelo.nome;
                        selectModelo.appendChild(opt);
                    });
                });

                selectModelo.disabled = false;

                selectModelo.addEventListener('change', async (e) => {
                    const modeloId = e.target.value;
                    if (!modeloId) return;
                    const modelo = await window.modelosService.getModeloById(modeloId);
                    if (!modelo || !modelo.atividades) return;
                    window.escalaService.getConjuntosDoItem(novoItemId).length = 0;
                    for (const atividadeId of modelo.atividades) {
                        const atividade = await window.modelosService.buscarAtividadePorId(atividadeId);
                        window.escalaService.adicionarConjuntoAoItem(novoItemId, { atividade, voluntario: null });
                    }
                    const seletorId = novoItemDiv.querySelector('[id^="detalhes-evento-"]')?.id?.replace('detalhes-evento-', '');
                    if (seletorId) {
                        window.itemManagerService.renderizarConjuntos(novoItemId, seletorId);
                    }
                });
            }

            // Adiciona evento ao botão de remover item
            novoItemDiv.querySelector('.btn-remover-item')?.addEventListener('click', () => {
                window.itemService.removerItem(novoItemId);
                novoItemDiv.remove();
            });

            // Renderiza o seletor de eventos e, após callback, atualiza o evento do item duplicado corretamente
            window.eventosService.abrirSeletorEventos(
                `eventos-seletor-container-${novoItemId}`,
                (eventoSelecionado, seletorIdNovo) => {
                    // Atualiza o evento do item duplicado corretamente
                    const itemDuplicado = window.itemService.getItens().find(i => i.id === novoItemId);
                    if (itemDuplicado) {
                        itemDuplicado.evento = eventoSelecionado;
                    }
                    window.itemManagerService.renderizarConjuntos(novoItemId, seletorIdNovo);
                }
            );
        }
    }
}

window.itemDuplicarService = new ItemDuplicarService();
