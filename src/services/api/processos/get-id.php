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

$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = $_GET['ministerio_id'] ?? ($_POST['ministerio_id'] ?? null);
$processo_id = $_GET['processo_id'] ?? null;

if (!$organizacao_id) {
    returnError('Organização não encontrada');
}
if (!$ministerio_id) {
    returnError('Ministério não informado');
}
if (!$processo_id) {
    returnError('ID do processo não informado');
}

$apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
$apiUrl = rtrim($apiBase, '/') . '/processos/' . urlencode($processo_id);
$params = [
    'organizacao_id' => $organizacao_id,
    'ministerio_id' => $ministerio_id
];
foreach ($_GET as $key => $value) {
    if (!isset($params[$key])) {
        $params[$key] = $value;
    }
}
$url = $apiUrl . '?' . http_build_query($params);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
    ]
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    curl_close($ch);
    returnError('Erro na conexão com a API: ' . curl_error($ch));
}
curl_close($ch);

$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API');
}

http_response_code($httpCode);
echo $response;
