<div id="modal-salvar-escala" class="fixed inset-0 z-[5000] flex items-center justify-center bg-black/40">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Salvar Escala</h3>
            <button type="button" class="fechar-modal-salvar text-gray-400 hover:text-red-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
        <div class="py-4">
            <div class="text-center" id="modal-content-salvar">
                <p class="text-gray-600 dark:text-gray-300">Deseja salvar esta escala?</p>
                <div class="mt-6 flex justify-center gap-3">
                    <button type="button" 
                            class="fechar-modal-salvar px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
                        Cancelar
                    </button>
                    <button type="button"
                            id="btn-confirmar-salvar"
                            class="confirmar-salvar flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg min-w-[120px]">
                        <span>Confirmar</span>
                    </button>
                </div>
            </div>
            <div class="text-center hidden" id="modal-success-salvar">
                <div class="mb-4">
                    <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">Escala salva com sucesso!</p>
                <p class="text-gray-600 dark:text-gray-300 mb-6">A escala foi salva com sucesso.</p>
                <button type="button"
                        onclick="window.location.href='<?= $_ENV['URL_BASE'] ?>/src/pages/escalas'"
                        class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">
                    Ir para Listagem de Escalas
                </button>
            </div>
        </div>
    </div>
</div>
