<?php
$pageTitle = "Voluntários";
require_once __DIR__ . '/../../components/layout/header.php';
?>

<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css"/>
    <script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>
</head>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho da Página -->
        <div class="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Ministérios</h1>
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Gerencie os ministérios da organização</p>
            </div>
            <div class="mt-4 sm:mt-0 flex items-center gap-4">
                <!-- Filtro de Busca -->
                <div class="relative">
                    <input type="text" 
                           id="search-input"
                           class="block w-full rounded-md border-0 py-2 pl-10 pr-4 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:focus:ring-primary-500 sm:text-sm sm:leading-6" 
                           placeholder="Buscar ministério...">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>

                <button onclick="window.app.toggleModal(true)" 
                        class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-150 hover:scale-105">
                    <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Novo Ministério
                </button>
            </div>
        </div>

        <!-- Grid de Ministérios -->
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
                    <h3 class="text-sm font-medium text-red-800 dark:text-red-200" id="error-message">Erro ao carregar ministérios</h3>
                </div>
            </div>
        </div>

        <div id="empty-state" class="hidden text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum ministério encontrado</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece criando um novo ministério para sua organização.</p>
        </div>

        <!-- Lista de Ministérios -->
        <div id="ministerios-grid" class="hidden">
            <!-- O grid de cards será renderizado via JS -->
        </div>

        <!-- Paginação -->
        <div id="pagination-container" class="mt-6"></div>
    </div>

    <?php require_once __DIR__ . '/components/modal.php'; ?>
</main>

<script>
    // Disponibiliza as variáveis de ambiente necessárias para o JavaScript
    window.APP_CONFIG = {
        baseUrl: '<?php echo $_ENV['URL_BASE']; ?>',
        apiUrl: '<?php echo $_ENV['API_BASE_URL']; ?>',
        whatsapp: {
            apiUrl: '<?php echo $_ENV['WHATSAPP_API_URL']; ?>',
            apiKey: '<?php echo $_ENV['WHATSAPP_API_KEY']; ?>',
            instance: '<?php echo $_ENV['WHATSAPP_INSTANCE']; ?>'
        }
    };

    // Garantir que as variáveis globais estejam disponíveis antes dos scripts
    window.USER = {
        ministerios: <?= json_encode(SessionService::getMinisterios()) ?>,
        organizacao_id: <?= SessionService::getOrganizacaoId() ?>,
        ministerio_atual: <?= json_encode(SessionService::getMinisterioAtual()) ?>,
        nivel: <?= json_encode(SessionService::getNivel()) ?>
    };
</script>

<!-- Scripts com caminhos corrigidos -->
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/ministerios/js/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/ministerios/js/ui.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/ministerios/js/state.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/ministerios/js/main.js"></script>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>
