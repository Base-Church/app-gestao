export class ObservacoesAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG.baseUrl;
        this.apiPath = `${this.baseUrl}/src/services/api/observacoes`; // Caminho base para os endpoints
    }

    async list(organizacaoId, ministerioId, mes) {
        try {
            if (!organizacaoId || !ministerioId || !mes) {
                throw new Error('Parâmetros obrigatórios não fornecidos');
            }

            const params = new URLSearchParams({
                organizacao_id: organizacaoId,
                ministerio_id: (typeof ministerioId === 'object' && ministerioId.id) ? ministerioId.id : ministerioId,
                mes: mes
            });

            const url = `${this.apiPath}/get.php?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar observações`);
            }

            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar observações');
        }
    }
}
