
<?php
$pageTitle = "Relatório indisponibilidades";
require_once __DIR__ . '/../../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-4 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Indisponibilidades</h1>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Gerencie e visualize as indisponibilidades dos voluntários</p>
        </div>

        <!-- Card em Construção -->
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-8 text-center">
            <div class="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
            </div>
            <h3 class="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">Funcionalidade em Desenvolvimento</h3>
            <p class="text-amber-700 dark:text-amber-300 max-w-md mx-auto">
                Estamos trabalhando para trazer o melhor sistema de gerenciamento de indisponibilidades. 
                Esta funcionalidade estará disponível em breve!
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


<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/indisponibilidades/js/api.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/indisponibilidades/js/app.service.js"></script>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>
