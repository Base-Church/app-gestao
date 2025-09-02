class UIManager {
    constructor() {
        this.toasts = [];
    }

    showLoading(show) {
        const loading = document.getElementById('eventos-loading');
        const container = document.getElementById('eventos-container');
        const empty = document.getElementById('eventos-empty');
        
        if (show) {
            loading.classList.remove('hidden');
            container.classList.add('hidden');
            empty.classList.add('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    showSuccess(message) {
        console.log('✓', message);
    }

    showError(message) {
        console.error('✗', message);
    }

    formatDateBR(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('pt-BR');
    }
}

window.UIManager = UIManager;
