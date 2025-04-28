<?php
$configFile = __DIR__ . '/../../../../config/env.php';
if (!file_exists($configFile)) {
    die('Configuration file not found');
}
require_once $configFile;

// Adicionar headers no-cache
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
?>
<!DOCTYPE html>
<html lang="pt-BR" class="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Adicionar meta tags no-cache -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta name="Cache-Control" content="max-age=0,must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    
    <title>Visualizar Escala - <?= $_ENV['APP_NAME'] ?></title>
    
    <!-- Adicionar timestamp para quebrar cache do CSS -->
    <link href="<?php echo $_ENV['URL_BASE']; ?>/src/css/output.css?v=<?= time() ?>" rel="stylesheet">
    <link href="<?php echo $_ENV['URL_BASE']; ?>/src/pages/escalas/css/ver.css?v=<?= time() ?>" rel="stylesheet">
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css?v=<?= time() ?>">

</head>
<body class="bg-white dark:bg-black">
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
        <div class="max-w-7xl mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <a href="#" class="flex-shrink-0">
                    <img src="<?= $_ENV['URL_BASE'] ?>/assets/img/logo-preta.svg" alt="Logo" class="h-12 w-auto dark:hidden">
                    <img src="<?= $_ENV['URL_BASE'] ?>/assets/img/logo-branca.svg" alt="Logo" class="h-12 w-auto hidden dark:block">
                </a>
                <div class="flex items-center gap-2">
                    <!-- Menu Button -->
                    <div class="relative">
                        <button id="menu-button" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>
                        <!-- Dropdown Menu -->
                        <div id="menu-dropdown" class="hidden absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                            <div class="py-1">
                                <button id="open-filters" class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                    <svg class="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                                    </svg>
                                    Filtros de escalas
                                </button>
                                <div id="music-only-option" class="hidden">
                                    <button id="add-repertorio" 
                                            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                        <svg class="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                                        </svg>
                                        Adicionar repertório
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Repertório Button -->
                    <button id="repertorio-button" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hidden">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                        </svg>
                    </button>
                    <!-- Theme Toggle Button -->
                    <button id="theme-toggle" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <svg class="w-6 h-6 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                        </svg>
                        <svg class="w-6 h-6 dark:hidden" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <main class="min-h-screen p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Loading State -->
            <div id="loading-indicator" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 dark:border-white border-r-transparent"></div>
            </div>

            <!-- Error State -->
            <div id="error-container" class="hidden">
                <div class="bg-red-50 dark:bg-black rounded-lg p-4 border dark:border-red-900/50">
                    <div class="flex items-center gap-3 text-red-500 dark:text-red-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <h3 class="text-lg font-medium" id="error-message">
                            Erro ao carregar escala
                        </h3>
                    </div>
                </div>
            </div>

            <!-- Escala Container -->
            <div id="escala-container" class="hidden">
                <!-- Content will be inserted via JavaScript -->
            </div>
        </div>

        <div class="text-center py-4">
            <p class="text-gray-600 dark:text-gray-400">Projeto exclusivo Base Church</p>
        </div>
    </main>

    <footer class="bg-white dark:bg-black border-t border-gray-200 dark:border-zinc-800">
        <div class="max-w-7xl mx-auto py-6 px-4">
            <div class="flex justify-center">
            <img src="https://basechurch.com.br/wp-content/uploads/2024/11/rodape-1.svg" alt="Logo" class="h-12 w-auto dark:hidden">
            <img src="https://basechurch.com.br/wp-content/uploads/2024/11/rodape-1.svg" alt="Logo" class="h-12 w-auto hidden dark:block">
            </div>
        </div>
    </footer>

    <!-- Scripts modules -->
    <script>
        window.ENV = {
            API_BASE_URL: '<?= $_ENV['API_BASE_URL'] ?>',
            API_KEY: '<?= $_ENV['API_KEY'] ?>',
            URL_BASE: '<?= $_ENV['URL_BASE'] ?>',
            ORGANIZACAO_ID: '<?= $_ENV['ORGANIZACAO_ID'] ?? '1' ?>'
        };
    </script>

  
    <script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/ver/js/dark-mode.js"></script>
    <script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/ver/js/services/LayoutManager.js"></script>
    <script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/ver/js/escala-view.js"></script>
    <script type="module" src="<?= $_ENV['URL_BASE'] ?>/src/pages/escalas/ver/js/components/filtro.js"></script>

</body>
</html>
