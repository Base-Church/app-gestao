
<?php
$pageTitle = "Relatório indisponibilidades";
require_once __DIR__ . '/../../../components/layout/header.php';
?>

<main class="with-sidebar mt-24 px-6 pb-8 dark:bg-gray-900">
  <div class="max-w-8xl mx-auto">
        <!-- Cabeçalho -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Relatório de Indisponibilidades</h1>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Acompanhe os scores de disponibilidade e engajamento dos voluntários por ministério</p>
        </div>

    

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
        <div id="relatorio-content" class="hidden space-y-8">
            <!-- Cards de métricas serão renderizados via JS -->
        </div>

    </div>
</main>


<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/indisponibilidades/js/api.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/indisponibilidades/js/app.service.js"></script>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>
