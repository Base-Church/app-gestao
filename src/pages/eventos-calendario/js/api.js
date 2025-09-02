class EventosCalendarioAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG.baseUrl;
        this.apiPath = `${this.baseUrl}/src/services/api/eventos`;
    }

    async getEventos(filters = {}) {
        try {
            const params = new URLSearchParams({
                page: 1,
                search: filters.search || '',
                ...filters
            });

            const response = await fetch(`${this.apiPath}/get.php?${params}`);
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }
            
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Erro na API:', error);
            return [];
        }
    }
}

window.EventosCalendarioAPI = EventosCalendarioAPI;
