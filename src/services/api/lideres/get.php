<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

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
$limit = $_GET['limit'] ?? 12;
$search = $_GET['search'] ?? '';
$organizacao_id = SessionService::getOrganizacaoId();

// Validações
if ($page < 1) returnError('Página inválida');
if ($limit < 1) returnError('Limite inválido');
if (!$organizacao_id) returnError('Organização não identificada');

// Monta URL com query params
$params = http_build_query([
    'page' => $page,
    'limit' => $limit,
    'search' => $search,
    'organizacao_id' => $organizacao_id
]);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $_ENV['API_BASE_URL'] . "/lideres?{$params}",
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

http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'message' => 'Líderes recuperados com sucesso',
    'data' => $data['data'] ?? [],
    'meta' => [
        'total' => $data['total'] ?? 0,
        'page' => (int)$page,
        'limit' => (int)$limit,
        'totalPages' => ceil(($data['total'] ?? 0) / $limit)
    ]
]);
