<?php
$pageTitle = "Criador de Escalas V2";
require_once __DIR__ . '/../../../components/layout/header.php';
?>
<div class="sm:ml-64">
    <div class="p-2 sm:p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
        <div class="space-y-6">
            <div class="flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row gap-4 items-stretch min-h-[500px] h-[70vh]">
                    <!-- Calendário -->
                    <div class="w-full sm:w-[80%] flex flex-col h-full">
                        <div class="flex justify-between items-center mb-2 gap-2">
                            <div id="calendar-nav" class="flex items-center gap-2">
                                <span id="calendar-title" class="font-semibold text-primary-700 dark:text-primary-200 text-base"></span>
                            </div>
                            <button id="btn-toggle-view" class="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold shadow hover:bg-primary-700 transition text-sm">
                                Visualizar por Semana
                            </button>
                        </div>
                        <div id="week-buttons" class="flex gap-2 mb-2"></div>
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 sm:p-4 flex-1 flex flex-col overflow-hidden">
                            <div id="fullcalendar" class="w-full flex-1 overflow-y-auto overflow-x-hidden" style="min-height: 400px;"></div>
                        </div>
                    </div>
                    <!-- Sidebar: Tabs e Listagem (agora à direita) -->
                    <div class="w-full sm:w-[20%] flex-shrink-0 flex flex-col h-full">
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-0 mb-4 h-full flex flex-col flex-1">
                            <div class="flex border-b border-gray-200 dark:border-gray-700">
                                <button class="tab-btn flex-1 px-4 py-2 text-center font-semibold bg-primary-50 dark:bg-gray-800 text-primary-700 dark:text-primary-200 border-b-2 border-primary-600 focus:outline-none transition" data-tab="eventos" id="tab-eventos" type="button">Eventos</button>
                                <button class="tab-btn flex-1 px-4 py-2 text-center font-semibold bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-200 border-b-2 border-transparent focus:outline-none transition" data-tab="voluntarios" id="tab-voluntarios" type="button" disabled>Voluntários</button>
                            </div>
                            <div id="tab-content-eventos" class="p-4 flex-1 overflow-y-auto" style="max-height: 70vh;">
                                <div id="eventos-draggable-list"></div>
                            </div>
                            <div id="tab-content-voluntarios" class="p-4 hidden">
                                <div class="text-gray-400">(Em breve)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<link rel="stylesheet" href="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/v2/css/calendario.css">

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.min.css">
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/locales-all.global.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>

<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/v2/js/api.service.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/v2/js/eventos.ui.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/v2/js/main.js"></script>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?> 