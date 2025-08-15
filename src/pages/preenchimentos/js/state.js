class PreenchimentosState {
    constructor() {
        this.currentPage = 1;
        this.limit = 12;
        this.search = '';
        this.created_at = '';
        this.formularios = [];
        this.meta = {};
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

    setCreatedAt(created_at) {
        this.created_at = created_at;
        this.currentPage = 1; // Reset para primeira página ao filtrar
    }

    setFormularios(formularios) {
        this.formularios = formularios;
    }

    setMeta(meta) {
        this.meta = meta;
    }

    getFormularios() {
        return this.formularios;
    }

    getMeta() {
        return this.meta;
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

    getCreatedAt() {
        return this.created_at;
    }

    getFormularioById(id) {
        return this.formularios.find(f => f.id == id);
    }

    reset() {
        this.currentPage = 1;
        this.search = '';
        this.created_at = '';
        this.formularios = [];
        this.meta = {};
    }
}

window.PreenchimentosState = PreenchimentosState;