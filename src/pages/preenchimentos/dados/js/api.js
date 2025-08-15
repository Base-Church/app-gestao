class DadosAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG?.baseUrl || '';
        this.apiPath = `${this.baseUrl}/src/services/api`;
    }

    async getFormularioById(formularioId) {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({
                ministerio_id: ministerio_id,
                organizacao_id: window.USER.organizacao_id,
                formulario_id: formularioId
            });
            const url = `${this.apiPath}/formularios/get-id.php?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status} ao buscar formulário`);
            }

            const data = await response.json();
            
            if (data.code === 200 && data.data) {
                return data;
            } else if (data.error) {
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar formulário:', error);
            throw new Error(error.message || 'Erro ao buscar formulário');
        }
    }

    async getPreenchimentos(formularioId) {
        try {
            const ministerio_id = this.getMinisterioId();
            const params = new URLSearchParams({
                page: 1,
                limit: 1000,
                ministerio_id: ministerio_id,
                formulario_id: formularioId
            });

            const url = `${this.apiPath}/formulario_preenchimentos/get.php?${params}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status} ao buscar preenchimentos`);
            }

            const data = await response.json();
            
            if (data.code === 200 && data.data) {
                return data;
            } else if (data.error) {
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar preenchimentos:', error);
            throw new Error(error.message || 'Erro ao buscar preenchimentos');
        }
    }

    async getPreenchimentoById(id) {
        try {
            const ministerio_id = this.getMinisterioId();
            // Tenta obter o formulario_id a partir da query string da página
            const urlParams = new URLSearchParams(window.location.search);
            const formulario_id = urlParams.get('id') || urlParams.get('formulario_id') || '';

            const paramsObj = {
                id: id,
                ministerio_id: ministerio_id
            };

            if (formulario_id) {
                paramsObj.formulario_id = formulario_id;
            }

            const params = new URLSearchParams(paramsObj);
            const url = `${this.apiPath}/formulario_preenchimentos/get-by-id.php?${params}`;
            const response = await fetch(url);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Erro ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Erro ao buscar preenchimento:', error);
            throw new Error(error.message || 'Erro ao buscar preenchimento');
        }
    }

    async deletePreenchimento(id) {
        try {
            const url = `${this.apiPath}/formulario_preenchimentos/delete.php`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id=${encodeURIComponent(id)}`
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Erro ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Erro ao excluir preenchimento:', error);
            throw new Error(error.message || 'Erro ao excluir preenchimento');
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

window.DadosAPI = DadosAPI;
