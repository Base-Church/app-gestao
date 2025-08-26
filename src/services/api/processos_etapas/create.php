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
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnError('Método não permitido', 405);
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['nome']) || !isset($data['ministerio_id'])) {
    returnError('Dados inválidos ou incompletos');
}

$organizacao_id = SessionService::getOrganizacaoId();
if (!$organizacao_id) {
    returnError('Organização não encontrada');
}
$data['organizacao_id'] = $organizacao_id;

$apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
$apiUrl = rtrim($apiBase, '/') . '/processo_etapas';
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
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
