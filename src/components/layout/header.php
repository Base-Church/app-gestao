<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../../config/auth/session.service.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

// Forçar redirecionamento se não estiver logado
if (!SessionService::isLoggedIn() && $_SERVER['REQUEST_URI'] !== '/login') {
    header('Location: ' . $_ENV['URL_BASE'] . '/login');
    exit;
}

// Forçar redirecionamento se não tiver ministério e não estiver na página sem-ministerio
if (SessionService::isLoggedIn() && 
    !SessionService::hasMinisterios() && 
    strpos($_SERVER['REQUEST_URI'], 'sem-ministerio') === false) {
    header('Location: ' . $_ENV['URL_BASE'] . '/sem-ministerio');
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
        apiKey: '<?php echo $_ENV['API_KEY']; ?>',
        apiWhatsapp: '<?php echo $_ENV['API_WHATSAPP']; ?>',
        apiTokenWhatsapp: '<?php echo $_ENV['API_TOKEN_WHATSAPP']; ?>',
        webhookUrl: '<?php echo $_ENV['WEBHOOK_URL'] ?? ''; ?>'
    };
    // Retrocompatibilidade para scripts antigos
    window.ENV = {
        URL_BASE: window.APP_CONFIG.baseUrl,
        API_BASE_URL: window.APP_CONFIG.apiBaseUrl,
        API_KEY: window.APP_CONFIG.apiKey,
        API_WHATSAPP: window.APP_CONFIG.apiWhatsapp,
        API_TOKEN_WHATSAPP: window.APP_CONFIG.apiTokenWhatsapp,
        WEBHOOK_URL: window.APP_CONFIG.webhookUrl
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
    
body {
  --sb-track-color: #232E33;
  --sb-thumb-color: #7c3aed;
  --sb-size: 13px;
}

body::-webkit-scrollbar {
  width: var(--sb-size)
}

body::-webkit-scrollbar-track {
  background: var(--sb-track-color);
  border-radius: 1px;
}

body::-webkit-scrollbar-thumb {
  background: var(--sb-thumb-color);
  border-radius: 1px;
  
}

@supports not selector(::-webkit-scrollbar) {
  body {
    scrollbar-color: var(--sb-thumb-color)
                     var(--sb-track-color);
  }
}
</style>