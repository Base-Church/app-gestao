class EventosState {
    constructor() {
        this.currentPage = 1;
        this.searchTerm = '';
        this.isLoading = false;
        this.error = null;
        this.itemsPerPage = 100;
    }

    setPage(page) {
        this.currentPage = page;
    }

    setSearch(term) {
        this.searchTerm = term;
        this.currentPage = 1; // Reset para primeira página ao buscar
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
            limit: this.itemsPerPage,
            search: this.searchTerm
        };
    }
}

// Exporta a classe globalmente
window.EventosState = EventosState;
