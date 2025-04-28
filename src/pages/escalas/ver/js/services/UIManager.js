export class UIManager {
    constructor(elements) {
        this.elements = elements;
    }

    showLoading() {
        this.elements.loadingIndicator.classList.remove('hidden');
        this.elements.errorContainer.classList.add('hidden');
        this.elements.escalaContainer.classList.add('hidden');
    }

    showError(message) {
        this.elements.loadingIndicator.classList.add('hidden');
        this.elements.errorContainer.classList.remove('hidden');
        this.elements.escalaContainer.classList.add('hidden');
        
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = message;
        
        if (window.ENV.APP_ENV === 'development') {
            const errorDetails = document.createElement('div');
            errorDetails.className = 'mt-2 text-sm text-red-600 dark:text-red-400';
            errorDetails.textContent = 'Verifique o console para mais detalhes.';
            errorMessage.parentNode.appendChild(errorDetails);
        }
    }

    showEscala() {
        this.elements.loadingIndicator.classList.add('hidden');
        this.elements.errorContainer.classList.add('hidden');
        this.elements.escalaContainer.classList.remove('hidden');
    }
}
