class WeekRenderer {
    constructor(calendar) {
        this.calendar = calendar;
    }

    renderWeekView() {
        const weekContainer = document.getElementById('week-days');
        if (!weekContainer) return;
        
        weekContainer.innerHTML = '';

        for (let i = 0; i < 7; i++) {
            const date = new Date(this.calendar.currentWeekStart);
            date.setDate(date.getDate() + i);
            
            const dayColumn = this.createWeekDayColumn(date);
            weekContainer.appendChild(dayColumn);
        }
        
        // Renderizar eventos imediatamente após criação das colunas
        this.refreshWeekEvents();
    }

    refreshWeekEvents() {
        console.log('refreshWeekEvents chamado - re-renderizando todos os eventos da semana');
        for (let i = 0; i < 7; i++) {
            const date = new Date(this.calendar.currentWeekStart);
            date.setDate(date.getDate() + i);
            const dateStr = this.calendar.formatDateKey(date);
            
            const eventsContainer = document.querySelector(`.drop-zone[data-date="${dateStr}"]`);
            if (eventsContainer) {
                console.log(`Re-renderizando eventos para ${dateStr}`);
                // Limpar container antes de re-renderizar
                eventsContainer.innerHTML = '';
                this.calendar.eventManager.renderEventosNoDia(eventsContainer, dateStr);
            } else {
                console.log(`Drop zone não encontrada para ${dateStr}`);
            }
        }
        
        // Atualizar drag-drop após re-renderização
        if (window.app && window.app.dragDrop) {
            window.app.dragDrop.updateDropZones();
        }
    }

    createWeekDayColumn(date) {
        const column = document.createElement('div');
        const dateStr = this.calendar.formatDateKey(date);
        const isToday = this.calendar.isToday(date);

        column.className = `
            flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
            min-h-[500px] flex flex-col shadow-sm
            ${isToday ? 'ring-2 ring-primary-500' : ''}
        `.trim();

        const header = document.createElement('div');
        header.className = `
            p-3 border-b border-gray-200 dark:border-gray-700 text-center
            ${isToday ? 'bg-primary-600 text-white' : 'bg-gray-50 dark:bg-gray-700'}
        `.trim();

        const dayName = document.createElement('div');
        dayName.className = `text-sm font-semibold ${isToday ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`;
        dayName.textContent = this.calendar.dayNamesShort[date.getDay()];

        const dayNumber = document.createElement('div');
        dayNumber.className = `text-lg font-bold ${isToday ? 'text-white' : 'text-gray-900 dark:text-white'}`;
        dayNumber.textContent = date.getDate();

        header.appendChild(dayName);
        header.appendChild(dayNumber);

        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'flex-1 p-2 space-y-2 drop-zone overflow-y-auto';
        eventsContainer.dataset.date = dateStr;

        this.calendar.eventManager.renderEventosNoDia(eventsContainer, dateStr);

        column.appendChild(header);
        column.appendChild(eventsContainer);

        return column;
    }
}

window.WeekRenderer = WeekRenderer;
