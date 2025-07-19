let modalEscalasData = null;
let eventosOriginais = null;
let eventosBaseData = null;
let ministeriosBaseData = null;
let eventoSelecionado = null;
let ministerioSelecionado = null;

// Utilidade
function getEl(id) { return document.getElementById(id); }

// Exibir modal
function abrirModalEscalas(dataIso, dataFormatada) {
    const modal = getEl('modal-escalas');
    if (!modal) return;
    const url = new URL(window.location);
    // Garantir que apenas a data seja usada (YYYY-MM-DD)
    const dataLimpa = new Date(dataIso).toISOString().split('T')[0];
    url.searchParams.set('data', dataLimpa);
    window.history.pushState({ data: dataLimpa }, '', url);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    carregarDadosModalLocal(dataLimpa, dataFormatada);
}

function carregarDadosModalLocal(dataIso, dataFormatada) {
    const loading = getEl('modal-loading');
    const content = getEl('modal-content');
    const titulo = getEl('modal-titulo');
    if (loading) loading.classList.remove('hidden');
    if (content) content.classList.add('hidden');
    try {
        if (!Array.isArray(eventosOriginais)) throw new Error('Dados dos eventos não disponíveis');
        const dataEventoFormatada = new Date(dataIso).toISOString().split('T')[0];
        const eventosDaData = eventosOriginais.filter(e =>
            new Date(e.data_evento).toISOString().split('T')[0] === dataEventoFormatada
        );
        
        // Debug: Verificar se temos eventos duplicados ou com problemas
        console.log('Eventos da data:', eventosDaData.map(e => ({ id: e.evento_id, nome: e.evento_nome, voluntarios: e.total_voluntarios })));
        
        modalEscalasData = eventosDaData;
        const eventosOrdenados = ordenarEventosPorProximidade(eventosDaData);
        eventoSelecionado = eventosOrdenados[0] || null;
        ministerioSelecionado = null;
        if (titulo) titulo.textContent = `Escalas de ${dataFormatada}`;
        renderizarModalContent(eventosOrdenados);
        if (loading) loading.classList.add('hidden');
        if (content) content.classList.remove('hidden');
    } catch (error) {
        console.error('Erro ao carregar modal:', error);
        if (loading) loading.classList.add('hidden');
        if (content) {
            content.classList.remove('hidden');
            content.innerHTML = `<div class="text-center py-12"><div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <span class="text-red-600 dark:text-red-400 font-semibold">Erro ao carregar dados: ${error.message}</span></div></div>`;
        }
    }
}

function ordenarEventosPorProximidade(eventos) {
    const agora = new Date();
    const diaAtual = agora.getDay();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    const diasSemana = { 'domingo': 0, 'segunda': 1, 'terca': 2, 'quarta': 3, 'quinta': 4, 'sexta': 5, 'sabado': 6 };
    
    return eventos.map((evento, index) => {
        // Buscar evento base correspondente pelo ID primeiro, depois pelo nome se necessário
        let eventoBase = eventosBaseData?.find(e => e.id === evento.evento_id);
        if (!eventoBase) {
            eventoBase = eventosBaseData?.find(e => e.nome === evento.evento_nome);
        }
        
        if (!eventoBase) {
            return { 
                ...evento, 
                distancia: Infinity, 
                eventoBase: null,
                originalIndex: index,
                uniqueKey: `${evento.evento_id}_${index}` // Chave única para cada evento
            };
        }
        
        const diaSemanaEvento = diasSemana[eventoBase.dia_semana] || 0;
        const [hora, minuto] = eventoBase.hora.split(':').map(Number);
        const horaEvento = hora * 60 + minuto;
        let distanciaDias = (diaSemanaEvento - diaAtual + 7) % 7;
        if (distanciaDias === 0 && horaEvento < horaAtual) distanciaDias = 7;
        const distancia = distanciaDias * 1440 + (horaEvento - horaAtual);
        
        return { 
            ...evento, 
            distancia, 
            eventoBase: { 
                ...eventoBase,
                // Garantir que cada evento tenha dados únicos baseados no ID do evento
                uniqueId: evento.evento_id,
                originalHora: eventoBase.hora
            },
            originalIndex: index,
            uniqueKey: `${evento.evento_id}_${index}`
        };
    }).sort((a, b) => {
        // Primeiro ordenar por distância, depois por ID para garantir ordem consistente
        if (a.distancia !== b.distancia) {
            return a.distancia - b.distancia;
        }
        return a.evento_id - b.evento_id;
    });
}

