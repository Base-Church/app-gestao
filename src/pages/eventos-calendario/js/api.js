class EventosCalendarioAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG.baseUrl;
        this.apiPath = `${this.baseUrl}/src/services/api/eventos`;
        this.calendarioPath = `${this.baseUrl}/src/services/api/eventos-calendario`;
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

    async getEventosAgendados(mes, organizacaoId) {
        try {
            const response = await fetch(`${this.calendarioPath}/get.php/${mes}/${organizacaoId}`);
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao carregar eventos do calendário:', error);
            return { data: {} };
        }
    }

    async salvarEventosDoDia(mes, organizacaoId, dia, eventoIds) {
        try {
            const response = await fetch(`${this.calendarioPath}/post.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mes: mes,
                    organizacao_id: organizacaoId,
                    dia: dia,
                    eventos: eventoIds
                })
            });

            const data = await response.json();
            
            if (!response.ok || data.code !== 200) {
                throw new Error(data.error || data.message || `Erro ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao salvar eventos do dia:', error);
            throw error;
        }
    }
}

window.EventosCalendarioAPI = EventosCalendarioAPI;
