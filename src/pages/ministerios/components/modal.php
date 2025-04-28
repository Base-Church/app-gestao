<!-- Modal de Criação/Edição -->
    <div id="modal-create" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity hidden">
        <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                            <span id="modal-title">Novo Ministério</span>
                        </h3>
                        
                        <form id="form-create" class="space-y-4">
                            <input type="hidden" id="ministerio-id" name="id" value="">

                            <!-- Foto -->
                            <div class="form-group">
                                <div class="flex items-center space-x-4">
                                    <div class="flex-shrink-0">
                                        <div class="h-20 w-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                            <img id="foto-preview" 
                                                 src="<?= $baseUrl ?>/assets/img/placeholder.jpg" 
                                                 alt="Preview" 
                                                 class="h-full w-full object-cover">
                                        </div>
                                    </div>
                                    <div class="flex-grow">
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
                            </div>

                            <!-- Nome -->
                            <div class="form-group">
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
                            <div class="form-group">
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
                            <div class="form-group">
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
                            <div class="form-group">
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
                            <div class="form-group">
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

                    <div class="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="submit" 
                                form="form-create"
                                class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto">
                            <span id="modal-submit-text">Criar Ministério</span>
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