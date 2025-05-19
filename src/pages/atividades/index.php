<?php
// Configurações da página
$pageTitle = "Atividades";

// Incluir o header
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho da Página -->
        <div class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Atividades</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Gerencie as atividades do ministério</p>
                </div>
            </div>

            <!-- Filtros e Botão -->
            <div class="mt-6 flex flex-col sm:flex-row gap-4">
                <!-- Campo de Busca -->
                <div class="relative flex-1 sm:max-w-xs">
                    <input type="text" id="search-input" 
                           class="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500" 
                           placeholder="Buscar atividades...">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>
                </div>

                <!-- Filtro de Categoria -->
                <div class="relative flex-1 sm:max-w-xs">
                    <select id="categoria-select" 
                            class="w-full px-4 py-2 border rounded-lg dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary-500 dark:focus:border-primary-500">
                        <option value="">Todas as categorias</option>
                    </select>
                </div>

                <!-- Botão Criar -->
                <div class="flex-none">
                    <button onclick="window.app.toggleModal(true)" 
                            class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors">
                        <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Nova Atividade
                    </button>
                </div>
            </div>
        </div>

        <!-- Grid de Atividades -->
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
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200" id="error-message">Erro ao carregar atividades</h3>
                </div>
            </div>
        </div>

        <div id="empty-state" class="hidden text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma atividade encontrada</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece criando uma nova atividade para o ministério.</p>
        </div>

        <!-- Lista de Atividades -->
        <div id="atividades-grid" class="hidden">
            <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Atividade
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Categoria
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Cor
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody id="atividades-list" class="divide-y divide-gray-200 dark:divide-gray-700">
                            <!-- Linhas serão inseridas via JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Paginação -->
        <div id="pagination-container" class="mt-6">
            <!-- Paginação será inserida via JavaScript -->
        </div>
    </div>
</main>

<?php
// Incluir o modal de criação/edição
require_once __DIR__ . '/components/modal.php';

// Incluir o footer com os scripts
require_once __DIR__ . '/../../components/layout/footer.php';
?>

<script>
    window.BASE_URL = '<?= $_ENV['URL_BASE'] ?>';
    window.USER = {
        ministerios: <?= json_encode(SessionService::getMinisterios()) ?>,
        ministerio_atual: <?= json_encode(SessionService::getMinisterioAtual()) ?>,
        organizacao_id: <?= SessionService::getOrganizacaoId() ?>,
        nivel: <?= json_encode(SessionService::getNivel()) ?>
    };
</script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/atividades/js/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/atividades/js/main.js"></script>