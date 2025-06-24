// main.js para calendário customizado com grid manual de dias, controle total de semana/mês

window.addEventListener('DOMContentLoaded', async () => {
    const baseUrl = (window.APP_CONFIG && window.APP_CONFIG.baseUrl) || window.BASE_URL || '';
    const eventos = await window.apiV2Service.buscarEventos();
    
    // Array para armazenar eventos colocados no calendário (instâncias independentes)
    let eventosCalendario = [];
    let nextEventInstanceId = 1;
    
    renderDraggableEventos(eventos, baseUrl);

    let currentView = 'month'; // 'month' ou 'week'
    let currentWeek = 0;
    const calendarEl = document.getElementById('fullcalendar');
    const weekButtonsEl = document.getElementById('week-buttons');
    const btnToggle = document.getElementById('btn-toggle-view');
    const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    function getWeeksInMonth(year, month) {
        const weeks = [];
        let date = new Date(year, month, 1);
        let week = [];
        while (date.getMonth() === month) {
            week.push(new Date(date));
            if (date.getDay() === 6) {
                weeks.push(week);
                week = [];
            }
            date.setDate(date.getDate() + 1);
        }
        if (week.length) weeks.push(week);
        return weeks;
    }

    function renderCalendar() {
        calendarEl.innerHTML = '';
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        let weeks = getWeeksInMonth(year, month);
        let daysToShow = [];
        if (currentView === 'month') {
            daysToShow = Array.from({length: new Date(year, month + 1, 0).getDate()}, (_, i) => new Date(year, month, i + 1));
        } else {
            daysToShow = weeks[currentWeek] || weeks[0] || [];
        }
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-7 gap-1 h-full';
        // Cabeçalho dos dias da semana
        const diasSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
        diasSemana.forEach(dia => {
            const th = document.createElement('div');
            th.className = 'text-xs font-bold text-center py-1 text-primary-700 dark:text-primary-300';
            th.textContent = dia;
            grid.appendChild(th);
        });
        // Preencher grid
        let firstDay = daysToShow[0] ? daysToShow[0].getDay() : 0;
        if (currentView === 'month') {
            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                grid.appendChild(empty);
            }
        }
        daysToShow.forEach(date => {
            const dayCell = document.createElement('div');
            dayCell.className = 'fc-daygrid-day bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[100px] flex flex-col p-1 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900 transition relative';
            dayCell.setAttribute('data-date', date.toISOString().slice(0,10));
            const dayNum = document.createElement('div');
            dayNum.className = 'text-xs font-bold mb-1 text-gray-900 dark:text-gray-100 flex-shrink-0';
            dayNum.textContent = date.getDate();
            dayCell.appendChild(dayNum);
            
            // Container para eventos do dia com rolagem e fade
            const eventosContainer = document.createElement('div');
            eventosContainer.className = 'flex flex-col gap-1 flex-1 overflow-y-auto overflow-x-hidden max-h-full w-full relative';
            eventosContainer.style.cssText = `
                scrollbar-width: thin;
                scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
                mask: linear-gradient(to bottom, black calc(100% - 20px), transparent 100%);
                -webkit-mask: linear-gradient(to bottom, black calc(100% - 20px), transparent 100%);
                max-width: 100%;
                box-sizing: border-box;
            `;
            
            // Renderizar eventos do dia
            renderEventosNoDia(eventosContainer, date.toISOString().slice(0,10));
            
            dayCell.appendChild(eventosContainer);
            
            // Event listeners para o dia
            setupDayEventListeners(dayCell);
            
            grid.appendChild(dayCell);
        });
        calendarEl.appendChild(grid);
        updateCalendarTitle(year, month);
        
        // Configurar drag and drop apenas uma vez após renderizar
        setTimeout(setupDragAndDrop, 50);
    }

    function renderEventosNoDia(container, dateStr) {
        container.innerHTML = '';
        eventosCalendario.filter(ev => ev.data === dateStr).forEach(ev => {
            const evDiv = document.createElement('div');
            evDiv.className = 'relative flex-shrink-0 w-full max-w-full overflow-hidden';
            evDiv.innerHTML = renderEventoCardHtml(ev, true);
            
            // Adicionar botão de remoção
            const removeBtn = document.createElement('button');
            removeBtn.className = 'absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors z-10';
            removeBtn.innerHTML = '×';
            removeBtn.setAttribute('title', 'Remover evento');
            removeBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                removeEventoDoCalendario(ev.instanceId);
            };
            evDiv.appendChild(removeBtn);
            container.appendChild(evDiv);
        });
    }

    function removeEventoDoCalendario(instanceId) {
        eventosCalendario = eventosCalendario.filter(item => item.instanceId !== instanceId);
        // Apenas re-renderizar os eventos, não o calendário inteiro
        document.querySelectorAll('.fc-daygrid-day').forEach(dayCell => {
            const dateStr = dayCell.getAttribute('data-date');
            const eventosContainer = dayCell.querySelector('.flex.flex-col.gap-1.flex-1');
            if (eventosContainer) {
                renderEventosNoDia(eventosContainer, dateStr);
            }
        });
    }

    function setupDayEventListeners(dayCell) {
        dayCell.addEventListener('click', function() {
            document.querySelectorAll('.fc-daygrid-day').forEach(el => el.classList.remove('ring', 'ring-primary-500'));
            dayCell.classList.add('ring', 'ring-primary-500');
        });
        
        // Drag and drop listeners para este dia
        dayCell.addEventListener('dragover', function(e) {
            e.preventDefault();
            dayCell.classList.add('ring', 'ring-primary-500', 'bg-primary-50', 'dark:bg-primary-900');
        });
        
        dayCell.addEventListener('dragleave', function(e) {
            // Verificar se realmente saiu do elemento
            if (!dayCell.contains(e.relatedTarget)) {
                dayCell.classList.remove('ring', 'ring-primary-500', 'bg-primary-50', 'dark:bg-primary-900');
            }
        });
        
        dayCell.addEventListener('drop', function(e) {
            e.preventDefault();
            dayCell.classList.remove('ring', 'ring-primary-500', 'bg-primary-50', 'dark:bg-primary-900');
            
            const eventId = e.dataTransfer.getData('text/plain');
            if (!eventId) return;
            
            const ev = eventos.find(ev => String(ev.id) === eventId);
            if (!ev) return;
            
            // Criar nova instância do evento para o calendário
            const novaInstancia = {
                ...ev,
                instanceId: nextEventInstanceId++,
                data: dayCell.getAttribute('data-date')
            };
            
            // Adicionar ao array de eventos do calendário
            eventosCalendario.push(novaInstancia);
            
            // Apenas re-renderizar os eventos deste dia específico
            const eventosContainer = dayCell.querySelector('.flex.flex-col.gap-1.flex-1');
            if (eventosContainer) {
                renderEventosNoDia(eventosContainer, dayCell.getAttribute('data-date'));
            }
        });
    }

    function setupDragAndDrop() {
        // Configurar apenas os itens draggable da lista lateral
        document.querySelectorAll('.evento-draggable-item').forEach(item => {
            if (item.hasAttribute('data-drag-setup')) return; // Evitar duplicação
            
            item.setAttribute('draggable', 'true');
            item.setAttribute('data-drag-setup', 'true');
            
            item.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', item.dataset.eventId);
                e.dataTransfer.effectAllowed = 'copy';
                item.style.opacity = '0.5';
            });
            
            item.addEventListener('dragend', function(e) {
                item.style.opacity = '1';
            });
        });
    }

    function renderWeekButtons() {
        weekButtonsEl.innerHTML = '';
        if (currentView === 'week') {
            const now = new Date();
            const weeks = getWeeksInMonth(now.getFullYear(), now.getMonth());
            weeks.forEach((week, i) => {
                const btn = document.createElement('button');
                const isActive = i === currentWeek;
                btn.className = `px-3 py-1 rounded text-xs font-semibold transition-all ${
                    isActive 
                    ? 'bg-primary-600 text-white ring-2 ring-primary-400' 
                    : 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200 hover:bg-primary-200 dark:hover:bg-primary-800'
                }`;
                btn.textContent = `${i+1}ª semana`;
                btn.addEventListener('click', () => {
                    currentWeek = i;
                    renderAll();
                });
                weekButtonsEl.appendChild(btn);
            });
        }
    }

    // Chamar após cada renderização
    function renderAll() {
        renderCalendar();
        renderWeekButtons();
    }

    btnToggle.addEventListener('click', function() {
        if (currentView === 'month') {
            currentView = 'week';
            currentWeek = 0; // Reset para primeira semana
            btnToggle.textContent = 'Visualizar por Mês';
        } else {
            currentView = 'month';
            btnToggle.textContent = 'Visualizar por Semana';
        }
        renderAll();
    });

    // Inicialização
    renderAll();

    function updateCalendarTitle(year, month) {
        document.getElementById('calendar-title').textContent = meses[month] + ' ' + year;
    }
});

