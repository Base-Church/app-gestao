<?php
// Configurações da página
$pageTitle = "Escalas";

// Incluir o header
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho da Página -->
        <div class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Escalas</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Gerencie as escalas do ministério</p>
                </div>
            </div>

            <!-- Filtros e Botão -->
            <div class="mt-6 flex flex-col sm:flex-row gap-4">
                <!-- Campo de Busca -->
                <!-- Botão Criar -->
                <div class="flex-none">
                    <a href="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/criar.php" 
                       class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors">
                        <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Nova Escala
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
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200" id="error-message">Erro ao carregar escalas</h3>
                </div>
            </div>
        </div>

        <div id="empty-state" class="hidden text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma escala encontrada</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece criando uma nova escala para o ministério.</p>
        </div>

        <!-- Lista de Escalas -->
        <div id="escalas-grid" class="hidden">
            <!-- Botão Toggle Escalas -->
            <div class="mb-4 flex justify-between items-center">
                <button id="toggle-escalas" 
                        class="inline-flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                    <span>Mostrar todas as escalas</span>
                </button>
                <span class="text-sm text-gray-500 dark:text-gray-400" id="escalas-count"></span>
            </div>

            <!-- Lista em Cards -->
            <div class="space-y-4" id="escalas-list">
                <!-- Preenchido via JavaScript -->
            </div>
        </div>
    </div>
</main>


<!-- Modal de Compartilhamento -->
<div id="share-modal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity hidden" aria-modal="true">
    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
            <div class="relative w-full max-w-lg transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
                <!-- Header do Modal -->
                <div class="flex items-center justify-between border-b dark:border-gray-700 px-6 py-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white" id="modal-title">
                        Compartilhar Escala
                    </h3>
                    <button type="button" 
                            id="share-modal-cancel"
                            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                        <span class="sr-only">Fechar</span>
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Corpo do Modal -->
                <div class="px-6 py-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        Deseja compartilhar esta escala no grupo do WhatsApp?
                    </p>
                </div>

                <!-- Footer do Modal -->
                <div class="border-t dark:border-gray-700 px-6 py-4">
                    <div class="flex justify-end space-x-3">
                        <button type="button" 
                                id="share-modal-cancel-btn"
                                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Cancelar
                        </button>
                        <button type="button" 
                                id="share-modal-confirm"
                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Compartilhar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<script type="module">
    window.USER = {
        ministerios: <?= json_encode(SessionService::getMinisterios()) ?>,
        organizacao_id: <?= SessionService::getOrganizacaoId() ?>,
        nivel: <?= json_encode(SessionService::getNivel()) ?>,
        ministerio_atual: <?= SessionService::getMinisterioAtual() ?> // Adicionar ministério atual
    };
    
    window.ENV = {
        API_BASE_URL: '<?= $_ENV['API_BASE_URL'] ?>',
        API_KEY: '<?= $_ENV['API_KEY'] ?>',
        URL_BASE: '<?= $_ENV['URL_BASE'] ?>'
    };
</script>

<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/js/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/js/share-escala.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/js/main-list.js"></script>