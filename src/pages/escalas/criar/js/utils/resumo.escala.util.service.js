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
        fetch(window.URL_BASE + '/src/pages/escalas/criar/components/resumo-escala-modal.php')
            .then(r => r.text())
            .then(html => {
                const modalDiv = document.createElement('div');
                modalDiv.innerHTML = html;
                document.body.appendChild(modalDiv);

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
            });
    }

    // Utilitário para criar e mostrar tooltip global
    function showTooltip(triggerEl, html) {
        removeTooltip();
        const tooltip = document.createElement('div');
        tooltip.id = 'vol-tooltip-global';
        tooltip.className = 'fixed z-[6000] w-56 rounded-lg bg-gray-900 text-white text-xs shadow-lg px-4 py-2 pointer-events-auto';
        tooltip.innerHTML = html;
        document.body.appendChild(tooltip);

        // Calcula posição acima do trigger
        const rect = triggerEl.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        const tooltipRect = tooltip.getBoundingClientRect();
        let top = rect.top + scrollY - tooltipRect.height - 10;
        let left = rect.left + scrollX + rect.width / 2 - tooltipRect.width / 2;

        // Ajusta se sair da tela
        if (left < 8) left = 8;
        if (left + tooltipRect.width > window.innerWidth - 8) left = window.innerWidth - tooltipRect.width - 8;
        // Sempre tenta mostrar acima, mas se não couber, mostra abaixo
        if (top < 8) top = rect.bottom + scrollY + 10;

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
        const placeholder = `${window.URL_BASE}/assets/img/placeholder.jpg`;
        
        if (!item || !item.foto) return placeholder;
        
        // Se já for URL completa, retorna direto
        if (item.foto.startsWith('http')) return item.foto;
        
        // Monta URL baseado no tipo
        try {
            if (tipo === 'evento') {
                return `${window.URL_BASE}/assets/img/eventos/${item.foto}`;
            } else {
                return item.foto; // Voluntário já vem com caminho completo
            }
        } catch (error) {
            console.warn('Erro ao montar URL da imagem:', error);
            return placeholder;
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
                organizacao_id: window.ORGANIZACAO_ID,
                ministerio_id: window.ministerio_atual,
                data: dataPadrao,
                page: 1,
                limit: 100
            }),
            window.apiService.buscarVoluntariosSugestoes({
                page: 1,
                limit: 100,
                organizacao_id: window.ORGANIZACAO_ID,
                ministerio_id: window.ministerio_atual,
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
        if (voluntariosList) {
            voluntariosList.innerHTML = voluntariosEscalados.length
                ? voluntariosEscalados.map(v => {
                    const tooltipContent = v.eventos.map(ev => `<div>${ev.nome || '-'} <span class="text-gray-400">(${ev.data_evento || '-'})</span></div>`).join('');
                    return `
                    <li class="voluntario-card flex items-center gap-3 p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 relative">
                        <img src="${v.foto || v.img || `${window.URL_BASE}/assets/img/placeholder.jpg`}" 
                             class="w-10 h-10 rounded-full object-cover" 
                             alt="${v.nome || 'Voluntário'}"
                             onerror="this.src='${window.URL_BASE}/assets/img/placeholder.jpg'">
                        <div class="flex-1 min-w-0 flex items-center">
                            <div>
                                <div class="font-semibold flex items-center gap-1">
                                    ${v.nome}
                                    <span class="ml-1 relative">
                                        <svg class="w-4 h-4 text-primary-500 hover:text-primary-700 cursor-pointer tooltip-trigger" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            data-tooltip='${encodeURIComponent(`<div class="font-semibold mb-1 text-primary-300">Eventos deste voluntário:</div>${tooltipContent}`)}'
                                            tabindex="0">
                                            <circle cx="12" cy="12" r="10" stroke-width="2"></circle>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-4m0-4h.01"/>
                                        </svg>
                                    </span>
                                </div>
                                <div class="text-xs text-gray-500">Escalado ${v.eventos.length}x</div>
                            </div>
                        </div>
                    </li>
                    `;
                }).join('')
                : '<li class="text-gray-400">Nenhum voluntário escalado</li>';
        }

        // --- Preenche coluna de eventos escalados (Resumo) ---
        const eventosList = modalDiv.querySelector('#resumo-eventos-list');
        if (eventosList) {
            eventosList.innerHTML = eventosEscalados.length
                ? eventosEscalados.map(ev => `
                    <li class="evento-card flex items-center gap-3 p-2 rounded bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                        <img src="${getImageUrl(ev, 'evento')}" 
                             class="w-10 h-10 rounded-full object-cover" 
                             alt="${ev.nome || 'Evento'}"
                             onerror="this.src='${window.URL_BASE}/assets/img/placeholder.jpg'">
                        <div class="flex-1 min-w-0">
                            <div class="font-semibold">${ev.nome || '-'}</div>
                            <div class="flex flex-wrap items-center text-xs text-gray-500 gap-2">
                                <span>${ev.data_evento || '-'}</span>
                                <span>•</span>
                                <span class="capitalize">${ev.dia_semana || ''}</span>
                                <span>•</span>
                                <span>${ev.hora ? ev.hora.substring(0,5) : ''}</span>
                                <span>•</span>
                                <span>${ev.tipo || ''}</span>
                                <span>•</span>
                                <span class="text-primary-700 dark:text-primary-200 font-semibold">Voluntários: ${ev.voluntarios.length}</span>
                            </div>
                        </div>
                    </li>
                `).join('')
                : '<li class="text-gray-400">Nenhum evento selecionado</li>';
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
                             onerror="this.src='${window.URL_BASE}/assets/img/placeholder.jpg'">
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
                        <img src="${v.foto || v.img || `${window.URL_BASE}/assets/img/placeholder.jpg`}" 
                             class="w-10 h-10 rounded-full object-cover" 
                             alt="${v.nome || 'Voluntário'}"
                             onerror="this.src='${window.URL_BASE}/assets/img/placeholder.jpg'">
                        <div>
                            <div class="font-semibold text-gray-900 dark:text-gray-100">${v.nome}</div>
                        </div>
                    </div>
                `).join('')
                : '<div class="text-gray-400 dark:text-gray-500">Nenhum voluntário fora da escala</div>';
        }

        // Tooltip funcional (hover e foco)
        modalDiv.querySelectorAll('.tooltip-trigger').forEach(svg => {
            svg.addEventListener('mouseenter', function(e) {
                showTooltip(svg, decodeURIComponent(svg.dataset.tooltip));
            });
            svg.addEventListener('mouseleave', removeTooltip);
            svg.addEventListener('focus', function(e) {
                showTooltip(svg, decodeURIComponent(svg.dataset.tooltip));
            });
            svg.addEventListener('blur', removeTooltip);
        });
    }

    // Inicializa o botão quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', criarBotaoResumo);
})();

