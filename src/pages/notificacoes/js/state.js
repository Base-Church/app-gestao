export class State {
    constructor() {
        this.currentPage = 1;
        this.isLoading = false;
        this.error = null;
    }

    setPage(page) {
        this.currentPage = page;
    }

    setLoading(loading) {
        this.isLoading = loading;
    }

    setError(error) {
        this.error = error;
    }

    getQueryParams() {
        return {
            page: this.currentPage
        };
    }
}
