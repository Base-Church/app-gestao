/**
 * Serviço para lidar exclusivamente com os componentes HTML de eventos
 */
class EventosComponentesService {
    criarSeletorEventos(eventos, seletorId) {
        return `
        <div id="${seletorId}">
            
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 transition-all duration-300">
                <div class="border-r border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto transition-all duration-300" id="lista-eventos-${seletorId}">
                    ${eventos.map(evento => this.criarItemListaEvento(evento)).join('')}
                </div>
                <div class="md:col-span-2 lg:col-span-3 p-0 transition-all duration-300" id="detalhes-evento-${seletorId}">
                    <div class="flex items-center justify-center h-full w-full">
                        <p class="text-gray-500">Selecione um evento para ver detalhes</p>
                    </div>
                </div>
            </div>
        </div>`;
    }

    criarItemListaEvento(evento) {
        const imagemPath = evento.foto 
            ? `${window.APP_CONFIG.baseUrl}/assets/img/eventos/${evento.foto}`
            : `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`;
        const horario = evento.hora ? evento.hora.substring(0, 5) : '';
        return `
        <div class="evento-item flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 transition-all duration-200" data-evento-id="${evento.id}">
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                <img src="${imagemPath}" alt="${evento.nome}" class="w-full h-full object-cover" onerror="this.src='${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg'">
            </div>
            <div class="ml-3 flex-1">
                <h4 class="text-sm font-medium text-gray-800 dark:text-white truncate">${evento.nome}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${horario} · <span class="capitalize">${evento.dia_semana || ''}</span>
                </p>
            </div>
        </div>`;
    }

    criarCardEventoDetalhado(evento, seletorId) {
        const imagemPath = evento.foto 
            ? `${window.APP_CONFIG.baseUrl}/assets/img/eventos/${evento.foto}`
            : `${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg`;
        const horario = evento.hora ? evento.hora.substring(0, 5) : '';

        // Mapeia dia da semana para número (0=domingo, 1=segunda, ..., 6=sábado)
        const diasSemana = {
            domingo: 0,
            segunda: 1,
            terca: 2,
            terça: 2,
            quarta: 3,
            quinta: 4,
            sexta: 5,
            sabado: 6,
            sábado: 6
        };
        const diaSemanaNum = diasSemana[(evento.dia_semana || '').toLowerCase()] ?? null;

        const inputData = diaSemanaNum !== null ? `
            <div class="flex flex-row flex-nowrap items-center gap-2 w-full justify-end"
             style="flex-wrap:nowrap; padding-left: 12px; padding-right: 12px;">
            <button type="button" class="btn-combinar-eventos px-2 py-1 bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 text-primary-700 dark:text-primary-200 rounded text-xs font-semibold flex-shrink-0" data-seletor-id="${seletorId}" data-evento-id="${evento.id}">
                Combinar
            </button>
            <button type="button" class="btn-trocar-evento px-2 py-1 bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 text-primary-700 dark:text-primary-200 rounded text-xs font-semibold ml-1 flex-shrink-0" data-seletor-id="${seletorId}" data-evento-id="${evento.id}">
                Trocar evento
            </button>
            <span class="mini-cards-eventos-combinados flex flex-row flex-nowrap items-center gap-1 ml-2 flex-shrink-0" data-seletor-id="${seletorId}" style="white-space:nowrap;overflow-x:auto;max-width:320px;"></span>
            <label class="block text-sm font-medium text-white dark:text-gray-100 ml-2 flex-shrink-0">Data:</label>
            <div class="relative flex-1 min-w-0" style="max-width:150px;">
                <input 
                type="text" 
                id="evento-data-input-${evento.id}-${seletorId}"
                class="evento-datepicker mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm font-medium"
                autocomplete="off"
                data-dia-semana="${diaSemanaNum}"
                placeholder="dd/mm/aaaa"
                >
            </div>
            <span class="text-sm text-white/60 dark:text-gray-300 ml-2 capitalize font-medium flex-shrink-0">(${evento.dia_semana})</span>
            </div>
        ` : '';



        return `
        <div class="evento-detalhado h-full w-full flex flex-col bg-white dark:bg-gray-800 shadow-md overflow-hidden">
            <div class="bg-gradient-to-r from-primary-600 to-primary-700 flex flex-row w-full">
                <div class="evento-detalhado-header flex flex-col gap-2 justify-center p-4"
                     style="flex: 0 0 35%; align-items:flex-start;">
                    <div class="flex items-center flex-shrink-0 min-w-0 w-full">
                        <div class="w-16 h-16 bg-white/20 rounded-full overflow-hidden flex-shrink-0">
                            <img src="${imagemPath}" alt="${evento.nome}" class="w-full h-full object-cover" onerror="this.src='${window.APP_CONFIG.baseUrl}/assets/img/placeholder.jpg'">
                        </div>
                        <div class="ml-4 flex-1 min-w-0">
                            <h3 class="text-xl font-bold text-white truncate">${evento.nome}</h3>
                            <div class="flex items-center text-white/80 text-sm">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                ${horario} · <span class="capitalize ml-1">${evento.dia_semana || ''}</span>
                                <span class="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">${evento.tipo || ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="evento-detalhado-config flex flex-col justify-center items-end p-4"
                     style="flex: 0 0 65%; align-items:flex-end;">
                    ${inputData}
                </div>
            </div>
        </div>`;
    }

