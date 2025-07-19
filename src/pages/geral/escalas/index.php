
<?php
$pageTitle = "Relatório Escalas";
require_once __DIR__ . '/../../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-4 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Relatório Escalas</h1>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Dashboard com métricas e indicadores dos ministérios</p>
        </div>

        <!-- Botões de Ação Rápida -->
        <section>
            <div class="mb-6">
                <a href="<?= $_ENV['URL_BASE'] ?>/geral" class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Voltar para Geral
                </a>
            </div>
            
        </section>
        

        <!-- Loading e Erro -->
        <div id="relatorio-loading" class="flex justify-center items-center py-12">
            <div class="flex items-center space-x-3">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span class="text-gray-500 dark:text-gray-400">Carregando relatório...</span>
            </div>
        </div>
        <div id="relatorio-erro" class="hidden text-center py-12">
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <span class="text-red-600 dark:text-red-400 font-semibold">Erro ao carregar relatório.</span>
            </div>
        </div>

        <!-- Conteúdo do Relatório -->
        <div id="relatorio-geral" class="hidden space-y-8">
            <!-- Cards de métricas e eventos serão renderizados via JS -->
        </div>

    </div>
</main>

<!-- Modal de Escalas -->
<div id="modal-escalas" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        <!-- Header do Modal -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 id="modal-titulo" class="text-xl font-semibold text-gray-900 dark:text-white">Escalas do Dia</h2>
            <button onclick="fecharModalEscalas()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        
        <!-- Body do Modal -->
        <div class="flex-1 overflow-y-auto p-6">
            <!-- Loading -->
            <div id="modal-loading" class="flex justify-center items-center py-12">
                <div class="flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span class="text-gray-500 dark:text-gray-400">Carregando escalas...</span>
                </div>
            </div>
            
            <!-- Conteúdo -->
            <div id="modal-content" class="hidden">
                <!-- Conteúdo será renderizado via JS -->
            </div>
        </div>
    </div>
</div>


<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/escalas/js/api.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/escalas/js/modal.escalas.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/escalas/js/app.service.js"></script>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>
