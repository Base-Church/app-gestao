<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once __DIR__ . '/../SessionService.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

// Encerra a sessão
SessionService::logout();

// Redireciona para a página de login
header('Location: ' . $_ENV['URL_BASE'] . '/src/pages/login');
exit;
