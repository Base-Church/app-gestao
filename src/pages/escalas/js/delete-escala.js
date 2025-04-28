export async function deleteEscala(id) {
    try {
        const organizacao_id = window.USER.organizacao_id;
        
        const response = await fetch(`${window.ENV.API_BASE_URL}/api/escalas/${id}?organizacao_id=${organizacao_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${window.ENV.API_KEY}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao excluir escala');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
