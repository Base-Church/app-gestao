<!-- Modal de Criação/Edição -->
<div id="modal-create" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-lg transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <!-- Header do Modal -->
                <div class="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white" id="modal-title">
                        Nova Atividade
                    </h3>
                    <button type="button" 
                            onclick="window.app.toggleModal(false)"
                            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                        <span class="sr-only">Fechar</span>
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Corpo do Modal -->
                <div class="px-6 py-4">
                    <form id="form-create" class="space-y-4">
                        <input type="hidden" id="atividade-id" name="id" value="">
                        <input type="hidden" id="ministerio_id" name="ministerio_id" value="">
                        <input type="hidden" id="foto" name="foto" value="">

                        <!-- Nome -->
                        <div class="space-y-1">
                            <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nome da Atividade
                            </label>
                            <input type="text" 
                                   name="nome" 
                                   id="nome" 
                                   class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm" 
                                   placeholder="Digite o nome da atividade"
                                   required>
                        </div>

                        <!-- Categoria -->
                        <div class="space-y-1">
                            <label for="categoria_atividade_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Categoria
                            </label>
                            <select name="categoria_atividade_id" 
                                    id="categoria_atividade_id" 
                                    class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    required>
                                <option value="">Selecione uma categoria</option>
                                <!-- As opções serão inseridas via JavaScript -->
                            </select>
                        </div>

                        <!-- Cor do Indicador -->
                        <div class="space-y-1">
                            <label for="cor_indicador" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cor do Indicador
                            </label>
                            <div class="flex items-center space-x-2">
                                <input type="color" 
                                       name="cor_indicador" 
                                       id="cor_indicador" 
                                       class="h-10 w-20 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" 
                                       value="#33ccad">
                                <span class="text-sm text-gray-500 dark:text-gray-400">
                                    Escolha uma cor para identificar a atividade
                                </span>
                            </div>
                        </div>

                        <!-- Foto -->
                        <div class="space-y-1">
                            <label for="foto_input" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Foto
                            </label>
                            <div class="mt-1 flex items-center space-x-4">
                                <div class="flex-shrink-0">
                                    <div id="foto_preview" class="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                                        <svg class="h-8 w-8 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="flex-grow">
                                    <label for="foto_input" 
                                           class="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                        <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Escolher Foto
                                    </label>
                                    <input type="file" 
                                           id="foto_input" 
                                           accept="image/*"
                                           class="hidden"
                                           onchange="handleFotoChange(event)">
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
                                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Cancelar
                        </button>
                        <button type="submit" 
                                form="form-create"
                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            <span id="modal-submit-text">Criar Atividade</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function handleFotoChange(event) {
    const file = event.target.files[0];
    if (file) {
        // Atualiza o preview
        const preview = document.getElementById('foto_preview');
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" class="h-full w-full object-cover">`;
            // Salva a imagem em base64 no input hidden
            document.getElementById('foto').value = e.target.result;
        }
        
        reader.readAsDataURL(file);
    }
}
</script>

<button type="button"
        data-edit="<?= $atividade['id'] ?>"
        data-nome="<?= htmlspecialchars($atividade['nome']) ?>"
        data-categoria-id="<?= $atividade['categoria_atividade_id'] ?>"
        data-cor-indicador="<?= $atividade['cor_indicador'] ?>"
        data-foto="<?= $atividade['foto'] ?>"
        class="text-primary-600 hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-400">
    <span class="sr-only">Editar</span>
    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
    </svg>
</button>
