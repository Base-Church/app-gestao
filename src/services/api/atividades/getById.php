<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../');
$dotenv->load();

// Define o header da resposta como JSON
header('Content-Type: application/json');

// Habilita todos os erros para debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Função para retornar erro
function returnError($message, $code = 400) {
    error_log("Erro: $message (Código: $code)");
    http_response_code($code);
    echo json_encode([
        'error' => 'Erro interno do servidor',
        'message' => $message
    ]);
    exit;
}

// Verifica se o usuário está autenticado
SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnError('Não autorizado', 401);
}

// Pega o ID da atividade
$id = $_GET['id'] ?? null;
if (!$id) {
    returnError('ID da atividade é obrigatório');
}

// Pega os dados da sessão
$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = SessionService::getMinisterioAtual();

// Log dos dados da sessão
error_log("Dados da sessão - Organização ID: $organizacao_id, Ministério ID: $ministerio_id");

if (!$organizacao_id) {
    returnError('ID da organização não encontrado na sessão');
}

if (!$ministerio_id) {
    returnError('ID do ministério não encontrado na sessão');
}

// Monta a URL da API
$apiUrl = $_ENV['API_BASE_URL'] . '/api/atividades/' . $id;
error_log("URL da API: $apiUrl");

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Authorization: ' . $_ENV['API_KEY']
    ]
]);

// Faz a requisição
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Log da resposta
error_log("Resposta da API (HTTP $httpCode): " . $response);

// Verifica erros do cURL
if (curl_errno($ch)) {
    $error = curl_error($ch);
    curl_close($ch);
    returnError("Erro ao conectar com a API: {$error}", 500);
}

curl_close($ch);

// Verifica se a resposta é um JSON válido
$responseData = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API: ' . json_last_error_msg(), 500);
}

// Se a resposta contiver erro, retorna o erro
if (isset($responseData['error'])) {
    returnError($responseData['message'] ?? $responseData['error'], $httpCode);
}

// Retorna a resposta de sucesso
http_response_code($httpCode);
echo json_encode($responseData);
