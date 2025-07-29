export class FormulariosAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG.baseUrl;
        this.apiPath = `${this.baseUrl}/src/services/api/formularios`;
    }

    async list({ organizacao_id, ministerio_id, search = '', page = 1, per_page = 10, sort = 'created_at', order = 'desc' } = {}) {
        try {
            const params = new URLSearchParams({
                organizacao_id,
                ministerio_id,
                search,
                page,
                per_page,
                sort,
                order
            });
            const response = await fetch(`${this.apiPath}/get.php?${params}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar formulários`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar formulários');
        }
    }
}
