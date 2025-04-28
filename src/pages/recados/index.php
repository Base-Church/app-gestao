<?php
$pageTitle = "Recados";
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho -->
        <div class="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Recados
                </h1>
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">
                    Gerencie os recados do ministério
                </p>
            </div>
            <div class="mt-4 sm:mt-0 flex items-center gap-4">
                <?php if (SessionService::getNivel() === 'superadmin'): ?>
                    <!-- Switch para mostrar todos -->
                    <div class="flex items-center">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="show-all" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                            <span class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Mostrar Todos</span>
                        </label>
                    </div>
                <?php endif; ?>
                <button onclick="window.app.toggleModal(true)" 
                        class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Novo Recado
                </button>
            </div>
        </div>

        <!-- Estados da Interface -->
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
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200" id="error-message">
                        Erro ao carregar recados
                    </h3>
                </div>
            </div>
        </div>

        <div id="empty-state" class="hidden text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum recado encontrado</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece criando um novo recado.</p>
        </div>

        <!-- Lista de Recados -->
        <div class="recados-grid grid gap-6" id="recados-list">
            <!-- Recados serão inseridos aqui via JavaScript -->
        </div>
    </div>

    <?php require_once __DIR__ . '/components/modal.php'; ?>
</main>

<script>
    window.USER = {
        ...window.USER,
        baseUrl: '<?= $_ENV['URL_BASE'] ?>',
        ministerio_atual: <?= json_encode(SessionService::getMinisterioAtual()) ?>, // Corrigido de ministerioAtual para ministerio_atual
        organizacao_id: <?= SessionService::getOrganizacaoId() ?>
    };
</script>

<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/recados/js/api.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/recados/js/ui.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/recados/js/main.js"></script>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>
