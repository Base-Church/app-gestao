<?php
$pageTitle = "Configurações";
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho -->
        <div class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Gerenciamento do Sistema</p>
                </div>
            </div>
        </div>

        <!-- Tabs e Conteúdo -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <!-- Tabs Navigation -->
            <div class="border-b border-gray-200 dark:border-gray-700">
                <nav class="-mb-px flex" aria-label="Tabs">
                    <button onclick="switchTab('config')" 
                            class="tab-button w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm border-primary-500 text-primary-600 dark:text-primary-500" 
                            data-tab="config">
                        <span class="flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Configurações Gerais
                        </span>
                    </button>
                    <button onclick="switchTab('users')" 
                            class="tab-button w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300" 
                            data-tab="users">
                        <span class="flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Usuários
                        </span>
                    </button>
                </nav>
            </div>

            <!-- Conteúdo das Tabs -->
            <div class="tab-content" id="config-content">
                <div class="p-6">
                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <!-- Configurações da Organização -->
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações da Organização</h3>
                            <!-- Adicione aqui os campos de configuração da organização -->
                        </div>

                        <!-- Configurações do Sistema -->
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Configurações do Sistema</h3>
                            <!-- Adicione aqui as configurações do sistema -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="tab-content hidden" id="users-content">
                <div class="p-6">
                    <!-- Header da Lista de Usuários -->
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Lista de Usuários</h3>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gerencie os usuários do sistema</p>
                        </div>
                        <button onclick="document.getElementById('configModal').classList.remove('hidden')" 
                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Novo Usuário
                        </button>
                    </div>

                    <!-- Lista de Usuários -->
                    <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                        <ul id="usuarios-list" class="divide-y divide-gray-200 dark:divide-gray-700">
                            <!-- Lista de usuários será carregada aqui -->
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php
require_once __DIR__ . '/components/modal.php';
require_once __DIR__ . '/components/modal-permissions.php';
?>

<script>
    window.USER = {
        ministerios: <?= json_encode(SessionService::getMinisterios()) ?>,
        organizacao_id: <?= SessionService::getOrganizacaoId() ?>,
        ministerio_atual: <?= json_encode(SessionService::getMinisterioAtual()) ?>,
        nivel: <?= json_encode(SessionService::getNivel()) ?>
    };
    window.BASE_URL = '<?= $_ENV['URL_BASE'] ?>';
    window.API_KEY = '<?= $_ENV['API_KEY'] ?>';
    
    function switchTab(tabId) {
        // Atualiza classes dos botões
        document.querySelectorAll('.tab-button').forEach(button => {
            const isActive = button.dataset.tab === tabId;
            button.classList.toggle('border-primary-500', isActive);
            button.classList.toggle('text-primary-600', isActive);
            button.classList.toggle('border-transparent', !isActive);
            button.classList.toggle('text-gray-500', !isActive);
        });

        // Mostra/esconde conteúdos
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('hidden', content.id !== `${tabId}-content`);
        });
    }
</script>

<script type="module">
    import { initializePermissionsHandlers } from './js/permissions.js';
    
    // Inicializa os handlers
    initializePermissionsHandlers();
    
    // Importa e expõe funções necessárias globalmente
    import { createUsuario, loadUsuarios } from './js/api.js';
    window.createUsuario = createUsuario;
    window.loadUsuarios = loadUsuarios;
    
    // Carrega dados iniciais
    await loadUsuarios();
</script>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>

