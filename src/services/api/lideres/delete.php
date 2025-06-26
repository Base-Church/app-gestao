<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');

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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    returnError('Método não permitido', 405);
}

$id = $_GET['id'] ?? null;
if (!$id) {
    returnError('ID não fornecido');
}

$organizacao_id = SessionService::getOrganizacaoId();
if (!$organizacao_id) {
    returnError('Organização não identificada');
}

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $_ENV['API_BASE_URL'] . "/lideres/{$id}?organizacao_id={$organizacao_id}",
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
    returnError('Erro ao conectar com API: ' . curl_error($ch), 500);
}

curl_close($ch);

// Se for 204 (No Content), retorna sucesso
if ($httpCode === 204) {
    echo json_encode([
        'code' => 200,
        'message' => 'Líder excluído com sucesso'
    ]);
    exit;
}

$responseData = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

http_response_code($httpCode);
echo json_encode($responseData);
