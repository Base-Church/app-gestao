

<!-- Modal de Configuração do Formulário -->
<!-- Utiliza o serviço global de upload em /config/upload.service.php -->

<!-- Modal de Configuração -->
<div id="config-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 hidden">
    <div class="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="mt-3">
            <!-- Header do Modal -->
            <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Configurações do Formulário</h3>
                <button id="close-config" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Tabs -->
            <div class="mt-4">
                <div class="border-b border-gray-200 dark:border-gray-700">
                    <nav class="-mb-px flex space-x-8">
                        <button class="config-tab-btn active py-2 px-1 border-b-2 border-primary-500 font-medium text-sm text-primary-600 dark:text-primary-400" data-tab="geral">
                            Geral
                        </button>
                        <button class="config-tab-btn py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300" data-tab="aparencia">
                            Aparência
                        </button>
                        <button class="config-tab-btn py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300" data-tab="modo">
                            Modo
                        </button>
                    </nav>
                </div>
                
                <!-- Conteúdo das Tabs -->
                <div class="mt-6">
                    <!-- Tab Geral -->
                    <div id="tab-geral" class="config-tab-content">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug do Formulário</label>
                                <input type="text" id="form-slug"  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">URL amigável para o formulário</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                                <textarea id="form-descricao" rows="3" placeholder="Descrição do formulário" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"></textarea>
                            </div>
                            
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL de Redirecionamento</label>
                                <input type="url" id="form-redirect-url"class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">URL para onde o usuário será redirecionado após enviar o formulário</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tab Aparência -->
                    <div id="tab-aparencia" class="config-tab-content hidden">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cor Ativa</label>
                                <div class="flex items-center space-x-3">
                                    <input type="color" id="form-cor-active" value="#3B82F6" class="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded cursor-pointer">
                                    <input type="text" id="form-cor-active-text" value="#3B82F6" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                </div>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Cor dos elementos ativos do formulário</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cor de Fundo</label>
                                <div class="flex items-center space-x-3">
                                    <input type="color" id="form-cor-bc" value="#ffffff" class="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded cursor-pointer">
                                    <input type="text" id="form-cor-bc-text" value="#ffffff" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                </div>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Cor de fundo do formulário</p>
                            </div>
                            
                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagem do Formulário</label>
                                
                                <!-- Área de preview da imagem -->
                                <div id="image-preview" class="hidden mb-4">
                                    <img id="preview-img" src="" alt="Preview" class="mx-auto h-32 w-auto rounded-md border border-gray-300 dark:border-gray-600">
                                    <div class="text-center mt-2">
                                        <button type="button" id="remove-image" class="text-sm text-red-600 hover:text-red-500">Remover imagem</button>
                                    </div>
                                </div>
                                
                                <!-- Área de crop (oculta inicialmente) -->
                                <div id="crop-area" class="hidden mb-4">
                                    <div class="border border-gray-300 dark:border-gray-600 rounded-md p-4">
                                        <div class="text-center mb-3">
                                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Ajustar Imagem</h4>
                                        </div>
                                        <div id="crop-container" class="max-w-full max-h-64 mx-auto">
                                            <img id="crop-image" src="" alt="Imagem para crop" class="max-w-full">
                                        </div>
                                        <div class="flex justify-center space-x-3 mt-3">
                                            <button type="button" id="cancel-crop-btn" class="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500">
                                                Cancelar
                                            </button>
                                            <button type="button" id="apply-crop-btn" class="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm">
                                                Aplicar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Área de upload -->
                                <div id="upload-area" class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
                                    <div class="space-y-1 text-center">
                                        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        <div class="flex text-sm text-gray-600 dark:text-gray-400">
                                            <label for="form-image-upload" class="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                                <span>Enviar uma imagem</span>
                                                <input id="form-image-upload" name="form_image" type="file" class="sr-only" accept="image/*">
                                            </label>
                                          
                                        </div>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF até 3MB</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">Tamanho recomendado: 650x270px</p>
                                    </div>
                                </div>
                                
                                <input type="hidden" id="form-img-url" name="img_url">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tab Modo -->
                    <div id="tab-modo" class="config-tab-content hidden">
                        <div class="grid grid-cols-1 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Formulário</label>
                                <select id="form-modo" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                    <option value="list">Listagem - Todos os campos em uma página</option>
                                    <option value="step">Etapas - Formulário dividido em etapas</option>
                                </select>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <strong>Listagem:</strong> Todos os campos são exibidos em uma única página.<br>
                                    <strong>Etapas:</strong> O formulário é dividido em múltiplas etapas para melhor experiência do usuário.
                                </p>
                            </div>
                        </div>
                    </div>
                   
                </div>
            </div>
            
            <!-- Footer do Modal -->
            <div class="flex items-center justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                <button id="cancel-config-btn" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 mr-3">
                    Cancelar
                </button>
                <button id="save-config-btn" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md">
                    Salvar Configurações
                </button>
            </div>
        </div>
    </div>
</div>
