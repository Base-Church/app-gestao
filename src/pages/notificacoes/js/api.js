export class NotificacoesAPI {
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('baseUrl é obrigatório');
        }
        this.baseUrl = baseUrl;
        this.apiPath = `${baseUrl}/api/notificacoes`;
    }

    async list(page = 1, limit = 40, search = '') {
        try {
            const params = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id,
                ministerio_id: localStorage.getItem('ministerio_atual') || '',
                page,
                limit
            });

            if (search) {
                params.append('search', search);
            }

            const url = `${this.apiPath}?${params}`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${window.ENV.API_KEY}`
                },
                mode: 'cors',
                cache: 'no-store'
            });

            const data = await response.json();

            if (data && data.code === 200) {
                return {
                    data: data.data || [],
                    meta: data.meta || {
                        page: 1,
                        total: 0,
                        totalPages: 0
                    }
                };
            }

            throw new Error(data?.message || 'Erro ao buscar notificações');
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }
}
