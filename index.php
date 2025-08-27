<?php
// Carrega variáveis de ambiente simples (sem Composer)
require_once __DIR__ . '/config/load_env.php';

// Se for um endpoint SSE ou API, não processar pelo router
if (strpos($_SERVER['REQUEST_URI'], '/src/realtime/') !== false) {
    $file = __DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (file_exists($file)) {
        require $file;
        exit;
    }
}

$routes = require __DIR__ . '/config/router.php';
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove o prefixo base se necessário
$base = '';
if (isset($_ENV['URL_BASE'])) {
    $base = rtrim(parse_url($_ENV['URL_BASE'], PHP_URL_PATH), '/');
}
if ($base && strpos($uri, $base) === 0) {
    $uri = substr($uri, strlen($base));
    if ($uri === '') $uri = '/inicio';
}

if (isset($routes[$uri])) {
    require __DIR__ . $routes[$uri];
    exit;
}

// Fallback padrão (login)
$urlBase = isset($_ENV['URL_BASE']) ? $_ENV['URL_BASE'] : '';
header('Location: ' . $urlBase . '/login');
exit;
?>
