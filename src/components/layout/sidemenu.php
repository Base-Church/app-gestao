<?php
// Detectar submenus ativos conforme a URL
$currentPath = $_SERVER['REQUEST_URI'];
$escalasActive      = strpos($currentPath, '/escalas') !== false || strpos($currentPath, '/modelos') !== false || strpos($currentPath, '/musicas') !== false;
$atividadesActive   = strpos($currentPath, '/atividades') !== false || strpos($currentPath, '/categoria-atividade') !== false;
$voluntariosActive  = strpos($currentPath, '/voluntarios') !== false || strpos($currentPath, '/calendario') !== false || strpos($currentPath, '/observacoes') !== false;
$ministeriosActive  = strpos($currentPath, '/ministerios') !== false || strpos($currentPath, '/solicitacoes') !== false || strpos($currentPath, '/recados') !== false || strpos($currentPath, '/aniversariantes') !== false;
$eventosActive      = strpos($currentPath, '/eventos') !== false || strpos($currentPath, '/calendarios') !== false || strpos($currentPath, '/eventos/agenda') !== false;
$processosActive    = strpos($currentPath, '/processos') !== false;
$ferramentasActive  = strpos($currentPath, '/formularios') !== false || strpos($currentPath, '/disparador') !== false;
?>
<style>
/* Ajusta o conteúdo conforme o estado do sidebar global (#sidebar[data-collapsed]) mesmo em arquivos separados */
@media (min-width: 1024px) {
  :root { --sidebar-ml: 16rem; }                  /* Sidebar expandido (lg:w-64) */
  html.sidebar-collapsed { --sidebar-ml: 5rem; }  /* Sidebar recolhido (lg:w-20) */

  main.with-sidebar {
    margin-left: var(--sidebar-ml);
    transition: margin-left .3s ease;
  }
}
/* Ajusta o topo conforme o estado do sidebar */
@media (min-width: 1024px) {
  :root { --sidebar-width: 16rem; }                  /* expandido */
  html.sidebar-collapsed { --sidebar-width: 5rem; }  /* recolhido */

  nav.with-sidebar {
    width: calc(100% - var(--sidebar-width));
    transition: width .3s ease;
  }
}
/* Em mobile o sidebar é sobreposto, então sem margem lateral */
</style>

<script>
/* Observa o #sidebar global (no header) e aplica/remova a classe em <html> para ajustar a margem do <main> */
document.addEventListener('DOMContentLoaded', function () {
  const html = document.documentElement;
  const sidebar = document.getElementById('sidebar');
  const apply = () => {
    if (sidebar && sidebar.getAttribute('data-collapsed') === 'true') {
      html.classList.add('sidebar-collapsed');
    } else {
      html.classList.remove('sidebar-collapsed');
    }
  };
  apply();
  if (sidebar) {
    new MutationObserver(apply).observe(sidebar, { attributes: true, attributeFilter: ['data-collapsed'] });
  }
});
</script>


