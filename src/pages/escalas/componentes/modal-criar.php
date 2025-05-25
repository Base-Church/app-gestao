<div id="modal-criador-escala" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden" style="z-index: 9999;" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-2xl transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <!-- Header do Modal -->
                <div class="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                      Criador de Escalas
                    </h3>
                    <button type="button" 
                            onclick="document.getElementById('modal-criador-escala').classList.add('hidden')"
                            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <span class="sr-only">Fechar</span>
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Corpo do Modal -->
                <div class="px-6 py-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Opção 1: Criador Tradicional -->
                        <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 shadow group hover:shadow-lg transition">
                            <svg class="w-12 h-12 text-primary-600 dark:text-primary-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Criador Tradicional</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                                Crie escalas, preenchendo todos os campos e eventos de forma personalizada.
                            </p>
                            <a href="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/criar.php"
                               class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 transition">
                                Usar Tradicional
                            </a>
                        </div>
                        <!-- Opção 2: Novo Criador (Beta) -->
                        <div class="flex flex-col items-center bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6 shadow group hover:shadow-lg transition border-2 border-primary-200 dark:border-primary-700">
                            <svg class="w-12 h-12 text-primary-700 dark:text-primary-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 014-4h4m0 0V7m0 4l-4-4m4 4l4-4"/>
                            </svg>
                            <h4 class="text-lg font-semibold text-primary-700 dark:text-primary-300 mb-2">Novo Criador (Beta)</h4>
                            <p class="text-sm text-primary-800 dark:text-primary-200 text-center mb-4">
                                Experimente o novo criador de escalas, mais rápido e inteligente, com sugestões visão geral.
                            </p>
                            <a href="<?= $_ENV['URL_BASE'] ?>/escalas/criar"
                               class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-700 hover:bg-primary-600 transition">
                                Usar Novo Criador
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Footer do Modal -->
                <div class="border-t dark:border-gray-700 px-6 py-4 flex justify-end">
                    <button type="button" 
                            onclick="document.getElementById('modal-criador-escala').classList.add('hidden')"
                            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
