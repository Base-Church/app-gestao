<?php
// Removido require_once __DIR__ . '/../../../config/menu.service.php';
// Removido controle de $authorizedMenus, $menuIds, função hasAccess, $debug

// Detectar submenus ativos conforme a URL
$currentPath = $_SERVER['REQUEST_URI'];
$escalasActive = strpos($currentPath, '/escalas') !== false || strpos($currentPath, '/modelos') !== false || strpos($currentPath, '/musicas') !== false;
$atividadesActive = strpos($currentPath, '/atividades') !== false || strpos($currentPath, '/categoria-atividade') !== false;
$voluntariosActive = strpos($currentPath, '/voluntarios') !== false || strpos($currentPath, '/calendario') !== false || strpos($currentPath, '/observacoes') !== false;
?>

<!-- Botão Toggle Menu Mobile -->
<button id="menuToggle" class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
    <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
</button>

<aside id="sidebar" class="fixed inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-xl lg:w-64 w-64 transition-all duration-300 transform lg:translate-x-0 -translate-x-full z-40">
    <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-center h-24 border-b dark:border-gray-700 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10"></div>
            <img src="<?php echo $_ENV['URL_BASE']; ?>/assets/img/logo-preta.svg" alt="Logo" class="h-16 w-auto relative z-10 block dark:hidden">
            <img src="<?php echo $_ENV['URL_BASE']; ?>/assets/img/logo-branca.svg" alt="Logo" class="h-16 w-auto relative z-10 hidden dark:block">
        </div>
        <!-- Seletor de Ministérios -->
        <div class="px-4 py-3 border-b dark:border-gray-700">
            <div class="relative">
                <select id="ministerioSelect" onchange="alterarMinisterio(this.value)" class="block w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <?php foreach ($_SESSION['user']['ministerios'] as $ministerio): ?>
                        <option value="<?php echo $ministerio['id']; ?>" <?php echo $_SESSION['user']['ministerio_atual'] == $ministerio['id'] ? 'selected' : ''; ?>>
                            <?php echo $ministerio['nome']; ?>
                        </option>
                    <?php endforeach; ?>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Menu Items -->
        <nav class="flex-1 overflow-y-auto py-4 px-3">
            <div class="space-y-1">
                <!-- Início -->
                <a href="<?php echo $_ENV['URL_BASE']; ?>/inicio" 
                   class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                    <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    <span class="font-medium">Início</span>
                </a>

                <!-- Escalas (submenu) -->
                <div class="space-y-1">
                    <button type="button" onclick="toggleSubMenu('escalasSubMenu', this)" 
                            aria-expanded="<?= $escalasActive ? 'true' : 'false' ?>"
                            class="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group focus:outline-none">
                        <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span class="font-medium flex-1 text-left">Escalas</span>
                        <svg id="escalasArrow" class="w-4 h-4 ml-auto transition-transform duration-200 <?= $escalasActive ? 'rotate-180' : '' ?>" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div id="escalasSubMenu" class="<?= $escalasActive ? '' : 'hidden' ?> pl-11 space-y-1">
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/escalas" 
                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                            <span>Ver Escalas</span>
                        </a>
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/modelos" 
                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                            <span>Modelos</span>
                        </a>
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/musicas" 
                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                            <span>Músicas</span>
                        </a>
                    </div>
                </div>

                <!-- Ministérios -->
                <a href="<?php echo $_ENV['URL_BASE']; ?>/ministerios" 
                   class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                    <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <span class="font-medium">Ministérios</span>
                </a>
                <!-- Solicitações -->
                <a href="<?php echo $_ENV['URL_BASE']; ?>/solicitacoes" 
                   class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                    <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    <span class="font-medium">Solicitações</span>
                </a>
                <!-- Atividades (submenu) -->
                <div class="space-y-1">
                    <button type="button" onclick="toggleSubMenu('atividadesSubMenu', this)" 
                            aria-expanded="<?= $atividadesActive ? 'true' : 'false' ?>"
                            class="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group focus:outline-none">
                        <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span class="font-medium flex-1 text-left">Atividades</span>
                        <svg id="atividadesArrow" class="w-4 h-4 ml-auto transition-transform duration-200 <?= $atividadesActive ? 'rotate-180' : '' ?>" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div id="atividadesSubMenu" class="<?= $atividadesActive ? '' : 'hidden' ?> pl-11 space-y-1">
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/atividades" 
                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                            <span>Listagem</span>
                        </a>
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/categoria-atividade" 
                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                            <span>Atividades</span>
                        </a>
                    </div>
                </div>
                <!-- Eventos -->
                <a href="<?php echo $_ENV['URL_BASE']; ?>/eventos" 
                   class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                    <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span class="font-medium">Eventos</span>
                </a>
                <!-- Recados -->
                <a href="<?php echo $_ENV['URL_BASE']; ?>/recados" 
                   class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                    <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                    </svg>
                    <span class="font-medium">Recados</span>
                </a>
                <!-- Voluntários (submenu) -->
                <div class="space-y-1">
                    <button type="button" onclick="toggleSubMenu('voluntariosSubMenu', this)" 
                            aria-expanded="<?= $voluntariosActive ? 'true' : 'false' ?>"
                            class="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group focus:outline-none">
                        <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                        <span class="font-medium flex-1 text-left">Voluntários</span>
                        <svg id="voluntariosArrow" class="w-4 h-4 ml-auto transition-transform duration-200 <?= $voluntariosActive ? 'rotate-180' : '' ?>" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div id="voluntariosSubMenu" class="<?= $voluntariosActive ? '' : 'hidden' ?> pl-11 space-y-1">
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/voluntarios" 
                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                            <span>Ver voluntários</span>
                        </a>
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/calendario" 
                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                            <span>Calendário</span>
                        </a>
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/observacoes" 
                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                            <span>Observações</span>
                        </a>
                        <a href="<?php echo $_ENV['URL_BASE']; ?>/aniversariantes" 
                           class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                            <span>Aniversariantes</span>
                        </a>
                    </div>
                </div>
                <!-- Orden de culto -->
                <a href="<?php echo $_ENV['URL_BASE']; ?>/orden-culto" 
                   class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                    <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    <span class="font-medium">Orden de culto</span>
                </a>
                <!-- Configurações -->
                <a href="<?php echo $_ENV['URL_BASE']; ?>/configuracoes" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group">
                    <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <span class="font-medium">Configurações</span>
                </a>
            </div>
        </nav>

        <!-- User Menu Button -->
        <div class="p-4 border-t dark:border-gray-700">
            <button onclick="toggleUserMenu()" class="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
                <div class="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-white"><?php echo substr($_SESSION['user']['nome'], 0, 1); ?></span>
                </div>
                <div class="ml-3 text-left">
                    <p class="text-sm font-medium"><?php echo $_SESSION['user']['nome']; ?></p>
                    <p class="text-xs text-gray-500 dark:text-gray-400"><?php echo $_SESSION['user']['nivel']; ?></p>
                </div>
                <svg class="ml-auto w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
        </div>
    </div>
