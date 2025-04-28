import { EscalaApi } from './services/EscalaApi.js';
import { EscalaRenderer } from './services/EscalaRenderer.js';
import { UIManager } from './services/UIManager.js';
import { getDefaultPrefix } from './config/prefixes.js';
import UrlPrefixService from './url-prefix-service.js';

class EscalaViewer {
    constructor() {
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorContainer = document.getElementById('error-container');
        this.errorMessage = document.getElementById('error-message');
        this.escalaContainer = document.getElementById('escala-container');
    }

    showLoading() {
        this.loadingIndicator.classList.remove('hidden');
        this.errorContainer.classList.add('hidden');
        this.escalaContainer.classList.add('hidden');
    }

    hideLoading() {
        this.loadingIndicator.classList.add('hidden');
    }

    showError(message) {
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.remove('hidden');
        this.escalaContainer.classList.add('hidden');
        this.errorMessage.textContent = message;
    }

    showContent(content) {
        this.loadingIndicator.classList.add('hidden');
        this.errorContainer.classList.add('hidden');
        this.escalaContainer.classList.remove('hidden');
        this.escalaContainer.innerHTML = content;
    }

    parseEscalaCode(code) {
        // Find the first occurrence of '-' to get the prefix
        const firstDashIndex = code.indexOf('-');
        if (firstDashIndex === -1) return { prefix: '', id: '' };
        
        const prefix = code.substring(0, firstDashIndex);
        // Get everything after the prefix-
        const id = code.substring(firstDashIndex + 1);
        
      
        return { prefix, id };
    }

    async loadEscala() {
        try {
            this.showLoading();
            const urlParams = new URLSearchParams(window.location.search);
            const escalaCode = urlParams.get('ec');

            if (!escalaCode) {
                throw new Error('Código da escala não encontrado');
            }

            const { prefix, id } = this.parseEscalaCode(escalaCode);
            if (!prefix || !id) {
                throw new Error('Código da escala inválido');
            }

            const organizacaoId = window.ENV.ORGANIZACAO_ID || '1';
            const data = await EscalaApi.fetchEscala(prefix, id, organizacaoId);
            
            // Dispatch escalaLoaded event with the data
            const event = new CustomEvent('escalaLoaded', { 
                detail: { data }
            });
            document.dispatchEvent(event);

            await EscalaRenderer.renderEscala(this.escalaContainer, data, prefix);
            this.hideLoading();
        } catch (error) {
           
            this.showError(error.message || 'Erro ao carregar escala');
        }
    }
}

// Initialize and load
const viewer = new EscalaViewer();
viewer.loadEscala();