function renderDraggableEventos(eventos, baseUrl) {
    const container = document.getElementById('eventos-draggable-list');
    container.innerHTML = '';
    if (!eventos.length) {
        container.innerHTML = '<div class="text-gray-400">Nenhum evento encontrado.</div>';
        return;
    }
    eventos.forEach(ev => {
        const item = document.createElement('div');
        item.className = 'evento-draggable-item flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow p-2 border border-gray-200 dark:border-gray-700 mb-2 cursor-move hover:bg-primary-50 dark:hover:bg-primary-900 transition select-none';
        item.dataset.eventId = ev.id;
        item.innerHTML = renderEventoCardHtml(ev, false);
        container.appendChild(item);
    });
}

function getNextDateForWeekday(weekday, hora = '10:00:00') {
    const dias = ['domingo','segunda','terca','quarta','quinta','sexta','sabado'];
    const hoje = new Date();
    let diaSemana = dias.indexOf((weekday || '').toLowerCase());
    if (diaSemana === -1) diaSemana = 0;
    let data = new Date(hoje);
    data.setDate(hoje.getDate() + ((7 + diaSemana - hoje.getDay()) % 7));
    if (hora) {
        const [h, m, s] = hora.split(':');
        data.setHours(Number(h), Number(m), Number(s || 0));
    }
    return data.toISOString().slice(0,19);
}

