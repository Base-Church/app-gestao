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
if (!SessionService::hasToken()) {
    returnError('Token de autenticação não encontrado', 401);
}
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    returnError('Método não permitido', 405);
}

$processo_id = $_GET['id'] ?? null;
if (!$processo_id) {
    returnError('ID do processo não informado');
}

$organizacao_id = SessionService::getOrganizacaoId();
if (!$organizacao_id) {
    returnError('Organização não encontrada');
}

$apiUrl = $_ENV['API_BASE_URL'] . '/processos/' . $processo_id;
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_CUSTOMREQUEST => 'DELETE',
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

http_response_code($httpCode);
echo $response;
