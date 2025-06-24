// Serviço para lidar exclusivamente com chamadas de API do criador de escalas v2
class ApiV2Service {
    constructor() {
        this.BASE_URL = (window.APP_CONFIG && window.APP_CONFIG.baseUrl) || window.BASE_URL || '';
    }

    /**
     * Busca eventos da API
     * @param {string|number} categoria_id
     * @returns {Promise<Array>}
     */
    async buscarEventos(categoria_id = '') {
        try {
            let url = `${this.BASE_URL}/src/services/api/eventos/get.php`;
            if (categoria_id) url += `?categoria_id=${categoria_id}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
            const resultado = await response.json();
            return resultado.data || [];
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            return [];
        }
    }

    /**
     * Busca voluntários da API
     * @param {Object} params - Parâmetros de busca (organizacao_id, ministerio_id, etc)
     * @returns {Promise<Array>}
     */
    async buscarVoluntarios(params = {}) {
        try {
            // Remove parâmetros undefined/null para evitar erro 400
            const cleanParams = {};
            Object.keys(params).forEach(k => {
                if (
                    params[k] !== undefined &&
                    params[k] !== null &&
                    params[k] !== ''
                ) {
                    cleanParams[k] = params[k];
                }
            });
            // Garante uso dos dados globais
            if (!cleanParams.organizacao_id && window.USER) cleanParams.organizacao_id = window.USER.organizacao_id;
            if (!cleanParams.ministerio_id && window.USER) cleanParams.ministerio_id = window.USER.ministerio_atual;
            const query = new URLSearchParams(cleanParams).toString();
            const url = `${this.BASE_URL}/src/services/api/voluntarios/get.php${query ? '?' + query : ''}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
            const resultado = await response.json();
            return resultado.data || [];
        } catch (error) {
            console.error('Erro ao buscar voluntários:', error);
            return [];
        }
    }

    /**
     * Busca categorias de atividades da API
     * @param {Object} params - Parâmetros de busca (organizacao_id, ministerio_id, etc)
     * @returns {Promise<Array>}
     */
    async buscarCategorias(params = {}) {
        try {
            const cleanParams = {};
            Object.keys(params).forEach(k => {
                if (
                    params[k] !== undefined &&
                    params[k] !== null &&
                    params[k] !== ''
                ) {
                    cleanParams[k] = params[k];
                }
            });
            if (!cleanParams.organizacao_id && window.USER) cleanParams.organizacao_id = window.USER.organizacao_id;
            if (!cleanParams.ministerio_id && window.USER) cleanParams.ministerio_id = window.USER.ministerio_atual;
            const query = new URLSearchParams(cleanParams).toString();
            const url = `${this.BASE_URL}/src/services/api/categoria-atividade/get.php${query ? '?' + query : ''}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
            const resultado = await response.json();
            return resultado.data || [];
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            return [];
        }
    }
}

(function() {
    window.apiV2Service = new ApiV2Service();
})(); 