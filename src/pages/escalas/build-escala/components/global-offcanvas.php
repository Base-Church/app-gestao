<?php
/**
 * Off Canvas Global
 * Sobrepõe o sidebar e mostra informações globais
 */
?>

<!-- Off Canvas Global -->
<div id="global-offcanvas" class="fixed left-0 top-0 h-full lg:w-64 w-64 bg-white dark:bg-gray-800  z-40 overflow-hidden">
    
    <!-- Header do Off Canvas -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-500/10 to-primary-600/10">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Geral
        </h2>
        <button id="close-global-offcanvas" class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            Voltar
        </button>
    </div>

    <!-- Conteúdo do Off Canvas -->
    <div class="flex flex-col h-full">
        
        <!-- Seção: Usuários Online -->
        <div class="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                    <span class="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Usuários Online
                </h3>
                <span id="global-user-count" class="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 rounded-full text-xs font-medium">
                    0
                </span>
            </div>
            
            <!-- Lista de Usuários Online -->
            <div id="global-users-list" class="space-y-2 max-h-60 overflow-y-auto">
                <!-- Usuários serão inseridos aqui via JavaScript -->
                <div class="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                    Carregando usuários...
                </div>
            </div>
        </div>

        <!-- Seção: Atividades Recentes (Placeholder para futuras funcionalidades) -->
        <div class="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Atividade Recente
            </h3>
            <div class="text-center text-gray-400 dark:text-gray-500 text-xs py-4">
                Em breve...
            </div>
        </div>

        <!-- Seção: Status do Sistema (Placeholder) -->
        <div class="flex-1 p-4">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center mb-3">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Status do Sistema
            </h3>
            <div class="space-y-2">
                <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span class="text-xs text-gray-600 dark:text-gray-400">Conexão Realtime</span>
                    <span id="global-connection-status" class="text-xs text-gray-500">Conectando...</span>
                </div>
            </div>
        </div>

        <!-- Footer com informações -->
        <div class="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
                Painel Global - Base Church
            </div>
        </div>
    </div>
</div>
