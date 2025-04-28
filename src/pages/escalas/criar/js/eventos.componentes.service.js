/**
 * Serviço para lidar exclusivamente com os componentes HTML de eventos
 */
class EventosComponentesService {
    constructor() {
        // Apenas templates - não precisa de estado
    }

    criarSeletorEventos(eventos, seletorId) {
        return `
        <div id="${seletorId}" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4">
            <!-- Novo cabeçalho -->
            <div class="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-800 dark:text-white">Selecione o Evento</h3>
                <button type="button" 
                        onclick="window.eventosService.removerSeletorEventos('${seletorId}')"
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                <div class="border-r border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto" id="lista-eventos-${seletorId}">
                    ${eventos.map(evento => this.criarItemListaEvento(evento)).join('')}
                </div>
                <div class="md:col-span-2 lg:col-span-3 p-4" id="detalhes-evento-${seletorId}">
                    <div class="flex items-center justify-center h-full">
                        <p class="text-gray-500">Selecione um evento para ver detalhes</p>
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * Templates de UI para eventos
     */
    criarItemListaEvento(evento) {
        // Constrói caminho correto da imagem com URL_BASE
        const imagemPath = evento.foto 
            ? `${window.URL_BASE}/assets/img/eventos/${evento.foto}`
            : `${window.URL_BASE}/assets/img/placeholder.jpg`;
        
        const horario = evento.hora ? evento.hora.substring(0, 5) : ''; // Format HH:MM
        
        return `
        <div class="evento-item flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700" data-evento-id="${evento.id}">
            <!-- Miniatura da imagem -->
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                <img src="${imagemPath}" alt="${evento.nome}" class="w-full h-full object-cover" onerror="this.src='${window.URL_BASE}/assets/img/placeholder.jpg'">
            </div>
            <!-- Informações do evento -->
            <div class="ml-3 flex-1">
                <h4 class="text-sm font-medium text-gray-800 dark:text-white truncate">${evento.nome}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ${horario} · <span class="capitalize">${evento.dia_semana || ''}</span>
                </p>
            </div>
        </div>`;
    }

    criarCardEventoDetalhado(evento) {
        // Constrói caminho correto da imagem com URL_BASE
        const imagemPath = evento.foto 
            ? `${window.URL_BASE}/assets/img/eventos/${evento.foto}`
            : `${window.URL_BASE}/assets/img/placeholder.jpg`;
        
        const horario = evento.hora ? evento.hora.substring(0, 5) : '';
        
        return `
        <div class="evento-detalhado bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <!-- Cabeçalho do evento -->
            <div class="bg-gradient-to-r from-primary-600 to-primary-700 p-4 flex items-center">
                <div class="w-16 h-16 bg-white/20 rounded-full overflow-hidden flex-shrink-0">
                    <img src="${imagemPath}" alt="${evento.nome}" class="w-full h-full object-cover" onerror="this.src='${window.URL_BASE}/assets/img/placeholder.jpg'">
                </div>
                <div class="ml-4 flex-1">
                    <h3 class="text-xl font-bold text-white">${evento.nome}</h3>
                    <div class="flex items-center text-white/80 text-sm">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${horario} · <span class="capitalize ml-1">${evento.dia_semana || ''}</span>
                        <span class="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">${evento.tipo || ''}</span>
                    </div>
                </div>
            </div>
            
            <!-- Conteúdo do evento - Espaço para atividades e voluntários -->
            <div class="p-4">
                <h4 class="text-lg font-medium text-gray-800 dark:text-white mb-4">Atividades e Voluntários</h4>
                
                <!-- Layout para atividades e voluntários -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Coluna Atividades -->
                    <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                        <h5 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Atividades
                        </h5>
                        <div class="space-y-2 min-h-[100px] flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                            <p>Espaço reservado para atividades</p>
                        </div>
                    </div>
                    
                    <!-- Coluna Voluntários -->
                    <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                        <h5 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Voluntários
                        </h5>
                        <div class="space-y-2 min-h-[100px] flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                            <p>Espaço reservado para voluntários</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }
}

// Inicialização
window.eventosComponentesService = new EventosComponentesService();