</aside>

<!-- User Menu Dropdown -->
<div id="userMenu" class="hidden fixed z-50 w-56 rounded-lg shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10">
    <div class="px-4 py-2 border-b dark:border-gray-700">
        <p class="text-sm font-medium text-gray-900 dark:text-white"><?php echo $_SESSION['user']['nome']; ?></p>
        <p class="text-xs text-gray-500 dark:text-gray-400"><?php echo $_SESSION['user']['nivel']; ?></p>
    </div>
    <a href="<?php echo $_ENV['URL_BASE']; ?>/config/auth/logout.service.php" class="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
        <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sair
        </div>
    </a>
</div>

<script>
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    const button = event.currentTarget;
    if (menu.classList.contains('hidden')) {
        // Calcula a posição do botão
        const rect = button.getBoundingClientRect();
        let left = rect.left;
        let top = rect.bottom + window.scrollY + 8;

        // Em telas grandes, alinhar à direita do sidebar
        if (window.innerWidth >= 1024) {
            left = rect.left + rect.width + 16;
            top = rect.top + window.scrollY;
        }

        // Garante que o menu não fique fora da tela (rodapé/topo)
        const menuHeight = menu.offsetHeight || 200; // fallback para altura estimada
        const menuWidth = menu.offsetWidth || 224; // fallback para largura estimada
        const padding = 16;

        // Ajusta se ultrapassar o rodapé
        if (top + menuHeight > window.scrollY + window.innerHeight - padding) {
            top = window.scrollY + window.innerHeight - menuHeight - padding;
        }
        // Ajusta se ultrapassar o topo
        if (top < window.scrollY + padding) {
            top = window.scrollY + padding;
        }
        // Ajusta se ultrapassar a lateral direita
        if (left + menuWidth > window.scrollX + window.innerWidth - padding) {
            left = window.scrollX + window.innerWidth - menuWidth - padding;
        }
        // Ajusta se ultrapassar a lateral esquerda
        if (left < window.scrollX + padding) {
            left = window.scrollX + padding;
        }

        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
        menu.classList.remove('hidden');
    } else {
        menu.classList.add('hidden');
    }
}

