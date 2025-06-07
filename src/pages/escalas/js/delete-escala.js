export async function deleteEscala(id) {
    try {
        const organizacao_id = window.USER.organizacao_id;
        
        const response = await fetch(`${window.APP_CONFIG.apiUrl}/api/escalas/${id}?organizacao_id=${organizacao_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${window.APP_CONFIG.apiKey}`
            }
        });

        const text = await response.text();
        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
                throw new Error('A resposta da API não é JSON. Verifique a URL da API ou se o backend está online.');
            }
            throw new Error('Erro ao processar resposta da API: ' + e.message);
        }

        if (!response.ok) {
            throw new Error(json.message || 'Erro ao excluir escala');
        }

        return json;
    } catch (error) {
        throw error;
    }
}
