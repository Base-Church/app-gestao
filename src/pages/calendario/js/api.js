class CalendarioAPI {
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('baseUrl é obrigatório');
        }
        this.baseUrl = baseUrl;
    }

    async getCalendarData(ministerioId, mes) {
        try {
            const params = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id,
                ministerio_id: ministerioId,
                mes: mes,
                page: 1,
                limit: 100,
                search: ''
            });

            const response = await fetch(`${this.baseUrl}/src/services/api/calendario/get.php?${params}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao buscar dados do calendário');
            }
            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar dados do calendário');
        }
    }
}

// Exporta a instância
const api = new CalendarioAPI(window.USER.baseUrl);
export { api };
