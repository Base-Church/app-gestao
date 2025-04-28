export class ModelosAPI {
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('baseUrl é obrigatório');
        }
        this.baseUrl = `${baseUrl}/src/services/api/modelos`;
    }

    async list(ministerio_id) {
        try {
            if (!ministerio_id) {
                throw new Error('ministerio_id é obrigatório');
            }

            const params = new URLSearchParams({
                ministerio_id: String(ministerio_id)
            });

            const url = `${this.baseUrl}/get.php?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar modelos');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error(error.message || 'Erro ao buscar modelos');
        }
    }

    async delete(id) {
        try {
            const response = await fetch(`${this.baseUrl}/delete.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id,
                    organizacao_id: window.USER.organizacao_id 
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao excluir modelo');
            }

            return await response.json();
        } catch (error) {
            console.error('Delete API Error:', error);
            throw error;
        }
    }
}
