export class State {
    constructor() {
        this.ministerios = window.USER.ministerios;
        this.isLoading = false;
        this.error = null;
    }

    setLoading(loading) {
        this.isLoading = loading;
    }

    setError(error) {
        this.error = error;
    }

    getCurrentMinisterio() {
        return window.USER.ministerio_atual;
    }
}