<aside id="sidebar"
  class="fixed inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-xl w-64 transition-all duration-300 transform lg:translate-x-0 -translate-x-full z-40 lg:w-64"
  data-collapsed="false" data-hover-open="false">
  <div class="flex flex-col h-full">

    <!-- Logo -->
    <div class="flex items-center justify-center h-24 border-b dark:border-gray-700 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10"></div>
      <!-- Mostra 1 logo por tema (corrigido duplicidade) -->
      <img src="<?php echo $_ENV['URL_BASE'] ?? ''; ?>/assets/img/logo-preta.svg" alt="Logo Claro"
           class="h-12 w-auto relative z-10 sidebar-logo dark:hidden block">
      <img src="<?php echo $_ENV['URL_BASE'] ?? ''; ?>/assets/img/logo-branca.svg" alt="Logo Escuro"
           class="h-12 w-auto relative z-10 sidebar-logo hidden dark:block">
    </div>



    <!-- Seletor de Ministérios -->
    <div class="px-4 py-3 border-b dark:border-gray-700 sidebar-content">
      <div class="relative">
        <select id="ministerioSelect" onchange="alterarMinisterio(this.value)"
          class="block w-full px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
          <?php foreach ($_SESSION['user']['ministerios'] as $ministerio): ?>
            <option value="<?php echo $ministerio['id']; ?>" <?php echo $_SESSION['user']['ministerio_atual'] == $ministerio['id'] ? 'selected' : ''; ?>>
              <?php echo $ministerio['nome']; ?>
            </option>
          <?php endforeach; ?>
        </select>
      </div>
    </div>

    <!-- Menu Items -->
    <nav class="flex-1 overflow-y-auto py-4 px-3">
      <div class="space-y-1">

        <!-- Início -->
        <a title="Início" href="<?php echo $_ENV['URL_BASE']; ?>/inicio"
           class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group menu-item">
          <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="font-medium sidebar-text">Início</span>
        </a>

        <!-- Geral -->
        <a title="Geral" href="<?php echo $_ENV['URL_BASE']; ?>/geral"
           class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group menu-item">
          <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12">
                        <path fill="currentColor" d="M5.816 2.035a.5.5 0 0 1 .368 0l3.5 1.384a.5.5 0 0 1 .316.465v4.23a.5.5 0 0 1-.316.466l-3.5 1.383a.5.5 0 0 1-.368 0l-3.5-1.383A.5.5 0 0 1 2 8.115V3.884a.5.5 0 0 1 .316-.465zm.735-.93a1.5 1.5 0 0 0-1.102 0l-3.5 1.384A1.5 1.5 0 0 0 1 3.884v4.23a1.5 1.5 0 0 0 .949 1.396l3.5 1.383a1.5 1.5 0 0 0 1.102 0l3.5-1.383A1.5 1.5 0 0 0 11 8.115V3.884a1.5 1.5 0 0 0-.949-1.395zm-2.865 2.93a.5.5 0 0 0-.372.93l2.186.874V8a.5.5 0 0 0 1 0V5.839l2.186-.875a.5.5 0 1 0-.372-.928L6 4.96z"/>
                    </svg>
          <span class="font-medium sidebar-text">Geral</span>
        </a>

        <!-- Escalas (submenu) -->
        <div class="space-y-1">
          <button type="button" onclick="toggleSubMenu('escalasSubMenu', this)"
                  aria-expanded="<?= $escalasActive ? 'true' : 'false' ?>"
                  class="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group focus:outline-none menu-item">
            <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="font-medium flex-1 text-left sidebar-text">Escalas</span>
            <svg id="escalasArrow" class="w-4 h-4 ml-auto transition-transform duration-200 <?= $escalasActive ? 'rotate-180' : '' ?>" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div id="escalasSubMenu" class="<?= $escalasActive ? '' : 'hidden' ?> pl-11 space-y-1 submenu-list">
            <a title="Ver Escalas" href="<?php echo $_ENV['URL_BASE']; ?>/escalas"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Ver Escalas</span>
            </a>
            <a title="Modelos" href="<?php echo $_ENV['URL_BASE']; ?>/modelos"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Modelos</span>
            </a>
            <a title="Músicas" href="<?php echo $_ENV['URL_BASE']; ?>/musicas"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Músicas</span>
            </a>
          </div>
        </div>

        <!-- Ministérios (submenu) -->
        <div class="space-y-1">
          <button type="button" onclick="toggleSubMenu('ministeriosSubMenu', this)"
                  aria-expanded="<?= $ministeriosActive ? 'true' : 'false' ?>"
                  class="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group focus:outline-none menu-item">
            <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <span class="font-medium flex-1 text-left sidebar-text">Ministérios</span>
            <svg id="ministeriosArrow" class="w-4 h-4 ml-auto transition-transform duration-200 <?= $ministeriosActive ? 'rotate-180' : '' ?>" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div id="ministeriosSubMenu" class="<?= $ministeriosActive ? '' : 'hidden' ?> pl-11 space-y-1 submenu-list">
            <a title="Ver Ministérios" href="<?php echo $_ENV['URL_BASE']; ?>/ministerios"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Ver Ministérios</span>
            </a>
            <a title="Solicitações" href="<?php echo $_ENV['URL_BASE']; ?>/solicitacoes"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Solicitações</span>
            </a>
            <a title="Recados" href="<?php echo $_ENV['URL_BASE']; ?>/recados"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Recados</span>
            </a>
            <a title="Aniversariantes" href="<?php echo $_ENV['URL_BASE']; ?>/aniversariantes"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Aniversariantes</span>
            </a>
          </div>
        </div>

        <!-- Atividades (submenu) -->
        <div class="space-y-1">
          <button type="button" onclick="toggleSubMenu('atividadesSubMenu', this)"
                  aria-expanded="<?= $atividadesActive ? 'true' : 'false' ?>"
                  class="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group focus:outline-none menu-item">
            <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5z"/>
            </svg>
            <span class="font-medium flex-1 text-left sidebar-text">Atividades</span>
            <svg id="atividadesArrow" class="w-4 h-4 ml-auto transition-transform duration-200 <?= $atividadesActive ? 'rotate-180' : '' ?>" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div id="atividadesSubMenu" class="<?= $atividadesActive ? '' : 'hidden' ?> pl-11 space-y-1 submenu-list">
            <a title="Listagem" href="<?php echo $_ENV['URL_BASE']; ?>/atividades"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Listagem</span>
            </a>
            <a title="Categorias" href="<?php echo $_ENV['URL_BASE']; ?>/categoria-atividade"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Categorias</span>
            </a>
          </div>
        </div>

        <!-- Eventos (submenu) -->
        <div class="space-y-1">
          <button type="button" onclick="toggleSubMenu('eventosSubMenu', this)"
                  aria-expanded="<?= $eventosActive ? 'true' : 'false' ?>"
                  class="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group focus:outline-none menu-item">
            <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5z"/>
            </svg>
            <span class="font-medium flex-1 text-left sidebar-text">Eventos</span>
            <svg id="eventosArrow" class="w-4 h-4 ml-auto transition-transform duration-200 <?= $eventosActive ? 'rotate-180' : '' ?>" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div id="eventosSubMenu" class="<?= $eventosActive ? '' : 'hidden' ?> pl-11 space-y-1 submenu-list">
            <a title="Ver eventos" href="<?php echo $_ENV['URL_BASE']; ?>/eventos"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Ver eventos</span>
            </a>
            <a title="Calendários" href="<?php echo $_ENV['URL_BASE']; ?>/eventos/agenda"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Calendários</span>
            </a>
          </div>
        </div>

        <!-- Voluntários (submenu) -->
        <div class="space-y-1">
          <button type="button" onclick="toggleSubMenu('voluntariosSubMenu', this)"
                  aria-expanded="<?= $voluntariosActive ? 'true' : 'false' ?>"
                  class="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group focus:outline-none menu-item">
            <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <span class="font-medium flex-1 text-left sidebar-text">Voluntários</span>
            <svg id="voluntariosArrow" class="w-4 h-4 ml-auto transition-transform duration-200 <?= $voluntariosActive ? 'rotate-180' : '' ?>" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div id="voluntariosSubMenu" class="<?= $voluntariosActive ? '' : 'hidden' ?> pl-11 space-y-1 submenu-list">
            <a title="Ver voluntários" href="<?php echo $_ENV['URL_BASE']; ?>/voluntarios"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Ver voluntários</span>
            </a>
            <a title="Calendário" href="<?php echo $_ENV['URL_BASE']; ?>/calendario"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Calendário</span>
            </a>
            <a title="Observações" href="<?php echo $_ENV['URL_BASE']; ?>/observacoes"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Observações</span>
            </a>
          </div>
        </div>

        <!-- Processos -->
        <a title="Processos" href="<?php echo $_ENV['URL_BASE']; ?>/processos"
           class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group menu-item">
          <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586l5.707 5.707A1 1 0 0120 9v10a2 2 0 01-2 2z"/>
          </svg>
          <span class="font-medium sidebar-text">Processos</span>
        </a>

        <!-- Ferramentas (submenu) -->
        <div class="space-y-1">
          <button type="button" onclick="toggleSubMenu('ferramentasSubMenu', this)"
                  aria-expanded="<?= $ferramentasActive ? 'true' : 'false' ?>"
                  class="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group focus:outline-none menu-item">
            <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            <span class="font-medium flex-1 text-left sidebar-text">Ferramentas</span>
            <svg id="ferramentasArrow" class="w-4 h-4 ml-auto transition-transform duration-200 <?= $ferramentasActive ? 'rotate-180' : '' ?>" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div id="ferramentasSubMenu" class="<?= $ferramentasActive ? '' : 'hidden' ?> pl-11 space-y-1 submenu-list">
            <a title="Formulários" href="<?php echo $_ENV['URL_BASE']; ?>/formularios"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Formulários</span>
            </a>
            <a title="Disparador" href="<?php echo $_ENV['URL_BASE']; ?>/disparador"
               class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
              <span class="sidebar-text">Disparador</span>
            </a>
          </div>
        </div>

        <!-- Ordem de culto -->
        <a title="Ordem de culto" href="<?php echo $_ENV['URL_BASE']; ?>/orden-culto"
           class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group menu-item">
          <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          <span class="font-medium sidebar-text">Ordem de culto</span>
        </a>

        <!-- Configurações -->
        <a title="Configurações" href="<?php echo $_ENV['URL_BASE']; ?>/configuracoes"
           class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group menu-item">
          <svg class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span class="font-medium sidebar-text">Configurações</span>
        </a>

      </div>
    </nav>

    <!-- User Menu Button -->
    <div class="p-4 border-t dark:border-gray-700">
      <button onclick="toggleUserMenu(event)" class="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200">
        <div class="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
          <span class="text-sm font-medium text-white"><?php echo substr($_SESSION['user']['nome'], 0, 1); ?></span>
        </div>
        <div class="ml-3 text-left sidebar-text">
          <p class="text-sm font-medium"><?php echo $_SESSION['user']['nome']; ?></p>
          <p class="text-xs text-gray-500 dark:text-gray-400"><?php echo $_SESSION['user']['nivel']; ?></p>
        </div>
        <svg class="ml-auto w-5 h-5 text-gray-500 dark:text-gray-400 sidebar-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  <div class="px-4 py-2 border-b dark:border-gray-700">
    <div class="flex items-center space-x-4">
      <!-- Tema -->
      <button id="themeToggle" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg group transition-all duration-200" onclick="toggleTheme()">
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
  <a href="<?php echo $_ENV['URL_BASE']; ?>/config/auth/logout.service.php" class="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
    <div class="flex items-center">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
      </svg>
      Sair
    </div>
  </a>
