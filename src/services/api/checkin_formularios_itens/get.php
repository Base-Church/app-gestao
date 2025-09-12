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
$checkin_formularios_id = $_GET['checkin_formularios_id'] ?? null;

if (!$organizacao_id) {
    returnError('Organização não encontrada');
}
if (!$checkin_formularios_id) {
    returnError('ID do formulário de check-in não informado');
}

$apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
$apiUrl = rtrim($apiBase, '/') . '/checkin_formularios_itens';

$params = [
    'organizacao_id' => $organizacao_id,
    'checkin_formularios_id' => $checkin_formularios_id
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
