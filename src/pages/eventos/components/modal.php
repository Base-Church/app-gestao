<!-- Modal de Criação/Edição -->
<div id="modal-create" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-lg transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <!-- Header do Modal -->
                <div class="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white" id="modal-title">
                        Novo Evento
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
                    <form id="form-create" class="mt-5 space-y-6">
                        <input type="hidden" id="evento-id" name="id" value="">
                        <input type="hidden" id="foto" name="foto" value="">
                        <input type="hidden" id="organizacao_id" name="organizacao_id" value="<?php echo isset($_SESSION['organizacao_id']) ? $_SESSION['organizacao_id'] : ''; ?>">

                        <!-- Nome -->
                        <div class="space-y-1">
                            <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nome do Evento
                            </label>
                            <input type="text" 
                                   name="nome" 
                                   id="nome" 
                                   class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm" 
                                   placeholder="Digite o nome do evento"
                                   required>
                        </div>

                        <!-- Dia da Semana -->
                        <div class="space-y-1">
                            <label for="dia_semana" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Dia da Semana
                            </label>
                            <select name="dia_semana" 
                                    id="dia_semana" 
                                    class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    required>
                                <option value="">Selecione o dia</option>
                                <option value="domingo">Domingo</option>
                                <option value="segunda">Segunda-feira</option>
                                <option value="terca">Terça-feira</option>
                                <option value="quarta">Quarta-feira</option>
                                <option value="quinta">Quinta-feira</option>
                                <option value="sexta">Sexta-feira</option>
                                <option value="sabado">Sábado</option>
                            </select>
                        </div>

                        <!-- Hora -->
                        <div class="space-y-1">
                            <label for="hora" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Horário
                            </label>
                            <input type="time" 
                                   name="hora" 
                                   id="hora" 
                                   class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm" 
                                   required>
                        </div>

                        <!-- Tipo -->
                        <div class="space-y-1">
                            <label for="tipo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tipo
                            </label>
                            <select name="tipo" 
                                    id="tipo" 
                                    class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    onchange="toggleValidoField()"
                                    required>
                                <option value="">Selecione o tipo</option>
                                <option value="culto">Culto</option>
                                <option value="evento">Evento</option>
                            </select>
                        </div>

                        <!-- Campo Válido (Data/Hora) - Visível apenas para eventos -->
                        <div id="valido-container" class="space-y-1 hidden">
                            <label for="valido" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Data do Evento
                            </label>
                            <input type="date" 
                                   name="valido" 
                                   id="valido" 
                                   class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                        </div>

                        <!-- Visibilidade -->
                        <div class="space-y-1">
                            <label for="visibilidade" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Visibilidade
                            </label>
                            <select name="visibilidade" 
                                    id="visibilidade" 
                                    class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    required>
                                    <option value="">Selecione a visibilidade</option>
                                <option value="interno">Interno</option>
                                <option value="publico">Público</option>
                            </select>
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
                            <span id="modal-submit-text">Criar Evento</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
async function handleFotoChange(event) {
    const file = event.target.files[0];
    if (file) {
        // Atualiza o preview
        const preview = document.getElementById('foto_preview');
        const reader = new FileReader();
        
        reader.onload = async function(e) {
            preview.innerHTML = `<img src="${e.target.result}" class="h-full w-full object-cover">`;
            
            try {
                // Cria um FormData para enviar o arquivo
                const formData = new FormData();
                formData.append('foto', file);
                
                // Envia o arquivo para o servidor
                const response = await fetch(`${window.USER.baseUrl}/src/services/api/upload.php`, {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao fazer upload da imagem');
                }
                
                if (data.success && data.filename) {
                    // Salva apenas o nome do arquivo no input hidden
                    document.getElementById('foto').value = data.filename;
                } else {
                    throw new Error(data.message || 'Erro ao fazer upload da imagem');
                }
            } catch (error) {
                console.error('Erro no upload:', error);
                alert('Erro ao fazer upload da imagem: ' + error.message);
                
                // Limpa o preview e o campo em caso de erro
                preview.innerHTML = `<svg class="h-8 w-8 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>`;
                document.getElementById('foto').value = '';
            }
        }
        
        reader.readAsDataURL(file);
    }
}

function toggleValidoField() {
    const tipoSelect = document.getElementById('tipo');
    const validoContainer = document.getElementById('valido-container');
    const validoInput = document.getElementById('valido');
    
    if (tipoSelect.value === 'evento') {
        validoContainer.classList.remove('hidden');
        validoInput.required = true;
    } else {
        validoContainer.classList.add('hidden');
        validoInput.required = false;
        validoInput.value = '';
    }
}

// Inicializa o campo ao carregar
document.addEventListener('DOMContentLoaded', () => {
    toggleValidoField();
});
</script>
