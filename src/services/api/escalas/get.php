<?php
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

// Verifica método
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    returnError('Método não permitido', 405);
}

// Extrai o ID da URL usando expressão regular
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
preg_match('/\/get\.php\/(\d+)/', $uri, $matches);
$escalaId = $matches[1] ?? null;

if (!$escalaId) {
    returnError('ID da escala não informado');
}

$organizacaoId = $_GET['organizacao_id'] ?? null;
if (!$organizacaoId) {
    returnError('Organização não informada');
}

// Monta URL da API principal
$apiUrl = $_ENV['API_BASE_URL'] . "/api/escalas/{$escalaId}?organizacao_id={$organizacaoId}";

// Faz requisição para API principal
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . $_ENV['API_KEY']
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
