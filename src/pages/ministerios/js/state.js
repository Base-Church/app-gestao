export class State {
    constructor() {
        this.currentPage = 1;
        this.searchTerm = '';
        this.isLoading = false;
        this.error = null;
    }

    setPage(page) {
        this.currentPage = page;
    }

    setSearch(term) {
        this.searchTerm = term;
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
            search: this.searchTerm
        };
    }
}