// Close user menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('userMenu');
    const button = document.querySelector('button[onclick="toggleUserMenu()"]');
    if (!menu.contains(event.target) && !button.contains(event.target)) {
        menu.classList.add('hidden');
    }
});

// Mobile menu toggle
document.getElementById('menuToggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
});
</script>

<!-- Script do seletor de ministérios -->
<script>
    window.URL_BASE = '<?php echo $_ENV['URL_BASE']; ?>';
</script>
<script src="<?php echo $_ENV['URL_BASE']; ?>/assets/js/ministerio-switcher.js"></script>
<script>
function toggleSubMenu(menuId, btn) {
    // Fecha todos os outros submenus
    document.querySelectorAll('[id$="SubMenu"]').forEach(menu => {
        if (menu.id !== menuId) {
            menu.classList.add('hidden');
            const arrow = document.getElementById(menu.id.replace('SubMenu', 'Arrow'));
            if (arrow) arrow.classList.remove('rotate-180');
            const button = menu.previousElementSibling;
            if (button) button.setAttribute('aria-expanded', 'false');
        }
    });
    // Toggle submenu clicado
    const subMenu = document.getElementById(menuId);
    const arrow = document.getElementById(menuId.replace('SubMenu', 'Arrow'));
    if (subMenu.classList.contains('hidden')) {
        subMenu.classList.remove('hidden');
        if (arrow) arrow.classList.add('rotate-180');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
        subMenu.classList.add('hidden');
        if (arrow) arrow.classList.remove('rotate-180');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }
}

// Fecha submenus ao clicar fora (desktop)
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar.contains(event.target)) {
        document.querySelectorAll('[id$="SubMenu"]').forEach(menu => {
            menu.classList.add('hidden');
            const arrow = document.getElementById(menu.id.replace('SubMenu', 'Arrow'));
            if (arrow) arrow.classList.remove('rotate-180');
            const button = menu.previousElementSibling;
            if (button) button.setAttribute('aria-expanded', 'false');
        });
    }
});

// Garante que todos os submenus comecem fechados/abertos conforme a rota ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    <?php if (!$escalasActive): ?>document.getElementById('escalasSubMenu')?.classList.add('hidden');<?php endif; ?>
    <?php if ($escalasActive): ?>
        document.getElementById('escalasSubMenu')?.classList.remove('hidden');
        document.getElementById('escalasArrow')?.classList.add('rotate-180');
        document.querySelector('button[onclick*="escalasSubMenu"]')?.setAttribute('aria-expanded', 'true');
    <?php endif; ?>
    <?php if (!$atividadesActive): ?>document.getElementById('atividadesSubMenu')?.classList.add('hidden');<?php endif; ?>
    <?php if ($atividadesActive): ?>
        document.getElementById('atividadesSubMenu')?.classList.remove('hidden');
        document.getElementById('atividadesArrow')?.classList.add('rotate-180');
        document.querySelector('button[onclick*="atividadesSubMenu"]')?.setAttribute('aria-expanded', 'true');
    <?php endif; ?>
    <?php if (!$voluntariosActive): ?>document.getElementById('voluntariosSubMenu')?.classList.add('hidden');<?php endif; ?>
    <?php if ($voluntariosActive): ?>
        document.getElementById('voluntariosSubMenu')?.classList.remove('hidden');
        document.getElementById('voluntariosArrow')?.classList.add('rotate-180');
        document.querySelector('button[onclick*="voluntariosSubMenu"]')?.setAttribute('aria-expanded', 'true');
    <?php endif; ?>
});
</script>