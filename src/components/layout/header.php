<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../../../config/auth/session.service.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

// Verificar se o usuário está logado
if (!SessionService::isLoggedIn()) {
    header('Location: ' . $_ENV['URL_BASE'] . '/src/pages/login');
    exit;
}

// Verificar se o usuário tem ministérios
if (!SessionService::hasMinisterios()) {
    header('Location: ' . $_ENV['URL_BASE'] . '/src/pages/sem-ministerio');
    exit;
}

// Informações globais do usuário
$user = SessionService::getUser();
$organizacao_id = SessionService::getOrganizacaoId();
$ministerios = SessionService::getMinisterios();
$nivel = SessionService::getNivel();

// Parâmetros globais de paginação
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
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
    scrollbar-width: none;
    scrollbar-color: #8f54a0 #ffffff;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 16px;
  }

  *::-webkit-scrollbar-track {
    background: #ffffff;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #8f54a0;
    border-radius: 10px;
    border: 3px solid #ffffff;
  }
</style>

    <script>
        // Variáveis globais do usuário para uso no JavaScript
        window.USER = {
            organizacao_id: <?php echo $organizacao_id; ?>,
            ministerios: <?php echo json_encode($ministerios); ?>,
            nivel: <?php echo json_encode($nivel); ?>
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
</body>
</html>
