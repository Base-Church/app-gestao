<?php

require_once __DIR__ . '/../../../../config/load_env.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

header('Content-Type: application/json');

function returnError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnError('Não autorizado', 401);
}

if (!SessionService::hasToken()) {
    returnError('Token de autenticação não encontrado', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    returnError('Método não permitido', 405);
}

// Pega os parâmetros da URL /eventos-calendario/{mes}/{organizacao_id}
$request_uri = $_SERVER['REQUEST_URI'];
$parts = explode('/', trim($request_uri, '/'));
$mes = $parts[count($parts) - 2] ?? null;
$organizacao_id = $parts[count($parts) - 1] ?? null;


if (!$mes || !preg_match('/^\d{4}-\d{2}$/', $mes)) {
    returnError('Mês inválido. Use o formato YYYY-MM.');
}

if (!$organizacao_id || !filter_var($organizacao_id, FILTER_VALIDATE_INT)) {
    returnError('ID da organização inválido.');
}

$session_organizacao_id = SessionService::getOrganizacaoId();
if ($organizacao_id != $session_organizacao_id) {
    returnError('Acesso negado a esta organização.', 403);
}

$apiBase = $_ENV['API_BASE_URL'] ?? null;
$apiUrl = rtrim($apiBase, '/') . "/eventos-calendario/{$mes}/{$organizacao_id}";

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    returnError('Erro ao conectar com API: ' . curl_error($ch), 500);
}

curl_close($ch);

http_response_code($httpCode);
echo $response;