</div>

<style>
/* Regras puras de CSS para o modo recolhido (sem @apply) */
#sidebar[data-collapsed="true"] { width: 5rem; }            /* lg:w-20 */
@media (min-width: 1024px) {
  #sidebar { width: 16rem; }                                /* lg:w-64 */
  #sidebar[data-collapsed="true"] { width: 5rem; }          /* lg:w-20 */
}
#sidebar[data-collapsed="true"] .sidebar-text { display: none !important; }
#sidebar[data-collapsed="true"] .sidebar-content { display: none !important; }
#sidebar[data-collapsed="true"] .submenu-list { display: none !important; }
#sidebar[data-collapsed="true"] .menu-item svg { margin-right: 0 !important; }

/* Tooltip simples opcional via title padrão do navegador (sem CSS extra) */

/* Dropdown do usuário posição calculada por JS */
</style>

<script>
/* ===== Helper: tema ===== */
function toggleTheme() {
  const html = document.documentElement;
  html.classList.toggle('dark');
}

/* ===== Toggle user dropdown + posicionamento ===== */
function toggleUserMenu(ev) {
  ev?.stopPropagation();
  const menu = document.getElementById('userMenu');
  const btn  = ev?.currentTarget;
  if (menu.classList.contains('hidden')) {
    const rect = btn.getBoundingClientRect();
    let left = rect.right + 12;
    let top  = rect.top + window.scrollY;
    const menuWidth  = 224, menuHeight = 200, pad = 16;

    if (top + menuHeight > window.scrollY + window.innerHeight - pad) {
      top = window.scrollY + window.innerHeight - menuHeight - pad;
    }
    if (left + menuWidth > window.scrollX + window.innerWidth - pad) {
      left = rect.left - menuWidth - 12;
      if (left < window.scrollX + pad) left = window.scrollX + pad;
    }

    menu.style.left = left + 'px';
    menu.style.top  = top  + 'px';
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
}

document.addEventListener('click', function (e) {
  const menu = document.getElementById('userMenu');
  if (!menu.classList.contains('hidden') && !menu.contains(e.target) && !e.target.closest('button[onclick*="toggleUserMenu"]')) {
    menu.classList.add('hidden');
  }
});

/* ===== Função toggleSidebar agora está no navbar.php ===== */

/* ===== Funções de estado do sidebar ===== */
let collapseTimeout = null;
const LG = window.matchMedia('(min-width: 1024px)');

function setCollapsed(collapsed, userAction = false) {
  const sidebar = document.getElementById('sidebar');
  sidebar.setAttribute('data-collapsed', collapsed ? 'true' : 'false');

  // classes utilitárias para suavizar sem depender de @apply
  if (LG.matches) {
    if (collapsed) {
      sidebar.classList.remove('w-64'); sidebar.classList.add('w-20');
      sidebar.classList.remove('lg:w-64'); sidebar.classList.add('lg:w-20');
    } else {
      sidebar.classList.remove('w-20'); sidebar.classList.add('w-64');
      sidebar.classList.remove('lg:w-20'); sidebar.classList.add('lg:w-64');
    }
  }

  // Se o usuário clicou para expandir, ainda assim aplicamos "recuar sozinho" ao sair
  if (!collapsed && userAction) {
    bindAutoCollapse();
  }
}

/* ===== Mecânica de RECUAR SOZINHO (desktop) =====
   - Se expandido, ao sair com o mouse do sidebar por 600ms, recolhe.
   - Se recolhido, ao passar o mouse por cima, expande temporariamente; ao sair, recolhe.
*/
function bindAutoCollapse() {
  const sidebar = document.getElementById('sidebar');
  if (!LG.matches) return;

  sidebar.addEventListener('mouseleave', onSidebarLeave);
  sidebar.addEventListener('mouseenter', onSidebarEnter);

  // Também recolhe ao clicar fora
  document.addEventListener('click', onDocumentClick);
}

function onSidebarLeave() {
  if (!LG.matches) return;
  const sidebar = document.getElementById('sidebar');
  clearTimeout(collapseTimeout);
  collapseTimeout = setTimeout(() => {
    setCollapsed(true, false);
  }, 600);
}

function onSidebarEnter() {
  if (!LG.matches) return;
  clearTimeout(collapseTimeout);
}

function onDocumentClick(e) {
  const sidebar = document.getElementById('sidebar');
  if (!LG.matches) return;
  if (!sidebar.contains(e.target)) {
    setCollapsed(true, false);
  }
}

// Hover para abrir temporariamente quando já estiver recolhido
(function setupHoverOpen() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  sidebar.addEventListener('mouseenter', function () {
    if (!LG.matches) return;
    if (sidebar.getAttribute('data-collapsed') === 'true') {
      // abre temporariamente enquanto hover
      sidebar.setAttribute('data-hover-open', 'true');
      sidebar.classList.remove('w-20', 'lg:w-20');
      sidebar.classList.add('w-64', 'lg:w-64');
      sidebar.setAttribute('data-collapsed', 'false');
    }
  });

  sidebar.addEventListener('mouseleave', function () {
    if (!LG.matches) return;
    if (sidebar.getAttribute('data-hover-open') === 'true') {
      sidebar.setAttribute('data-hover-open', 'false');
      setCollapsed(true, false);
    }
  });
})();

