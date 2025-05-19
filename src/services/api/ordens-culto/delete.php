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

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    returnError('Método não permitido', 405);
}

$organizacao_id = SessionService::getOrganizacaoId();
$id = basename($_SERVER['REQUEST_URI']);

if (!$id) {
    returnError('ID não fornecido');
}

if (!$organizacao_id) {
    returnError('ID da organização não encontrado');
}

// Monta a URL da API com o organizacao_id como query parameter
$apiUrl = $_ENV['API_BASE_URL'] . '/api/ordens-culto/' . $id;
$params = http_build_query([
    'organizacao_id' => $organizacao_id
]);
$url = "{$apiUrl}?{$params}";

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_CUSTOMREQUEST => 'DELETE',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: ' . $_ENV['API_KEY']
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

http_response_code($httpCode);
echo json_encode(['code' => 200, 'message' => 'Ordem de culto excluída com sucesso']);
