/**
 * Serviço para lidar exclusivamente com chamadas de API
 */
class ApiService {
    constructor() {
        // Usa as variáveis globais definidas no index.php
        this.API_BASE_URL = window.API_BASE_URL || '';
        this.API_KEY = window.API_KEY || '';
        this.URL_BASE = window.URL_BASE || '';
    }

    /**
     * Busca eventos da API
     * @param {Object} params - Parâmetros de busca
     * @returns {Promise<Array>} - Lista de eventos
     */
    async buscarEventos(params = {}) {
        try {
            // Altere para usar o endpoint local PHP
            const apiUrl = `${this.URL_BASE}/src/services/api/eventos/get.php?page=1&limit=100`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const resultado = await response.json();
            return resultado.data || [];
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            return [];
        }
    }

    /**
     * Busca atividades da API
     * @param {Object} params - Parâmetros de busca
     * @returns {Promise<Array>} - Lista de atividades
     */
    async buscarAtividades(params = {}) {
        try {
            let query = new URLSearchParams({
                page: params.page || 1,
                limit: params.limit || 100,
                organizacao_id: params.organizacao_id || window.ORGANIZACAO_ID,
                ministerio_id: params.ministerio_id || window.ministerio_atual
            }).toString();

            const apiUrl = `${this.URL_BASE}/src/services/api/atividades/get.php?${query}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            const resultado = await response.json();
            return resultado.data || [];
        } catch (error) {
            console.error('Erro ao buscar atividades:', error);
            return [];
        }
    }

    /**
     * Busca modelos de escala da API
     * @param {string|number} ministerio_id
     * @returns {Promise<Array>}
     */
    async buscarModelos(ministerio_id) {
        try {
            const apiUrl = `${this.URL_BASE}/src/services/api/modelos/get.php?ministerio_id=${ministerio_id}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
            const resultado = await response.json();
            return resultado.data || [];
        } catch (error) {
            console.error('Erro ao buscar modelos:', error);
            return [];
        }
    }

    /**
     * Busca voluntários e sugestões para uma atividade/evento
     * @param {Object} params - {organizacao_id, ministerio_id, atividade_id, data, data_evento, evento_id}
     * @returns {Promise<{sugestoes:[], todos:[]}>}
     */
    async buscarVoluntariosSugestoes(params = {}) {
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
            const query = new URLSearchParams(cleanParams).toString();
            const apiUrl = `${this.URL_BASE}/src/services/api/voluntarios/get-sugestoes.php?${query}`;
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
            const resultado = await response.json();
            // Corrige para aceitar tanto {data: {sugestoes, todos}} quanto {sugestoes, todos}
            const data = resultado.data || resultado;
            return {
                sugestoes: data.sugestoes || [],
                todos: data.todos || []
            };
        } catch (error) {
            console.error('Erro ao buscar voluntários:', error);
            return { sugestoes: [], todos: [] };
        }
    }
}

(function() {
    window.apiService = new ApiService();
})();
// Nenhuma redundância encontrada.
