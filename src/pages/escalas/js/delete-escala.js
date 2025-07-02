export async function deleteEscala(id) {
    try {
        const organizacao_id = window.USER.organizacao_id;
        const baseUrl = window.APP_CONFIG.baseUrl;
        const apiPath = `${baseUrl}/src/services/api/escalas`;
        
        const response = await fetch(`${apiPath}/delete.php/${id}?organizacao_id=${organizacao_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Erro ${response.status} ao excluir escala`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na API:', error);
        throw new Error(error.message || 'Erro ao excluir escala');
    }
}
