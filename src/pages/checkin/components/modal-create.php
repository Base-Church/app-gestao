<!-- Modal de Criação de Check-in -->
<div id="modal-create-checkin" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden" style="z-index: 9999;" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-md transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <!-- Header do Modal -->
                <div class="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        Novo Check-in
                    </h3>
                    <button type="button" 
                            id="btn-close-create-modal"
                            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <span class="sr-only">Fechar</span>
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <!-- Corpo do Modal -->
                <div class="px-6 py-4">
                    <form id="form-create-checkin" class="space-y-4">
                        <!-- Nome do Check-in -->
                        <div>
                            <label for="create-checkin-nome" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                Nome do Check-in *
                            </label>
                            <input type="text" 
                                   name="nome" 
                                   id="create-checkin-nome" 
                                   class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
                                   placeholder="Ex: Check-in Evento da Manhã"
                                   required>
                        </div>
                        
                        <!-- Formulário -->
                        <div>
                            <label for="create-checkin-formulario" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                Formulário *
                            </label>
                            <select name="formulario_id" 
                                    id="create-checkin-formulario" 
                                    class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6"
                                    required>
                                <option value="">Selecione um formulário</option>
                            </select>
                        </div>
                        
                        <!-- Etapas/Processo -->
                        <div>
                            <label for="create-checkin-etapas" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                Etapas
                            </label>
                            <select name="processo_etapa_id" 
                                    id="create-checkin-etapas" 
                                    class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                <option value="">Selecione uma etapa</option>
                            </select>
                        </div>
                        
                        <!-- Evento -->
                        <div>
                            <label for="create-checkin-evento" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                Evento
                            </label>
                            <select name="evento_id" 
                                    id="create-checkin-evento" 
                                    class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                <option value="">Selecione um evento</option>
                            </select>
                        </div>
                    </form>
                </div>
                
                <!-- Footer do Modal -->
                <div class="border-t dark:border-gray-700 px-6 py-4">
                    <div class="flex justify-end space-x-3">
                        <button type="button" 
                                id="btn-cancel-create-modal"
                                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            Cancelar
                        </button>
                        <button type="submit" 
                                form="form-create-checkin"
                                id="btn-save-create-modal"
                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Criar Check-in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>