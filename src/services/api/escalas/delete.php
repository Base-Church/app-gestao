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

// Pega o ID da escala da URL
$pathParts = explode('/', $_SERVER['REQUEST_URI']);
$escalaId = null;

// Procura o ID na URL (formato: /delete.php/123)
foreach ($pathParts as $i => $part) {
    if ($part === 'delete.php' && isset($pathParts[$i + 1])) {
        $escalaId = intval($pathParts[$i + 1]);
        break;
    }
}

if (!$escalaId) {
    returnError('ID da escala não fornecido');
}

// Pega organizacao_id da query string
$organizacao_id = $_GET['organizacao_id'] ?? null;
if (!$organizacao_id) {
    returnError('ID da organização é obrigatório');
}

// Monta a URL da API para deletar escala
$apiUrl = $_ENV['API_BASE_URL'] . "/escalas/{$escalaId}";

// Configuração do cURL
$ch = curl_init($apiUrl);
curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST => "DELETE",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => json_encode(['organizacao_id' => $organizacao_id]),
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

// Processa a resposta
$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API');
}

// Retorna a resposta
http_response_code($httpCode);
echo $response; 