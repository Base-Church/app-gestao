<?php
/**
 * Estados da Aplicação
 * Componente para exibir estados de loading, erro e vazio
 */
?>

<!-- Loading State -->
<div id="loading-indicator" class="flex justify-center py-12">
    <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Carregando formulários...</p>
    </div>
</div>

<!-- Error State -->
<div id="error-container" class="hidden rounded-lg bg-red-50 dark:bg-red-900/50 p-4">
    <div class="flex">
        <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
            </svg>
        </div>
        <div class="ml-3">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200" id="error-message">
                        Erro ao carregar formulários
                    </h3>
                    <p class="mt-1 text-sm text-red-700 dark:text-red-300">
                        Tente recarregar a página ou entre em contato com o suporte.
                    </p>
                </div>
                <button type="button" 
                        onclick="window.location.reload()" 
                        class="ml-4 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-3 py-1 rounded text-sm hover:bg-red-200 dark:hover:bg-red-700 transition-colors">
                    Recarregar
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Empty State -->
<div id="empty-state" class="hidden text-center py-12">
    <div class="flex flex-col items-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-sm font-medium text-gray-900 dark:text-white">Nenhum formulário encontrado</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Não há formulários que correspondam aos critérios de busca.
        </p>
        <div class="mt-4">
            <button type="button" 
                    onclick="window.app.clearFilters()" 
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-200 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Limpar filtros
            </button>
        </div>
    </div>
</div>
