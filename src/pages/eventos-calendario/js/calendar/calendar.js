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

    renderEventosNoDia(container, dateStr) {
        this.eventManager.renderEventosNoDia(container, dateStr);
    }

    createEventoCardCalendar(evento) {
        return this.eventManager.createEventoCard(evento);
    }

    adicionarEventoAoCalendario(evento, dateStr) {
        return this.eventManager.adicionarEventoAoCalendario(evento, dateStr);
    }

    removerEventoDoCalendario(eventoId, dateStr) {
        return this.eventManager.removerEventoDoCalendario(eventoId, dateStr);
    }

    carregarEventosAgendados(eventos) {
        this.eventManager.carregarEventosAgendados(eventos);
    }
}

window.Calendar = Calendar;