function renderizarModalContent(eventos) {
    const content = getEl('modal-content');
    if (!content) return;
    if (!Array.isArray(eventos) || eventos.length === 0) {
        content.innerHTML = `<div class="text-center py-6 text-gray-500 dark:text-gray-400">Nenhum evento encontrado para esta data.</div>`;
        content.classList.remove('hidden');
        return;
    }
    let html = `
        <div class="space-y-4">
            ${eventoSelecionado ? renderizarCardEventoCompacto(eventos) : ''}
            <div id="ministerio-card-container"></div>
        </div>
    `;
    content.innerHTML = html;
    if (!eventoSelecionado && eventos.length > 0) eventoSelecionado = eventos[0];
    renderizarMinisterioCard();
}

// Card compacto do evento selecionado
function renderizarCardEventoCompacto(eventos) {
    // Buscar o evento base correto para o evento selecionado
    let eventoBase = null;
    if (eventoSelecionado.eventoBase && eventoSelecionado.eventoBase.uniqueId === eventoSelecionado.evento_id) {
        eventoBase = eventoSelecionado.eventoBase;
    } else {
        eventoBase = eventosBaseData?.find(e => e.id === eventoSelecionado.evento_id);
        if (!eventoBase) {
            eventoBase = eventosBaseData?.find(e => e.nome === eventoSelecionado.evento_nome);
        }
    }
    
    // Determinar o horário correto para exibição
    let horarioDisplay = 'N/A';
    if (eventoBase && eventoBase.hora) {
        horarioDisplay = eventoBase.hora.substring(0, 5);
    }
    
    return `
        <div class="relative">
            <div class="flex items-center p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                onclick="abrirListaEventos()">
                <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 mr-3">
                    ${eventoBase?.foto ? `<img src="${window.APP_CONFIG.baseUrl}/assets/img/eventos/${eventoBase.foto}" alt="${eventoSelecionado.evento_nome}" class="w-full h-full object-cover">` :
                        `<div class="w-full h-full flex items-center justify-center text-gray-400">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"></path></svg>
                        </div>`}
                </div>
                <div class="flex-1 min-w-0">
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate block">${eventoSelecionado.evento_nome}</span>
                    <div class="flex items-center space-x-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                        <span>${horarioDisplay}</span>
                        <span>• ID: ${eventoSelecionado.evento_id}</span>
                        <span>• ${eventoSelecionado.total_voluntarios} vol.</span>
                    </div>
                </div>
                <div class="flex-shrink-0 ml-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
            <div id="lista-eventos-flutuante" class="absolute left-0 right-0 mt-2 z-10 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hidden max-h-64 overflow-y-auto">
                ${eventos.map(evento => renderizarEventoListaFlutuante(evento)).join('')}
            </div>
        </div>
    `;
}

