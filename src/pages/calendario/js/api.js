class CalendarioAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG.baseUrl;
    }

    async getCalendarData(ministerioId, mes) {
        // Garante que sempre pega o ID do ministério, mesmo que seja objeto
        let ministerio_id = ministerioId;
        if (ministerio_id && typeof ministerio_id === 'object' && ministerio_id.id) {
            ministerio_id = ministerio_id.id;
        }
        const params = new URLSearchParams({
            organizacao_id: window.USER.organizacao_id,
            ministerio_id: ministerio_id,
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
    }
}

// Exporta a instância
const api = new CalendarioAPI();
export { api };
