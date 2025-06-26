class GruposService {
    constructor() {
        this.groups = [];
    }

    async loadGroups() {
        try {
            const container = document.getElementById('groupsList');
            if (!container) return;

            // Mostrar loading
            container.innerHTML = `
                <div class="text-center py-8">
                    <div class="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p class="text-gray-500">Carregando grupos...</p>
                </div>
            `;

            // Buscar grupos com imagens da API
            const apiService = window.apiService;
            if (!apiService) {
                throw new Error('API Service não encontrado');
            }
            
            const response = await apiService.getGroupsWithImages();
            
            if (response && response.groups) {
                this.groups = response.groups;
            } else if (response && Array.isArray(response)) {
                this.groups = response;
            } else {
                this.groups = [];
            }
            
            // Renderizar usando o MainController
            if (window.mainController) {
                window.mainController.renderGroupsList();
            }
            
        } catch (error) {
            const container = document.getElementById('groupsList');
            if (container) {
                container.innerHTML = `
                    <div class="text-center py-8">
                        <svg class="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">Erro ao carregar grupos</p>
                        <p class="text-xs text-gray-500">${error.message}</p>
                    </div>
                `;
            }
        }
    }

    getGroups() {
        return this.groups;
    }
}

// Exportar para uso global
window.GruposService = GruposService; 