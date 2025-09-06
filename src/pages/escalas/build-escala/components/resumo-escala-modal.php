<div id="modal-resumo-escala" class="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 p-4">
    <div class="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-2xl w-[80vw] h-[85vh] p-0 overflow-hidden relative animate-fade-in flex flex-col">
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-primary-600 flex-shrink-0">
            <h2 class="text-xl font-bold text-white">Resumo da Escala</h2>
            <button class="fechar-modal-resumo text-white hover:text-red-300 text-2xl leading-none">&times;</button>
        </div>
        <div class="flex flex-col flex-1 min-h-0">
            <div class="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <button type="button" id="tab-btn-resumo" tabindex="0" class="tab-resumo-ativa flex-1 px-4 py-3 text-center font-semibold bg-primary-50 dark:bg-gray-800 text-primary-700 dark:text-primary-200 border-b-2 border-primary-600 focus:outline-none transition" data-tab="resumo">
                    Resumo
                </button>
                <button type="button" id="tab-btn-fora" tabindex="0" class="tab-resumo-inativa flex-1 px-4 py-3 text-center font-semibold bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-200 border-b-2 border-transparent focus:outline-none transition" data-tab="fora">
                    Fora da Escala
                </button>
            </div>
            <div id="tab-conteudo-resumo" class="p-6 flex-1 overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    <div class="flex flex-col min-h-0">
                        <h3 class="font-semibold text-primary-700 dark:text-primary-200 mb-2 text-base flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Eventos Selecionados
                            <span class="text-xs bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200 px-2 py-1 rounded-full" id="eventos-count">0</span>
                        </h3>
                        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-1 overflow-hidden p-3">
                            <div id="resumo-eventos-list" class="h-full overflow-y-auto space-y-2 text-sm text-gray-800 dark:text-gray-100 sortable-eventos"></div>
                        </div>
                    </div>
                    <div class="flex flex-col min-h-0">
                        <h3 class="font-semibold text-primary-700 dark:text-primary-200 mb-2 text-base flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                            </svg>
                            Voluntários Escolhidos
                            <span class="text-xs bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200 px-2 py-1 rounded-full" id="voluntarios-count">0</span>
                        </h3>
                        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-1 overflow-hidden p-3 relative">
                            <div id="resumo-voluntarios-list" class="h-full overflow-y-auto space-y-2 text-sm text-gray-800 dark:text-gray-100 transition-all duration-300"></div>
                            
                            <!-- Painel lateral para eventos do voluntário -->
                            <div id="voluntario-eventos-panel" class="absolute top-0 right-0 w-full h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-600 transform translate-x-full transition-transform duration-300 ease-in-out z-10 rounded-r-lg overflow-hidden hidden">
                                <div class="flex flex-col h-full">
                                    <!-- Header do painel -->
                                    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 bg-primary-50 dark:bg-gray-800">
                                        <div class="flex items-center gap-3">
                                            <img id="panel-voluntario-foto" src="" class="w-10 h-10 rounded-full object-cover" alt="Voluntário">
                                            <div>
                                                <h4 id="panel-voluntario-nome" class="font-semibold text-gray-900 dark:text-white">-</h4>
                                                <p id="panel-voluntario-info" class="text-xs text-gray-500 dark:text-gray-400">-</p>
                                            </div>
                                        </div>
                                        <button id="fechar-eventos-panel" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <!-- Conteúdo do painel -->
                                    <div class="flex-1 overflow-y-auto p-4">
                                        <div class="space-y-3" id="panel-eventos-lista">
                                            <!-- Eventos serão inseridos aqui -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="tab-conteudo-fora" class="p-6 flex-1 overflow-hidden hidden">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    <div class="flex flex-col min-h-0">
                        <h3 class="font-semibold text-primary-700 dark:text-primary-200 mb-2 text-base flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Eventos fora da escala
                        </h3>
                        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-1 overflow-hidden p-3">
                            <div id="fora-eventos-list" class="h-full overflow-y-auto grid grid-cols-1 gap-2"></div>
                        </div>
                    </div>
                    <div class="flex flex-col min-h-0">
                        <h3 class="font-semibold text-primary-700 dark:text-primary-200 mb-2 text-base flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                            </svg>
                            Voluntários não escolhidos
                        </h3>
                        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-1 overflow-hidden p-3">
                            <div id="fora-voluntarios-list" class="h-full overflow-y-auto grid grid-cols-1 gap-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>