// Lista flutuante de eventos
function abrirListaEventos() {
    document.getElementById('lista-eventos-flutuante').classList.toggle('hidden');
}
function selecionarEvento(eventoId) {
    eventoSelecionado = modalEscalasData.find(e => e.evento_id == eventoId);
    ministerioSelecionado = null;
    document.getElementById('lista-eventos-flutuante').classList.add('hidden');
    renderizarModalContent(modalEscalasData);
}
function renderizarEventoListaFlutuante(evento) {
    // Buscar o evento base correspondente diretamente pelo ID do evento para garantir dados únicos
    let eventoBase = null;
    if (evento.eventoBase && evento.eventoBase.uniqueId === evento.evento_id) {
        // Usar o eventoBase já associado se o ID bater
        eventoBase = evento.eventoBase;
    } else {
        // Buscar pelo ID primeiro, depois pelo nome como fallback
        eventoBase = eventosBaseData?.find(e => e.id === evento.evento_id);
        if (!eventoBase) {
            eventoBase = eventosBaseData?.find(e => e.nome === evento.evento_nome);
        }
    }
    
    const isSelected = eventoSelecionado && eventoSelecionado.evento_id === evento.evento_id;
    
    // Determinar o horário a ser exibido - usar o horário específico do evento base encontrado
    let horarioDisplay = 'N/A';
    if (eventoBase && eventoBase.hora) {
        horarioDisplay = eventoBase.hora.substring(0, 5);
    }
    
    return `<div class="flex items-center p-3 ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-50 dark:bg-gray-900'} rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onclick="selecionarEvento(${evento.evento_id})">
        <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 mr-2">
            ${eventoBase?.foto ? `<img src="${window.APP_CONFIG.baseUrl}/assets/img/eventos/${eventoBase.foto}" alt="${evento.evento_nome}" class="w-full h-full object-cover">` :
                `<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"></path></svg></div>`}
        </div>
        <div class="flex-1 min-w-0">
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate block">${evento.evento_nome}</span>
            <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span>${horarioDisplay}</span>
                <span>• ID: ${evento.evento_id}</span>
                <span>• ${evento.total_voluntarios} vol.</span>
            </div>
        </div>
        ${isSelected ? `<div class="flex-shrink-0 ml-2"><svg class="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"/></svg></div>` : ''}
    </div>`;
}

// Card compacto do ministério escolhido
function renderizarMinisterioCard() {
    const container = getEl('ministerio-card-container');
    if (!container || !eventoSelecionado) return;
    const ministerios = eventoSelecionado.ministerios || [];
    // Não mostra nada se não há ministérios
    if (ministerios.length === 0) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = `
        <div class="relative mt-2">
            <div class="flex items-center p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                onclick="abrirListaMinisterios()">
                <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700 mr-3">
                    ${ministerioSelecionado ?
                        (() => {
                            const ministerioBase = ministeriosBaseData?.find(m => m.nome === ministerioSelecionado);
                            return ministerioBase?.foto
                                ? `<img src="${window.APP_CONFIG.baseUrl}/${ministerioBase.foto}" alt="${ministerioSelecionado}" class="w-full h-full object-cover">`
                                : `<div class="w-full h-full flex items-center justify-center text-white font-bold text-xs" style="background-color: ${ministerioBase?.cor || '#6B7280'}">${ministerioSelecionado.charAt(0).toUpperCase()}</div>`;
                        })()
                        : `<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></div>`
                    }
                </div>
                <div class="flex-1 min-w-0">
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate block">
                        ${ministerioSelecionado ? ministerioSelecionado : 'Selecione um ministério'}
                    </span>
                </div>
                <div class="flex-shrink-0 ml-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
            <div id="lista-ministerios-flutuante" class="absolute left-0 right-0 mt-2 z-10 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hidden max-h-64 overflow-y-auto">
                ${ministerios.map(m => renderizarMinisterioListaFlutuante(m)).join('')}
            </div>
            <div id="voluntarios-ministerio" class="mt-4"></div>
        </div>
    `;
    if (ministerioSelecionado) renderizarVoluntariosMinisterio(ministerioSelecionado);
}
function abrirListaMinisterios() {
    document.getElementById('lista-ministerios-flutuante').classList.toggle('hidden');
}
function selecionarMinisterio(nome) {
    ministerioSelecionado = nome;
    document.getElementById('lista-ministerios-flutuante').classList.add('hidden');
    renderizarMinisterioCard();
}
function renderizarMinisterioListaFlutuante(ministerio) {
    const ministerioBase = ministeriosBaseData?.find(m => m.nome === ministerio.ministerio_nome);
    const isSelected = ministerioSelecionado === ministerio.ministerio_nome;
    return `<div class="flex items-center p-3 ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-50 dark:bg-gray-900'} rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onclick="selecionarMinisterio('${ministerio.ministerio_nome}')">
        <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700 mr-2">
            ${ministerioBase?.foto ? `<img src="${window.APP_CONFIG.baseUrl}/${ministerioBase.foto}" alt="${ministerio.ministerio_nome}" class="w-full h-full object-cover">`
                : `<div class="w-full h-full flex items-center justify-center text-white font-bold text-xs" style="background-color: ${ministerioBase?.cor || '#6B7280'}">${ministerio.ministerio_nome.charAt(0).toUpperCase()}</div>`}
        </div>
        <div class="flex-1 min-w-0">
            <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate block">${ministerio.ministerio_nome}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">${ministerio.total_voluntarios} voluntário(s)</span>
        </div>
        ${isSelected ? `<div class="flex-shrink-0 ml-2"><svg class="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"/></svg></div>` : ''}
    </div>`;
}

// Voluntários do ministério selecionado
function renderizarVoluntariosMinisterio(nome) {
    const container = document.getElementById('voluntarios-ministerio');
    if (!container || !eventoSelecionado || !nome) {
        if (container) container.innerHTML = '';
        return;
    }
    const ministerio = eventoSelecionado.ministerios?.find(m => m.ministerio_nome === nome);
    if (!ministerio) { container.innerHTML = ''; return; }
    const ministerioBase = ministeriosBaseData?.find(m => m.nome === ministerio.ministerio_nome);
    let html = `<h5 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Voluntários Escalados</h5><div class="space-y-2">`;
    if (Array.isArray(ministerio.voluntarios) && ministerio.voluntarios.length > 0) {
        html += ministerio.voluntarios.map(voluntario => {
            const inicial = voluntario.nome?.trim()?.charAt(0)?.toUpperCase() || '?';
            return `<div class="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <span class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs shadow-md flex-shrink-0" 
                    style="background-color: ${ministerioBase?.cor || '#6B7280'}20; color: ${ministerioBase?.cor || '#6B7280'}">${inicial}</span>
                <div class="flex-1 min-w-0">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200 block">${voluntario.nome}</span>
                </div>
            </div>`;
        }).join('');
    } else {
        html += `<div class="col-span-full text-center py-6"><div class="text-gray-500 dark:text-gray-400">
            <svg class="w-8 h-8 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <p class="text-sm">Nenhum voluntário escalado para este ministério</p></div></div>`;
    }
    html += `</div>`;
    container.innerHTML = html;
}

