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

    // Método para forçar atualização da vista atual
    forceRefresh() {
        if (this.currentView === 'week') {
            this.renderWeekView();
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
        return result;
    }

    removerEventoDoCalendario(eventoId, dateStr) {
        const result = this.eventManager.removerEventoDoCalendario(eventoId, dateStr);
        return result;
    }

    carregarEventosAgendados(eventos) {
        // Este método agora é populado via API, mas pode ser mantido para compatibilidade
        // this.eventManager.carregarEventosAgendados(eventos);
    }
}

window.Calendar = Calendar;
