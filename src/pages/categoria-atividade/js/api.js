class CategoriaAtividadeAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG.baseUrl;
    }

    async list(page = 1, limit = 12, search = '') {
        try {
            const params = new URLSearchParams({
                page,
                limit,
                search
            });

            const url = `${this.baseUrl}/src/services/api/categoria-atividade/get.php?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar categorias`);
            }

            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar categorias');
        }
    }

    async create(data) {
        try {
            if (!data.nome || !data.organizacao_id || !data.ministerio_id) {
                throw new Error('Nome, organização e ministério são obrigatórios');
            }

            const response = await fetch(`${this.baseUrl}/src/services/api/categoria-atividade/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: data.nome,
                    cor: data.cor || '#33ccad',
                    organizacao_id: data.organizacao_id,
                    ministerio_id: data.ministerio_id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar categoria');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            if (!id || !data.nome || !data.cor) {
                throw new Error('ID, nome e cor são obrigatórios');
            }

            const response = await fetch(`${this.baseUrl}/src/services/api/categoria-atividade/update.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: Number(id),
                    nome: data.nome,
                    cor: data.cor
                })
            });

            const responseData = await response.json();
            
            // Modificado: Não trata código 200 como erro
            if (!response.ok && response.status !== 200) {
                throw new Error(responseData.message || 'Erro ao atualizar categoria');
            }

            return responseData;
        } catch (error) {
            console.error('Update API Error:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            if (!id) {
                throw new Error('ID é obrigatório');
            }

            const response = await fetch(`${this.baseUrl}/src/services/api/categoria-atividade/delete.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao excluir categoria');
            }

            return true;
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            throw new Error(error.message || 'Erro ao excluir categoria');
        }
    }
}

// Exporta a classe globalmente
window.CategoriaAtividadeAPI = CategoriaAtividadeAPI;