// Setters
function setEventosOriginais(eventos) { eventosOriginais = eventos; }
function setEventosData(eventos) { eventosBaseData = eventos; }
function setMinisteriosData(ministerios) { ministeriosBaseData = ministerios; }

// Fechar modal
function fecharModalEscalas() {
    const modal = getEl('modal-escalas');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
    const url = new URL(window.location);
    url.searchParams.delete('data');
    window.history.pushState({}, '', url);
}

// URL & Navegação
function verificarParametroURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    if (dataParam) {
        // Aguardar os dados estarem carregados antes de abrir o modal
        const aguardarDados = () => {
            if (Array.isArray(eventosOriginais) && eventosOriginais.length > 0) {
                const dataFormatada = new Date(dataParam).toLocaleDateString('pt-BR');
                abrirModalEscalas(dataParam, dataFormatada);
            } else {
                // Tentar novamente em 100ms
                setTimeout(aguardarDados, 100);
            }
        };
        aguardarDados();
    }
}

// Eventos globais
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModalEscalas(); });
window.addEventListener('popstate', e => {
    if (e.state && e.state.data) {
        const dataFormatada = new Date(e.state.data).toLocaleDateString('pt-BR');
        abrirModalEscalas(e.state.data, dataFormatada);
    } else {
        fecharModalEscalas();
    }
});