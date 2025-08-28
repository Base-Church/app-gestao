<?php
$pageTitle = "Configurações";
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho -->
        <div class="px-6 mb-6">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Gerencie as configurações do sistema</p>
        </div>

        <!-- Container Principal -->
        <div class="flex flex-col lg:flex-row">
            <!-- Sidebar de Navegação -->
            <div class="w-full lg:w-64 px-6 lg:pr-0">
                <nav class="space-y-1 lg:h-full lg:border-r lg:border-gray-200 dark:lg:border-gray-700">
                    <button data-tab-target="geral"
                            class="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                        <svg class="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        Geral
                    </button>

                    <button data-tab-target="usuarios"
                            class="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                        <svg class="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                        Usuários
                    </button>
                </nav>
            </div>

            <!-- Conteúdo das Tabs -->
            <div class="flex-1 px-6 lg:px-8">
                <!-- Tab Geral -->
                <div data-tab-content="geral" class="hidden">
                    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">
                        Geral
                    </div>
                </div>

                <!-- Tab Usuários -->
                <div data-tab-content="usuarios" class="hidden">
                    <div class="flex justify-between items-center mb-6">
                        <button onclick="usuariosTab.openNewModal()" 
                                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            Novo Usuário
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="usuarios-list">
                        <!-- Lista de usuários será carregada aqui via JavaScript -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php require_once __DIR__ . '/components/modal.php'; ?>

<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/configuracoes/js/main.js"></script>

<?php
// Incluir o footer com os scripts
require_once __DIR__ . '/../../components/layout/footer.php';
?>