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
    *{scrollbar-width:thin;scrollbar-color:#4a4a4a #fff}
    *::-webkit-scrollbar{width:11px}
    *::-webkit-scrollbar-track{background:#fff}
    *::-webkit-scrollbar-thumb{background:#4a4a4a;border-radius:5px;border:1px solid #fff}
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

  <!-- ======== Realtime (SSE) — substitui RealtimeService/Socket.IO ======== -->
  <script>
  // Endpoints SSE/atividade
  window.REALTIME_CONFIG = {
    sseUrl: '<?php echo rtrim($_ENV['URL_BASE'] ?? '', '/'); ?>/src/realtime/realtime.stream.php',
    activityUrl: '<?php echo rtrim($_ENV['URL_BASE'] ?? '', '/'); ?>/src/realtime/user-activity.php'
  };

  // sessionId por aba
  window.SESSION_ID = localStorage.getItem('SESSION_ID') ||
    (crypto.randomUUID ? crypto.randomUUID() : (Date.now()+'-'+Math.random()));
  localStorage.setItem('SESSION_ID', window.SESSION_ID);

  // Inicia SSE e despacha evento global 'realtime-users'
  (function initSSE(){
    try{
      const es = new EventSource(window.REALTIME_CONFIG.sseUrl);
      es.addEventListener('users', (ev) => {
        try{
          const payload = JSON.parse(ev.data);    // { ts, users: { sessionId: {...} } }
          const all = payload.users || {};
          const orgId = window.USER?.organizacao_id ?? null;
          const list = orgId == null ? Object.values(all)
                                     : Object.values(all).filter(u => String(u.organizacaoId) === String(orgId));
          window.dispatchEvent(new CustomEvent('realtime-users', { detail: { all, list } }));
        } catch(e){ console.error('SSE parse error', e); }
      });
      window.__realtime_es = es;
    } catch(e){ console.error('SSE init error', e); }
  })();

  // POST de atividade (cliente -> servidor)
  window.realtimeSendActivity = async function(payload){
    const base = {
      sessionId: window.SESSION_ID,
      userId: window.USER?.id ?? null,
      userName: window.USER?.name ?? null,
      organizacaoId: window.USER?.organizacao_id ?? null,
      currentPage: (document.body && document.body.dataset && document.body.dataset.page) ? document.body.dataset.page : 'inicio'
    };
    const body = Object.assign(base, payload || {});
    try{
      await fetch(window.REALTIME_CONFIG.activityUrl, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(body)
      });
    } catch(e){ console.error('Falha ao enviar atividade', e); }
  };

  // Presença básica global
  window.addEventListener('focus', () => window.realtimeSendActivity({activity:'active', tabActive:true, status:'online'}));
  window.addEventListener('blur',  () => window.realtimeSendActivity({activity:'away',  tabActive:false}));
  document.addEventListener('visibilitychange', () => 
    window.realtimeSendActivity({activity: document.hidden ? 'away' : 'active', tabActive: !document.hidden})
  );
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
    *{scrollbar-width:thin;scrollbar-color:#894bfb #2b2b2b}
    *::-webkit-scrollbar{width:3px}
    *::-webkit-scrollbar-track{background:#2b2b2b}
    *::-webkit-scrollbar-thumb{background:#894bfb;border-radius:3px;border:1px solid #fff}
  </style>
