<?php
// Configurações da página
$pageTitle = "Calendário de Eventos";

// Incluir o header
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-full mx-auto h-screen">
        <!-- Cabeçalho da Página -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Calendário de Eventos</h1>
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Gerencie eventos arrastando-os para datas específicas</p>
            </div>
            <div class="flex items-center gap-4">
                <!-- Filtros rápidos -->
                <select id="filter-tipo" class="rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500 sm:text-sm">
                    <option value="">Todos os tipos</option>
                    <option value="culto">Cultos</option>
                    <option value="evento">Eventos</option>
                </select>
                <button id="btn-hoje" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                    Hoje
                </button>
            </div>
        </div>

        <!-- Layout Principal: 85% Calendário | 15% Lista de Eventos -->
        <div class="flex gap-4 h-[calc(100vh-200px)]">
            <!-- Calendário (85%) -->
            <div class="w-[85%] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                    <div class="flex items-center gap-4">
                        <button id="prev-month" class="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <h2 id="calendar-month-year" class="text-xl font-bold text-gray-900 dark:text-white">
                            Janeiro 2025
                        </h2>
                        <button id="next-month" class="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                    <div class="flex items-center gap-3">
                        <!-- Seletor de visualização -->
                        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button id="view-month" class="px-3 py-1.5 text-sm font-medium rounded-md transition-all view-btn active">
                                Mês
                            </button>
                            <button id="view-week" class="px-3 py-1.5 text-sm font-medium rounded-md transition-all view-btn">
                                Semana
                            </button>
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            Arraste eventos para agendar
                        </div>
                    </div>
                </div>
                
                <!-- Grid do Calendário -->
                <div class="h-full overflow-hidden">
                    <!-- Vista Mensal -->
                    <div id="calendar-month-view" class="h-full calendar-view">
                        <!-- Cabeçalho dos dias da semana -->
                        <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                            <div class="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Domingo</div>
                            <div class="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Segunda</div>
                            <div class="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Terça</div>
                            <div class="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Quarta</div>
                            <div class="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Quinta</div>
                            <div class="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Sexta</div>
                            <div class="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Sábado</div>
                        </div>
                        
                        <!-- Grid dos dias -->
                        <div id="calendar-grid" class="grid grid-cols-7 h-[calc(100%-4rem)] auto-rows-fr">
                            <!-- Dias serão gerados via JavaScript -->
                        </div>
                    </div>

                    <!-- Vista Semanal -->
                    <div id="calendar-week-view" class="h-full calendar-view hidden">
                        <!-- Cabeçalho da semana -->
                        <div id="week-header" class="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4">
                            <div class="flex items-center justify-between">
                                <button id="prev-week" class="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                                    </svg>
                                </button>
                                <h3 id="week-range" class="text-lg font-semibold text-gray-900 dark:text-white">
                                    <!-- Data da semana -->
                                </h3>
                                <button id="next-week" class="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Grid da semana -->
                        <div class="flex h-[calc(100%-5rem)]">
                            <div id="week-days" class="flex-1 flex gap-1 p-2">
                                <!-- Colunas dos dias da semana -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lista de Eventos (15%) -->
            <div class="w-[15%] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                <div class="p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                    <h3 class="text-base font-bold text-gray-900 dark:text-white">Eventos</h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Arraste para agendar</p>
                </div>
                
                <!-- Busca -->
                <div class="p-3 border-b border-gray-200 dark:border-gray-700">
                    <input type="text" 
                           id="search-eventos"
                           class="w-full rounded-md border-0 py-1.5 px-2 text-sm text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-600 dark:focus:ring-primary-500" 
                           placeholder="Buscar...">
                </div>

                <!-- Loading -->
                <div id="eventos-loading" class="flex justify-center py-8">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                </div>

                <!-- Lista de eventos -->
                <div id="eventos-container" class="flex-1 overflow-y-auto p-2 space-y-2 hidden">
                    <!-- Eventos serão inseridos aqui via JavaScript -->
                </div>

                <!-- Estado vazio -->
                <div id="eventos-empty" class="hidden flex-1 flex items-center justify-center p-3">
                    <div class="text-center">
                        <svg class="mx-auto h-6 w-6 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                        </svg>
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Nenhum evento</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Container para Toasts/Notificações -->
<div id="toast-container" class="fixed top-5 right-5 z-[100]"></div>

<!-- Importar SortableJS para drag and drop -->
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>

<!-- CSS customizado -->
<link rel="stylesheet" href="<?= $_ENV['URL_BASE'] ?>/src/pages/eventos-calendario/css/styles.css">

<!-- Scripts da página -->
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/eventos-calendario/js/api.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/eventos-calendario/js/ui-manager.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/eventos-calendario/js/calendar/calendar-base.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/eventos-calendario/js/calendar/month-renderer.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/eventos-calendario/js/calendar/week-renderer.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/eventos-calendario/js/calendar/event-manager.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/eventos-calendario/js/calendar/calendar.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/eventos-calendario/js/eventos-list.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/eventos-calendario/js/drag-drop.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/eventos-calendario/js/main.js"></script>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>

