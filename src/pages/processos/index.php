<?php
$pageTitle = "Processos e Etapas";
require_once __DIR__ . '/../../components/layout/header.php';
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho -->
        <div class="mb-8 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Processos</h1>
                <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">
                    Gerencie processos e etapas de forma dinâmica e intuitiva.
                </p>
            </div>
            <div>
                <button id="btnNovoProcesso" class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors">
                    Novo Processo
                </button>
            </div>
        </div>

        <!-- Grid Principal -->
        <div id="processosContainer" class="space-y-8">
            <!-- Processos e etapas serão renderizados aqui -->
        </div>
    </div>
</main>

<!-- Modal Novo Processo -->
<div id="modalNovoProcesso" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 hidden">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 class="text-lg font-bold mb-4 text-gray-900 dark:text-white">Novo Processo</h2>
        <form id="formNovoProcesso" class="space-y-4">
            <div id="processoErrorMsg" class="hidden text-red-500 text-sm mb-2"></div>
            <div>
                <label for="nomeProcesso" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Processo</label>
                <input type="text" id="nomeProcesso" name="nome" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm" required>
            </div>
            <div>
                <label for="statusProcesso" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select id="statusProcesso" name="status" class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm">
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                </select>
            </div>
            <div class="flex justify-end space-x-2">
                <button type="button" id="btnCancelarProcesso" class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">Cancelar</button>
                <button type="submit" class="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700">Salvar</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>

<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/processos/js/main.js"></script>
