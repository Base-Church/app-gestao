export class MusicasAPI {
    constructor(baseUrl) {
        if (!baseUrl) {
            throw new Error('baseUrl é obrigatório');
        }
        this.baseUrl = baseUrl;
        this.apiPath = `${baseUrl}/src/services/api/musicas`;
    }

    async list(page = 1, limit = 1000, search = '') {
        try {
            const params = new URLSearchParams({
                page,
                limit,
                search
            });

            const response = await fetch(`${this.apiPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar musicas`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar musicas');
        }
    }

    async create(data) {
        try {
            const response = await fetch(`${this.apiPath}/create.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao criar música`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao criar música');
        }
    }

    async update(id, data) {
        try {
            const payload = { ...data, id };
            const response = await fetch(`${this.apiPath}/put.php`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao atualizar música`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao atualizar música');
        }
    }

    async delete(id) {
        try {
            const response = await fetch(`${this.apiPath}/delete.php`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao excluir música`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao excluir música');
        }
    }
}
