<?php
require_once dirname(__DIR__, 2) . '/vendor/autoload.php';
require_once __DIR__ . '/session.service.php';

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__, 2));
$dotenv->load();

// Encerra a sessão
SessionService::logout();

// Redireciona para a página de login
header('Location: ' . $_ENV['URL_BASE'] . '/src/pages/login');
exit;
