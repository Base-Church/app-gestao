<?php
$pageTitle = "Calendário";
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Header Section com Stats -->
        <div class="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="sm:flex sm:items-center sm:justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Calendário de Indisponibilidades</h1>
                        <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">
                            Visualize e gerencie as indisponibilidades dos voluntários
                        </p>
                    </div>
                    <div class="mt-4 sm:mt-0 flex items-center space-x-4">
                        <div class="text-right">
                            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Voluntários</p>
                            <p class="text-2xl font-bold text-primary-600 dark:text-primary-400" id="total-voluntarios">0</p>
                        </div>
                        
                        <div class="relative">
                            <input type="month" 
                                   id="month-picker"
                                   class="block rounded-lg border-0 py-3 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6">
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Novo: Resumo Estatístico -->
            <div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4" id="stats-container">
                <div class="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-300">Mais Indisponibilidades</h4>
                    <p class="mt-1 text-xl font-semibold text-yellow-900 dark:text-yellow-200" id="dia-mais-indisponivel">-</p>
                    <p class="mt-1 text-sm text-yellow-600 dark:text-yellow-400" id="total-mais-indisponivel">-</p>
                </div>

                <div class="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-green-800 dark:text-green-300">Dia Mais Livre</h4>
                    <p class="mt-1 text-xl font-semibold text-green-900 dark:text-green-200" id="dia-mais-livre">-</p>
                    <p class="mt-1 text-sm text-green-600 dark:text-green-400" id="total-mais-livre">-</p>
                </div>

                <div class="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300">Sugestão de Reuniões</h4>
                    <p class="mt-1 text-sm text-blue-600 dark:text-blue-400" id="sugestao-escala">
                        Analisando melhor data...
                    </p>
                </div>
            </div>
        </div>

        <!-- Calendar -->
        <div id="calendar-container" class="hidden">
            <!-- Calendar Legend -->
           

            <!-- Calendar Grid -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                    <div class="py-4 text-center text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50">Dom</div>
                    <div class="py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Seg</div>
                    <div class="py-4 text-center text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50">Ter</div>
                    <div class="py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Qua</div>
                    <div class="py-4 text-center text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50">Qui</div>
                    <div class="py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Sex</div>
                    <div class="py-4 text-center text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50">Sáb</div>
                </div>
                <div id="calendar-days" class="grid grid-cols-7"></div>
            </div>
        </div>
    </div>
</main>

<!-- Off-Canvas Sidebar -->
<div id="off-canvas" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-black bg-opacity-50" onclick="ui.hideVoluntariosList()"></div>
    <div class="absolute inset-y-0 right-0 max-w-full flex">
        <div class="w-screen max-w-md bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">Detalhes do Dia</h2>
                <button class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" onclick="ui.hideVoluntariosList()">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div id="off-canvas-content" class="p-4"></div>
        </div>
    </div>
</div>

<script>
    window.USER = {
        baseUrl: '<?= $_ENV['URL_BASE'] ?>',
        organizacao_id: '<?= $_SESSION['user']['organizacao_id'] ?>',
        ministerio_atual: '<?= $_SESSION['user']['ministerio_atual'] ?>',
        ministerios: <?= json_encode($_SESSION['user']['ministerios']) ?>,
        nivel: '<?= $_SESSION['user']['nivel'] ?>'
    };
</script>

<!-- Scripts -->
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/calendario/js/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/calendario/js/ui.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/calendario/js/main.js"></script>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>