<?php
// Conteúdo copiado exatamente do templates.php
?>
<!-- Template para Evento -->
<template id="evento-template">
    <div class="dynamic-field bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div class="flex justify-between items-center mb-4 dynamic-field-header">
            <!-- Botão Expandir/Colapsar -->
            <button type="button" class="toggle-evento flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300">
                <svg class="w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
                <span class="evento-summary ml-2">
                    <span class="text-sm text-gray-700 dark:text-gray-300">Nenhum evento selecionado</span>
                    <small class="text-xs text-gray-400 ml-2"><span class="atividades-count">0</span> voluntários</small>
                </span>
            </button>
            
            <div class="flex items-center">
                <!-- O select será inserido aqui via JavaScript -->
                <!-- Botão de remover -->
                <button type="button" class="btn-remove-field text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Conteúdo do Evento (Collapsible) -->
        <div class="evento-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <!-- Seletor de Evento -->
                <div class="evento-selector relative">
                    <div class="cursor-pointer bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-600 hover:border-primary-500">
                        <div class="flex items-center space-x-3">
                            <img src="<?= $_ENV['URL_BASE'] ?>/assets/img/placeholder.jpg" class="w-12 h-12 rounded-full object-cover">
                            <span class="text-gray-500 dark:text-gray-400">Selecionar Evento</span>
                        </div>
                    </div>
                    <div class="floating-selection hidden absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        <div class="p-3 border-b dark:border-gray-700">
                            <input type="text" id="evento-search-input" placeholder="Pesquisar evento..." class="w-full rounded-lg border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                        </div>
                        <div id="loading-eventos" class="p-4 text-center hidden">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            <p class="mt-2">Carregando eventos...</p>
                        </div>
                        <div id="eventos-lista" class="p-2 max-h-64 overflow-y-auto"></div>
                    </div>
                </div>

                <!-- Data do Evento -->
                <input 
                    type="date" 
                    name="data_evento[]" 
                    class="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
            </div>

            <!-- Container de Atividades -->
            <div class="atividades-container space-y-3">
                <div id="atividades-lista-container">
                    <!-- Atividades serão adicionadas aqui -->
                </div>
                <div class="header-acoes flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <button type="button" class="btn-adicionar-atividade text-primary-600 hover:text-primary-700 dark:text-primary-400">
                            + Adicionar Atividade
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Template para Atividade -->
<template id="atividade-template">
    <div class="dynamic-field pb-2 px-2 pt-3 rounded-lg relative" data-atividade-id="">
        <!-- Botão Remover Atividade - Versão melhorada -->
        <button type="button" class="btn-remove-field absolute -top-2 -right-2 bg-white dark:bg-gray-700 rounded-full p-1 shadow-lg border border-gray-200 dark:border-gray-600 text-red-500 hover:text-red-700 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Seletor de Atividade -->
            <div class="atividade-selector relative">
                <div class="cursor-pointer bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-600 hover:border-primary-500">
                    <div class="flex items-center space-x-3">
                        <img src="<?= $_ENV['URL_BASE'] ?>/assets/img/placeholder.jpg" class="w-12 h-12 rounded-full object-cover">
                        <span class="text-gray-500 dark:text-gray-400">Selecionar Atividade</span>
                    </div>
                </div>
                <div class="floating-selection hidden absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <div id="loading-atividades" class="p-4 text-center hidden">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p class="mt-2">Carregando atividades...</p>
                    </div>
                    <div id="atividades-lista" class="p-4 space-y-2 max-h-96 overflow-y-auto"></div>
                </div>
            </div>

            <!-- Seletor de Voluntários -->
            <div class="voluntario-selector relative">
                <button type="button" class="voluntario-toggle-btn flex items-center space-x-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 w-full">
                    <img src="<?= $_ENV['URL_BASE'] ?>/assets/img/placeholder.jpg" class="w-12 h-12 rounded-full object-cover">
                    <div class="flex-1 text-left">
                        <span class="text-gray-500 dark:text-gray-400">Selecionar Voluntário</span>
                        <div class="voluntarios-selecionados mt-1 flex items-center space-x-2">
                            <!-- Voluntário selecionado será adicionado aqui -->
                        </div>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<!-- Off-canvas Voluntários -->
<div id="voluntariosOffcanvas" class="fixed top-0 right-0 z-50 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-[28rem] dark:bg-gray-800 shadow-lg">
    <div class="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
        <h5 class="text-lg font-semibold text-gray-900 dark:text-white">Listagem de Voluntários</h5>
        <button onclick="toggleVoluntariosOffcanvas()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        </button>
    </div>

    <!-- Área de Filtros e Pesquisa -->
    <div class="mb-4">
        <input 
            type="text" 
            id="voluntarios-search" 
            placeholder="Pesquisar voluntários..." 
            class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
        >
    </div>

    <!-- Área de Carregamento -->
    <div id="loading-voluntarios" class="text-center py-6 hidden">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-3"></div>
        <p class="text-gray-600 dark:text-gray-300">Carregando voluntários...</p>
    </div>

    <!-- Container de Conteúdo -->
    <div class="space-y-3 h-[calc(100vh-250px)] overflow-y-auto">
        <!-- Sugestões serão renderizadas aqui -->
    </div>
</div>
