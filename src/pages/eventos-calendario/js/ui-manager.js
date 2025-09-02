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
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            console.error('Toast container não encontrado!');
            return;
        }

        const toastId = `toast-${Date.now()}`;
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `
            flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800
            ${type === 'error' ? 'ring-2 ring-red-500' : 'ring-1 ring-gray-200 dark:ring-gray-700'}
        `.trim();

        const iconClass = type === 'error' 
            ? 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200'
            : 'bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200';
        
        const icon = `
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${iconClass} rounded-lg">
                ${type === 'error' ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>' : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>'}
            </div>
        `;

        toast.innerHTML = `
            ${icon}
            <div class="ml-3 text-sm font-normal">${message}</div>
            <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#${toastId}" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
        `;

        toastContainer.appendChild(toast);

        const closeButton = toast.querySelector(`[data-dismiss-target="#${toastId}"]`);
        closeButton.onclick = () => toast.remove();

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    formatDateBR(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('pt-BR');
    }
}

window.UIManager = UIManager;
