<div id="modal-create" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden" style="z-index: 9999;" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-2xl transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <!-- Header do Modal -->
                <div class="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        Voluntário 
                    </h3>
                    <button type="button" 
                            onclick="window.app.toggleModal(false)"
                            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <span class="sr-only">Fechar</span>
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Tabs Navigation -->
                <div class="border-b border-gray-200 dark:border-gray-700">
                    <div class="px-6">
                        <nav class="flex -mb-px space-x-8" aria-label="Tabs">
                            <button type="button" 
                                    onclick="window.app.switchTab('dados')"
                                    class="flex-1 py-4 px-1 text-sm font-medium border-b-2 transition-all duration-200 ease-in-out focus:outline-none 
                                           data-[active=true]:border-primary-500 data-[active=true]:text-primary-600 data-[active=true]:bg-primary-50
                                           data-[active=false]:border-transparent data-[active=false]:text-gray-500 data-[active=false]:hover:text-gray-700 data-[active=false]:hover:border-gray-300
                                           dark:data-[active=true]:border-primary-500 dark:data-[active=true]:text-primary-400 dark:data-[active=true]:bg-primary-900/20
                                           dark:data-[active=false]:text-gray-400 dark:data-[active=false]:hover:text-gray-300 dark:data-[active=false]:hover:border-gray-700"
                                    data-tab="dados"
                                    data-active="true">
                                Dados
                            </button>
                            <button type="button"
                                    onclick="window.app.switchTab('ministerios')" 
                                    class="flex-1 py-4 px-1 text-sm font-medium border-b-2 transition-all duration-200 ease-in-out focus:outline-none
                                           data-[active=true]:border-primary-500 data-[active=true]:text-primary-600 data-[active=true]:bg-primary-50
                                           data-[active=false]:border-transparent data-[active=false]:text-gray-500 data-[active=false]:hover:text-gray-700 data-[active=false]:hover:border-gray-300
                                           dark:data-[active=true]:border-primary-500 dark:data-[active=true]:text-primary-400 dark:data-[active=true]:bg-primary-900/20
                                           dark:data-[active=false]:text-gray-400 dark:data-[active=false]:hover:text-gray-300 dark:data-[active=false]:hover:border-gray-700"
                                    data-tab="ministerios"
                                    data-active="false">
                                Ministérios
                            </button>
                            <button type="button"
                                    onclick="window.app.switchTab('atividades')"
                                    class="flex-1 py-4 px-1 text-sm font-medium border-b-2 transition-all duration-200 ease-in-out focus:outline-none
                                           data-[active=true]:border-primary-500 data-[active=true]:text-primary-600 data-[active=true]:bg-primary-50
                                           data-[active=false]:border-transparent data-[active=false]:text-gray-500 data-[active=false]:hover:text-gray-700 data-[active=false]:hover:border-gray-300
                                           dark:data-[active=true]:border-primary-500 dark:data-[active=true]:text-primary-400 dark:data-[active=true]:bg-primary-900/20
                                           dark:data-[active=false]:text-gray-400 dark:data-[active=false]:hover:text-gray-300 dark:data-[active=false]:hover:border-gray-700"
                                    data-tab="atividades"
                                    data-active="false">
                                Atividades
                            </button>
                            <button type="button"
                                    onclick="window.app.switchTab('calendario')"
                                    class="flex-1 py-4 px-1 text-sm font-medium border-b-2 transition-all duration-200 ease-in-out focus:outline-none
                                           data-[active=true]:border-primary-500 data-[active=true]:text-primary-600 data-[active=true]:bg-primary-50
                                           data-[active=false]:border-transparent data-[active=false]:text-gray-500 data-[active=false]:hover:text-gray-700 data-[active=false]:hover:border-gray-300
                                           dark:data-[active=true]:border-primary-500 dark:data-[active=true]:text-primary-400 dark:data-[active=true]:bg-primary-900/20
                                           dark:data-[active=false]:text-gray-400 dark:data-[active=false]:hover:text-gray-300 dark:data-[active=false]:hover:border-gray-700"
                                    data-tab="calendario"
                                    data-active="false">
                                Calendário
                            </button>
                            <button type="button"
                                    onclick="window.app.switchTab('servicos')"
                                    class="flex-1 py-4 px-1 text-sm font-medium border-b-2 transition-all duration-200 ease-in-out focus:outline-none
                                           data-[active=true]:border-primary-500 data-[active=true]:text-primary-600 data-[active=true]:bg-primary-50
                                           data-[active=false]:border-transparent data-[active=false]:text-gray-500 data-[active=false]:hover:text-gray-700 data-[active=false]:hover:border-gray-300
                                           dark:data-[active=true]:border-primary-500 dark:data-[active=true]:text-primary-400 dark:data-[active=true]:bg-primary-900/20
                                           dark:data-[active=false]:text-gray-400 dark:data-[active=false]:hover:text-gray-300 dark:data-[active=false]:hover:border-gray-700"
                                    data-tab="servicos"
                                    data-active="false">
                                Servindo
                            </button>
                        </nav>
                    </div>
                </div>

                <!-- Corpo do Modal -->
                <div class="px-6 py-4">
                    <form id="form-create" class="space-y-4">
                        <input type="hidden" id="voluntario-id" name="id">
                        <input type="hidden" id="ministerio_id" name="ministerio_id" value="<?= SessionService::getMinisterioAtual() ?>">

                        <!-- Tab Dados -->
                        <div class="tab-content" data-tab="dados">
                            <!-- Nome e Foto -->
                            <div class="flex items-start gap-4 mb-6">
                                <div class="flex-shrink-0">
                                    <div id="foto_preview" class="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                                        <!-- Preview da imagem -->
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nome
                                    </label>
                                    <input type="text" 
                                           name="nome" 
                                           id="nome" 
                                           required
                                           class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                                </div>
                            </div>

                            <!-- WhatsApp -->
                            <div class="space-y-1 mb-6">
                                <label for="whatsapp" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    WhatsApp
                                </label>
                                <input type="tel" 
                                       name="whatsapp" 
                                       id="whatsapp" 
                                       required
                                       class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                            </div>

                            <!-- Status & Onboarding -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="flex items-center space-x-3">
                                        <input type="checkbox" 
                                               name="status" 
                                               id="status"
                                               class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800">
                                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Voluntário Ativo</span>
                                    </label>
                                </div>
                                <div class="space-y-1">
                                    <label class="flex items-center space-x-3">
                                        <input type="checkbox" 
                                               name="onboarding" 
                                               id="onboarding"
                                               class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800">
                                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Concluiu Onboarding</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Tab Ministérios -->
                        <div class="tab-content hidden" data-tab="ministerios">
                            <div id="ministerios-container" class="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                                <div class="flex flex-wrap gap-2">
                                    <!-- Preenchido via JavaScript -->
                                </div>
                            </div>
                        </div>

                        <!-- Tab Atividades -->
                        <div class="tab-content hidden" data-tab="atividades">
                            <div id="atividades-container" class="space-y-6">
                                <!-- Preenchido via JavaScript -->
                            </div>
                        </div>

                        <!-- Tab Calendário -->
                        <div class="tab-content hidden" data-tab="calendario">
                            <div class="space-y-6">
                                <!-- Navegação do Calendário -->
                                <div class="flex items-center justify-between">
                                    <button type="button" 
                                            id="btn-mes-anterior"
                                            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                        Anterior
                                    </button>
                                    
                                    <div class="flex items-center space-x-4">
                                        <select id="select-mes" class="rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                                            <!-- Preenchido via JavaScript -->
                                        </select>
                                        <select id="select-ano" class="rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                                            <!-- Preenchido via JavaScript -->
                                        </select>
                                    </div>
                                    
                                    <button type="button" 
                                            id="btn-proximo-mes"
                                            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        Próximo
                                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>

                                <!-- Grid do Calendário -->
                                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div class="grid grid-cols-7 bg-gray-50 dark:bg-gray-700">
                                        <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-center">Dom</div>
                                        <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-center">Seg</div>
                                        <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-center">Ter</div>
                                        <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-center">Qua</div>
                                        <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-center">Qui</div>
                                        <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-center">Sex</div>
                                        <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-center">Sáb</div>
                                    </div>
                                    <div id="calendario-grid" class="grid grid-cols-7">
                                        <!-- Preenchido via JavaScript -->
                                    </div>
                                </div>

                                <!-- Legenda -->
                                <div class="flex flex-wrap gap-4 text-sm">
                                    <div class="flex items-center space-x-2">
                                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span class="text-gray-700 dark:text-gray-300">Indisponível</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
                                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span class="text-gray-700 dark:text-gray-300">Disponível</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tab Serviços -->
                        <div class="tab-content hidden" data-tab="servicos">
                            <div class="space-y-6">
                                <!-- Navegação dos Serviços -->
                                <div class="flex items-center justify-between">
                                    <button type="button" 
                                            id="btn-servicos-mes-anterior"
                                            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                        Anterior
                                    </button>
                                    
                                    <div class="flex items-center space-x-4">
                                        <select id="select-servicos-mes" class="rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                                            <!-- Preenchido via JavaScript -->
                                        </select>
                                        <select id="select-servicos-ano" class="rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-sm">
                                            <!-- Preenchido via JavaScript -->
                                        </select>
                                    </div>
                                    
                                    <button type="button" 
                                            id="btn-servicos-proximo-mes"
                                            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        Próximo
                                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>

                                <!-- Lista de Serviços -->
                                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <h4 class="text-sm font-medium text-gray-900 dark:text-white">Serviços do Mês</h4>
                                    </div>
                                    <div id="servicos-lista" class="divide-y divide-gray-200 dark:divide-gray-700">
                                        <!-- Preenchido via JavaScript -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Footer do Modal -->
                <div class="border-t dark:border-gray-700 px-6 py-4">
                    <div class="flex justify-end space-x-3">
                        <button type="button" 
                                onclick="window.app.toggleModal(false)"
                                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            Cancelar
                        </button>
                        <button type="submit" 
                                form="form-create"
                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-500">
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
