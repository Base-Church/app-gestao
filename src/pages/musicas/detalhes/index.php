<?php
$pageTitle = "Detalhes da Música";
require_once __DIR__ . '/../../../components/layout/header.php';

// Pega o ID da música da URL
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
?>

<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="w-full">
        <div class="mb-8">
            <div class="flex items-center gap-4">
                <a href="<?= $_ENV['URL_BASE'] ?>/musicas" class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </a>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Detalhes da Música</h1>
                    <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Edite as informações da música</p>
                </div>
            </div>
        </div>

        <div id="loading-indicator" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <!-- Notificações flutuantes -->
        <div id="notification-container" class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
            <div id="error-container" class="hidden rounded-lg bg-red-500 text-white p-4 mb-2 shadow-lg backdrop-blur-sm">
                <div class="flex items-center">
                    <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span id="error-message" class="text-sm font-medium">Erro ao carregar música</span>
                </div>
            </div>
            
            <div id="success-container" class="hidden rounded-lg bg-green-500 text-white p-4 mb-2 shadow-lg backdrop-blur-sm">
                <div class="flex items-center">
                    <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span id="success-message" class="text-sm font-medium">Música atualizada com sucesso!</span>
                </div>
            </div>
        </div>

        <div id="musica-form" class="hidden">
            <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <!-- Informações Básicas -->
                <div class="xl:col-span-1">
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Informações da Música</h3>
                        </div>
                        <div class="p-6">
                            <form id="form-musica">
                                <div class="space-y-4">
                                    <div>
                                        <label for="nome_musica" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nome da Música *
                                        </label>
                                        <input type="text" id="nome_musica" name="nome_musica" required
                                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                    </div>

                                    <div>
                                        <label for="artista_banda" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Artista/Banda *
                                        </label>
                                        <input type="text" id="artista_banda" name="artista_banda" required
                                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                    </div>

                                    <div>
                                        <label for="url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            URL do YouTube
                                        </label>
                                        <input type="url" id="url" name="url"
                                               class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                                               placeholder="https://www.youtube.com/watch?v=...">
                                    </div>

                                    <div id="youtube-preview" class="hidden">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Preview do YouTube
                                        </label>
                                        <div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                            <img id="youtube-thumbnail" src="" alt="YouTube thumbnail" class="w-full h-full object-cover">
                                        </div>
                                    </div>
                                </div>

                                <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <a href="<?= $_ENV['URL_BASE'] ?>/musicas" 
                                       class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                        Cancelar
                                    </a>
                                    <button type="submit" 
                                            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                        Salvar Alterações
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Editor de Letra -->
                <div class="xl:col-span-3">
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Letra da Música</h3>
                        </div>
                        <div class="p-6">
                            <!-- Botões de inserção rápida -->
                            <div class="mb-4 flex gap-2">
                                <button type="button" class="insert-tag-btn px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" data-tag="[BACK]">
                                    BACK
                                </button>
                                <button type="button" class="insert-tag-btn px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500" data-tag="[MINISTRO]">
                                    MINISTRO
                                </button>
                                <button type="button" class="insert-tag-btn px-3 py-1 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500" data-tag="[VOCAL]">
                                    VOCAL
                                </button>
                            </div>
                            <textarea id="letra-editor" name="letra" rows="20" 
                                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm leading-relaxed"
                                      placeholder="Cole aqui a letra da música...&#10;&#10;Exemplo:&#10;Grande é o Senhor&#10;E digno de louvor&#10;&#10;Com todo o meu ser&#10;Vou te adorar..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</main>

<?php require_once __DIR__ . '/../../../components/layout/footer.php'; ?>

<style>
    #letra-editor {
        line-height: 1.6;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
</style>

<script>
    window.MUSICA_ID = <?= $id ?>;
</script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/musicas/detalhes/js/api.js"></script>
<script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/musicas/detalhes/js/main.js"></script>

