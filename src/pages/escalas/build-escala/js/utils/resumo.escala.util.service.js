(function() {
    // Cria o botão flutuante fixo
    function criarBotaoResumo() {
        if (document.getElementById('btn-resumo-escala')) return;
        
        const btn = document.createElement('div');
        btn.id = 'btn-resumo-escala';
        btn.className = 'fixed bottom-0 left-1/2 -translate-x-1/2 z-[3000] bg-primary-600 hover:bg-primary-700 text-white shadow-lg flex items-center justify-center p-3 cursor-pointer transition-all rounded-t-xl';
        btn.style.width = '120px';
        btn.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
            </svg>
        `;
        btn.onclick = abrirModalResumoAtualizado;
        document.body.appendChild(btn);
    }

    // Remove modal antigo e abre um novo
    function abrirModalResumoAtualizado() {
        document.getElementById('modal-resumo-escala')?.remove();
        abrirModalResumo();
    }

    // Função para inicializar as tabs do modal
    function initModalTabs(modalDiv) {
        const tabResumo = modalDiv.querySelector('#tab-btn-resumo');
        const tabFora = modalDiv.querySelector('#tab-btn-fora');
        const conteudoResumo = modalDiv.querySelector('#tab-conteudo-resumo');
        const conteudoFora = modalDiv.querySelector('#tab-conteudo-fora');
        
        if (!tabResumo || !tabFora || !conteudoResumo || !conteudoFora) return;

        function trocarTab(tabAtiva, tabInativa, conteudoAtivo, conteudoInativo) {
            // Ativa a tab clicada
            tabAtiva.classList.add('tab-resumo-ativa', 'bg-primary-50', 'dark:bg-gray-800', 'text-primary-700', 'dark:text-primary-200', 'border-primary-600');
            tabAtiva.classList.remove('tab-resumo-inativa', 'bg-gray-100', 'dark:bg-gray-900', 'text-gray-600', 'dark:text-gray-200', 'border-transparent');
            
            // Desativa a outra tab
            tabInativa.classList.remove('tab-resumo-ativa', 'bg-primary-50', 'dark:bg-gray-800', 'text-primary-700', 'dark:text-primary-200', 'border-primary-600');
            tabInativa.classList.add('tab-resumo-inativa', 'bg-gray-100', 'dark:bg-gray-900', 'text-gray-600', 'dark:text-gray-200', 'border-transparent');
            
            // Mostra/esconde conteúdos
            conteudoAtivo.classList.remove('hidden');
            conteudoInativo.classList.add('hidden');
        }

        // Click handlers
        tabResumo.addEventListener('click', () => {
            console.log('Click tab Resumo');
            trocarTab(tabResumo, tabFora, conteudoResumo, conteudoFora);
        });

        tabFora.addEventListener('click', () => {
            console.log('Click tab Fora');
            trocarTab(tabFora, tabResumo, conteudoFora, conteudoResumo);
        });
    }

    // Abre o modal de resumo e popula os dados
    function abrirModalResumo() {
        console.log('Debug - Tentando carregar modal de resumo');
        console.log('Debug - APP_CONFIG.baseUrl:', window.APP_CONFIG?.baseUrl);
        
        fetch(window.APP_CONFIG.baseUrl + '/src/pages/escalas/build-escala/components/resumo-escala-modal.php')
            .then(r => {
                console.log('Debug - Response status resumo:', r.status);
                if (!r.ok) {
                    throw new Error(`HTTP ${r.status}: ${r.statusText}`);
                }
                return r.text();
            })
            .then(html => {
                console.log('Debug - HTML resumo carregado, tamanho:', html.length);
                
                const modalDiv = document.createElement('div');
                modalDiv.innerHTML = html;
                document.body.appendChild(modalDiv);
                
                console.log('Debug - Modal resumo adicionado ao DOM');
                console.log('Debug - Modal resumo element:', modalDiv.querySelector('#modal-resumo-escala'));
                
                // Verificar se o modal de resumo está visível
                const modalElement = modalDiv.querySelector('#modal-resumo-escala');
                if (modalElement) {
                    console.log('Debug - Modal resumo styles:', {
                        display: getComputedStyle(modalElement).display,
                        visibility: getComputedStyle(modalElement).visibility,
                        opacity: getComputedStyle(modalElement).opacity,
                        zIndex: getComputedStyle(modalElement).zIndex,
                        position: getComputedStyle(modalElement).position
                    });
                    
                    // Forçar exibição do modal de resumo
                    modalElement.style.display = 'flex';
                    modalElement.style.visibility = 'visible';
                    modalElement.style.opacity = '1';
                    modalElement.style.zIndex = '9999';
                    
                    console.log('Debug - Modal resumo forçado a aparecer');
                }

                // Darkmode e setup inicial
                const modal = modalDiv.querySelector('.bg-white');
                if (modal) {
                    modal.classList.add('dark:bg-gray-900', 'dark:border', 'dark:border-gray-700');
                }

                // Inicializa as tabs
                initModalTabs(modalDiv);

                // Fechar modal e limpar eventos
                modalDiv.querySelector('.fechar-modal-resumo')?.addEventListener('click', () => {
                    modalDiv.remove();
                });

                // Popular dados do resumo
                popularResumoEscala(modalDiv);
            })
            .catch(error => {
                console.error('Erro ao carregar modal de resumo:', error);
                alert('Erro ao carregar modal de resumo: ' + error.message);
            });
    }

    // Utilitário para criar e mostrar tooltip global
    function showTooltip(triggerEl, html) {
        removeTooltip();
        const tooltip = document.createElement('div');
        tooltip.id = 'vol-tooltip-global';
        tooltip.className = 'fixed z-[6000] w-80 max-w-sm rounded-lg bg-gray-900 text-white text-xs shadow-lg px-4 py-2 pointer-events-auto';
        tooltip.innerHTML = html;
        document.body.appendChild(tooltip);

        // Força o tooltip a aparecer sempre acima do botão
        const rect = triggerEl.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        
        // Posiciona sempre acima do botão
        let top = rect.top + scrollY - tooltip.offsetHeight - 10;
        let left = rect.left + scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2);

        // Ajusta horizontalmente se sair da tela
        if (left < 8) left = 8;
        if (left + tooltip.offsetWidth > window.innerWidth - 8) {
            left = window.innerWidth - tooltip.offsetWidth - 8;
        }
        
        // Se não couber acima, força para aparecer acima mesmo assim
        if (top < 8) {
            top = 8;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;

        // Fecha ao clicar fora
        setTimeout(() => {
            document.addEventListener('mousedown', removeTooltip, { once: true });
        }, 0);
    }
    function removeTooltip() {
        const t = document.getElementById('vol-tooltip-global');
        if (t) t.remove();
    }

    // Função auxiliar para tratar URLs de imagem com fallback para placeholder
    function getImageUrl(item, tipo = 'evento') {
        const placeholder = `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`;
        
        if (!item || !item.foto) return placeholder;
        
        // Se já for URL completa, retorna direto
        if (item.foto.startsWith('http')) return item.foto;
        
        // Monta URL baseado no tipo
        try {
            if (tipo === 'evento') {
                return `${window.APP_CONFIG.baseUrl}/assets/img/eventos/${item.foto}`;
            } else {
                return item.foto; // Voluntário já vem com caminho completo
            }
        } catch (error) {
            console.warn('Erro ao montar URL da imagem:', error);
            return placeholder;
        }
    }

    // Configura drag and drop para os eventos no resumo
    function setupEventosSortable(container) {
        if (!window.Sortable || !container) return;

        const sortable = Sortable.create(container, {
            animation: 200,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            handle: '.drag-handle',
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onStart: (evt) => {
                console.log('Iniciando drag do evento no resumo');
                container.classList.add('dragging-eventos');
            },
            onEnd: (evt) => {
                container.classList.remove('dragging-eventos');
                console.log('Finalizando drag do evento no resumo:', {
                    oldIndex: evt.oldIndex,
                    newIndex: evt.newIndex
                });
                
                // Atualiza a ordem dos eventos na escala principal
                updateEventOrderInScale(evt.oldIndex, evt.newIndex);
            }
        });

        console.log('Sortable configurado para eventos do resumo');
        return sortable;
    }

    // Atualiza a ordem dos eventos na escala principal
    function updateEventOrderInScale(oldIndex, newIndex) {
        if (oldIndex === newIndex) return;

        try {
            // Obtém estado atual da escala
            const estado = window.escalaManagerService.getEstadoAtual();
            
            if (!estado.itens || estado.itens.length === 0) {
                console.warn('Nenhum item encontrado na escala');
                return;
            }

            // Move o item na posição correta
            const itemMovido = estado.itens.splice(oldIndex, 1)[0];
            estado.itens.splice(newIndex, 0, itemMovido);

            // Atualiza ordem no container de itens da página principal
            const itensContainer = document.getElementById('itens-container');
            if (itensContainer && itensContainer.children[oldIndex]) {
                const itemElement = itensContainer.children[oldIndex];
                itensContainer.removeChild(itemElement);
                
                if (newIndex < itensContainer.children.length) {
                    itensContainer.insertBefore(itemElement, itensContainer.children[newIndex]);
                } else {
                    itensContainer.appendChild(itemElement);
                }
            }

            // Sincroniza com os serviços
            if (window.itemService && window.itemService.reorderItems) {
                window.itemService.reorderItems(oldIndex, newIndex);
            }

            if (window.escalaService && window.escalaService.onItemOrderChanged) {
                window.escalaService.onItemOrderChanged(oldIndex, newIndex);
            }

            console.log('Ordem dos eventos atualizada na escala principal');
        } catch (error) {
            console.error('Erro ao atualizar ordem dos eventos:', error);
        }
    }

    // Função principal para popular o resumo
    async function popularResumoEscala(modalDiv) {
        // Busca dados atuais da escala
        const estado = window.escalaManagerService.getEstadoAtual();

        // Pega a primeira data de evento da escala (ou data atual como fallback)
        let dataPadrao = null, atividadePadrao = null, eventoPadrao = null;
        for (const item of estado.itens) {
            if (item.data_evento) {
                // Normaliza para yyyy-mm-dd se vier dd/mm/yyyy
                if (/^\d{2}\/\d{2}\/\d{4}$/.test(item.data_evento)) {
                    const [dia, mes, ano] = item.data_evento.split('/');
                    dataPadrao = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
                } else {
                    dataPadrao = item.data_evento;
                }
                eventoPadrao = item.evento?.id;
                // Busca primeira atividade do primeiro conjunto
                if (item.conjuntos && item.conjuntos.length && item.conjuntos[0].atividade) {
                    atividadePadrao = item.conjuntos[0].atividade.id;
                }
                break;
            }
        }
        if (!dataPadrao) {
            const hoje = new Date();
            dataPadrao = hoje.toISOString().slice(0, 10); // yyyy-mm-dd
        }

        // Busca todos eventos e voluntários disponíveis (enviando todos os parâmetros obrigatórios)
        const [todosEventos, voluntariosResp] = await Promise.all([
            window.apiService.buscarEventos({
                organizacao_id: window.USER.organizacao_id,
                ministerio_id: window.USER.ministerio_atual,
                data: dataPadrao,
                page: 1,
                limit: 100
            }),
            window.apiService.buscarVoluntariosSugestoes({
                page: 1,
                limit: 100,
                organizacao_id: window.USER.organizacao_id,
                ministerio_id: window.USER.ministerio_atual,
                atividade_id: atividadePadrao,
                data: dataPadrao,
                data_evento: dataPadrao,
                evento_id: eventoPadrao
            })
        ]);
        const todosVoluntarios = voluntariosResp.todos || [];

        // --- Resumo: Eventos e Voluntários escalados ---
        const eventosEscalados = estado.itens.map(item => ({
            ...item.evento,
            data_evento: item.data_evento,
            voluntarios: (item.conjuntos || []).map(c => c.voluntario).filter(Boolean)
        }));

        // Voluntários escalados: {id, nome, img, eventos: [{nome, data_evento}]}
        const voluntariosMap = {};
        estado.itens.forEach(item => {
            (item.conjuntos || []).forEach(c => {
                if (c.voluntario) {
                    const v = c.voluntario;
                    if (!voluntariosMap[v.id]) {
                        voluntariosMap[v.id] = { ...v, eventos: [] };
                    }
                    voluntariosMap[v.id].eventos.push({
                        nome: item.evento?.nome,
                        data_evento: item.data_evento
                    });
                }
            });
        });
        const voluntariosEscalados = Object.values(voluntariosMap);

        // --- Preenche coluna de voluntários escalados (Resumo) ---
        const voluntariosList = modalDiv.querySelector('#resumo-voluntarios-list');
        const voluntariosCount = modalDiv.querySelector('#voluntarios-count');
        if (voluntariosList) {
            voluntariosList.innerHTML = voluntariosEscalados.length
                ? voluntariosEscalados.map(v => {
                    return `
                    <div class="voluntario-card flex items-center gap-3 p-3 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all">
                        <img src="${v.foto || v.img || `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`}" 
                             class="w-12 h-12 rounded-full object-cover flex-shrink-0" 
                             alt="${v.nome || 'Voluntário'}"
                             onerror="this.src='${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg'">
                        <div class="flex-1 min-w-0">
                            <div class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <span class="truncate" title="${v.nome}">${v.nome}</span>
                                <button class="ver-eventos-voluntario text-xs px-2 py-1 bg-primary-100 hover:bg-primary-200 dark:bg-primary-800 dark:hover:bg-primary-700 text-primary-700 dark:text-primary-200 rounded transition flex-shrink-0" 
                                        data-voluntario-id="${v.id}"
                                        data-voluntario-nome="${v.nome}"
                                        data-voluntario-foto="${v.foto || v.img || `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`}"
                                        data-voluntario-eventos='${JSON.stringify(v.eventos)}'>
                                    Ver eventos
                                </button>
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span class="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-2 py-0.5 rounded">Escalado ${v.eventos.length}x</span>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')
                : '<div class="text-gray-400 dark:text-gray-500 text-center p-8">Nenhum voluntário escalado</div>';
            
            // Atualiza contador
            if (voluntariosCount) {
                voluntariosCount.textContent = voluntariosEscalados.length;
            }
        }

        // --- Preenche coluna de eventos escalados (Resumo) ---
        const eventosList = modalDiv.querySelector('#resumo-eventos-list');
        const eventosCount = modalDiv.querySelector('#eventos-count');
        if (eventosList) {
            eventosList.innerHTML = eventosEscalados.length
                ? eventosEscalados.map((ev, index) => `
                    <div class="evento-card-draggable" data-evento-id="${ev.id}" data-evento-index="${index}">
                        <div class="evento-card flex items-center gap-3 p-3 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-move group">
                            <div class="drag-handle opacity-50 group-hover:opacity-100 transition-opacity">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9h8M8 15h8"></path>
                                </svg>
                            </div>
                            <img src="${getImageUrl(ev, 'evento')}" 
                                 class="w-12 h-12 rounded-full object-cover flex-shrink-0" 
                                 alt="${ev.nome || 'Evento'}"
                                 onerror="this.src='${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg'">
                            <div class="flex-1 min-w-0">
                                <div class="font-semibold text-gray-900 dark:text-white truncate">${ev.nome || '-'}</div>
                                <div class="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-2 mt-1">
                                    <span class="bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200 px-2 py-0.5 rounded">${ev.data_evento || '-'}</span>
                                    <span class="capitalize">${ev.dia_semana || ''}</span>
                                    <span>${ev.hora ? ev.hora.substring(0,5) : ''}</span>
                                    <span class="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 px-2 py-0.5 rounded font-semibold">${ev.voluntarios.length} vol.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')
                : '<div class="text-gray-400 dark:text-gray-500 text-center p-8">Nenhum evento selecionado</div>';
            
            // Atualiza contador
            if (eventosCount) {
                eventosCount.textContent = eventosEscalados.length;
            }
            
            // Configura drag and drop para eventos
            setupEventosSortable(eventosList);
        }

        // --- Fora da escala: Eventos e Voluntários não escalados ---
        // Eventos fora da escala
        const idsEventosEscalados = new Set(eventosEscalados.map(ev => String(ev.id)));
        const eventosFora = todosEventos.filter(ev => !idsEventosEscalados.has(String(ev.id)));
        const foraEventosList = modalDiv.querySelector('#fora-eventos-list');
        if (foraEventosList) {
            foraEventosList.innerHTML = eventosFora.length
                ? eventosFora.map(ev => `
                    <div class="evento-card flex items-center gap-3 p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                        <img src="${getImageUrl(ev, 'evento')}" 
                             class="w-10 h-10 rounded-full object-cover" 
                             alt="${ev.nome || 'Evento'}"
                             onerror="this.src='${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg'">
                        <div>
                            <div class="font-semibold text-gray-900 dark:text-gray-100">${ev.nome || '-'}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">${ev.dia_semana || ''} • ${ev.hora ? ev.hora.substring(0,5) : ''} • ${ev.tipo || ''}</div>
                        </div>
                    </div>
                `).join('')
                : '<div class="text-gray-400 dark:text-gray-500">Nenhum evento fora da escala</div>';
        }

        // Voluntários fora da escala
        const idsVolEscalados = new Set(voluntariosEscalados.map(v => String(v.id)));
        const voluntariosFora = todosVoluntarios.filter(v => !idsVolEscalados.has(String(v.id)));
        const foraVoluntariosList = modalDiv.querySelector('#fora-voluntarios-list');
        if (foraVoluntariosList) {
            foraVoluntariosList.innerHTML = voluntariosFora.length
                ? voluntariosFora.map(v => `
                    <div class="voluntario-card flex items-center gap-3 p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                        <img src="${v.foto || v.img || `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`}" 
                             class="w-10 h-10 rounded-full object-cover" 
                             alt="${v.nome || 'Voluntário'}"
                             onerror="this.src='${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg'">
                        <div>
                            <div class="font-semibold text-gray-900 dark:text-gray-100">${v.nome}</div>
                        </div>
                    </div>
                `).join('')
                : '<div class="text-gray-400 dark:text-gray-500">Nenhum voluntário fora da escala</div>';
        }

        // Tooltip funcional (clique) - removido pois agora usamos painel lateral
        // modalDiv.querySelectorAll('.tooltip-trigger').forEach(button => { ... });

        // Configura eventos para os botões "ver eventos do voluntário"
        configurarPainelEventosVoluntario(modalDiv);
    }

    // Configura o painel lateral de eventos do voluntário
    function configurarPainelEventosVoluntario(modalDiv) {
        const panel = modalDiv.querySelector('#voluntario-eventos-panel');
        const voluntariosList = modalDiv.querySelector('#resumo-voluntarios-list');
        const btnFechar = modalDiv.querySelector('#fechar-eventos-panel');

        if (!panel || !voluntariosList || !btnFechar) return;

        // Função para abrir o painel
        function abrirPainel(voluntarioData) {
            const { nome, foto, eventos } = voluntarioData;
            
            // Preenche dados do header
            const fotoEl = modalDiv.querySelector('#panel-voluntario-foto');
            const nomeEl = modalDiv.querySelector('#panel-voluntario-nome');
            const infoEl = modalDiv.querySelector('#panel-voluntario-info');
            
            if (fotoEl) fotoEl.src = foto;
            if (nomeEl) nomeEl.textContent = nome;
            if (infoEl) infoEl.textContent = `Escalado em ${eventos.length} evento${eventos.length !== 1 ? 's' : ''}`;

            // Preenche lista de eventos
            const eventosLista = modalDiv.querySelector('#panel-eventos-lista');
            if (eventosLista) {
                eventosLista.innerHTML = eventos.length > 0 
                    ? eventos.map(evento => `
                        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 transition-colors">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg class="w-4 h-4 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h5 class="font-medium text-gray-900 dark:text-white text-sm truncate">${evento.nome || 'Evento sem nome'}</h5>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        <span class="inline-flex items-center gap-1">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                            </svg>
                                            ${evento.data_evento || 'Data não informada'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    `).join('')
                    : '<div class="text-center text-gray-500 dark:text-gray-400 py-8">Nenhum evento encontrado</div>';
            }

            // Mostra e anima o painel
            panel.classList.remove('hidden');
            setTimeout(() => {
                panel.classList.remove('translate-x-full');
                voluntariosList.classList.add('-translate-x-full');
            }, 10);
        }

        // Função para fechar o painel
        function fecharPainel() {
            panel.classList.add('translate-x-full');
            voluntariosList.classList.remove('-translate-x-full');
            
            setTimeout(() => {
                panel.classList.add('hidden');
            }, 300);
        }

        // Event listener para botões "ver eventos"
        voluntariosList.addEventListener('click', (e) => {
            const btn = e.target.closest('.ver-eventos-voluntario');
            if (!btn) return;

            const voluntarioData = {
                id: btn.dataset.voluntarioId,
                nome: btn.dataset.voluntarioNome,
                foto: btn.dataset.voluntarioFoto,
                eventos: JSON.parse(btn.dataset.voluntarioEventos || '[]')
            };

            abrirPainel(voluntarioData);
        });

        // Event listener para botão fechar
        btnFechar.addEventListener('click', fecharPainel);

        // Fechar ao clicar fora do painel (opcional)
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                fecharPainel();
            }
        });
    }

    // Inicializa o botão quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', criarBotaoResumo);
})();

