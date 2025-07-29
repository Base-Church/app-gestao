<?php
// Configurações da página
$pageTitle = "Construtor de Formulários";

// Incluir o header
require_once __DIR__ . '/../../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-full mx-auto">
        <!-- Cabeçalho da Página -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Construtor de Formulários</h1>
                <div class="flex gap-2">
                        <button id="save-form-btn" 
                                class="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:shadow-md">
                            <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            Salvar
                        </button>
                        <button id="preview-form-btn" 
                                class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-150">
                            <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            Preview
                        </button>
                        <button id="clear-form-btn" 
                                class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-all duration-150">
                            <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            Limpar
                        </button>
                    </div>
                </div>
            
            <!-- Campos de configuração -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título do Formulário</label>
                    <input type="text" 
                           id="form-title-input" 
                           placeholder="Digite o título do formulário"
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
                           value="Formulário Personalizado">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Etapas do Processo</label>
                    <el-dropdown class="relative w-full">
                        <button id="processo-etapa-button" class="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md text-sm text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 flex justify-between items-center transition-colors">
                            <span id="selected-etapas-text" class="truncate">Selecione as etapas</span>
                            <svg class="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                        
                        <el-menu id="processo-etapa-menu" anchor="bottom start" popover class="absolute z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-700 dark:border-gray-600" style="max-height: 200px; overflow-y: auto;">
                            <div class="py-1" id="etapas-list">
                                <!-- Opções serão carregadas via JavaScript -->
                            </div>
                        </el-menu>
                    </el-dropdown>
                    <!-- Hidden input para armazenar os IDs selecionados -->
                    <input type="hidden" id="processo-etapa-select" name="processo_etapa_ids" value="">
                </div>
            </div>
        </div>

        <!-- Layout Principal - 3 Colunas -->
        <div id="coluna-elementos" class="grid grid-cols-12 gap-6">
            <!-- Coluna 1: Elementos (3 colunas) -->
            <div class="col-span-3">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6" style="height: calc(100vh - 140px);">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Elementos</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Arraste os elementos para o formulário</p>
                    </div>
                    <div class="p-3 space-y-2 overflow-y-auto" style="height: calc(100% - 80px);">
                        <!-- Elementos de Input -->
                        <div class="space-y-1">
                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Campos de Entrada</h4>
                            
                            <!-- Text Input -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="text" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
                                    </svg>
                                   
                                </div>
                            </div>

                            <!-- Number Input -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="number" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                                    </svg>
                                  
                                </div>
                            </div>

                            <!-- Email Input -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="email" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                    </svg>
                               
                                </div>
                            </div>

                            <!-- Radio Button -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="radio" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                 
                                </div>
                            </div>

                            <!-- Select -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="select" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
                                    </svg>
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Lista Suspensa</span>
                                </div>
                            </div>

                            <!-- Checkbox -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="checkbox" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Caixa de Seleção</span>
                                </div>
                            </div>
                        </div>

                        <!-- Elementos Especiais -->
                        <div class="space-y-1 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Elementos Especiais</h4>
                            
                            <!-- CPF -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="cpf" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">CPF</span>
                                </div>
                            </div>

                            <!-- Data de Nascimento -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="birthdate" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Nascimento</span>
                                </div>
                            </div>
                        </div>

                        <!-- Elementos Básicos Adicionais -->
                        <div class="space-y-1 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data e Hora</h4>
                            
                            <!-- Data e Hora -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="datetime" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Data e Hora</span>
                                </div>
                            </div>
                        </div>

                        <!-- Elementos de Conteúdo -->
                        <div class="space-y-1 pt-3 border-t border-gray-200 dark:border-gray-600">
                            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Conteúdo</h4>
                            
                            <!-- Título -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="title" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                    </svg>
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Título</span>
                                </div>
                            </div>

                            <!-- Descrição -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="description" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
                                    </svg>
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</span>
                                </div>
                            </div>

                            <!-- Separador -->
                            <div class="element-item bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" 
                                 data-type="separator" draggable="true">
                                <div class="flex items-center">
                                    <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                    </svg>
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Separador</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Coluna 2: Formulário (6 colunas) -->
            <div class="col-span-6">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Formulário</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Arraste elementos aqui para construir seu formulário</p>
                    </div>
                    <div id="form-builder" class="p-6 min-h-96">
                        <div id="drop-zone" class="">
                            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            
                        </div>
                    </div>
                </div>
            </div>

            <!-- Coluna 3: Configurações (3 colunas) -->
            <div class="col-span-3">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6" style="height: calc(100vh - 140px);">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Configurações</h3>
                    </div>
                    
                    <!-- Tabs -->
                    <div class="border-b border-gray-200 dark:border-gray-700">
                        <nav class="-mb-px flex">
                            <button id="tab-properties" class="tab-button active w-1/2 py-2 px-4 text-center border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 text-sm font-medium">
                                Propriedades
                            </button>
                            <button id="tab-json" class="tab-button w-1/2 py-2 px-4 text-center border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium">
                                JSON
                            </button>
                        </nav>
                    </div>

                    <!-- Tab Content -->
                    <div class="p-4 overflow-y-auto" style="height: calc(100% - 130px);">
                        <!-- Properties Tab -->
                        <div id="properties-panel" class="tab-content">
                            <div id="no-selection" class="text-center py-8">
                                <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum elemento selecionado</h3>
                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Selecione um elemento no formulário para ver suas propriedades.</p>
                            </div>
                            <div id="element-properties" class="hidden">
                                <!-- Sub-tabs para propriedades -->
                                <div class="border-b border-gray-200 dark:border-gray-700 mb-4">
                                    <nav class="-mb-px flex space-x-8">
                                        <button id="properties-tab" class="border-primary-500 text-primary-600 dark:text-primary-400 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                                            Propriedades
                                        </button>
                                        <button id="conditions-tab" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors">
                                            Condições
                                        </button>
                                    </nav>
                                </div>
                                
                                <div id="properties-content" class="space-y-4">
                                    <!-- Conteúdo das propriedades será inserido dinamicamente -->
                                </div>
                                

                                
                                <div id="conditions-content" class="space-y-4 hidden">
                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between">
                                            <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100">Condições de Exibição</h4>
                                            <button id="add-condition" class="px-3 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                                                + Adicionar
                                            </button>
                                        </div>
                                        
                                        <div id="conditions-list" class="space-y-3">
                                            <!-- Condições serão inseridas dinamicamente -->
                                        </div>
                                        
                                        <div class="text-xs text-gray-500 dark:text-gray-400">
                                            <p>As condições determinam quando este elemento será exibido baseado nos valores de outros campos.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- JSON Tab -->
                        <div id="json-panel" class="tab-content hidden">
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">JSON do Formulário</label>
                                    <textarea id="form-json" 
                                              class="w-full h-96 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm" 
                                              readonly></textarea>
                                </div>
                                <button id="copy-json-btn" 
                                        class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                    </svg>
                                    Copiar JSON
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Modal de Preview -->
<div id="preview-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 hidden">
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div class="mt-3">
            <!-- Header do Modal -->
            <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Preview do Formulário</h3>
                <button id="close-preview" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Conteúdo do Preview -->
            <div class="mt-4">
                <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg max-h-96 overflow-y-auto">
                    <form id="preview-form" class="space-y-4">
                        <!-- Formulário será renderizado aqui -->
                    </form>
                </div>
            </div>
            
            <!-- Footer do Modal -->
            <div class="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <button id="close-preview-btn" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 mr-2">
                    Fechar
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Scripts da página -->
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/elements.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/drag-drop.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/properties.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/form-builder.js"></script>
<script src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/preview.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/main.js"></script>



<style>
    .sortable-chosen {
        box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5);
        border-radius: 0.375rem;
    }
    .sortable-drag {
        transform: rotate(3deg) scale(1.05);
        transition: transform 0.2s ease;
    }
    </style>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>