<?php
require_once __DIR__ . '/vendor/autoload.php';
if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}
$routes = require __DIR__ . '/config/router.php';
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove o prefixo base se necessário
$base = rtrim(parse_url($_ENV['URL_BASE'] ?? '', PHP_URL_PATH), '/');
if ($base && strpos($uri, $base) === 0) {
    $uri = substr($uri, strlen($base));
    if ($uri === '') $uri = '/inicio';
}

if (isset($routes[$uri])) {
    require __DIR__ . $routes[$uri];
    exit;
}

// Fallback padrão (login)
header('Location: ' . ($_ENV['URL_BASE'] ?? '') . '/login');
exit;
?>
