<?php
$currentPage = basename($_SERVER['PHP_SELF']);
$pageTitle = isset($pageTitle) ? $pageTitle : 'Início';
?>

<nav class="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] bg-white dark:bg-gray-800 shadow-sm z-30 transition-all duration-300">
    <div class="h-16 px-4 flex items-center justify-between relative">
        <!-- Versão -->
        <div class="flex items-center space-x-4">
            <span class="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 rounded-full">By: TecnoTriks</span>
        </div>
        
        <div class="flex items-center space-x-4">
            <!-- Tema -->
            <button id="themeToggle" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg hidden lg:block group transition-all duration-200" onclick="toggleTheme()">
                <!-- Sol (modo claro) -->
                <svg class="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                <!-- Lua (modo escuro) -->
                <svg class="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
            </button>
        </div>
    </div>

    <!-- Barra de Progresso -->
    <div class="h-1 w-full bg-gray-100 dark:bg-gray-700">
        <div class="h-1 bg-primary-500 w-1/3 transition-all duration-300"></div>
    </div>
</nav>

<script>
// Função para alternar o tema
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

</script>
