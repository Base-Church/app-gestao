<?php
require_once dirname(__DIR__) . '/load_env.php';
require_once __DIR__ . '/session.service.php';

// Inicia a sessão para acessar dados antes de limpar
SessionService::start();

// Encerra a sessão
SessionService::logout();

// Redireciona para a página de login
$urlBase = $_ENV['URL_BASE'] ?? ($_SERVER['URL_BASE'] ?? '');
?>
<!DOCTYPE html>
<html>
<head>
    <script>
    // Notificar o Socket.IO sobre o logout antes de redirecionar
    if (window.realtimeSocket && window.realtimeSocket.connected) {
        window.realtimeSocket.emit('user-logout');
        setTimeout(() => {
            window.location.href = '<?php echo $urlBase; ?>/login';
        }, 100);
    } else {
        window.location.href = '<?php echo $urlBase; ?>/login';
    }
    </script>
</head>
<body>
    <p>Desconectando...</p>
</body>
</html>
