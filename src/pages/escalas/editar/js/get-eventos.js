let loadingEvents = false;

async function carregarEventos(eventoContainer) {
    if (loadingEvents) return;
    
    const notification = window.notificationManager.show();
    
    try {
        const params = new URLSearchParams();
        params.append('organizacao_id', window.USER.organizacao_id);
        params.append('page', '1');
        params.append('limit', '100');

        const apiUrl = `${window.APP_CONFIG.baseUrl}/src/services/api/eventos/get.php?${params}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const loadingDiv = eventoContainer.querySelector('#loading-eventos');
        const eventosLista = eventoContainer.querySelector('#eventos-lista');
        const floatingSelection = eventoContainer.querySelector('.floating-selection');
        const searchInput = eventoContainer.querySelector('#evento-search-input');
        
        if (loadingDiv) {
            loadingDiv.classList.remove('hidden');
        }
        
        loadingEvents = true;
        
        if (data.code === 200 && data.data.length > 0) {
            notification.finish(true);
            if (eventosLista) {
                window.todosEventos = data.data;
                
                renderizarEventos(data.data, eventosLista, eventoContainer);
                
                if (searchInput && !searchInput.hasEventListener) {
                    searchInput.addEventListener('input', () => filtrarEventos(eventoContainer));
                    searchInput.hasEventListener = true;
                }
                
                if (floatingSelection) {
                    floatingSelection.classList.remove('hidden');
                }
            }
        } else {
            notification.finish(true);
            if (eventosLista) {
                eventosLista.innerHTML = '<p class="text-center text-gray-500">Nenhum evento encontrado</p>';
            }
        }
    } catch (error) {
        notification.finish(false);
        const eventosLista = eventoContainer.querySelector('#eventos-lista');
        if (eventosLista) {
            eventosLista.innerHTML = `<p class="text-center text-red-500">Erro ao carregar eventos: ${error.message}</p>`;
        }
    } finally {
        loadingEvents = false;
        const loadingDiv = eventoContainer.querySelector('#loading-eventos');
        if (loadingDiv) {
            loadingDiv.classList.add('hidden');
        }
    }
}

function getTurno(hora) {
    const horaNumerica = parseInt(hora.split(':')[0]);
    
    if (horaNumerica >= 0 && horaNumerica < 6) return 'Madrugada';
    if (horaNumerica >= 6 && horaNumerica < 12) return 'Manhã';
    if (horaNumerica >= 12 && horaNumerica < 18) return 'Tarde';
    return 'Noite';
}

function formatarHora(hora) {
    return hora.split(':').slice(0, 2).join(':');
}

function renderizarEventos(eventos, eventosLista, eventoContainer) {
    eventosLista.innerHTML = ''; // Limpar lista anterior
    
    eventos.forEach(evento => {
        const fotoPath = evento.foto 
            ? `${window.APP_CONFIG.baseUrl}/assets/img/eventos/${evento.foto}` 
            : `${window.APP_CONFIG.baseUrl}/assets/img/eventos/placeholder.jpg`;
        
        const turno = getTurno(evento.hora);
        
        const eventoDiv = document.createElement('div');
        eventoDiv.classList.add(
            'bg-white', 'dark:bg-gray-700', 
            'shadow', 'rounded-lg', 'p-3', 'mb-2', 
            'hover:bg-gray-100', 'dark:hover:bg-gray-600',
            'cursor-pointer', 'transition-colors', 'duration-300',
            'flex', 'items-center', 'space-x-3'
        );
        
        eventoDiv.innerHTML = `
            <div class="flex items-center space-x-3 w-full">
                <img src="${fotoPath}" alt="${evento.nome}" class="w-12 h-12 rounded-full object-cover">
                <div class="flex-1">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">${evento.nome}</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-300">
                        ${evento.dia_semana} - ${formatarHora(evento.hora)}
                        <span class="text-xs font-medium text-primary-600 dark:text-primary-400 ml-1">${turno}</span>
                    </p>
                </div>
            </div>
        `;
        
        eventoDiv.addEventListener('click', () => selecionarEvento(evento.id, evento.nome, evento.foto, eventoContainer, turno));
        eventosLista.appendChild(eventoDiv);
    });
}

function filtrarEventos(eventoContainer) {
    const searchInput = eventoContainer.querySelector('#evento-search-input');
    const eventosLista = eventoContainer.querySelector('#eventos-lista');
    
    if (!searchInput || !eventosLista || !window.todosEventos) return;
    
    const termoBusca = searchInput.value.toLowerCase().trim();
    
    const eventosFiltrados = window.todosEventos.filter(evento => 
        evento.nome.toLowerCase().includes(termoBusca) ||
        evento.dia_semana.toLowerCase().includes(termoBusca) ||
        evento.hora.toLowerCase().includes(termoBusca)
    );
    
    if (eventosFiltrados.length > 0) {
        renderizarEventos(eventosFiltrados, eventosLista, eventoContainer);
    } else {
        eventosLista.innerHTML = '<p class="text-center text-gray-500">Nenhum evento encontrado</p>';
    }
}

function selecionarEvento(id, nome, foto, eventoContainer) {
    console.log('Selecionando evento:', { id, nome, eventoContainer });
    
    const seletor = eventoContainer.querySelector('.evento-selector .cursor-pointer');
    if (seletor) {
        const evento = window.todosEventos.find(e => e.id === id);
        const turno = getTurno(evento.hora);
        const fotoPath = foto 
            ? `${window.APP_CONFIG.baseUrl}/assets/img/eventos/${foto}` 
            : `${window.APP_CONFIG.baseUrl}/assets/img/eventos/placeholder.jpg`;
        
        // Modificação na estrutura do HTML para manter os inputs fora da div aninhada
        seletor.innerHTML = `
            <input type="hidden" name="evento_id[]" value="${id}" class="evento-id-input">
            <input type="hidden" name="evento_nome[]" value="${nome}">
            <input type="hidden" name="evento_hora[]" value="${evento.hora}">
            <input type="hidden" name="evento_dia[]" value="${evento.dia_semana}">
            <div class="flex items-center space-x-3">
                <img src="${fotoPath}" class="w-12 h-12 rounded-full object-cover">
                <div>
                    <span class="text-gray-900 dark:text-white">${nome}</span>
                    <p class="text-xs text-gray-500">
                        ${evento.dia_semana} - ${formatarHora(evento.hora)}
                        <span class="text-xs font-medium text-primary-600 dark:text-primary-400 ml-1">${turno}</span>
                    </p>
                </div>
            </div>
        `;

        // Verificar se o input foi criado corretamente
        console.log('Input do evento criado:', {
            eventoId: id,
            input: seletor.querySelector('input[name="evento_id[]"]')?.value
        });

        const floatingSelection = eventoContainer.querySelector('.evento-selector .floating-selection');
        if (floatingSelection) {
            floatingSelection.classList.add('hidden');
        }
        
        // Disparar evento para atualizar o resumo
        seletor.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const eventoSelectors = document.querySelectorAll('.evento-selector .cursor-pointer');
    
    eventoSelectors.forEach((selector, index) => {
        selector.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            const eventoContainer = selector.closest('.dynamic-field');
            const floatingSelection = selector.nextElementSibling;
            
            if (floatingSelection && floatingSelection.classList.contains('floating-selection')) {
                floatingSelection.classList.toggle('hidden');
                
                if (!floatingSelection.classList.contains('hidden')) {
                    carregarEventos(eventoContainer);
                }
            }
        });
    });
});
