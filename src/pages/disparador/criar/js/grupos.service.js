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

            // Buscar grupos reais da API
            const apiService = window.apiService;
            if (!apiService) {
                throw new Error('API Service não encontrado');
            }
            
            const response = await apiService.getGroups();
            
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
            console.error('Erro ao carregar grupos:', error);
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

    async loadGroupImages() {
        const groupCards = document.querySelectorAll('#groupsList > div');
        
        for (const card of groupCards) {
            const checkbox = card.querySelector('input[type="checkbox"]');
            if (!checkbox) continue;
            
            const jid = checkbox.value;
            if (!jid) continue;
            
            try {
                const apiService = window.apiService;
                if (!apiService) continue;
                
                const response = await apiService.getChatNameAndImage(jid);
                
                if (response && response.image) {
                    const imgContainer = card.querySelector('.w-12.h-12');
                    if (imgContainer) {
                        imgContainer.innerHTML = `<img src="${response.image}" alt="Grupo" class="w-12 h-12 rounded-full object-cover">`;
                    }
                }
            } catch (error) {
                console.error(`Erro ao carregar imagem do grupo ${jid}:`, error);
            }
        }
    }

    getGroups() {
        return this.groups;
    }
}

// Exportar para uso global
window.GruposService = GruposService; 