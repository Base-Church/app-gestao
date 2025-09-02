class CalendarBase {
    constructor() {
        this.currentDate = new Date();
        this.currentView = 'month';
        this.currentWeekStart = null;
        this.eventosAgendados = new Map();
        
        this.monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        this.dayNamesShort = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
            this.loadMonthData();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
            this.loadMonthData();
        });

        document.getElementById('btn-hoje').addEventListener('click', () => {
            this.currentDate = new Date();
            if (this.currentView === 'week') {
                this.currentWeekStart = this.getWeekStart(this.currentDate);
            }
            this.render();
        });

        document.getElementById('view-month').addEventListener('click', () => {
            this.switchToMonthView();
        });

        document.getElementById('view-week').addEventListener('click', () => {
            this.switchToWeekView();
        });

        const prevWeek = document.getElementById('prev-week');
        const nextWeek = document.getElementById('next-week');
        
        if (prevWeek) {
            prevWeek.addEventListener('click', () => {
                if (this.currentView === 'week') {
                    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
                }
                this.render();
            });
        }

        if (nextWeek) {
            nextWeek.addEventListener('click', () => {
                this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
                this.render();
                this.loadMonthData();
            });
        }
    }

    async loadMonthData() {
        const mes = this.formatDateKey(this.currentDate).substring(0, 7);
        const organizacaoId = window.app.getOrganizacaoId();
        const eventosAgendados = await window.app.api.getEventosAgendados(mes, organizacaoId);

        const eventosMap = new Map();
        if (eventosAgendados && eventosAgendados.data) {
            for (const [dateStr, eventoIds] of Object.entries(eventosAgendados.data)) {
                const eventosDoDia = eventoIds.map(id => window.app.getEventoById(id)).filter(Boolean);
                eventosMap.set(dateStr, eventosDoDia);
            }
        }
        this.eventosAgendados = eventosMap;
        this.render();
    }

    switchToMonthView() {
        this.currentView = 'month';
        document.getElementById('view-month').classList.add('active');
        document.getElementById('view-week').classList.remove('active');
        document.getElementById('calendar-month-view').classList.remove('hidden');
        document.getElementById('calendar-week-view').classList.add('hidden');
        this.render();
    }

    switchToWeekView() {
        this.currentView = 'week';
        this.currentWeekStart = this.getWeekStart(this.currentDate);
        document.getElementById('view-week').classList.add('active');
        document.getElementById('view-month').classList.remove('active');
        document.getElementById('calendar-week-view').classList.remove('hidden');
        document.getElementById('calendar-month-view').classList.add('hidden');
        this.render();
    }

    render() {
        this.updateHeader();
        if (this.currentView === 'month') {
            this.renderCalendarGrid();
        } else {
            this.renderWeekView();
        }
        
        // Atualizar drag-drop
        if (window.app && window.app.dragDrop) {
            window.app.dragDrop.updateDropZones();
        }
    }

    updateHeader() {
        const monthYear = document.getElementById('calendar-month-year');
        if (this.currentView === 'month') {
            monthYear.textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        } else {
            this.updateWeekHeader();
        }
    }

    updateWeekHeader() {
        const weekRange = document.getElementById('week-range');
        if (!weekRange) return;
        
        const endDate = new Date(this.currentWeekStart);
        endDate.setDate(endDate.getDate() + 6);
        
        const startStr = `${this.currentWeekStart.getDate()}`;
        const endStr = `${endDate.getDate()}`;
        
        weekRange.textContent = `${startStr} - ${endStr} de ${this.monthNames[this.currentWeekStart.getMonth()]}`;
    }

    formatDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        d.setDate(d.getDate() - day);
        return d;
    }

    getEventCountForDate(dateStr) {
        return (this.eventosAgendados.get(dateStr) || []).length;
    }
}

window.CalendarBase = CalendarBase;
