let modalEscalasData = null;
let eventosOriginais = null;
let eventosBaseData = null;
let ministeriosBaseData = null;
let eventoSelecionado = null;

function abrirModalEscalas(dataIso, dataFormatada) {
    const modal = document.getElementById('modal-escalas');
    if (!modal) return;
    
    // Atualizar URL com parâmetro da data
    const url = new URL(window.location);
    url.searchParams.set('data', dataIso);
    window.history.pushState({ data: dataIso }, '', url);
    
    // Mostrar modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    
    // Carregar dados do modal usando os dados já carregados
    carregarDadosModalLocal(dataIso, dataFormatada);
}

function carregarDadosModalLocal(dataIso, dataFormatada) {
    const loading = document.getElementById('modal-loading');
    const content = document.getElementById('modal-content');
    const titulo = document.getElementById('modal-titulo');
    
    if (loading) loading.classList.remove('hidden');
    if (content) content.classList.add('hidden');
    
    try {
        if (!eventosOriginais || !Array.isArray(eventosOriginais)) {
            throw new Error('Dados dos eventos não disponíveis');
        }
        
        // Filtrar eventos pela data
        const dataEventoFormatada = new Date(dataIso).toISOString().split('T')[0];
        const eventosDaData = eventosOriginais.filter(evento => {
            const dataEvento = new Date(evento.data_evento).toISOString().split('T')[0];
            return dataEvento === dataEventoFormatada;
        });
        
        modalEscalasData = eventosDaData;
        
        // Ordenar eventos por proximidade com a hora atual
        const eventosOrdenados = ordenarEventosPorProximidade(eventosDaData);
        
        if (titulo) titulo.textContent = `Escalas de ${dataFormatada}`;
        
        // Selecionar o primeiro evento por padrão
        eventoSelecionado = eventosOrdenados.length > 0 ? eventosOrdenados[0] : null;
        
        renderizarModalContent(eventosOrdenados);
        
        if (loading) loading.classList.add('hidden');
        if (content) content.classList.remove('hidden');
        
    } catch (error) {
        console.error('Erro ao carregar modal:', error);
        if (loading) loading.classList.add('hidden');
        if (content) {
            content.classList.remove('hidden');
            content.innerHTML = `
                <div class="text-center py-12">
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <span class="text-red-600 dark:text-red-400 font-semibold">Erro ao carregar dados: ${error.message}</span>
                    </div>
                </div>
            `;
        }
    }
}

function ordenarEventosPorProximidade(eventos) {
    const agora = new Date();
    const diaAtual = agora.getDay(); // 0 = domingo, 1 = segunda, etc.
    const horaAtual = agora.getHours() * 60 + agora.getMinutes(); // minutos desde meia-noite
    
    const diasSemana = {
        'domingo': 0, 'segunda': 1, 'terca': 2, 'quarta': 3,
        'quinta': 4, 'sexta': 5, 'sabado': 6
    };
    
    return eventos.map(evento => {
        const eventoBase = eventosBaseData?.find(e => e.nome === evento.evento_nome);
        if (!eventoBase) return { ...evento, distancia: Infinity };
        
        const diaSemanaEvento = diasSemana[eventoBase.dia_semana] || 0;
        const [hora, minuto] = eventoBase.hora.split(':').map(Number);
        const horaEvento = hora * 60 + minuto;
        
        // Calcular distância em dias e minutos
        let distanciaDias = (diaSemanaEvento - diaAtual + 7) % 7;
        if (distanciaDias === 0 && horaEvento < horaAtual) {
            distanciaDias = 7; // próxima semana se já passou a hora hoje
        }
        
        const distancia = distanciaDias * 1440 + (horaEvento - horaAtual); // em minutos
        
        return { ...evento, distancia, eventoBase };
    }).sort((a, b) => a.distancia - b.distancia);
}

// Função para definir os eventos originais (chamada do app.service.js)
function setEventosOriginais(eventos) {
    eventosOriginais = eventos;
}

function setEventosData(eventos) {
    eventosBaseData = eventos;
}

function setMinisteriosData(ministerios) {
    ministeriosBaseData = ministerios;
}

