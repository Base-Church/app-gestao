class LideresState {
    constructor() {
        this.loading = false;
        this.page = 1;
        this.limit = 12;
        this.search = '';
    }

    setLoading(loading) {
        this.loading = loading;
    }

    setPage(page) {
        this.page = page;
    }

    setSearch(search) {
        this.search = search;
        this.page = 1; // Reset página ao buscar
    }

    getQueryParams() {
        return {
            page: this.page,
            limit: this.limit,
            search: this.search
        };
    }
}

window.LideresState = LideresState;
