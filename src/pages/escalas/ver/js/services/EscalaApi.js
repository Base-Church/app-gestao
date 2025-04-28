import UrlPrefixService from '../url-prefix-service.js';

export class EscalaApi {
    static async fetchEscala(prefix, id, organizacaoId) {
        const url = `${window.ENV.API_BASE_URL}/api/escalas/${prefix}-${id}?organizacao_id=${organizacaoId}`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${window.ENV.API_KEY}`
                }
            });

            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('API Error:', {
                message: error.message,
                url: url,
                stack: error.stack
            });
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                throw new Error('Erro de conexão com o servidor. Verifique sua conexão ou tente novamente mais tarde.');
            }
            throw error;
        }
    }

    static async fetchAtividadesByCategoria(categoriaId, organizacaoId) {
        const url = `${window.ENV.API_BASE_URL}/api/atividades/categoria/${categoriaId}?organizacao_id=${organizacaoId}`;
        console.log('Buscando atividades...', { url, categoriaId, organizacaoId });
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${window.ENV.API_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Resposta recebida:', data);
            return data;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }
}
