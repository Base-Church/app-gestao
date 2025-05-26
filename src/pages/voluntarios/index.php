<?php
$pageTitle = "Voluntários";
require_once __DIR__ . '/../../components/layout/header.php';
?>

<!-- Move o modal para o container de modais -->
<script>
document.addEventListener('DOMContentLoaded', () => {
    // Move o modal para o container correto
    const modal = document.getElementById('modal-create');
    if (modal) {
        document.getElementById('modals-container').appendChild(modal);
    }
});
</script>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho -->
        <div class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Voluntários</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Gerencie os voluntários do ministério</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <div class="flex gap-2">
                        <button id="notificar-button" 
                                onclick="window.notificacaoApp.toggleModal(true)"
                                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                            </svg>
                            Notificar
                        </button>
                        <button id="sync-button" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Sincronizar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filtros e Botão -->
            <div class="mt-6 flex flex-col sm:flex-row gap-4">
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
            <div class="space-y-4">
                <!-- Lista em formato de cards horizontais -->
                <div id="voluntarios-list" class="space-y-4">
                    <!-- Preenchido via JavaScript -->
                </div>
            </div>
        </div>

    </div>
</main>

<?php
// O modal será movido via JavaScript
require_once __DIR__ . '/components/modal.php';
require_once __DIR__ . '/components/modal-notificacao.php';
require_once __DIR__ . '/../../components/layout/footer.php';
?>

<script type="module">
    // Garantir que as variáveis globais estejam disponíveis antes dos scripts
    window.USER = {
        ministerios: <?= json_encode(SessionService::getMinisterios()) ?>,
        organizacao_id: <?= SessionService::getOrganizacaoId() ?>,
        ministerio_atual: <?= json_encode(SessionService::getMinisterioAtual()) ?>, // Usar json_encode para garantir tipo correto
        nivel: <?= json_encode(SessionService::getNivel()) ?>
    };
    window.BASE_URL = '<?= $_ENV['URL_BASE'] ?>';
    window.API_KEY = '<?= $_ENV['API_KEY'] ?>';
    // Adicionar configurações do WhatsApp
    window.WHATSAPP_API_URL = '<?= $_ENV['WHATSAPP_API_URL'] ?>';
    window.WHATSAPP_API_KEY = '<?= $_ENV['WHATSAPP_API_KEY'] ?>';
    window.WHATSAPP_INSTANCE = '<?= $_ENV['WHATSAPP_INSTANCE'] ?>';

    
    // Verificar se há ministério selecionado
    if (!window.USER.ministerio_atual) {
        document.getElementById('error-message').textContent = 'Selecione um ministério para continuar';
        document.getElementById('error-container').classList.remove('hidden');
    }
</script>

<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/voluntarios/js/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/voluntarios/js/main.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/voluntarios/js/notificacao.js"></script>

