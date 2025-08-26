<?php
require_once __DIR__ . '/../../../../config/load_env.php';
require_once __DIR__ . '/../../../../config/auth/session.service.php';

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

// Verifica se o token existe
if (!SessionService::hasToken()) {
    returnError('Token de autenticação não encontrado', 401);
}

// Verifica se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnError('Método não permitido', 405);
}

// Pega os dados da requisição
$rawData = file_get_contents('php://input');
error_log("Raw data recebido: " . $rawData);

$data = json_decode($rawData, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Dados inválidos: ' . json_last_error_msg());
}

// Log dos dados recebidos
error_log('Dados decodificados: ' . print_r($data, true));

// Pega os dados da sessão
$organizacao_id = SessionService::getOrganizacaoId();
$ministerio_id = SessionService::getMinisterioAtual();

// Log dos dados da sessão
error_log("Dados da sessão - Organização ID: $organizacao_id, Ministério ID: $ministerio_id");

// Validações
if (!$organizacao_id) {
    returnError('ID da organização não encontrado');
}

if (!$ministerio_id) {
    returnError('ID do ministério não encontrado');
}

if (!isset($data['nome'])) {
    returnError('Nome da categoria é obrigatório');
}

if (!isset($data['cor'])) {
    returnError('Cor da categoria é obrigatória');
}

// Monta a URL da API
 $apiBase = $_ENV['API_BASE_URL'] ?? ($_SERVER['API_BASE_URL'] ?? null);
 $apiUrl = rtrim($apiBase, '/') . '/categoria-atividade';
error_log("URL da API: $apiUrl");

// Prepara os dados para envio
$postData = [
    'nome' => $data['nome'],
    'cor' => $data['cor'],
    'organizacao_id' => intval($organizacao_id),
    'ministerio_id' => intval($ministerio_id)
];

// Log dos dados a serem enviados
error_log('Dados a serem enviados para API: ' . print_r($postData, true));

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($postData),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . SessionService::getToken()
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
echo json_encode([
    'message' => 'Categoria criada com sucesso',
    'data' => $responseData
]);
