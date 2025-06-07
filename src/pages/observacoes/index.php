<?php
$pageTitle = "Observações";
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho da Página -->
        <div class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Observações</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Visualize as observações e indisponibilidades dos voluntários</p>
                </div>
            </div>

            <!-- Filtros -->
            <div class="mt-6 flex flex-col sm:flex-row gap-4">
                <div class="relative flex-1 sm:max-w-xs">
                    <input type="month" 
                           id="mes-select" 
                           class="w-full px-4 py-2 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary-500">
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div id="loading-indicator" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <!-- Error State -->
        <div id="error-container" class="hidden rounded-lg bg-red-50 dark:bg-red-900/50 p-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200" id="error-message">Erro ao carregar observações</h3>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div id="empty-state" class="hidden text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma observação encontrada</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Não há observações registradas para o período selecionado.</p>
        </div>

        <!-- Lista de Observações -->
        <div id="observacoes-grid" class="hidden space-y-4">
            <!-- Observações serão inseridas via JavaScript -->
        </div>
    </div>
</main>

<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/observacoes/js/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/observacoes/js/ui.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/observacoes/js/main.js"></script>


<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>