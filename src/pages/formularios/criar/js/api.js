export class FormulariosAPI {
    constructor() {
        this.baseUrl = window.APP_CONFIG.baseUrl;
        this.apiPath = `${this.baseUrl}/src/services/api/formularios`;
        this.processosEtapasPath = `${this.baseUrl}/src/services/api/processos_etapas`;
    }

    async createFormulario(data) {
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
                throw new Error(errorText || `Erro ${response.status} ao criar formulário`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao criar formulário');
        }
    }

    async getProcessoEtapas(ministerio_id) {
        try {
            const params = new URLSearchParams({
                ministerio_id
            });
            
            const response = await fetch(`${this.processosEtapasPath}/get.php?${params}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erro ${response.status} ao buscar etapas`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw new Error(error.message || 'Erro ao buscar etapas do processo');
        }
    }

    getMinisterioId() {
        // Prioriza window.USER.ministerio_atual
        if (window.USER && window.USER.ministerio_atual) {
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