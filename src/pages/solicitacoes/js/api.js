export class SolicitacoesAPI {
    constructor() {
        this.baseUrl = window.ENV?.API_BASE_URL;
        if (!this.baseUrl) {
            throw new Error('API_BASE_URL não configurado');
        }
    }

    async list(ministerio_id) {
        try {
            const response = await fetch(`${this.baseUrl}/api/solicitacoes-ministerio/ministerio/${ministerio_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.ENV?.API_KEY}`
                }
            });
            
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const error = await response.json();
                    throw new Error(error.message || 'Erro ao buscar solicitações');
                } else {
                    const text = await response.text();
                    throw new Error('Erro no servidor: ' + text);
                }
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async responder(id, { status, observacao }) {
        try {
            const response = await fetch(`${this.baseUrl}/api/solicitacoes-ministerio/${id}/responder`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.ENV?.API_KEY}`
                },
                body: JSON.stringify({
                    status,
                    observacao
                })
            });
            
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const error = await response.json();
                    throw new Error(error.message || 'Erro ao responder solicitação');
                } else {
                    const text = await response.text();
                    throw new Error('Erro no servidor: ' + text);
                }
            }

            const data = await response.json();
            // Verifica se o retorno está no formato esperado
            if (data.code !== 200) {
                throw new Error(data.message || 'Erro ao responder solicitação');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}