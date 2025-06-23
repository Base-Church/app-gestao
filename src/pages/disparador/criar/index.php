<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

SessionService::start();

// Verificar se o usuário está logado
if (!SessionService::isLoggedIn()) {
    header('Location: ' . $_ENV['URL_BASE'] . '/login');
    exit;
}

$pageTitle = "Criar Campanha - Disparador";
include_once __DIR__ . '/../../../components/layout/header.php';
?>
<div class="sm:ml-64">
<div class="p-4 sm:p-6 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
        <!-- Header da Página -->
        <div class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Criar Campanha WhatsApp</h1>
                    <p class="text-gray-600 dark:text-gray-400 mt-1">Crie e envie campanhas para múltiplos grupos</p>
                </div>
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <!-- Botão para abrir modal de grupos -->
                    <button type="button" 
                            id="btnEditarGrupos"
                            class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                            onclick="openGroupsModal()">
                        <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        Editar Grupos
                    </button>
                    <button type="button" 
                            class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            onclick="showSendModal()">
                        <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                        Enviar Campanha
                    </button>
                </div>
            </div>
        </div>

        <!-- Informações dos Grupos Selecionados -->
        <div id="gruposInfo" class="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hidden">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Grupos Selecionados</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span id="gruposCount">0</span> grupo(s) selecionado(s)
                    </p>
                </div>
                <button type="button" 
                        class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        onclick="openGroupsModal()">
                    Alterar
                </button>
            </div>
            <div id="gruposList" class="mt-3 flex flex-wrap gap-2">
                <!-- Lista de grupos será exibida aqui -->
            </div>
        </div>

        <!-- Layout Principal - Uma Coluna -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <!-- Header da Seção de Mensagens -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Mensagens da Campanha</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Crie as mensagens que serão enviadas para os grupos selecionados
                        </p>
                    </div>
                    <button type="button" 
                            class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                            onclick="openMessageTypeModal()">
                        <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        Adicionar Mensagem
                    </button>
                </div>
            </div>

            <!-- Container de Mensagens com Rolagem -->
            <div class="p-6">
                <div id="mensagensContainer" class="min-h-[400px] max-h-[600px] overflow-y-auto">
                    <!-- Mensagem inicial -->
                    <div class="text-center py-12">
                        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhuma mensagem criada</h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-4">Clique em "Adicionar Mensagem" para começar a criar sua campanha</p>
                        <button type="button" 
                                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                onclick="openMessageTypeModal()">
                            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            Criar Primeira Mensagem
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Incluir modais -->
<?php include_once 'components/modal-tipo-mensagem.php'; ?>
<?php include_once 'components/modal-grupos.php'; ?>
<?php include_once 'components/modal-envio.php'; ?>

<!-- Scripts -->
<script src="<?php echo $_ENV['URL_BASE']; ?>/src/pages/disparador/criar/js/api.service.js"></script>
<script src="<?php echo $_ENV['URL_BASE']; ?>/src/pages/disparador/criar/js/grupos.service.js"></script>
<script src="<?php echo $_ENV['URL_BASE']; ?>/src/pages/disparador/criar/js/message.service.js"></script>
<script src="<?php echo $_ENV['URL_BASE']; ?>/src/pages/disparador/criar/js/main.controller.js"></script>

<?php include_once __DIR__ . '/../../../components/layout/footer.php'; ?> 