<?php
// src/pages/usuarios-online/index.php
$pageTitle = 'Usuários Online';
require_once __DIR__ . '/../../components/layout/header.php';
?>
<main class="mt-24 lg:ml-64 px-6 pb-8">
    <div class="max-w-7xl mx-auto">
      
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Usuários online</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Indicativos em tempo real do que cada um está fazendo</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/40 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-200">
          <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
          <span id="contador-usuarios-online">0</span> online
        </span>
        <button id="btn-refresh" class="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
          Atualizar agora
        </button>
      </div>
    </div>

    <div id="usuarios-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- cards renderizados via JS -->
    </div>
  </div>

  <!-- Notificações simples -->
  <div id="toast" class="hidden fixed bottom-4 right-4 z-50 rounded-lg bg-gray-900 text-white px-4 py-3 shadow-lg"></div>
  <script src="<?php echo $_ENV['URL_BASE']; ?>/src/pages/usuarios-online/js/usuarios-online.js"></script>
</body>
</html>
