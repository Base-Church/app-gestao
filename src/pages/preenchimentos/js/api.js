class PreenchimentosAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG.baseUrl;
        this.apiPath = `${this.baseUrl}/src/services/api/formulario_preenchimentos`;
    }

    async list(page = 1, limit = 1200, search = '', formulario_id = '', status = '', created_at = '') {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams();
            
            // Adiciona apenas parâmetros não vazios
            params.append('page', page);
            params.append('limit', limit);
            params.append('ministerio_id', ministerio_id);
            
            if (search) params.append('search', search);
            if (formulario_id) params.append('formulario_id', formulario_id);
            if (status) params.append('status', status);
            if (created_at) params.append('created_at', created_at);

            const url = `${this.apiPath}/get.php?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar preenchimentos`);
            }

            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar preenchimentos');
        }
    }

    async delete(id) {
        try {
            const url = `${this.baseUrl}/src/services/api/formulario_preenchimentos/delete.php`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id=${encodeURIComponent(id)}`
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao excluir preenchimento');
            }

            return data;
        } catch (error) {
            console.error('Erro ao excluir preenchimento:', error);
            throw new Error(error.message || 'Erro ao excluir preenchimento');
        }
    }

    async getById(id) {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({
                id: id,
                ministerio_id: ministerio_id
            });
            const url = `${this.baseUrl}/src/services/api/formulario_preenchimentos/get-by-id.php?${params}`;
            const response = await fetch(url);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao buscar preenchimento');
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar preenchimento:', error);
            throw new Error(error.message || 'Erro ao buscar preenchimento');
        }
    }

    async getFormularios() {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({
                ministerio_id: ministerio_id,
                organizacao_id: window.USER.organizacao_id
            });
            const url = `${this.baseUrl}/src/services/api/formularios/get.php?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar formulários`);
            }

            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            // Verifica se a resposta tem o formato esperado
            if (data.code === 200 && data.data) {
                return data;
            } else if (data.error) {
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar formulários:', error);
            throw new Error(error.message || 'Erro ao buscar formulários');
        }
    }

    async getFormularioById(formulario_id) {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({
                ministerio_id: ministerio_id,
                formulario_id: formulario_id
            });
            const url = `${this.baseUrl}/src/services/api/formularios/get-id.php?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar formulário`);
            }

            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Resposta inválida da API');
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar formulário:', error);
            throw new Error(error.message || 'Erro ao buscar formulário');
        }
    }

    getMinisterioId() {
        // Prioriza window.USER.ministerio_atual
        if (window.USER && window.USER.ministerio_atual) {
            if (typeof window.USER.ministerio_atual === 'object' && window.USER.ministerio_atual.id) {
                return window.USER.ministerio_atual.id;
            }
            return window.USER.ministerio_atual;
        }
        
        // Fallback para data-ministerio-id
        const element = document.querySelector('[data-ministerio-id]');
        if (element && element.dataset.ministerioId) {
            return element.dataset.ministerioId;
        }
        
        throw new Error('ID do ministério não encontrado');
    }
}

window.PreenchimentosAPI = PreenchimentosAPI;