function renderEventoCardHtml(ev, isCalendar = false) {
    const turno = getTurno(ev.hora);
    
    // Card para o calendário: design vertical compacto mas legível
    if (isCalendar) {
        let avatarHtml = '';
        if (ev.foto) {
            const baseUrl = (window.APP_CONFIG && window.APP_CONFIG.baseUrl) || window.BASE_URL || '';
            const imgUrl = `${baseUrl}/assets/img/eventos/${ev.foto}`;
            avatarHtml = `<img src="${imgUrl}" alt="${ev.nome}" class="w-6 h-6 object-cover rounded border border-white/20" onerror="this.style.display='none'">`;
        } else {
            const letra = (ev.nome || 'E').charAt(0).toUpperCase();
            avatarHtml = `<div class="w-6 h-6 flex items-center justify-center rounded bg-white/20 text-white font-bold text-xs">${letra}</div>`;
        }
        
        return `
        <div class="w-full bg-primary-600 dark:bg-primary-700 rounded-md text-white p-2 space-y-1 shadow-sm">
            <div class="flex items-center justify-between gap-2">
                ${avatarHtml}
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-semibold truncate">${ev.nome}</div>
                </div>
            </div>
            <div class="flex items-center justify-between text-xs">
                <span class="text-primary-100">${ev.hora ? ev.hora.slice(0,5) : '--:--'}</span>
                <span class="bg-white/20 px-1.5 py-0.5 rounded text-xs font-medium">${turno}</span>
            </div>
        </div>
        `;
    } else {
        // Card da lista lateral
        return `
        <div class="flex items-center gap-2 min-w-0">
            <div class="w-8 h-8 flex items-center justify-center rounded-full bg-primary-600 text-white font-bold text-base">${(ev.nome || 'E').charAt(0).toUpperCase()}</div>
            <div class="flex-1 min-w-0">
                <div class="font-bold text-primary-700 dark:text-primary-200 text-xs truncate">${ev.nome}</div>
                <div class="text-xs text-gray-500 dark:text-gray-300 flex items-center gap-1">
                    <span>${ev.hora ? ev.hora.slice(0,5) : '--:--'}</span>
                    <span class="ml-1 px-1 rounded bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 text-[10px] font-semibold">${turno}</span>
                </div>
            </div>
        </div>
        `;
    }
}

function getTurno(hora) {
    if (!hora) return 'Indefinido';
    const h = parseInt(hora.split(':')[0], 10);
    if (h < 12) return 'Manhã';
    if (h < 18) return 'Tarde';
    return 'Noite';
} 