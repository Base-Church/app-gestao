<?php
// Configurações da página
$pageTitle = "Ordem de Culto";

// Incluir o header
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho da Página -->
        <div class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ordem de Culto</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Gerencie as ordens de culto</p>
                </div>
            </div>

            <!-- Filtros e Botão -->
            <div class="mt-6 flex flex-col sm:flex-row gap-4">
                <div class="flex-none">
                    <a href="<?= $_ENV['URL_BASE'] ?>/src/pages/orden-culto/criar/" 
                       class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors">
                        <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Nova Ordem de Culto
                    </a>
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
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200" id="error-message">Erro ao carregar ordens de culto</h3>
                </div>
            </div>
        </div>

        <div id="empty-state" class="hidden text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma ordem de culto encontrada</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece criando uma nova ordem de culto.</p>
        </div>

        <!-- Lista de Ordens de Culto -->
        <div id="ordens-grid" class="hidden">
            <!-- Lista em formato lista -->
            <div class="space-y-3" id="ordens-list">
                <!-- Preenchido via JavaScript -->
            </div>
        </div>
    </div>
</main>

<script type="module">
    window.USER = {
        ministerios: <?= json_encode(SessionService::getMinisterios()) ?>,
        organizacao_id: <?= SessionService::getOrganizacaoId() ?>,
        nivel: <?= json_encode(SessionService::getNivel()) ?>,
        ministerio_atual: <?= SessionService::getMinisterioAtual() ?>
    };
    
    window.ENV = {
        API_BASE_URL: '<?= $_ENV['API_BASE_URL'] ?>',
        API_KEY: '<?= $_ENV['API_KEY'] ?>',
        URL_BASE: '<?= $_ENV['URL_BASE'] ?>'
    };
</script>

<!-- Scripts -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/orden-culto/js/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/orden-culto/js/main-list.js"></script>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>
