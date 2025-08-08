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
                
                <!-- Botões de ação -->
                <div class="space-y-3">
                    <!-- Botões de Link da Escala -->
                    <div class="flex gap-2">
                        <button type="button"
                                id="btn-link-escala"
                                class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                            </svg>
                            Ver Link
                        </button>
                        <button type="button"
                                id="btn-copiar-link"
                                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                            Copiar URL
                        </button>
                    </div>
                    
                    <!-- Botão Continuar Editando -->
                    <button type="button"
                            id="btn-continuar-editando"
                            class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Continuar Editando
                    </button>
                    
                    <!-- Botão Voltar à Listagem -->
                    <button type="button"
                            onclick="window.location.href='<?= $_ENV['URL_BASE'] ?>/escalas'"
                            class="w-full px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                        </svg>
                        Voltar à Listagem
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
