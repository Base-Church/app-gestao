class PreenchimentosState {
    constructor() {
        this.currentPage = 1;
        this.limit = 12;
        this.search = '';
        this.formulario_id = '';
        this.processo_etapa_id = '';
        this.created_at = '';
        this.preenchimentos = [];
        this.meta = {};
        this.formularios = [];
    }

    setPage(page) {
        this.currentPage = page;
    }

    setLimit(limit) {
        this.limit = limit;
    }

    setSearch(search) {
        this.search = search;
        this.currentPage = 1; // Reset para primeira página ao buscar
    }

    setFormularioId(formulario_id) {
        this.formulario_id = formulario_id;
        this.currentPage = 1; // Reset para primeira página ao filtrar
    }

    setProcessoEtapaId(processo_etapa_id) {
        this.processo_etapa_id = processo_etapa_id;
        this.currentPage = 1; // Reset para primeira página ao filtrar
    }

    setCreatedAt(created_at) {
        this.created_at = created_at;
        this.currentPage = 1; // Reset para primeira página ao filtrar
    }

    setPreenchimentos(preenchimentos) {
        this.preenchimentos = preenchimentos;
    }

    setMeta(meta) {
        this.meta = meta;
    }

    setFormularios(formularios) {
        this.formularios = formularios;
    }

    getPreenchimentos() {
        return this.preenchimentos;
    }

    getMeta() {
        return this.meta;
    }

    getFormularios() {
        return this.formularios;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getLimit() {
        return this.limit;
    }

    getSearch() {
        return this.search;
    }

    getFormularioId() {
        return this.formulario_id;
    }

    getProcessoEtapaId() {
        return this.processo_etapa_id;
    }

    getCreatedAt() {
        return this.created_at;
    }

    getPreenchimentoById(id) {
        return this.preenchimentos.find(p => p.id == id);
    }

    removePreenchimento(id) {
        this.preenchimentos = this.preenchimentos.filter(p => p.id != id);
    }

    reset() {
        this.currentPage = 1;
        this.search = '';
        this.formulario_id = '';
        this.processo_etapa_id = '';
        this.created_at = '';
        this.preenchimentos = [];
        this.meta = {};
    }
}

window.PreenchimentosState = PreenchimentosState;