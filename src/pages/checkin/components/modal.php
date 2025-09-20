<!-- Modal de Criação/Edição de Check-in -->
<div id="modal-checkin" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden" style="z-index: 9999;" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-6xl transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <!-- Header do Modal -->
                <div class="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white" id="modal-title">
                        Check-in
                    </h3>
                    <button type="button" 
                            id="btn-close-modal"
                            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <span class="sr-only">Fechar</span>
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <!-- Corpo do Modal -->
                <div class="px-6 py-4">
                    <form id="form-create" class="space-y-6">
                        <input type="hidden" id="checkin-id" name="id" value="">
                        <input type="hidden" id="ministerio-id" name="ministerio_id" value="">
                        
                        <!-- Grid Principal -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Configuração Geral -->
                            <div class="space-y-4">
                                <h4 class="text-md font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Configuração Geral
                                </h4>
                                
                                <!-- Nome do Check-in -->
                                <div>
                                    <label for="checkin-nome" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Nome do Check-in
                                    </label>
                                    <input type="text" 
                                           name="nome" 
                                           id="checkin-nome" 
                                           class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
                                           placeholder="Ex: Check-in Evento da Manhã"
                                           required>
                                </div>
                                
                                <!-- Formulário e Processo lado a lado -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Formulário -->
                                    <div>
                                        <label for="checkin-formulario" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Formulário
                                        </label>
                                        <select name="formulario_id" 
                                                id="checkin-formulario" 
                                                class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6"
                                                required>
                                            <option value="">Selecione um formulário</option>
                                        </select>
                                    </div>
                                    
                                    <!-- Processo -->
                                    <div>
                                        <label for="checkin-processo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Processo
                                        </label>
                                        <select name="processo_etapa_id" 
                                                id="checkin-processo" 
                                                class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                            <option value="">Selecione um processo</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <!-- Evento -->
                                <div>
                                    <label for="checkin-evento" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                        Evento
                                    </label>
                                    <select name="evento_id" 
                                            id="checkin-evento" 
                                            class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                        <option value="">Selecione um evento</option>
                                    </select>
                                </div>
                                
                                <!-- Itens do Check-in -->
                                <div>
                                    <div class="flex items-center justify-between mb-3">
                                        <label class="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Itens do Check-in
                                        </label>
                                        <button type="button" 
                                                id="add-checkin-item-btn" 
                                                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                            Adicionar Item
                                        </button>
                                    </div>
                                    <!-- Container com rolagem para itens -->
                                    <div id="checkin-itens-container" class="max-h-64 overflow-y-auto space-y-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                                        <div class="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                                            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                            </svg>
                                            <p class="font-medium">Nenhum item adicionado</p>
                                            <p class="mt-1">Clique em "Adicionar Item" para começar</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Pessoas com Acesso -->
                            <div class="space-y-4">
                                <h4 class="text-md font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Controle de Acesso
                                </h4>
                                
                                <div>
                                    <div class="flex items-center justify-between mb-3">
                                        <label class="block text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Pessoas Autorizadas
                                        </label>
                                        <button type="button" 
                                                id="add-checkin-acesso-btn" 
                                                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            Adicionar Pessoa
                                        </button>
                                    </div>
                                    <!-- Container com rolagem para acessos -->
                                    <div id="checkin-acessos-container" class="max-h-64 overflow-y-auto space-y-3 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
                                        <div class="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                                            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                                            </svg>
                                            <p class="font-medium">Nenhuma pessoa autorizada</p>
                                            <p class="mt-1">Clique em "Adicionar Pessoa" para começar</p>
                                        </div>
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
                                id="btn-cancel-modal"
                                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            Cancelar
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>