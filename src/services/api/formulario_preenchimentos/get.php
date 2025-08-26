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

// Parâmetros da requisição
$page = $_GET['page'] ?? 1;
$limit = $_GET['limit'] ?? 1200;
$search = $_GET['search'] ?? '';
$formulario_id = $_GET['formulario_id'] ?? '';
$processo_etapa_id = $_GET['processo_etapa_id'] ?? '';
$created_at = $_GET['created_at'] ?? '';
$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = $_GET['ministerio_id'] ?? SessionService::getMinisterioAtual();

// Validações
if ($page < 1) returnError('Página inválida');
if ($limit < 1) returnError('Limite inválido');
if (!$organizacao_id) returnError('Organização não identificada');
if (!$ministerio_id) returnError('Ministério não informado');

// Monta URL com query params
$params = http_build_query(array_filter([
    'page' => $page,
    'limit' => $limit,
    'search' => $search,
    'formulario_id' => $formulario_id,
    'processo_etapa_id' => $processo_etapa_id,
    'created_at' => $created_at,
    'organizacao_id' => $organizacao_id,
    'ministerio_id' => $ministerio_id
], function($value) {
    return $value !== '' && $value !== null;
}));


$apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => rtrim($apiBase, '/') . "/formulario_preenchimentos?{$params}",
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
    returnError('Erro ao conectar com API: ' . curl_error($ch), 500);
}

curl_close($ch);

$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

// Se a API retornou erro, propaga o erro
if ($httpCode >= 400) {
    http_response_code($httpCode);
    echo $response;
    exit;
}

http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'message' => 'Preenchimentos de formulário recuperados com sucesso',
    'data' => $data['data'] ?? [],
    'meta' => [
        'total' => $data['total'] ?? 0,
        'page' => (int)$page,
        'limit' => (int)$limit,
        'totalPages' => ceil(($data['total'] ?? 0) / $limit)
    ]
]);