class Calendar extends CalendarBase {
    constructor() {
        super();
        
        this.monthRenderer = new MonthRenderer(this);
        this.weekRenderer = new WeekRenderer(this);
        this.eventManager = new EventManager(this);
        
        this.init();
    }

    renderCalendarGrid() {
        this.monthRenderer.renderCalendarGrid();
    }

    renderWeekView() {
        this.weekRenderer.renderWeekView();
    }

    refreshWeekEvents() {
        if (this.currentView === 'week') {
            this.weekRenderer.refreshWeekEvents();
        }
    }

    // Método para forçar atualização da vista atual
    forceRefresh() {
        if (this.currentView === 'week') {
            this.refreshWeekEvents();
        } else {
            this.renderCalendarGrid();
        }
    }

    renderEventosNoDia(container, dateStr) {
        this.eventManager.renderEventosNoDia(container, dateStr);
    }

    createEventoCardCalendar(evento) {
        return this.eventManager.createEventoCard(evento);
    }

    adicionarEventoAoCalendario(evento, dateStr) {
        const result = this.eventManager.adicionarEventoAoCalendario(evento, dateStr);
        
        // Garantir que a vista seja atualizada após adicionar
        if (result && this.currentView === 'week') {
            setTimeout(() => {
                this.refreshWeekEvents();
            }, 10);
        }
        
        return result;
    }

    removerEventoDoCalendario(eventoId, dateStr) {
        const result = this.eventManager.removerEventoDoCalendario(eventoId, dateStr);
        
        // Garantir que a vista seja atualizada após remover
        if (result && this.currentView === 'week') {
            setTimeout(() => {
                this.refreshWeekEvents();
            }, 10);
        }
        
        return result;
    }

    carregarEventosAgendados(eventos) {
        // Este método agora é populado via API, mas pode ser mantido para compatibilidade
        // this.eventManager.carregarEventosAgendados(eventos);
    }
}

window.Calendar = Calendar;
