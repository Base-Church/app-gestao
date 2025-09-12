

<!-- Modal de Configuração do Formulário -->
<div id="config-modal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden" style="z-index: 9999;" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-4xl transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <!-- Header do Modal -->
                <div class="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        Configurações do Formulário
                    </h3>
                    <button type="button" 
                            id="close-config"
                            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <span class="sr-only">Fechar</span>
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <!-- Tabs -->
                <div class="border-b border-gray-200 dark:border-gray-700 px-6">
                    <nav class="-mb-px flex space-x-8">
                        <button class="config-tab-btn active py-3 px-1 border-b-2 border-primary-500 font-medium text-sm text-primary-600 dark:text-primary-400" data-tab="geral">
                            Geral
                        </button>
                        <button class="config-tab-btn py-3 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300" data-tab="aparencia">
                            Aparência
                        </button>
                        <button class="config-tab-btn py-3 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300" data-tab="modo">
                            Modo
                        </button>
                    </nav>
                </div>
                
                <!-- Corpo do Modal -->
                <div class="px-6 py-4">
                    <form id="form-config" class="space-y-6">
                        <!-- Conteúdo das Tabs -->
                        <div>
                            <!-- Tab Geral -->
                            <div id="tab-geral" class="config-tab-content">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <!-- Slug do Formulário -->
                                    <div>
                                        <label for="form-slug" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Slug do Formulário
                                        </label>
                                        <input type="text" 
                                               name="slug" 
                                               id="form-slug" 
                                               class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
                                               placeholder="Ex: formulario-inscricao">
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">URL amigável para o formulário</p>
                                    </div>
                                    
                                    <!-- URL de Redirecionamento -->
                                    <div>
                                        <label for="form-redirect-url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                            URL de Redirecionamento
                                        </label>
                                        <input type="url" 
                                               name="redirect_url" 
                                               id="form-redirect-url" 
                                               class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
                                               placeholder="https://exemplo.com/obrigado">
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">URL para onde o usuário será redirecionado após enviar o formulário</p>
                                    </div>
                                    
                                    <!-- Descrição -->
                                    <div class="md:col-span-2">
                                        <label for="form-descricao" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Descrição
                                        </label>
                                        <textarea name="descricao" 
                                                  id="form-descricao" 
                                                  rows="3"
                                                  class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
                                                  placeholder="Descrição do formulário"></textarea>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Tab Aparência -->
                            <div id="tab-aparencia" class="config-tab-content hidden">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <!-- Cor Ativa -->
                                    <div>
                                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Cor Ativa
                                        </label>
                                        <div class="flex items-center space-x-3">
                                            <input type="color" 
                                                   id="form-cor-active" 
                                                   value="#3B82F6" 
                                                   class="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer">
                                            <input type="text" 
                                                   id="form-cor-active-text" 
                                                   value="#3B82F6" 
                                                   class="flex-1 rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                        </div>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Cor dos elementos ativos do formulário</p>
                                    </div>
                                    
                                    <!-- Cor de Fundo -->
                                    <div>
                                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Cor de Fundo
                                        </label>
                                        <div class="flex items-center space-x-3">
                                            <input type="color" 
                                                   id="form-cor-bc" 
                                                   value="#ffffff" 
                                                   class="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer">
                                            <input type="text" 
                                                   id="form-cor-bc-text" 
                                                   value="#ffffff" 
                                                   class="flex-1 rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                        </div>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Cor de fundo do formulário</p>
                                    </div>
                                    
                                    <!-- Imagem do Formulário -->
                                    <div class="md:col-span-2">
                                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Imagem do Formulário
                                        </label>
                                        
                                        <!-- Preview da imagem -->
                                        <div id="image-preview" class="hidden mb-4">
                                            <div class="relative inline-block">
                                                <img id="preview-img" 
                                                     src="" 
                                                     alt="Preview" 
                                                     class="mx-auto h-32 w-auto rounded-md border border-gray-300 dark:border-gray-600">
                                                <button type="button" 
                                                        id="remove-image" 
                                                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <!-- Área de crop -->
                                        <div id="crop-area" class="hidden mb-4">
                                            <div class="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-900/50">
                                                <div class="text-center mb-3">
                                                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Ajustar Imagem</h4>
                                                </div>
                                                <div id="crop-container" class="max-w-full max-h-64 mx-auto">
                                                    <img id="crop-image" src="" alt="Imagem para crop" class="max-w-full">
                                                </div>
                                                <div class="flex justify-center space-x-3 mt-3">
                                                    <button type="button" 
                                                            id="cancel-crop-btn" 
                                                            class="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        Cancelar
                                                    </button>
                                                    <button type="button" 
                                                            id="apply-crop-btn" 
                                                            class="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm">
                                                        Aplicar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Área de upload -->
                                        <div id="upload-area" class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                                            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                            <div class="mt-4">
                                                <label for="form-image-upload" class="cursor-pointer">
                                                    <span class="text-sm text-primary-600 hover:text-primary-500 font-medium">Clique para fazer upload</span>
                                                    <input id="form-image-upload" name="form_image" type="file" class="sr-only" accept="image/*">
                                                </label>
                                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">ou arraste e solte aqui</p>
                                            </div>
                                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG, GIF até 3MB</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">Tamanho recomendado: 650x270px</p>
                                        </div>
                                        
                                        <input type="hidden" id="form-img-url" name="img_url">
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Tab Modo -->
                            <div id="tab-modo" class="config-tab-content hidden">
                                <div class="grid grid-cols-1 gap-6">
                                    <div>
                                        <label for="form-modo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                                            Tipo de Formulário
                                        </label>
                                        <select id="form-modo" 
                                                name="modo"
                                                class="w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                            <option value="list">Listagem - Todos os campos em uma página</option>
                                            <option value="step">Etapas - Formulário dividido em etapas</option>
                                        </select>
                                        <div class="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                            <p class="text-xs text-blue-700 dark:text-blue-300">
                                                <strong>Listagem:</strong> Todos os campos são exibidos em uma única página.<br>
                                                <strong>Etapas:</strong> O formulário é dividido em múltiplas etapas para melhor experiência do usuário.
                                            </p>
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
                                id="cancel-config-btn"
                                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            Cancelar
                        </button>
                        <button type="submit" 
                                form="form-config"
                                id="save-config-btn"
                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-500">
                            Salvar Configurações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
