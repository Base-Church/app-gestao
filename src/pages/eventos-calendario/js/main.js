class EventosCalendarioApp {
    constructor() {
        if (!window.USER) {
            console.error('Erro: USER não encontrado');
            return;
        }

        this.api = new EventosCalendarioAPI();
        this.calendar = new Calendar();
        this.eventosList = new EventosList(this);
        this.ui = new UIManager();
        this.dragDrop = new DragDropManager(this.calendar, this.api);
        
        this.searchTerm = '';
        this.tipoFilter = '';

        this.init();
    }

    async init() {
        window.app = this;
        this.setupEventListeners();
        await this.loadEventos();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search-eventos');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                this.eventosList.filterEventos(this.searchTerm, this.tipoFilter);
            });
        }

        const tipoFilter = document.getElementById('filter-tipo');
        if (tipoFilter) {
            tipoFilter.addEventListener('change', (e) => {
                this.tipoFilter = e.target.value;
                this.eventosList.filterEventos(this.searchTerm, this.tipoFilter);
            });
        }
    }

    async loadEventos() {
        try {
            this.ui.showLoading(true);

            const eventos = await this.api.getEventos({
                search: this.searchTerm
            });

            this.eventosList.setEventos(eventos);
            this.calendar.carregarEventosAgendados(eventos);

        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            this.ui.showError(error.message);
        } finally {
            this.ui.showLoading(false);
        }
    }

    getEventoById(id) {
        return this.eventosList.getEventoById(id);
    }

    showSuccess(message) {
        this.ui.showSuccess(message);
    }

    showError(message) {
        this.ui.showError(message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EventosCalendarioApp();
});
