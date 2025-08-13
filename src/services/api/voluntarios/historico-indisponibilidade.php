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

// Pega os parâmetros da requisição
$organizacao_id = SessionService::getOrganizacaoId();
$voluntario_id = isset($_GET['voluntario_id']) ? $_GET['voluntario_id'] : null;

// Validações
if (!$organizacao_id) {
    returnError('ID da organização não encontrado');
}

if (!$voluntario_id) {
    returnError('ID do voluntário é obrigatório');
}

// Monta a URL da API
$apiUrl = $_ENV['API_BASE_URL'] . '/calendario/indisponibilidade/historico';
$params = http_build_query([
    'organizacao_id' => $organizacao_id,
    'voluntario_id' => $voluntario_id
]);

$url = "{$apiUrl}?{$params}";

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
    ]
]);

// Faz a requisição
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Verifica erros do cURL
if (curl_errno($ch)) {
    $error = curl_error($ch);
    curl_close($ch);
    returnError("Erro ao conectar com a API: {$error}", 500);
}

curl_close($ch);

// Verifica se a resposta é um JSON válido
$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

// Retorna a resposta formatada
http_response_code($httpCode);
echo json_encode($data);