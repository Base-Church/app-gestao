<?php
// Configurações da página
$pageTitle = "Formulários";

// Incluir o header
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho da Página -->
        <div class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Formulários</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Gerencie os formulários do ministério</p>
                </div>
            </div>

            <!-- Filtros e Botão -->
            <div class="mt-6 flex flex-col sm:flex-row gap-4">
                <!-- Create Button -->
                <div class="flex-none">
                    <button type="button"
                        onclick="window.location.href='<?= $_ENV['URL_BASE'] ?>/formularios/criar'"
                        class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors">
                        <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Novo Formulário
                    </button>
                </div>

                <!-- View Submissions Button -->
                <div class="flex-none">
                    <button type="button"
                        onclick="window.location.href='<?= $_ENV['URL_BASE'] ?>/formularios/preenchimentos'"
                        class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors">
                        <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Ver Preenchimentos
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading, Error e Empty States -->
        <div id="loading-indicator" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <div id="error-container" class="hidden rounded-lg bg-red-50 dark:bg-red-900/50 p-4">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200" id="error-message">Erro ao carregar formulários</h3>
                </div>
            </div>
        </div>

        <div id="empty-state" class="hidden text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum formulário encontrado</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece criando um novo formulário para o ministério.</p>
        </div>

        <!-- Lista de Formulários -->
        <div id="formularios-grid" class="hidden">
            <div class="mb-4 flex justify-end items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400" id="formularios-count"></span>
            </div>
            <div class="space-y-4" id="formularios-list">
                <!-- Preenchido via JavaScript -->
            </div>
        </div>
    </div>
</main>

<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/js/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/js/main-list.js"></script>

<?php
// Incluir o footer
require_once __DIR__ . '/../../components/layout/footer.php';
?>
