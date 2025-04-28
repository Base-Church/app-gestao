<!-- Modal de Criação/Edição -->
<div id="modal-create" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity hidden">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                        <span id="modal-title">Nova Notificação</span>
                    </h3>
                    <form id="form-create" class="space-y-4">
                        <!-- Escala Select -->
                        <div class="form-group">
                            <label for="escala-select" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                Selecione a Escala
                            </label>
                            <select id="escala-select" 
                                    name="escala_id" 
                                    class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-600"
                                    required>
                                <option value="">Selecione uma escala...</option>
                            </select>
                        </div>

                        <!-- Eventos da Escala -->
                        <div id="eventos-container" class="space-y-4 mt-4 hidden">
                            <div class="flex justify-between items-center">
                                <h4 class="text-md font-medium text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-gray-800 py-2 z-10">
                                    Eventos da Escala
                                </h4>
                                <button type="button" id="toggle-select-all" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400">
                                    Marcar todos
                                </button>
                            </div>
                            <div id="eventos-list" class="space-y-4 overflow-y-auto h-[50vh] pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                <!-- Eventos serão inseridos aqui -->
                            </div>
                        </div>
                    </form>
                </div>

                <div id="progress-bar-container" class="hidden px-4 py-3">
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                        <div id="progress-bar" class="bg-primary-600 h-2.5 rounded-full transition-all duration-1000" style="width: 0%"></div>
                    </div>
                    <p id="progress-text" class="text-sm text-gray-600 dark:text-gray-300 text-center">Processando...</p>
                </div>

                <div class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button type="submit" 
                            form="form-create"
                            class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto">
                        Criar Notificação
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

