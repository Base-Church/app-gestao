<?php
require_once dirname(__DIR__) . '/load_env.php';
require_once __DIR__ . '/session.service.php';

// Encerra a sessão
SessionService::logout();

// Redireciona para a página de login
$urlBase = $_ENV['URL_BASE'] ?? ($_SERVER['URL_BASE'] ?? '');
header('Location: ' . $urlBase . '/login');
exit;
