<?php
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../config/auth/session.service.php';

// Carrega as variáveis de ambiente
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../../..');
$dotenv->load();

// Define o header da resposta como JSON
header('Content-Type: application/json');

// Função para retornar erro
function returnError($message, $code = 400) {
    http_response_code($code);
    echo json_encode(['error' => $message]);
    exit;
}

// Verifica se o usuário está autenticado
SessionService::start();
if (!SessionService::isLoggedIn()) {
    returnError('Não autorizado', 401);
}

// Verifica se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnError('Método não permitido', 405);
}

// Pega os dados da requisição
$data = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('JSON inválido');
}

// Validações
if (!isset($data['mes'])) {
    returnError('Mês é obrigatório');
}

if (!isset($data['ministerio_id'])) {
    returnError('ID do ministério é obrigatório');
}

if (!isset($data['destinatarios']) || !is_array($data['destinatarios'])) {
    returnError('Lista de destinatários é obrigatória');
}

if (empty($data['destinatarios'])) {
    returnError('Lista de destinatários não pode estar vazia');
}

// Monta a URL da API
$apiUrl = rtrim($_ENV['API_BASE_URL'], '/') . '/api/notificacoes/disparos/preenchimento';

// Configuração do cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: ' . $_ENV['API_KEY']
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
$responseData = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    returnError('Resposta inválida da API', 500);
}

// Retorna a resposta
http_response_code($httpCode);
echo json_encode([
    'code' => 200,
    'message' => 'Notificações enviadas com sucesso',
    'data' => $responseData
]);
