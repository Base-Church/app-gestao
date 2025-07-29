<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

// Carrega as variáveis de ambiente
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

// Verifica método
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    returnError('Método não permitido', 405);
}

// Pega o ID do formulário
$formulario_id = $_GET['id'] ?? null;
if (!$formulario_id) {
    returnError('ID do formulário não informado');
}

// Pega os parâmetros necessários
$organizacao_id = SessionService::getOrganizacaoId();
if (!$organizacao_id) {
    returnError('Organização não encontrada');
}

$apiUrl = $_ENV['API_BASE_URL'] . '/formularios/' . $formulario_id;

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

// Retorna a resposta
http_response_code($httpCode);
echo $response;