<!-- Modal de Criação/Edição -->
<div id="modal-create" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-lg transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <!-- Header -->
                <div class="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white" id="modal-title">
                        Novo Líder
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

                <!-- Formulário -->
                <div class="px-6 py-4">
                    <form id="form-create" class="space-y-6">
                        <input type="hidden" id="lider-id" name="id" value="">

                        <!-- Foto Preview -->
                        <div class="space-y-1">
                            <div class="mt-1 flex items-center justify-center">
                                <div class="relative h-24 w-24">
                                    <div id="foto-loading" class="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hidden">
                                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                                    </div>
                                    <img id="foto-preview" 
                                         src="<?= $_ENV['URL_BASE'] ?>/assets/img/placeholder.jpg" 
                                         alt="Preview" 
                                         class="h-full w-full rounded-full object-cover">
                                </div>
                            </div>
                        </div>

                        <!-- Nome -->
                        <div class="space-y-1">
                            <label for="nome" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nome
                            </label>
                            <input type="text" 
                                   name="nome" 
                                   id="nome" 
                                   class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm" 
                                   required>
                        </div>

                        <!-- WhatsApp com evento de busca de foto -->
                        <div class="space-y-1">
                            <label for="whatsapp" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                WhatsApp
                            </label>
                            <input type="tel" 
                                   name="whatsapp" 
                                   id="whatsapp" 
                                   class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                   placeholder="(11) 99999-9999"
                                   required>
                        </div>

                        <!-- Ministério -->
                        <div class="space-y-1">
                            <label for="ministerio_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Ministério
                            </label>
                            <select name="ministerio_id" 
                                    id="ministerio_id" 
                                    class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    required>
                                <option value="">Selecione um ministério</option>
                                <?php foreach (SessionService::getMinisterios() as $ministerio): ?>
                                    <option value="<?= $ministerio['id'] ?>"><?= $ministerio['nome'] ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </form>
                </div>

                <!-- Footer -->
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
                            <span id="modal-submit-text">Criar Líder</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Variável para controlar o timeout da busca
let whatsappTimeout;
const submitButton = document.querySelector('button[type="submit"]');
const fotoLoading = document.getElementById('foto-loading');

// Evento de digitação no campo WhatsApp
document.getElementById('whatsapp').addEventListener('input', function(e) {
    clearTimeout(whatsappTimeout);
    
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    }
    e.target.value = value;

    // Se tiver 11 dígitos, busca a foto
    if (value.replace(/\D/g, '').length === 11) {
        fotoLoading.classList.remove('hidden');
        submitButton.disabled = true;
        
        whatsappTimeout = setTimeout(async () => {
            try {
                const filename = await window.app.api.fetchProfilePicture(value);
                if (filename) {
                    document.getElementById('foto-preview').src = `${window.USER.baseUrl}/assets/img/lideres/${filename}`;
                }
            } finally {
                fotoLoading.classList.add('hidden');
                submitButton.disabled = false;
            }
        }, 500);
    }
});
</script>