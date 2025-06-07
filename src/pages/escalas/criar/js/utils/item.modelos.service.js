// Serviço para buscar modelos e detalhes das atividades
class ModelosService {
    constructor() {
        this.cacheModelos = {};
        this.cacheAtividades = {};
    }

    async buscarModelos(ministerioId) {
        if (this.cacheModelos[ministerioId]) {
            return this.cacheModelos[ministerioId];
        }
        // Busca via apiService
        const modelos = await window.apiService.buscarModelos(ministerioId);
        this.cacheModelos[ministerioId] = modelos;
        return modelos;
    }

    async getModeloById(modeloId) {
        // Busca em todos os caches
        for (const modelos of Object.values(this.cacheModelos)) {
            const modelo = modelos.find(m => m.id == modeloId);
            if (modelo) return modelo;
        }
        return null;
    }

    async buscarAtividadePorId(atividadeId) {
        if (this.cacheAtividades[atividadeId]) {
            return this.cacheAtividades[atividadeId];
        }
        // Busca via apiService
        const atividades = await window.apiService.buscarAtividades({
            organizacao_id: window.USER.organizacao_id,
            ministerio_id: window.USER.ministerio_atual
        });
        for (const a of atividades) {
            this.cacheAtividades[a.id] = a;
        }
        return this.cacheAtividades[atividadeId] || null;
    }
}

window.modelosService = new ModelosService();

// Nenhuma redundância encontrada.
