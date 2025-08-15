<?php
// Página de preenchimentos de um formulário específico
$pageTitle = "Preenchimentos do Formulário";
require_once __DIR__ . '/../../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class=" mx-auto">
        <!-- Cabeçalho da Página -->
        <div class="mb-8">
            <div class="flex items-center mb-4">
                <button id="back-button" 
                        class="mr-4 p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        title="Voltar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Preenchimentos do Formulário</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Visualize os preenchimentos deste formulário</p>
                </div>
            </div>
            
            <!-- Filtro de Busca e Data (client-side) -->
            <div class="mt-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <div class="relative w-full sm:w-1/2">
                        <input type="text" 
                               id="search-input"
                               class="block w-full rounded-md border-0 py-2 pl-10 pr-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
                               placeholder="Buscar preenchimento..."
                               autocomplete="off">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div class="mt-3 sm:mt-0 w-full sm:w-1/2 grid grid-cols-3 gap-2 items-center">
                        <input type="date" id="filter-date-from" class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 sm:text-sm" placeholder="De" />
                        <input type="date" id="filter-date-to" class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 sm:text-sm" placeholder="Até" />
                        <button id="export-selected" class="inline-flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed" title="Exportar selecionados para Excel" disabled>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M8 12l4 4m0 0l4-4m-4 4V4" />
                            </svg>
                            Exportar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estados (Loading, Error, Empty) -->
        <?php include __DIR__ . '/../components/estados.php'; ?>

        <!-- Tabela de Preenchimentos -->
        <div id="preenchimentos-table" class="hidden">
            <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <!-- Corpo da Tabela -->
                <div class="overflow-x-auto">
                    <table class="min-w-full table-fixed w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead id="table-header" class="bg-gray-50 dark:bg-gray-900">
                            <!-- Colunas serão criadas dinamicamente -->
                        </thead>
                        <tbody id="table-body" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <!-- Linhas serão criadas dinamicamente -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</main>

<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/preenchimentos/dados/js/api.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/preenchimentos/dados/js/state.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/preenchimentos/dados/js/ui.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/preenchimentos/dados/js/main.js"></script>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>