function fecharModalEscalas() {
    const modal = document.getElementById('modal-escalas');
    if (!modal) return;
    
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
    
    // Remover parâmetro da URL
    const url = new URL(window.location);
    url.searchParams.delete('data');
    window.history.pushState({}, '', url);
}

function renderizarModalContent(eventos) {
    const content = document.getElementById('modal-content');
    if (!content) return;
    
    if (!eventos || !Array.isArray(eventos) || eventos.length === 0) {
        content.innerHTML = `
            <div class="text-center py-12">
                <div class="text-gray-500 dark:text-gray-400">Nenhum evento encontrado para esta data.</div>
            </div>
        `;
        return;
    }
    
    // Mostrar apenas o primeiro evento (mais próximo)
    const evento = eventos[0];
    const eventoBase = evento.eventoBase || eventosBaseData?.find(e => e.nome === evento.evento_nome);
    
    let html = `
        <div class="space-y-6">
            <!-- Card do Evento Principal -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div class="flex items-center p-4 cursor-pointer" onclick="toggleMinisterios()">
                    <!-- Foto do Evento -->
                    <div class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 mr-3">
                        ${eventoBase?.foto ? 
                            `<img src="${window.APP_CONFIG.baseUrl}/assets/img/eventos/${eventoBase.foto}" alt="${evento.evento_nome}" class="w-full h-full object-cover">` :
                            `<div class="w-full h-full flex items-center justify-center text-gray-400">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"></path>
                                </svg>
                            </div>`
                        }
                    </div>
                    
                    <!-- Info do Evento -->
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                            ${evento.evento_nome}
                        </h3>
                        <div class="flex items-center space-x-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                            ${eventoBase ? `
                                <span class="flex items-center font-medium">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    ${eventoBase.hora.substring(0, 5)}
                                </span>
                            ` : ''}
                            <span class="flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                ${(evento.ministerios || []).length} ministério(s)
                            </span>
                        </div>
                    </div>
                    
                    <!-- Seta Expansível -->
                    <div class="flex-shrink-0 ml-4">
                        <svg id="seta-ministerios" class="w-5 h-5 text-gray-400 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
                
                <!-- Lista de Ministérios (Inicialmente Oculta) -->
                <div id="lista-ministerios" class="hidden border-t border-gray-200 dark:border-gray-700">
                    <div class="p-4">
                        <div class="max-h-64 overflow-y-auto space-y-2">
                            <!-- Será preenchido via JS -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Ministério Selecionado -->
            <div id="ministerio-selecionado-container">
                <!-- Será renderizado pela função renderizarMinisterioSelecionado -->
            </div>
        </div>
    `;
    
    content.innerHTML = html;
    
    // Definir evento selecionado automaticamente
    eventoSelecionado = evento;
    
    // Gerar lista de ministérios
    gerarListaMinisterios();
}

// Função para expandir/colapsar lista de ministérios
function toggleMinisterios() {
    const listaMinisterios = document.getElementById('lista-ministerios');
    const seta = document.getElementById('seta-ministerios');
    
    if (!listaMinisterios || !seta) return;
    
    if (listaMinisterios.classList.contains('hidden')) {
        listaMinisterios.classList.remove('hidden');
        seta.style.transform = 'rotate(180deg)';
    } else {
        listaMinisterios.classList.add('hidden');
        seta.style.transform = 'rotate(0deg)';
    }
}

// Função para gerar a lista compacta de ministérios
function gerarListaMinisterios() {
    const listaContainer = document.querySelector('#lista-ministerios .space-y-2');
    if (!listaContainer || !eventoSelecionado) return;
    
    const ministerios = eventoSelecionado.ministerios || [];
    
    if (ministerios.length === 0) {
        listaContainer.innerHTML = '<div class="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Nenhum ministério encontrado</div>';
        return;
    }
    
    let html = '';
    
    ministerios.forEach(ministerio => {
        const ministerioBase = ministeriosBaseData?.find(m => m.nome === ministerio.ministerio_nome);
        
        html += `
            <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                 onclick="selecionarMinisterio('${ministerio.ministerio_nome}')">
                
                <!-- Foto do Ministério -->
                <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700 mr-3">
                    ${ministerioBase?.foto ? 
                        `<img src="${window.APP_CONFIG.baseUrl}/${ministerioBase.foto}" alt="${ministerio.ministerio_nome}" class="w-full h-full object-cover">` :
                        `<div class="w-full h-full flex items-center justify-center text-white font-bold text-xs" style="background-color: ${ministerioBase?.cor || '#6B7280'}">
                            ${ministerio.ministerio_nome.charAt(0).toUpperCase()}
                        </div>`
                    }
                </div>
                
                <!-- Nome do Ministério -->
                <div class="flex-1 min-w-0">
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate block">
                        ${ministerio.ministerio_nome}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                        ${ministerio.total_voluntarios} voluntário(s)
                    </span>
                </div>
                
                <!-- Seta -->
                <div class="flex-shrink-0 ml-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </div>
        `;
    });
    
    listaContainer.innerHTML = html;
}

