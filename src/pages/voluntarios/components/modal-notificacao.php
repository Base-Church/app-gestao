<div id="modal-notificacao" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden" style="z-index: 9999;" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-2xl transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <!-- Header do Modal -->
                <div class="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        Notificar Voluntários
                    </h3>
                    <button type="button" 
                            onclick="window.notificacaoApp.toggleModal(false)"
                            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <span class="sr-only">Fechar</span>
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Corpo do Modal -->
                <div class="px-6 py-4">
                    <div class="space-y-4">
                        <!-- Estatísticas -->
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
                                <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-300">Não Preencheram</h4>
                                <p class="text-2xl font-semibold text-yellow-900 dark:text-yellow-200" id="nao-preencheu-count">0</p>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                                <h4 class="text-sm font-medium text-gray-800 dark:text-gray-300">Desatualizados</h4>
                                <p class="text-2xl font-semibold text-gray-900 dark:text-gray-200" id="desatualizado-count">0</p>
                            </div>
                        </div>

                        <!-- Lista de Voluntários com Rolagem -->
                        <div class="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            <!-- Botão Selecionar Todos -->
                            <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 pb-2 mb-2 border-b dark:border-gray-700">
                                <button type="button"
                                        onclick="window.notificacaoApp.toggleSelecionarTodos()"
                                        class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500">
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16M4 12h16m-7 7h7"/>
                                    </svg>
                                    Selecionar Todos
                                </button>
                            </div>
                            <div class="space-y-4 px-1" id="voluntarios-notificacao">
                                <!-- Preenchido via JavaScript -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer do Modal -->
                <div class="border-t dark:border-gray-700 px-6 py-4">
                    <div class="flex justify-end space-x-3">
                        <button type="button" 
                                onclick="window.notificacaoApp.toggleModal(false)"
                                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            Fechar
                        </button>
                        <button type="button" 
                                onclick="window.notificacaoApp.notificarTodos()"
                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-500">
                            Notificar Todos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
/* Garantir que o modal fique acima de tudo */
#modal-notificacao {
    z-index: 9999 !important;
}

/* Ajuste para o loading overlay */
.loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(2px);
}

.dark .loading-overlay {
    background: rgba(31, 41, 55, 0.9);
}
</style>
