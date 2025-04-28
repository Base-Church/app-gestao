export class State {
    constructor() {
        this.currentPage = 1;
        this.searchTerm = '';
        this.ministerios = window.USER.ministerios;
        this.categoriaId = '';
        this.isLoading = false;
        this.error = null;
    }

    setPage(page) {
        this.currentPage = page;
    }

    setSearch(term) {
        this.searchTerm = term;
    }

    setMinisterios(ministerios) {
        this.ministerios = ministerios;
    }

    setCategoriaId(id) {
        this.categoriaId = id;
    }

    setLoading(loading) {
        this.isLoading = loading;
    }

    setError(error) {
        this.error = error;
    }

    getQueryParams() {
        return {
            page: this.currentPage,
            search: this.searchTerm,
            ministerios: this.ministerios,
            categoria_id: this.categoriaId
        };
    }
}