function selecionarMinisterio(ministerioNome) {
    renderizarMinisterioSelecionado(ministerioNome);
}

function renderizarMinisterioSelecionado(ministerioNome) {
    const container = document.getElementById('ministerio-selecionado-container');
    if (!container || !eventoSelecionado || !ministerioNome) {
        if (container) container.innerHTML = '';
        return;
    }
    
    const ministerio = eventoSelecionado.ministerios?.find(m => m.ministerio_nome === ministerioNome);
    if (!ministerio) {
        container.innerHTML = '';
        return;
    }
    
    const ministerioBase = ministeriosBaseData?.find(m => m.nome === ministerio.ministerio_nome);
    
    let html = `
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div class="flex items-center mb-6">
                <!-- Foto do Ministério -->
                <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700 mr-4 shadow-md">
                    ${ministerioBase?.foto ? 
                        `<img src="${window.APP_CONFIG.baseUrl}/${ministerioBase.foto}" alt="${ministerio.ministerio_nome}" class="w-full h-full object-cover">` :
                        `<div class="w-full h-full flex items-center justify-center text-white font-bold text-lg" style="background-color: ${ministerioBase?.cor || '#6B7280'}">
                            ${ministerio.ministerio_nome.charAt(0).toUpperCase()}
                        </div>`
                    }
                </div>
                
                <div class="flex-1">
                    <h4 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">${ministerio.ministerio_nome}</h4>
                    <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span class="flex items-center font-medium">
                            <svg class="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            ${ministerio.total_voluntarios} voluntário(s) escalado(s)
                        </span>
                        <span class="flex items-center font-medium">
                            <svg class="w-4 h-4 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z"></path>
                            </svg>
                            ${eventoSelecionado.evento_nome}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h5 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Voluntários Escalados</h5>
                <div class="space-y-3">
    `;
    
    if (ministerio.voluntarios && Array.isArray(ministerio.voluntarios) && ministerio.voluntarios.length > 0) {
        ministerio.voluntarios.forEach(voluntario => {
            const inicial = voluntario.nome?.trim()?.charAt(0)?.toUpperCase() || '?';
            html += `
                <div class="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span class="flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm shadow-md flex-shrink-0" 
                          style="background-color: ${ministerioBase?.cor || '#6B7280'}20; color: ${ministerioBase?.cor || '#6B7280'}">
                        ${inicial}
                    </span>
                    <div class="flex-1 min-w-0">
                        <span class="text-base font-medium text-gray-700 dark:text-gray-200 block">
                            ${voluntario.nome}
                        </span>
                    </div>
                </div>
            `;
        });
    } else {
        html += `
            <div class="col-span-full text-center py-8">
                <div class="text-gray-500 dark:text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <p class="text-sm">Nenhum voluntário escalado para este ministério</p>
                </div>
            </div>
        `;
    }
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Verificar se há parâmetro de data na URL ao carregar a página
function verificarParametroURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    
    if (dataParam) {
        const dataFormatada = new Date(dataParam).toLocaleDateString('pt-BR');
        abrirModalEscalas(dataParam, dataFormatada);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', verificarParametroURL);

// Fechar modal com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharModalEscalas();
    }
});

// Voltar/avançar do navegador
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.data) {
        const dataFormatada = new Date(e.state.data).toLocaleDateString('pt-BR');
        abrirModalEscalas(e.state.data, dataFormatada);
    } else {
        fecharModalEscalas();
    }
});
