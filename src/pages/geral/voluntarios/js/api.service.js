export class VoluntariosAPI {
    static async getVoluntarios(params = {}) {
        try {
            const queryParams = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id,
                limit: 1000
            });

            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/voluntarios/get-geral.php?${queryParams}`, {
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao carregar voluntários');
            }

            const data = await response.json();
            
            return {
                data: data.data || [],
                meta: data.meta || {}
            };
        } catch (error) {
            console.error('Erro ao buscar voluntários:', error);
            throw error;
        }
    }
}

export class MinisteriosAPI {
    static async getMinisterios() {
        try {
            const queryParams = new URLSearchParams({
                organizacao_id: window.USER.organizacao_id,
                limit: 1000
            });

            const response = await fetch(`${window.APP_CONFIG.baseUrl}/src/services/api/ministerios/get.php?${queryParams}`, {
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao carregar ministérios');
            }

            const data = await response.json();
            
            return {
                data: data.data || [],
                meta: data.meta || {}
            };
        } catch (error) {
            console.error('Erro ao buscar ministérios:', error);
            throw error;
        }
    }
}