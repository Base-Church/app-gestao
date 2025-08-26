<?php
// Carrega variáveis de ambiente sem Composer
require_once __DIR__ . '/../../../config/load_env.php';
require_once __DIR__ . '/../../../config/auth/session.service.php';

// Iniciar sessão
SessionService::start();

// Fallbacks seguros para variáveis de ambiente
$urlBase = $_ENV['URL_BASE'] ?? ($_SERVER['URL_BASE'] ?? '');

// Forçar redirecionamento se não estiver logado (comparando somente o path)
$currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (!SessionService::isLoggedIn() && $currentPath !== ($urlBase ? parse_url($urlBase, PHP_URL_PATH) . '/login' : '/login') && strpos($currentPath, '/login') === false) {
  header('Location: ' . rtrim($urlBase, '/') . '/login');
  exit;
}

// Forçar redirecionamento se não tiver ministério e não estiver na página sem-ministerio
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
    <meta name="base-url" content="<?php echo $_ENV['URL_BASE']; ?>">
    <title><?php echo isset($pageTitle) ? $pageTitle . ' - ' : ''; ?><?php echo $_ENV['APP_NAME']; ?></title>
    <link href="<?php echo $_ENV['URL_BASE']; ?>/assets/css/output.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script>
    <style>
        body{
            font-family: 'Inter', sans-serif;
        }
/* ===== Scrollbar CSS ===== */
  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #4a4a4a #ffffff;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 11px;
  }

  *::-webkit-scrollbar-track {
    background: #ffffff;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #4a4a4a;
    border-radius: 5px;
    border: 1px solid #ffffff;
  }
</style>

    <script>
    // Configuração global padronizada
    window.APP_CONFIG = {
        baseUrl: '<?php echo $_ENV['URL_BASE']; ?>',
        apiBaseUrl: '<?php echo $_ENV['API_BASE_URL']; ?>',
        apiWhatsapp: '<?php echo $_ENV['API_WHATSAPP']; ?>',
        apiTokenWhatsapp: '<?php echo $_ENV['API_TOKEN_WHATSAPP']; ?>'
    };
    // Retrocompatibilidade para scripts antigos
    window.ENV = {
        URL_BASE: window.APP_CONFIG.baseUrl,
        API_BASE_URL: window.APP_CONFIG.apiBaseUrl,
        API_WHATSAPP: window.APP_CONFIG.apiWhatsapp,
        API_TOKEN_WHATSAPP: window.APP_CONFIG.apiTokenWhatsapp
    };

    window.USER = {
        ministerios: <?php echo json_encode(SessionService::getMinisterios()); ?>,
        ministerio_atual: <?php echo json_encode(SessionService::getMinisterioAtual()); ?>,
        organizacao_id: <?php echo json_encode(SessionService::getOrganizacaoId()); ?>,
        nivel: <?php echo json_encode(SessionService::getNivel()); ?>,
        permissoes: <?php echo json_encode(SessionService::getPermissoes()); ?>,
        token: <?php echo json_encode(SessionService::getToken()); ?>
    };

    // Função auxiliar para validação de ministério
    window.validateMinisterio = function() {
        if (!window.USER?.ministerio_atual) {
            const message = 'Selecione um ministério para continuar';
            console.error(message);
            if (document.getElementById('error-message')) {
                document.getElementById('error-message').textContent = message;
                document.getElementById('error-container')?.classList.remove('hidden');
            }
            return false;
        }
        return true;
    };

        // Inicialização do tema - mais simples e direta
        if (localStorage.getItem('theme') === 'dark' || 
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    </script>
</head>
<body class="h-full bg-white dark:bg-gray-900">
    <!-- Modals Container - Adicionado container para modais com z-index maior -->
    <div id="modals-container" class="relative z-50">
        <!-- Modais serão inseridos aqui -->
    </div>

    <!-- Layout principal com z-index menor -->
    <div class="relative z-40">
        <?php 
        require_once __DIR__ . '/sidemenu.php';
        require_once __DIR__ . '/navbar.php';
        ?>
    </div>
<style>
    /* ===== Scrollbar CSS ===== */
  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #894bfb #2b2b2b;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 3px;
  }

  *::-webkit-scrollbar-track {
    background: #2b2b2b;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #894bfb;
    border-radius: 3px;
    border: 1px solid #ffffff;
  }
</style>