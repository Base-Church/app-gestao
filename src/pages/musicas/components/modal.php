<div id="modal" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <form id="repertorio-form">
                    <div class="flex gap-6">
                        <!-- Coluna da Esquerda - Formulário -->
                        <div class="flex-1 space-y-6">
                            <!-- Nome da Música -->
                            <div>
                                <label for="nome_musica" class="block text-sm font-medium text-gray-900 dark:text-white">
                                    Nome da Música *
                                </label>
                                <input type="text" 
                                       id="nome_musica" 
                                       name="nome_musica" 
                                       required 
                                       class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                            </div>

                            <!-- Artista/Banda -->
                            <div>
                                <label for="artista_banda" class="block text-sm font-medium text-gray-900 dark:text-white">
                                    Artista/Banda
                                </label>
                                <input type="text" 
                                       id="artista_banda" 
                                       name="artista_banda" 
                                       class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                            </div>

                            <!-- URL do YouTube -->
                            <div>
                                <label for="url" class="block text-sm font-medium text-gray-900 dark:text-white">
                                    URL do YouTube
                                </label>
                                <input type="url" 
                                       id="url" 
                                       name="url" 
                                       onchange="window.app.previewVideo(this.value)"
                                       pattern="^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$"
                                       class="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6">
                                <p class="mt-1 text-sm text-gray-500">Cole aqui o link do vídeo do YouTube (opcional)</p>
                            </div>
                        </div>

                        <!-- Coluna da Direita - Preview -->
                        <div class="flex-1 border-l border-gray-200 dark:border-gray-700 pl-6">
                            <div class="aspect-video rounded-lg bg-gray-100 dark:bg-gray-700">
                                <div id="video-preview" class="w-full h-full">
                                    <!-- O iframe do YouTube será inserido aqui -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end gap-3">
                        <button type="button" 
                                onclick="window.app.toggleModal(false)" 
                                class="rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                            Cancelar
                        </button>
                        <button type="submit" 
                                class="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>