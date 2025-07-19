
<?php
$pageTitle = "Relatório aniversariantes";
require_once __DIR__ . '/../../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-4 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Aniversariantes</h1>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Visualize e gerencie os aniversários dos voluntários</p>
        </div>

        <!-- Card em Construção -->
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
            <div class="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Funcionalidade em Desenvolvimento</h3>
            <p class="text-blue-700 dark:text-blue-300 max-w-md mx-auto">
                Estamos criando uma experiência incrível para acompanhar os aniversários dos voluntários. 
                Em breve você poderá visualizar todos os aniversariantes!
            </p>
        </div>

        <!-- Loading e Erro -->
        <div id="relatorio-loading" class="hidden flex justify-center items-center py-12">
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


<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/aniversariantes/js/api.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/aniversariantes/js/app.service.js"></script>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>
