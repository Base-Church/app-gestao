<!-- Modal de Criação/Edição -->
<div id="modal-create" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden" style="z-index: 9999;" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-2xl transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <!-- Header do Modal -->
                <div class="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        <span id="modal-title">Novo Ministério</span>
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
                <!-- Corpo do Modal -->
                <div class="px-6 py-4">
                    <form id="form-create" class="space-y-4">
                        <input type="hidden" id="ministerio-id" name="id" value="">

                        <!-- Foto -->
                        <div class="flex items-center gap-4">
                            <div class="flex-shrink-0">
                                <div class="h-20 w-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    <img id="foto-preview" 
                                         src="<?= $_ENV['URL_BASE'] ?>/assets/img/placeholder.jpg" 
                                         alt="Preview" 
                                         class="h-full w-full object-cover">
                                </div>
                            </div>
                            <div class="flex-1">
                                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                    Foto do Ministério
                                </label>
                                <input type="file" 
                                       name="foto" 
                                       id="foto" 
                                       accept="image/*"
                                       class="block w-full text-sm text-gray-900 dark:text-gray-200
                                              file:mr-4 file:py-2 file:px-4
                                              file:rounded-md file:border-0
                                              file:text-sm file:font-semibold
                                              file:bg-primary-500 file:text-white
                                              hover:file:bg-primary-600
                                              cursor-pointer">
                            </div>
                        </div>

                        <!-- Nome -->
                        <div>
                            <label for="nome" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                Nome
                            </label>
                            <input type="text" 
                                   name="nome" 
                                   id="nome" 
                                   class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
                                   placeholder="Nome do ministério"
                                   required>
                        </div>

                        <!-- Prefixo -->
                        <div>
                            <label for="prefixo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                Prefixo
                            </label>
                            <input type="text" 
                                   name="prefixo" 
                                   id="prefixo" 
                                   class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
                                   placeholder="Prefixo do ministério"
                                   required>
                        </div>

                        <!-- Grupo WhatsApp -->
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                Grupo WhatsApp
                            </label>
                            <div class="relative">
                                <input type="text" 
                                       id="grupo_whatsapp_search" 
                                       class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
                                       placeholder="Pesquisar grupo...">
                                <input type="hidden" name="grupo_whatsapp" id="grupo_whatsapp" value="">
                                <div id="grupos-list" class="hidden absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    <div class="p-2 grid grid-cols-1 gap-2">
                                        <!-- Grupos serão inseridos aqui via JavaScript -->
                                    </div>
                                </div>
                            </div>
                            <div id="grupo-selecionado" class="mt-2 hidden">
                                <div class="flex items-center p-2 border dark:border-gray-700 rounded-lg">
                                    <img id="grupo-foto" src="" alt="" class="w-12 h-12 rounded-full object-cover">
                                    <div class="ml-3">
                                        <h4 id="grupo-nome" class="text-sm font-medium text-gray-900 dark:text-white"></h4>
                                        <p id="grupo-membros" class="text-sm text-gray-500 dark:text-gray-400"></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Cor -->
                        <div>
                            <label for="cor" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                Cor do Ministério
                            </label>
                            <input type="hidden" name="cor" id="cor" value="#000000">
                            <div id="color-picker" class="h-10"></div>
                            <div class="flex items-center mt-2">
                                <div id="color-preview" class="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 mr-2"></div>
                                <span id="color-value" class="text-sm text-gray-600 dark:text-gray-400"></span>
                            </div>
                        </div>

                        <!-- Descrição -->
                        <div>
                            <label for="descricao" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                Descrição
                            </label>
                            <textarea name="descricao" 
                                      id="descricao" 
                                      class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
                                      placeholder="Descrição do ministério"
                                      rows="3"></textarea>
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
                            <span id="modal-submit-text">Criar Ministério</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>