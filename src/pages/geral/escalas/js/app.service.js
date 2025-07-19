
const loading = document.getElementById('relatorio-loading');
const erro = document.getElementById('relatorio-erro');
const relatorioDiv = document.getElementById('relatorio-geral');

function animateNumber(element, finalValue, duration = 1500, suffix = '') {
    if (!element) return;
    const startValue = 0;
    const startTime = Date.now();
    function updateNumber() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(startValue + (finalValue - startValue) * easeOutQuart);
        element.textContent = currentValue + suffix;
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    updateNumber();
}



let ministeriosData = [];
let eventosData = [];

function obterNomeDiaSemana(data) {
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return diasSemana[new Date(data).getDay()];
}

function obterMinisteriosDoEvento(evento) {
    if (!evento.ministerios || !Array.isArray(evento.ministerios)) return [];
    
    return evento.ministerios.map(min => {
        const ministerioInfo = ministeriosData.find(m => m.nome === min.ministerio_nome);
        return {
            ...min,
            foto: ministerioInfo?.foto || null,
            cor: ministerioInfo?.cor || '#6B7280'
        };
    });
}

function renderEventos(eventos) {
    if (!Array.isArray(eventos) || eventos.length === 0) {
        relatorioDiv.innerHTML += `<div class="text-center text-gray-500 dark:text-gray-400">Nenhum evento encontrado para o mês.</div>`;
        return;
    }
    // Filtrar eventos para mostrar apenas os de hoje ou próximos
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    eventos = eventos.filter(ev => {
        const dataEv = new Date(ev.data_evento);
        dataEv.setHours(0,0,0,0);
        return dataEv >= hoje;
    });
    if (eventos.length === 0) {
        relatorioDiv.innerHTML += `<div class="text-center text-gray-500 dark:text-gray-400">Nenhum evento futuro encontrado.</div>`;
        return;
    }
    
    // Agrupar eventos por data
    const eventosPorData = {};
    eventos.forEach(evento => {
        const dataObj = new Date(evento.data_evento);
        const dataStr = dataObj.toLocaleDateString('pt-BR');
        if (!eventosPorData[dataStr]) {
            eventosPorData[dataStr] = {
                data: dataStr,
                dataObj: dataObj,
                diaSemana: obterNomeDiaSemana(evento.data_evento),
                eventos: []
            };
        }
        eventosPorData[dataStr].eventos.push(evento);
    });
    
    // Ordenar datas
    const datasOrdenadas = Object.keys(eventosPorData).sort((a, b) => {
        return eventosPorData[a].dataObj - eventosPorData[b].dataObj;
    });
    
    let html = `<section>
        <div class="mb-6">
            <a href="/geral" class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                Voltar para Geral
            </a>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Próximos Eventos</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">`;
    
    datasOrdenadas.forEach(dataStr => {
        const dadosData = eventosPorData[dataStr];
        const eventosNaData = dadosData.eventos;
        const totalVoluntarios = eventosNaData.reduce((total, evento) => total + evento.total_voluntarios, 0);
        const eventosNomes = eventosNaData.map(e => e.evento_nome).join(', ');
        const dataIso = eventosNaData[0].data_evento;
        
        // Coletar todos os ministérios únicos da data
        const ministeriosUnicos = new Map();
        eventosNaData.forEach(evento => {
            const ministeriosEvento = obterMinisteriosDoEvento(evento);
            ministeriosEvento.forEach(min => {
                if (!ministeriosUnicos.has(min.ministerio_nome)) {
                    ministeriosUnicos.set(min.ministerio_nome, min);
                }
            });
        });
        
        const ministeriosArray = Array.from(ministeriosUnicos.values());
        const ministeriosParaMostrar = ministeriosArray.slice(0, 3);
        const ministeriosRestantes = ministeriosArray.length - 3;
        
        html += `
        <div class="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-primary-300 dark:hover:border-primary-600 hover:-translate-y-1" 
             onclick="abrirModalEscalas('${dataIso}', '${dadosData.data}')">
            
            <!-- Header do Card -->
            <div class="text-center mb-6">
                <div class="text-xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    ${dadosData.diaSemana}
                </div>
                <div class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    ${dadosData.data}
                </div>
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate px-2 min-h-[2.5rem] flex items-center justify-center">
                    ${eventosNomes}
                </h3>
            </div>
            
            <!-- Ministérios -->
            <div class="flex justify-center items-center mb-6">
                <div class="flex items-center space-x-2">
                    ${ministeriosParaMostrar.map(min => `
                        <div class="relative group/ministerio">
                            <div class="w-12 h-12 rounded-full border-2 border-white dark:border-gray-800 shadow-lg overflow-hidden" 
                                 style="background-color: ${min.cor}20">
                                ${min.foto ? 
                                    `<img src="${window.APP_CONFIG.baseUrl}/${min.foto}" alt="${min.ministerio_nome}" class="w-full h-full object-cover">` :
                                    `<div class="w-full h-full flex items-center justify-center text-white font-bold text-sm" style="background-color: ${min.cor}">
                                        ${min.ministerio_nome.charAt(0).toUpperCase()}
                                    </div>`
                                }
                            </div>
                            <!-- Tooltip -->
                            <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/ministerio:opacity-100 transition-opacity whitespace-nowrap z-10">
                                ${min.ministerio_nome}
                            </div>
                        </div>
                    `).join('')}
                    
                    ${ministeriosRestantes > 0 ? `
                        <div class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                            <span class="text-sm font-bold text-gray-600 dark:text-gray-300">+${ministeriosRestantes}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="text-center">
                    <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        ${totalVoluntarios}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Voluntários
                    </div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${eventosNaData.length}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Evento${eventosNaData.length > 1 ? 's' : ''}
                    </div>
                </div>
            </div>
            
            <!-- Call to Action -->
            <div class="text-center">
                <div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    Ver Escalas
                </div>
            </div>
        </div>`;
    });
    
    html += `</div></section>`;
    relatorioDiv.innerHTML += html;
}

async function renderRelatorio() {
    try {
        if (document.readyState !== 'complete') {
            await new Promise(resolve => window.addEventListener('load', resolve));
        }
        const organizacao_id = window.USER?.organizacao_id;
        if (!organizacao_id) throw new Error('Organização não encontrada');
        
        // Carregar dados dos eventos, ministérios e eventos base em paralelo
        const [resultEventos, resultMinisterios, resultEventosBase] = await Promise.all([
            getRelatorioGeral(organizacao_id),
            getMinisterios(organizacao_id),
            getEventos(organizacao_id)
        ]);
        
        if (!resultEventos?.data) throw new Error('Dados dos eventos não encontrados');
        if (!resultMinisterios?.data) throw new Error('Dados dos ministérios não encontrados');
        if (!resultEventosBase?.data) throw new Error('Dados dos eventos base não encontrados');
        
        // Armazenar dados globalmente para uso nas funções de renderização
        ministeriosData = resultMinisterios.data;
        eventosData = resultEventosBase.data;
        
        const d = resultEventos.data;
        
        // Definir eventos originais para o modal
        if (typeof setEventosOriginais === 'function') {
            setEventosOriginais(d.eventos);
        }
        if (typeof setEventosData === 'function') {
            setEventosData(eventosData);
        }
        if (typeof setMinisteriosData === 'function') {
            setMinisteriosData(ministeriosData);
        }
        
        renderEventos(d.eventos);
        
        loading.classList.add('hidden');
        erro.classList.add('hidden');
        relatorioDiv.classList.remove('hidden');
    } catch (e) {
        loading.classList.add('hidden');
        erro.classList.remove('hidden');
        relatorioDiv.classList.add('hidden');
        const erroElement = document.querySelector('#relatorio-erro span');
        if (erroElement) erroElement.textContent = `Erro ao carregar relatório: ${e.message}`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    renderRelatorio();
});
