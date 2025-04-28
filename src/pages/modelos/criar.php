<?php
$pageTitle = "Criar Modelo de Escala";
require_once __DIR__ . '/../../components/layout/header.php';
?>

<style>
    /* Estilização da barra de rolagem */
    #atividadesLista::-webkit-scrollbar {
        width: 6px;
    }
    
    #atividadesLista::-webkit-scrollbar-track {
        background: transparent;
    }
    
    #atividadesLista::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 3px;
    }
    
    #atividadesLista::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.7);
    }

    /* Modo escuro */
    .dark #atividadesLista::-webkit-scrollbar-thumb {
        background-color: rgba(75, 85, 99, 0.5);
    }
    
    .dark #atividadesLista::-webkit-scrollbar-thumb:hover {
        background-color: rgba(75, 85, 99, 0.7);
    }
</style>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
        <!-- Cabeçalho -->
        <div class="mb-8">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Criar Modelo</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">
                        Arraste as atividades para criar seu modelo de escala
                    </p>
                </div>
                <div>
                    <button type="button" id="salvarModelo"
                            class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                        <svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Salvar Modelo
                    </button>
                </div>
            </div>

            <!-- Input Nome do Modelo -->
            <div class="mt-6">
                <label for="nomeModelo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nome do Modelo
                </label>
                <input type="text" id="nomeModelo" 
                       class="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                       placeholder="Digite o nome do modelo">
            </div>
        </div>

        <!-- Grid Principal -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Lista de Atividades -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div class="p-4 border-b dark:border-gray-700">
                    <h2 class="text-lg font-medium text-gray-900 dark:text-white">Atividades Disponíveis</h2>
                </div>
                <div class="p-4">
                    <!-- Adicionando div com altura fixa e rolagem -->
                    <div class="min-h-[400px] max-h-[calc(100vh-550px)] overflow-y-auto space-y-2 pr-2" id="atividadesLista">
                        <!-- Atividades serão inseridas aqui via JavaScript -->
                    </div>
                </div>
            </div>

            <!-- Construtor do Modelo -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/modelos/js/criar/main.js"></script>
                <div class="p-4 border-b dark:border-gray-700">
                    <h2 class="text-lg font-medium text-gray-900 dark:text-white">Estrutura do Modelo</h2>
                </div>
                <div class="p-4">
                    <div class="min-h-[400px] max-h-[calc(100vh-400px)] overflow-y-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3 transition-all duration-200" 
                         id="modeloContainer">
                        <!-- Atividades arrastadas serão inseridas aqui -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php require_once __DIR__ . '/../../components/layout/footer.php'; ?>

<script type="module">
    window.USER = {
        ministerios: <?= json_encode(SessionService::getMinisterios()) ?>,
        ministerio_atual: <?= json_encode(SessionService::getMinisterioAtual()) ?>,
        organizacao_id: <?= SessionService::getOrganizacaoId() ?>,
        nivel: <?= json_encode(SessionService::getNivel()) ?>
    };
</script>

<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/modelos/js/criar/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/modelos/js/criar/dragdrop.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/modelos/js/criar/ui.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/modelos/js/criar/main.js"></script>