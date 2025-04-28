export class ObservacoesAPI {
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('baseUrl é obrigatório');
        }
        
        if (!window.USER?.apiBaseUrl || !window.USER?.apiKey) {
            throw new Error('Configurações da API não encontradas');
        }

        // Corrigido: usando a variável correta apiBaseUrl ao invés de baseUrl
        this.apiBaseUrl = window.USER.apiBaseUrl;
        this.apiKey = window.USER.apiKey;
    }

    async list(organizacaoId, ministerioId, mes) {
        try {
            if (!organizacaoId || !ministerioId || !mes) {
                throw new Error('Parâmetros obrigatórios não fornecidos');
            }

            // Garante que os IDs sejam números
            ministerioId = Number(ministerioId);
            organizacaoId = Number(organizacaoId);

            const url = `${this.apiBaseUrl}/api/indisponibilidades/observacoes`;
            const params = new URLSearchParams({
                organizacao_id: organizacaoId,
                ministerio_id: ministerioId,
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
