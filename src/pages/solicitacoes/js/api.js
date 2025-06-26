export class SolicitacoesAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG.baseUrl;
        this.apiPath = `${this.baseUrl}/src/services/api/solicitacoes`; // Caminho base para os endpoints
    }

    async list(ministerio_id) {
        try {
            const params = new URLSearchParams({
                ministerio_id
            });

            const url = `${this.apiPath}/get.php?${params}`;
            console.log('URL da requisição:', url); // Debug
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta:', errorText); // Debug
                throw new Error(errorText || `Erro ${response.status} ao buscar solicitações`);
            }

            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar solicitações');
        }
    }

    async responder(id, { status, observacao }) {
        try {
            const payload = {
                id,
                status,
                observacao
            };

            const response = await fetch(`${this.apiPath}/put.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Erro ao responder solicitação');
            }

            return responseData;
        } catch (error) {
            console.error('Erro completo:', error);
            throw error;
        }
    }
}