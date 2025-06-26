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

// Verifica se é DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    returnError('Método não permitido', 405);
}

// Recebe e decodifica o JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validações
if (!isset($data['id'])) {
    returnError('ID é obrigatório');
}

if (!isset($data['organizacao_id'])) {
    returnError('ID da organização é obrigatório');
}

$id = intval($data['id']);
$organizacao_id = intval($data['organizacao_id']);

// Configura a URL com os parâmetros necessários
$url = $_ENV['API_BASE_URL'] . '/modelos-escalas/' . $id;

// Prepara o payload
$payload = json_encode(['organizacao_id' => $organizacao_id]);

// Configuração do cURL
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => "DELETE",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
    ]
]);

// Executa a requisição
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
