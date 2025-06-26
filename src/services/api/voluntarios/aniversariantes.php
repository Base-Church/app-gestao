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

SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnError('Não autorizado', 401);
}

// Verifica se o token existe
if (!SessionService::hasToken()) {
    returnError('Token de autenticação não encontrado', 401);
}

$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = isset($_GET['ministerio_id']) ? $_GET['ministerio_id'] : null;

if (!$ministerio_id) {
    returnError('Nenhum ministério selecionado');
}
if (!$organizacao_id) {
    returnError('ID da organização não encontrado');
}

$apiUrl = $_ENV['API_BASE_URL'] . '/voluntarios/aniversariantes';
$params = http_build_query([
    'organizacao_id' => $organizacao_id,
    'ministerios' => $ministerio_id
]);
$url = "{$apiUrl}?{$params}";

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
    $error = curl_error($ch);
    curl_close($ch);
    returnError("Erro ao conectar com a API: {$error}", 500);
}
curl_close($ch);

$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

http_response_code($httpCode);
echo json_encode([
    'data' => $data['data'] ?? [],
    'meta' => $data['meta'] ?? []
]);
