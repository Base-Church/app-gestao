<!-- Modal de Seleção de Grupos -->
<div id="modalGrupos" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Selecionar Grupos para Campanha
            </h3>
            <button type="button" 
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onclick="closeGroupsModal()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <!-- Busca -->
            <div class="mb-6">
                <div class="relative">
                    <input type="text" 
                           id="searchGroups"
                           class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                           placeholder="Buscar grupos..."
                           onkeyup="filterGroups(this.value)">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>
                </div>
            </div>

            <!-- Seleção Rápida -->
            <div class="mb-6">
                <div class="flex flex-wrap gap-2">
                    <button type="button" 
                            class="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full transition-colors"
                            onclick="selectAllGroups()">
                        Selecionar Todos
                    </button>
                    <button type="button" 
                            class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors"
                            onclick="deselectAllGroups()">
                        Desmarcar Todos
                    </button>
                </div>
            </div>

            <!-- Lista de Grupos -->
            <div id="groupsList" class="space-y-3">
                <!-- Grupos serão carregados aqui -->
                <div class="text-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p class="text-sm text-gray-500 mt-2">Carregando grupos...</p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 p-4">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                    <span id="selectedGroupsCount">0</span> grupo(s) selecionado(s)
                </div>
                <div class="flex gap-2 w-full sm:w-auto">
                    <button type="button" 
                            class="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                            onclick="closeGroupsModal()">
                        Cancelar
                    </button>
                    <button type="button" 
                            id="btnAvancar"
                            class="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onclick="confirmarGrupos()"
                            disabled>
                        Avançar
                    </button>
                </div>
            </div>
        </div>
    </div>
</div> 