/* ===== Submenus ===== */
function toggleSubMenu(menuId, btn) {
  const sidebar = document.getElementById('sidebar');
  // se recolhido, primeiro expande para o usuário ver o submenu
  if (LG.matches && sidebar.getAttribute('data-collapsed') === 'true') {
    setCollapsed(false, false);
  }

  // Fecha os outros
  document.querySelectorAll('[id$="SubMenu"]').forEach(menu => {
    if (menu.id !== menuId) {
      menu.classList.add('hidden');
      const arrow = document.getElementById(menu.id.replace('SubMenu', 'Arrow'));
      arrow && arrow.classList.remove('rotate-180');
      const button = menu.previousElementSibling;
      button && button.setAttribute('aria-expanded', 'false');
    }
  });

  const subMenu = document.getElementById(menuId);
  const arrow  = document.getElementById(menuId.replace('SubMenu', 'Arrow'));
  const willOpen = subMenu.classList.contains('hidden');

  subMenu.classList.toggle('hidden');
  arrow && arrow.classList.toggle('rotate-180');
  btn && btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
}

/* Fecha submenus ao clicar fora (desktop) */
document.addEventListener('click', function (event) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar.contains(event.target)) {
    document.querySelectorAll('[id$="SubMenu"]').forEach(menu => {
      menu.classList.add('hidden');
      const arrow = document.getElementById(menu.id.replace('SubMenu', 'Arrow'));
      arrow && arrow.classList.remove('rotate-180');
      const button = menu.previousElementSibling;
      button && button.setAttribute('aria-expanded', 'false');
    });
  }
});

