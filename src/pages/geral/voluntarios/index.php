<?php
$pageTitle = "Listagem Geral Voluntários";
require_once __DIR__ . '/../../../components/layout/header.php';

?>

<main class="with-sidebar mt-24 px-6 pb-8 dark:bg-gray-900">
  <div class="max-w-8xl mx-auto">
        <!-- Cabeçalho -->
        <div class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Voluntários</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Gerencie os voluntários do ministério</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <div class="flex gap-2">
                    </div>
                </div>
            </div>

            <!-- Filtros e Botão -->
            <div class="mt-6 flex flex-col lg:flex-row gap-4">
                <!-- Busca -->
                <div class="relative flex-1">
                    <input type="text" 
                           id="search-input" 
                           class="w-full pl-10 pr-4 py-3 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                           placeholder="Buscar por nome ou CPF..."
                           autocomplete="off">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>
                </div>

                <!-- Filtro por Ministério -->
                <div class="lg:w-64">
                    <select id="ministerio-filter" 
                            class="w-full px-3 py-3 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option value="">Todos os ministérios</option>
                    </select>
                </div>

                <!-- Filtro por Status -->
                <div class="lg:w-48">
                    <select id="status-filter" 
                            class="w-full px-3 py-3 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option value="all">Todos os status</option>
                        <option value="ativo">Ativo</option>
                        <option value="pendente">Pendente</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>

                <!-- Botão Limpar Filtros -->
                <div class="lg:w-auto">
                    <button id="clear-filters" 
                            class="w-full lg:w-auto px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                        Limpar Filtros
                    </button>
                </div>
            </div>

            <!-- Contador de Resultados -->
            <div class="mt-4">
                <p id="results-counter" class="text-sm text-gray-600 dark:text-gray-400">
                    Carregando...
                </p>
            </div>
        </div>

        <!-- Loading e Mensagens -->
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
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200" id="error-message">Erro ao carregar voluntários</h3>
                </div>
            </div>
        </div>

        <div id="empty-state" class="hidden text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum voluntário encontrado</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece adicionando voluntários ao ministério.</p>
        </div>

        <!-- Lista de Voluntários -->
        <div id="voluntarios-grid" class="hidden">
            <div class="grid gap-6">
                <!-- Lista em formato de cards -->
                <div id="voluntarios-list" class="space-y-4">
                    <!-- Preenchido via JavaScript -->
                </div>
            </div>
        </div>

    </div>
</main>

<!-- Scripts -->
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/voluntarios/js/api.service.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/voluntarios/js/ux.service.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/voluntarios/js/filter.service.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/voluntarios/js/app.js"></script>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>
