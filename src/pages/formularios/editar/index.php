<?php
// Configurações da página
$pageTitle = "Editar Formulário";

// Incluir o header
require_once __DIR__ . '/../../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho da Página -->
        <div class="mb-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Editar Formulário</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Modifique os campos e configurações do formulário</p>
                </div>
                <div class="mt-4 sm:mt-0">
                    <a href="<?= $_ENV['URL_BASE'] ?>/formularios" 
                       class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                        <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        Voltar
                    </a>
                </div>
            </div>
        </div>

        <!-- Container do Form Builder -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="p-6">
                <!-- Formulário de Configurações -->
                <div class="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="form-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome do Formulário *
                            </label>
                            <input type="text" id="form-title" name="form-title" required
                                   class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                                   placeholder="Digite o nome do formulário">
                        </div>
                        <div>
                            <label for="processo-etapa" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Processo/Etapa *
                            </label>
                            <select id="processo-etapa" name="processo-etapa" required multiple
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400">
                                <!-- Preenchido via JavaScript -->
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Form Builder -->
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <!-- Sidebar de Elementos -->
                    <div class="lg:col-span-1">
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Elementos</h3>
                            <div id="elements-sidebar" class="space-y-2">
                                <!-- Preenchido via JavaScript -->
                            </div>
                        </div>
                    </div>

                    <!-- Área de Construção do Formulário -->
                    <div class="lg:col-span-2">
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-96">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Construtor do Formulário</h3>
                            <div id="form-builder-area" class="space-y-4">
                                <div class="text-center text-gray-500 dark:text-gray-400 py-12">
                                    <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <p class="mt-2">Arraste elementos da barra lateral para começar a construir seu formulário</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Painel de Propriedades -->
                    <div class="lg:col-span-1">
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Propriedades</h3>
                            <div id="properties-panel">
                                <p class="text-gray-500 dark:text-gray-400 text-sm">Selecione um elemento para editar suas propriedades</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Botões de Ação -->
                <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    <button type="button" id="clear-form" 
                            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                        <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Limpar Formulário
                    </button>
                    <button type="button" id="save-form" 
                            class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800">
                        <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Atualizar Formulário
                    </button>
                </div>
            </div>
        </div>

        <!-- Preview do JSON (opcional, para debug) -->
        <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6" style="display: none;" id="json-preview">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview JSON</h3>
            <textarea id="json-output" readonly 
                      class="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"></textarea>
        </div>
    </div>
</main>

<!-- Scripts -->
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/elements.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/properties.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/preview.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/form-builder.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/formularios/criar/js/edit-formulario.js"></script>

<?php
// Incluir o footer
require_once __DIR__ . '/../../../components/layout/footer.php';
?>