/* Estado inicial conforme rota */
document.addEventListener('DOMContentLoaded', function () {
  // Começa expandido no desktop, recolhido no hover quando sair
  setCollapsed(false, false);
  bindAutoCollapse();

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

  <?php if (!$ministeriosActive): ?>document.getElementById('ministeriosSubMenu')?.classList.add('hidden');<?php endif; ?>
  <?php if ($ministeriosActive): ?>
    document.getElementById('ministeriosSubMenu')?.classList.remove('hidden');
    document.getElementById('ministeriosArrow')?.classList.add('rotate-180');
    document.querySelector('button[onclick*="ministeriosSubMenu"]')?.setAttribute('aria-expanded', 'true');
  <?php endif; ?>

  <?php if (!$eventosActive): ?>document.getElementById('eventosSubMenu')?.classList.add('hidden');<?php endif; ?>
  <?php if ($eventosActive): ?>
    document.getElementById('eventosSubMenu')?.classList.remove('hidden');
    document.getElementById('eventosArrow')?.classList.add('rotate-180');
    document.querySelector('button[onclick*="eventosSubMenu"]')?.setAttribute('aria-expanded', 'true');
  <?php endif; ?>

  <?php if (!$ferramentasActive): ?>document.getElementById('ferramentasSubMenu')?.classList.add('hidden');<?php endif; ?>
  <?php if ($ferramentasActive): ?>
    document.getElementById('ferramentasSubMenu')?.classList.remove('hidden');
    document.getElementById('ferramentasArrow')?.classList.add('rotate-180');
    document.querySelector('button[onclick*="ferramentasSubMenu"]')?.setAttribute('aria-expanded', 'true');
  <?php endif; ?>
});
</script>

<!-- Script do seletor de ministérios -->
<script>
  window.URL_BASE = '<?php echo $_ENV['URL_BASE']; ?>';
</script>
<script src="<?php echo $_ENV['URL_BASE']; ?>/assets/js/ministerio-switcher.js"></script>
