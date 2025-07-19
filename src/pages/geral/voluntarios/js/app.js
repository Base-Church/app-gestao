import { VoluntariosAPI, MinisteriosAPI } from './api.service.js';
import { UXService } from './ux.service.js';
import { FilterService } from './filter.service.js';

// Arquivo principal para coordenar a aplicação de voluntários
class VoluntariosApp {
    constructor() {
        this.filterService = new FilterService();
        this.isLoading = false;
    }

    async init() {
        try {
            this.showLoading(true);
            this.showError('', false);
            
            // Carrega voluntários e ministérios em paralelo
            const [voluntariosResult, ministeriosResult] = await Promise.all([
                VoluntariosAPI.getVoluntarios(),
                MinisteriosAPI.getMinisterios().catch(error => {
                    console.warn('Erro ao carregar ministérios:', error);
                    return { data: [] };
                })
            ]);
            
            console.log('Voluntários carregados:', voluntariosResult);
            console.log('Ministérios carregados:', ministeriosResult);
            
            // Configura os dados no filtro
            this.filterService.setData(voluntariosResult.data, ministeriosResult.data);
            this.filterService.populateMinisterioFilter();
            
            // Configura eventos
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.showError(error.message || 'Erro ao carregar voluntários');
        } finally {
            this.showLoading(false);
        }
    }

    setupEventListeners() {
        // Evento para limpar filtros
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.filterService.clearFilters();
            });
        }
    }

    showLoading(show = true) {
        this.isLoading = show;
        UXService.showLoading(show);
    }

    showError(message, show = true) {
        UXService.showError(message, show);
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    const app = new VoluntariosApp();
    app.init();
});
