export async function getEscalas(params = {}) {
    const searchParams = new URLSearchParams({
        organizacao_id: window.USER.organizacao_id,
        ministerio_id: window.USER.ministerio_atual,
        search: params.search || '',
        tipo: params.tipo || '',
        page: params.page || 1,
        per_page: params.per_page || 10,
        sort: params.sort || 'created_at',
        order: params.order || 'desc',
        ...params
    });

    try {
        const response = await fetch(`${window.APP_CONFIG.apiUrl}/api/escalas?${searchParams}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${window.APP_CONFIG.apiKey}`
            },
            mode: 'cors',
            credentials: 'omit'
        });

        const text = await response.text();
        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            // Se a resposta não for JSON, provavelmente é HTML de erro
            if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
                throw new Error('A resposta da API não é JSON. Verifique a URL da API ou se o backend está online.');
            }
            throw new Error('Erro ao processar resposta da API: ' + e.message);
        }

        if (!response.ok) {
            throw new Error(json.message || 'Erro ao carregar escalas');
        }

        return json;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}