    validarDataEvento(input, diaSemanaPermitido) {
        if (!input || !input.value) return;
        const data = new Date(input.value + 'T00:00:00');
        if (data.getDay() !== diaSemanaPermitido) {
            input.setCustomValidity('Selecione uma data que seja ' + this.nomeDiaSemana(diaSemanaPermitido));
            input.reportValidity();
            input.value = '';
        } else {
            input.setCustomValidity('');
        }
    }

    nomeDiaSemana(num) {
        // 0=domingo, 1=segunda, ..., 6=sábado
        return ['domingo','segunda','terça','quarta','quinta','sexta','sábado'][num] || '';
    }
}

window.eventosComponentesService = new EventosComponentesService();

// Configuração do idioma pt-BR para o datepicker
$.datepicker.regional['pt-BR'] = {
    closeText: 'Fechar',
    prevText: '&#x3C;Anterior',
    nextText: 'Próximo&#x3E;',
    currentText: 'Hoje',
    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
        'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun',
        'Jul','Ago','Set','Out','Nov','Dez'],
    dayNames: ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'],
    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
    dayNamesMin: ['D','S','T','Q','Q','S','S'],
    weekHeader: 'Sm',
    dateFrmat: 'dd/mm/yy',
    firstDay: 0,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
};
$.datepicker.setDefaults($.datepicker.regional['pt-BR']);

// Inicialização do datepicker para cada input de evento (apenas uma vez por campo)
$(document).on('focus', '.evento-datepicker', function() {
    if (!$(this).data('datepicker-inicializado')) {
        const diaSemana = parseInt($(this).data('dia-semana'));
        $(this).datepicker({
            dateFormat: 'dd/mm/yy',
            beforeShowDay: function(date) {
                if (date.getDay() === diaSemana) {
                    return [true, "ui-state-highlight", "Dia do evento"];
                }
                return [true, "", ""];
            },
            firstDay: 0 // domingo
        });
        $(this).data('datepicker-inicializado', true);
    }
});

// Adicione o evento do botão "Trocar evento" para exibir a lista lateral novamente
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.btn-trocar-evento');
    if (btn) {
        const seletorId = btn.dataset.seletorId;
        // Exibe a lista lateral de eventos novamente
        const listaEventos = document.getElementById(`lista-eventos-${seletorId}`);
        const detalhesContainer = document.getElementById(`detalhes-evento-${seletorId}`);
        if (listaEventos && detalhesContainer) {
            listaEventos.style.display = '';
            detalhesContainer.classList.remove('col-span-full', 'p-2');
            detalhesContainer.classList.add('md:col-span-2', 'lg:col-span-3', 'p-0');
        }
    }
});
