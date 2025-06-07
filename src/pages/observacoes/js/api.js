export class ObservacoesAPI {
    constructor() {
        this.apiBaseUrl = window.APP_CONFIG.apiUrl;
        this.apiKey = window.APP_CONFIG.apiKey;
    }

    async list(organizacaoId, ministerioId, mes) {
        try {
            if (!organizacaoId || !ministerioId || !mes) {
                throw new Error('Parâmetros obrigatórios não fornecidos');
            }

            const url = `${this.apiBaseUrl}/api/indisponibilidades/observacoes`;
            const params = new URLSearchParams({
                organizacao_id: organizacaoId,
                ministerio_id: (typeof ministerioId === 'object' && ministerioId.id) ? ministerioId.id : ministerioId,
                mes: mes
            });

            const response = await fetch(`${url}?${params}`, {
                method: 'GET',
                headers: {
                    'Authorization': this.apiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao buscar observações');
            }

            const data = await response.json();
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            return data;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar observações');
        }
    }
}
