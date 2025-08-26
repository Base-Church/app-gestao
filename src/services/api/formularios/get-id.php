<?php

require_once __DIR__ . '/../../../../config/load_env.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

header('Content-Type: application/json');

function returnError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// Verifica autenticação
SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnError('Não autorizado', 401);
}

// Verifica se o token existe
if (!SessionService::hasToken()) {
    returnError('Token de autenticação não encontrado', 401);
}

// Pega os parâmetros necessários
$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = $_GET['ministerio_id'] ?? ($_POST['ministerio_id'] ?? null);
$formulario_id = $_GET['formulario_id'] ?? null;

if (!$organizacao_id) {
    returnError('Organização não encontrada');
}
if (!$ministerio_id) {
    returnError('Ministério não informado');
}


// Monta a URL para buscar o formulário específico
if (!$formulario_id) {
    returnError('ID do formulário não informado');
}

$apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
$apiUrl = rtrim($apiBase, '/') . '/formularios/' . urlencode($formulario_id);

// Monta os parâmetros da query
$params = [
    'organizacao_id' => $organizacao_id,
    'ministerio_id' => $ministerio_id
];

// Adiciona outros parâmetros de GET (paginação, search, etc)
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

// Processa a resposta
$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API');
}

// Retorna a resposta
http_response_code($httpCode);
echo $response;