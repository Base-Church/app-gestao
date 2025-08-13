<?php
// Configurações da página
$pageTitle = "Preenchimentos";

// Incluir o header
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho da Página -->
        <div class="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Preenchimentos de Formulários</h1>
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Visualize e gerencie os preenchimentos dos formulários</p>
            </div>
            
            <!-- Componente de Filtros -->
            <?php include __DIR__ . '/components/filtros.php'; ?>
        </div>

        <!-- Componente de Estados (Loading, Error, Empty) -->
        <?php include __DIR__ . '/components/estados.php'; ?>

        <!-- Componente de Tabela de Preenchimentos -->
        <?php include __DIR__ . '/components/tabela-preenchimentos.php'; ?>
    </div>

    <!-- Componente do Modal de Detalhes -->
    <?php include __DIR__ . '/components/modal-detalhes.php'; ?>
</main>

<!-- Scripts da página -->
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/preenchimentos/js/api.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/preenchimentos/js/ui.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/preenchimentos/js/state.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/preenchimentos/js/main.js"></script>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>