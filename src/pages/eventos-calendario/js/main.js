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
        await this.loadInitialData();
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

    async loadInitialData() {
        try {
            this.ui.showLoading(true);

            // Carrega os eventos disponíveis para a lista
            const eventos = await this.api.getEventos({
                search: this.searchTerm
            });
            this.eventosList.setEventos(eventos);

            // Carrega os eventos já agendados no calendário
            const mes = this.calendar.formatDateKey(this.calendar.currentDate).substring(0, 7);
            const organizacaoId = this.getOrganizacaoId();
            
            try {
                const eventosAgendados = await this.api.getEventosAgendados(mes, organizacaoId);
                
                // Transforma a resposta da API no formato que o calendário espera
                const eventosMap = new Map();
                if (eventosAgendados && eventosAgendados.data && typeof eventosAgendados.data === 'object') {
                    for (const [dateStr, eventoIds] of Object.entries(eventosAgendados.data)) {
                        if (Array.isArray(eventoIds) && eventoIds.length > 0) {
                            const eventosDoDia = eventoIds.map(id => this.getEventoById(id)).filter(Boolean);
                            if (eventosDoDia.length > 0) {
                                eventosMap.set(dateStr, eventosDoDia);
                            }
                        }
                    }
                }
                this.calendar.eventosAgendados = eventosMap;
            } catch (error) {
                console.log('Nenhum evento agendado encontrado ou erro ao carregar:', error.message);
                // Não exibir erro para o usuário, apenas criar o Map vazio
                this.calendar.eventosAgendados = new Map();
            }
            
            this.calendar.render();

        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
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

    getOrganizacaoId() {
        return window.USER.organizacao_id;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EventosCalendarioApp();
});
