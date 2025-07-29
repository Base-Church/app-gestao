<?php
// Carrega o dotenv antes de qualquer operação
require_once __DIR__ . '/../../../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

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

// Verifica método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnError('Método não permitido', 405);
}

// Recebe e valida dados
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data || !isset($data['nome'])) {
    returnError('Dados inválidos ou incompletos');
}

// Pega os parâmetros necessários
$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = $data['ministerio_id'] ?? null;

if (!$organizacao_id) {
    returnError('Organização não encontrada');
}
if (!$ministerio_id) {
    returnError('Ministério não informado');
}

// Adiciona IDs ao payload
$data['organizacao_id'] = $organizacao_id;

// Configura requisição para API
$apiUrl = $_ENV['API_BASE_URL'] . '/formularios';
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