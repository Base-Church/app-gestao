<div id="modal-create" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity hidden">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                        Novo Recado
                    </h3>
                    
                    <form id="form-create" class="space-y-4">
                        <!-- Título -->
                        <div>
                            <label for="titulo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Título
                            </label>
                            <input type="text" 
                                   id="titulo" 
                                   name="titulo" 
                                   required
                                   class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                        </div>

                        <!-- Texto -->
                        <div>
                            <label for="texto" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Texto
                            </label>
                            <textarea id="texto" 
                                      name="texto" 
                                      rows="3" 
                                      required
                                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"></textarea>
                        </div>

                        <!-- Validade (opcional) -->
                        <div>
                            <label for="validade" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Válido até (opcional)
                            </label>
                            <input type="date" 
                                   id="validade" 
                                   name="validade"
                                   class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                        </div>

                        <?php if (SessionService::getNivel() === 'superadmin'): ?>
                            <!-- Opção para enviar para todos os ministérios -->
                            <div class="flex items-center">
                                <input type="checkbox" id="enviar-todos" name="enviar_todos" class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                <label for="enviar-todos" class="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Enviar para todos os ministérios
                                </label>
                            </div>
                        <?php endif; ?>
                    </form>
                </div>

                <div class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="submit" 
                            form="form-create"
                            class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto">
                        Criar Recado
                    </button>
                    <button type="button" 
                            onclick="window.app.toggleModal(false)"
                            class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
