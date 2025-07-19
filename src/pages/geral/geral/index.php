
<?php
$pageTitle = "Relatório Geral";
require_once __DIR__ . '/../../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-4 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Relatório Geral</h1>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Dashboard com métricas e indicadores dos ministérios</p>
        </div>

        <!-- Botões de Ação Rápida -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ações Rápidas</h2>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <a href="<?= $_ENV['URL_BASE'] ?>/geral/aniversariantes" class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg p-4 transition-all duration-200 border border-gray-200 dark:border-gray-600">
                    <div class="text-center lg:flex lg:items-center lg:text-left">
                        <svg class="w-5 h-5 mx-auto mb-2 lg:mx-0 lg:mb-0 lg:mr-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-sm font-medium">Aniversariantes</span>
                    </div>
                </a>

                <a href="<?= $_ENV['URL_BASE'] ?>/geral/escalas" class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg p-4 transition-all duration-200 border border-gray-200 dark:border-gray-600">
                    <div class="text-center lg:flex lg:items-center lg:text-left">
                        <svg class="w-5 h-5 mx-auto mb-2 lg:mx-0 lg:mb-0 lg:mr-3 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                        </svg>
                        <span class="text-sm font-medium">Escalas e Eventos</span>
                    </div>
                </a>

                <a href="<?= $_ENV['URL_BASE'] ?>/geral/voluntarios" class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg p-4 transition-all duration-200 border border-gray-200 dark:border-gray-600">
                    <div class="text-center lg:flex lg:items-center lg:text-left">
                        <svg class="w-5 h-5 mx-auto mb-2 lg:mx-0 lg:mb-0 lg:mr-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                        <span class="text-sm font-medium">Voluntários</span>
                    </div>
                </a>

                <a href="<?= $_ENV['URL_BASE'] ?>/geral/indisponibilidades" class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg p-4 transition-all duration-200 border border-gray-200 dark:border-gray-600">
                    <div class="text-center lg:flex lg:items-center lg:text-left">
                        <svg class="w-5 h-5 mx-auto mb-2 lg:mx-0 lg:mb-0 lg:mr-3 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <span class="text-sm font-medium">Engajamento</span>
                    </div>
                </a>
            </div>
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
        <div id="relatorio-geral" class="hidden space-y-8">
            
            <!-- Métricas Principais - 3 cards apenas -->
            <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <!-- Total Voluntários -->
                <div class="bg-primary-500 dark:bg-primary-600 rounded-xl p-6 text-white metric-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-primary-100 text-sm">Total Voluntários</p>
                            <p class="text-3xl font-bold metric-number" id="total-voluntarios">-</p>
                            <div class="mt-1">
                                <p class="text-orange-100 text-xs flex items-center gap-1">
                                    Geral
                                   
                                </p>
                            </div>
                        </div>
                        <div class="bg-primary-400/30 rounded-full p-3">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- % Escalados com Total Escalados -->
                <div class="bg-orange-500 dark:bg-orange-600 rounded-xl p-6 text-white metric-card">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <p class="text-orange-100 text-sm">% Escalados</p>
                            <p class="text-3xl font-bold metric-number" id="percentual-escalados">-%</p>
                            <div class="mt-1">
                                <p class="text-orange-100 text-xs flex items-center gap-1">
                                    Total Escalados
                                    <span id="total-escalados" class="font-bold ml-1">-</span>
                                </p>
                            </div>
                        </div>
                        <div class="bg-orange-400/30 rounded-full p-3">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Novos Voluntários -->
                <div class="sm:col-span-2 lg:col-span-1 bg-purple-500 dark:bg-purple-600 rounded-xl p-6 text-white metric-card">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-purple-100 text-sm">Novos Voluntários</p>
                            <p class="text-3xl font-bold metric-number" id="novos-voluntarios">-</p>
                            <div class="mt-1">
                                <p class="text-orange-100 text-xs flex items-center gap-1">
                                    Total do mês atual
                                </p>
                            </div>
                        </div>
                        <div class="bg-purple-400/30 rounded-full p-3">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Ministérios -->
            <section>
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Ministérios</h2>
                    <div class="flex space-x-2">
                        <button id="ministerios-scroll-left" class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>
                        <button id="ministerios-scroll-right" class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="relative">
                    <!-- Fade apenas do lado direito -->
                    <div class="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 dark:to-transparent z-10 pointer-events-none"></div>
                    <!-- Container com scroll livre para touch e mouse -->
                    <div class="overflow-x-auto scrollbar-hide pb-4 touch-pan-x" style="scrollbar-width: none; -ms-overflow-style: none;">
                        <div id="ministerios-cards" class="flex space-x-6" style="width: max-content;">
                            <!-- Preenchido via JS -->
                        </div>
                    </div>
                </div>
            </section>

            <!-- Escalas do Mês -->
            <section>
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Escalas do Mês Atual</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div id="escalas-cards" class="contents">
                        <!-- Preenchido via JS -->
                    </div>
                </div>
            </section>

        </div>
    </div>
</main>

<style>
/* Esconder scrollbar em navegadores WebKit */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

/* Garantir scroll suave em dispositivos touch */
.touch-pan-x {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
}

/* Remover qualquer interferência de pointer events nos cards */
#ministerios-cards > * {
    pointer-events: auto;
}

/* Animação para os números dos cards */
.metric-number {
    transition: all 0.3s ease;
}

/* Cards com hover effect suave */
.metric-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>

<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/geral/js/api.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/geral/geral/js/app.service.js"></script>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>
