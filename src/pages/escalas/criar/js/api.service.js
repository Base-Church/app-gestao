/**
 * Serviço para lidar exclusivamente com chamadas de API
 */
class ApiService {
    constructor() {
        // Usa as variáveis globais definidas no index.php
        this.API_BASE_URL = window.API_BASE_URL || '';
        this.API_KEY = window.API_KEY || '';
    }

    /**
     * Busca eventos da API
     * @param {Object} params - Parâmetros de busca
     * @returns {Promise<Array>} - Lista de eventos
     */
    async buscarEventos(params = {}) {
        try {
            const apiUrl = `${this.API_BASE_URL}/api/eventos?organizacao_id=1&page=1&limit=100`;
            
            console.log('Buscando eventos:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.API_KEY}`
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
}

// Inicializa o serviço com compatibilidade para módulos e scripts normais
(function() {
    window.apiService = new ApiService();
})();
