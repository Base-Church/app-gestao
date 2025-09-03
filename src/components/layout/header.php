<?php
// src/layouts/header.php (trecho completo corrigido)
require_once __DIR__ . '/../../../config/load_env.php';
require_once __DIR__ . '/../../../config/auth/session.service.php';

// Iniciar sessão
SessionService::start();

// Fallbacks seguros
$urlBase = $_ENV['URL_BASE'] ?? ($_SERVER['URL_BASE'] ?? '');

// Redirecionamentos
$currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (!SessionService::isLoggedIn() && $currentPath !== ($urlBase ? parse_url($urlBase, PHP_URL_PATH) . '/login' : '/login') && strpos($currentPath, '/login') === false) {
  header('Location: ' . rtrim($urlBase, '/') . '/login');
  exit;
}
if (SessionService::isLoggedIn() && !SessionService::hasMinisterios() && strpos($currentPath, 'sem-ministerio') === false) {
  header('Location: ' . rtrim($urlBase, '/') . '/sem-ministerio');
  exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="base-url" content="<?php echo $_ENV['URL_BASE'] ?? ''; ?>">
  <title><?php echo isset($pageTitle) ? $pageTitle . ' - ' : ''; ?><?php echo $_ENV['APP_NAME'] ?? 'App'; ?></title>
  <link href="<?php echo $_ENV['URL_BASE'] ?? ''; ?>/assets/css/output.css" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script>
  <style>
    body{font-family:'Inter',sans-serif}

  </style>

  <script>
  // Config global
  window.APP_CONFIG = {
    baseUrl: <?php echo json_encode($_ENV['URL_BASE'] ?? ''); ?>,
    apiBaseUrl: <?php echo json_encode($_ENV['API_BASE_URL'] ?? ''); ?>,
    apiWhatsapp: <?php echo json_encode($_ENV['API_WHATSAPP'] ?? ''); ?>,
    apiTokenWhatsapp: <?php echo json_encode($_ENV['API_TOKEN_WHATSAPP'] ?? ''); ?>
  };
  window.ENV = {
    URL_BASE: window.APP_CONFIG.baseUrl,
    API_BASE_URL: window.APP_CONFIG.apiBaseUrl,
    API_WHATSAPP: window.APP_CONFIG.apiWhatsapp,
    API_TOKEN_WHATSAPP: window.APP_CONFIG.apiTokenWhatsapp
  };

  // Dados do usuário logado
  window.USER = <?php
    $user = SessionService::getUser();
    $sessionId = session_id() ?: 'session_' . uniqid();
    echo json_encode([
      'id' => $user['id'] ?? $sessionId,
      'name' => $user['nome'] ?? 'Usuário',
      'organizacao_id' => $user['organizacao_id'] ?? null,
      'ministerios' => $user['ministerios'] ?? [],
      'ministerio_atual' => $user['ministerio_atual'] ?? null,
      'nivel' => $user['nivel'] ?? null,
      'permissoes' => $user['permissoes'] ?? [],
      'token' => $user['token'] ?? null
    ]);
  ?>;

  // Tema
  if (localStorage.getItem('theme') === 'dark' ||
     (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  </script>
</head>
<body class="h-full bg-white dark:bg-gray-900">
  <!-- Modals Container -->
  <div id="modals-container" class="relative z-50"></div>

  <!-- Layout principal -->
  <div class="relative z-40">
    <?php 
      require_once __DIR__ . '/sidemenu.php';
      require_once __DIR__ . '/navbar.php';
    ?>
  </div>

<style>
  /* --------- Variáveis de tema (ligadas ao Tailwind .dark) --------- */
  html {
    /* LIGHT */
    --sb-track: #f3f4f6;           /* ~ gray-100 */
    --sb-thumb: #8b5cf6;           /* primary-500 */
    --sb-thumb-border: #000000;    /* borda p/ contraste no claro */
    --sb-width: 8px;               /* ajuste a gosto */
    --sb-radius: 6px;
  }
  html.dark {
    /* DARK */
    --sb-track: #2b2b2b;           /* fundo escuro do track */
    --sb-thumb: #8b5cf6;           /* mantém sua cor "primary" */
    --sb-thumb-border: #ffffff;    /* borda p/ contraste no escuro */
  }

  /* --------- Firefox --------- */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--sb-thumb) var(--sb-track);
  }

  /* --------- WebKit (Chrome/Edge/Safari/Opera) --------- */
  *::-webkit-scrollbar {
    width: var(--sb-width);
    height: var(--sb-width);
  }
  *::-webkit-scrollbar-track {
    background: var(--sb-track);
  }
  *::-webkit-scrollbar-thumb {
    background: var(--sb-thumb);
    border-radius: var(--sb-radius);
    border: 1px solid var(--sb-thumb-border);
  }
</style>

<script>
  // Mantém o tema em localStorage e respeita o prefers-color-scheme no primeiro acesso
  (function () {
    const KEY = 'theme';
    const root = document.documentElement;
    const stored = localStorage.getItem(KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (stored === 'dark' || (!stored && prefersDark)) {
      root.classList.add('dark');
    } else if (stored === 'light') {
      root.classList.remove('dark');
    }
    // Se não houver nada salvo e não preferir dark, fica no claro por padrão
    window.toggleTheme = function () {
      const isDark = root.classList.toggle('dark');
      localStorage.setItem(KEY, isDark ? 'dark' : 'light');
    };
  })();
</script>
