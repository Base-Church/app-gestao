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
        const response = await fetch(`${window.ENV.API_BASE_URL}/api/escalas?${searchParams}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${window.ENV.API_KEY}`
            },
            // Remover configurações de cache dos headers e usar modo de cache
            mode: 'cors',
            credentials: 'omit'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao carregar escalas');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}
